import { HardwareExceptionType, HardwareExpection } from "../exceptions";
import type { Bit, Bit32, Bit8 } from "../types";
import { binaryToDecimal, decimalToBinary } from "../utils/convertion";

export class Register32 {
    private q: Bit32;
    private writable: boolean;

    constructor(isWritable: boolean) {
        this.q = Array.from({length: 32}, () => 0 as Bit) as Bit32;
        this.writable = isWritable
    }

    get() {
        return this.q;
    }

    set(dataIn: Bit32) {
        if (!this.writable) return;
        this.q = dataIn;
    }

    clear() {
        if (!this.writable) return;
        this.q = this.q.map(() => 0 as Bit) as Bit32;
    }
}

export class Register8 {
    private q: Bit8;
    private writable: boolean;

    constructor(isWritable: boolean) {
        this.q = Array.from({length: 8}, () => 0 as Bit) as Bit8;
        this.writable = isWritable
    }

    get() {
        return this.q;
    }

    set(dataIn: Bit8) {
        if (!this.writable) return;
        this.q = dataIn;
    }

    clear() {
        if (!this.writable) return;
        this.q = this.q.map(() => 0 as Bit) as Bit8;
    }
}

// export class RegisterFile16x8 {
//     private register: Register8[];

//     constructor() {
//         this.register = Array.from({length: 16}).map((_, regNum) => {
//             return new Register8(regNum <= 0 ? false : true);
//         });
//     }

//     // registerFile(reg1ReadNum: Bit4, reg2ReadNum: Bit4, regWriteNum: Bit4, writeData: Bit8, writeControl: Bit): [readData1: Bit8, readData2: Bit8] {
        
//     // }
// }

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
