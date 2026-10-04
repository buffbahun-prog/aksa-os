import { HardwareExceptionType, HardwareExpection } from "../exceptions";
import type { Bit, Bit32, Bit5, Bit8 } from "../types";
import { binaryToDecimal, decimalToBinary } from "../utils/convertion";
import { andGate, inverter } from "./gates";
import { decoder5to32, mux2To1, mux32Bit32To1 } from "./mux_demux";

export type Reg32 = [EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop, EnabledFlipFlop];
export type RegFile32x32 = [Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32, Reg32];

export class SRLatch {
    private q: Bit;

    constructor() {
        this.q = 0;
    }

    setReset(controls: [set: Bit, reset: Bit]) {
        if (controls[0] === 0 && controls[1] === 1) {
            this.q = 0;
        } else if (controls[0] === 1 && controls[1] === 0) {
            this.q = 1;
        } else if (controls[0] === 1 && controls[1] === 1) {
            this.q = 0;
        }
    }

    get(): Bit {
        return this.q
    }
}

export function DLatch(clk: Bit, data: Bit, stateElm: SRLatch): Bit {
    const dataInv = inverter(data);

    const setCtrl = andGate(clk, data);
    const resetCtrl = andGate(clk, dataInv);

    stateElm.setReset([setCtrl, resetCtrl]);

    return stateElm.get();
}

export function DFlipFlopRun(clk: Bit, data: Bit, leaderStateElm: SRLatch, followerStateElm: SRLatch): Bit {
    const clkInv = inverter(clk);

    // leader latch
    const leaderOutputBit = DLatch(clkInv, data, leaderStateElm);

    // follower latch
    return DLatch(clk, leaderOutputBit, followerStateElm);
}

export class DFlipFlop {
    private leaderStateElm: SRLatch;
    private followerStateElm: SRLatch;

    constructor() {
        this.leaderStateElm = new SRLatch();
        this.followerStateElm = new SRLatch();
    }

    get() {
        return this.followerStateElm.get();
    }

    set(clk: Bit, data: Bit) {
        const clkInv = inverter(clk);

        // leader latch
        const leaderOutputBit = DLatch(clkInv, data, this.leaderStateElm);

        // follower latch
        DLatch(clk, leaderOutputBit, this.followerStateElm);
    }
}

export class EnabledFlipFlop {
    private stateElm: DFlipFlop;

    constructor() {
        this.stateElm = new DFlipFlop();
    }

    get() {
        return this.stateElm.get();
    }

    set(clk: Bit, enable: Bit, data: Bit) {
        const prevData = this.stateElm.get();
        const newSetData = mux2To1(prevData, data, enable);
        this.stateElm.set(clk, newSetData);
    }
}

export function constructRegister(dataLen: number): EnabledFlipFlop[] {
    return Array.from({length: dataLen}).fill(new EnabledFlipFlop()) as EnabledFlipFlop[];
}

export function constructRegisterFile(dataLen: number, totalReg: number): EnabledFlipFlop[][] {
    return Array.from({length: totalReg}).fill(constructRegister(dataLen)) as EnabledFlipFlop[][]; 
}

export function registerFile32(reg: RegFile32x32, readRegNum1: Bit5, readRegNum2: Bit5, writeRegNum: Bit5, writeData: Bit32, writeControl: Bit, clk: Bit): [d1: Bit32, d2: Bit32] {
    const writeRegPos = decoder5to32(writeRegNum);
    writeRegPos.forEach((isSelectedBit, indx) => {
        const isWriteBit = andGate(writeControl, isSelectedBit);
        reg[indx].forEach((r, i) => r.set(clk, isWriteBit, writeData[i]));
    });

    const regData = reg.map(r => r.map(ir => ir.get())) as Bit32[];

    const d1 = mux32Bit32To1(regData, readRegNum1);
    const d2 = mux32Bit32To1(regData, readRegNum2);

    return [d1, d2];
}

export class RAM {
    private data: SharedArrayBuffer;
    private dataView: Uint8Array;
    private totalBytes: number;

    constructor() {
        // max address lane is 32 bits, so max ram size is 2 pow 32
        this.totalBytes = Math.min(2 ** 32, 1 * 1024 * 1024);
        this.data = new SharedArrayBuffer(this.totalBytes);
        this.dataView = new Uint8Array(this.data);
    }

    getBuffer() {
        return this.data;
    }

    read8(address: Bit32) {
        const dataNum = this.dataView.at(this.addressToIndex(address));
        if (dataNum !== undefined) {
            return decimalToBinary(dataNum, 8) as Bit8;
        }
    }

    write8(address: Bit32, data: Bit8) {
        const dataNum = binaryToDecimal(data);
        this.dataView[this.addressToIndex(address)] = dataNum;
    }

    private addressToIndex(address: Bit32): number {
        const index = binaryToDecimal(address);
        if (index >= this.totalBytes) {
            throw new HardwareExpection(
                HardwareExceptionType.MemoryFault,
                `Invalid address to RAM: 0x${index.toString(16)}`,
                index
            )
        }
        return index;
    }
}