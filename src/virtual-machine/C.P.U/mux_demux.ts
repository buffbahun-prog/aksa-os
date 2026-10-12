import type { Bit, Bit2, Bit3, Bit32, Bit4, Bit5, Bit8 } from "../types";
import { decimalToBinary } from "../utils/convertion";
import { andGate, andGateNInp, inverter, orGate, orGateNInp } from "./gates";

export function mux2To1(inp0: Bit, inp1: Bit, select: Bit) {
    return (
        orGate(
            andGate(
                inp0,
                inverter(select),
            ),
            andGate(
                inp1,
                select,
            )
        )
    );
}

export function mux32Bit2To1(inp0: Bit32, inp1: Bit32, select: Bit) {
    return inp0.map((_, indx) => mux2To1(
        inp0[indx],
        inp1[indx],
        select,
    )) as Bit32;
}

export function mux32Bit32To1(inp: Bit32[], select: Bit5): Bit32 {
    return inp.map((bits) => mux32to1(
        bits,
        select,
    )) as Bit32;
}

export function mux8To1(data: Bit8, selectBits: Bit3): Bit {
    return orGateNInp([
        // for select value 000
        andGateNInp([
            data[0],
            ...selectBits.map(bit => inverter(bit)),
        ]),
        // for select value 001
        andGateNInp([
            data[1],
            ...selectBits.map((bit, indx) => indx !== 2 ? inverter(bit) : bit),
        ]),
        // for select value 010
        andGateNInp([
            data[2],
            ...selectBits.map((bit, indx) => indx !== 1 ? inverter(bit) : bit),
        ]),
        // for select value 011
        andGateNInp([
            data[3],
            ...selectBits.map((bit, indx) => indx !== 1 && indx !== 2 ? inverter(bit) : bit),
        ]),
        // for select value 100
        andGateNInp([
            data[4],
            ...selectBits.map((bit, indx) => indx !== 0 ? inverter(bit) : bit),
        ]),
        // for select value 101
        andGateNInp([
            data[5],
            ...selectBits.map((bit, indx) => indx !== 0 && indx !== 2 ? inverter(bit) : bit),
        ]),
        // for select value 110
        andGateNInp([
            data[6],
            ...selectBits.map((bit, indx) => indx !== 0 && indx !== 1 ? inverter(bit) : bit),
        ]),
        // for select value 111
        andGateNInp([
            data[7],
            ...selectBits,
        ]),
    ]);
}

export function mux4To1(data: Bit4, selectBits: Bit2): Bit {
    return orGateNInp([
        // for select value 00
        andGateNInp([
            data[0],
            ...selectBits.map(bit => inverter(bit)),
        ]),
        // for select value 01
        andGateNInp([
            data[1],
            ...selectBits.map((bit, indx) => indx !== 1 ? inverter(bit) : bit),
        ]),
        // for select value 10
        andGateNInp([
            data[2],
            ...selectBits.map((bit, indx) => indx !== 0 ? inverter(bit) : bit),
        ]),
        // for select value 11
        andGateNInp([
            data[3],
            ...selectBits,
        ]),
    ]);
}

export function mux32to1(data: Bit32, selectorBits: Bit5): Bit {
    const selTransformed = Array.from({length: 32}).map((_, i) => {
        const [sel0, sel1, sel2, sel3, sel4] = decimalToBinary(i, 5) as Bit5;
        return [
            sel0 <= 0 ? inverter(selectorBits[0]) : selectorBits[0],
            sel1 <= 0 ? inverter(selectorBits[1]) : selectorBits[1],
            sel2 <= 0 ? inverter(selectorBits[2]) : selectorBits[2],
            sel3 <= 0 ? inverter(selectorBits[3]) : selectorBits[3],
            sel4 <= 0 ? inverter(selectorBits[4]) : selectorBits[4],
        ];
    });

    return orGateNInp(
        data.map((bit, i) => andGateNInp([bit, ...selTransformed[i]]))
    );
}

export function demux1to2(dataInp: Bit, select: Bit): [Bit, Bit] {
    return [
        andGate(
            dataInp,
            inverter(select),
        ),
        andGate(
            dataInp,
            select,
        )
    ]
}

export function decoder1to2(select: [Bit]): [Bit, Bit] {
    return [
        inverter(select[0]),
        select[0],
    ];
}

export function decoder2to4(select: Bit2): Bit4 {
    const s0 = select[0];
    const s0i = inverter(s0);
    const s1 = select[1];
    const s1i = inverter(s1);
    return [
        andGate(s0i, s1i),
        andGate(s0i, s1),
        andGate(s0, s1i),
        andGate(s0, s1),
    ];
}

export function decoder2to8(select: Bit3): Bit8 {
    const [s0, s1, s2] = select;
    const [s0i, s1i, s2i] = [inverter(s0), inverter(s1), inverter(s2)];

    return [
        andGateNInp([s0i, s1i, s2i]),
        andGateNInp([s0i, s1i, s2]),
        andGateNInp([s0i, s1, s2i]),
        andGateNInp([s0i, s1, s2]),
        andGateNInp([s0, s1i, s2i]),
        andGateNInp([s0, s1i, s2]),
        andGateNInp([s0, s1, s2i]),
        andGateNInp([s0, s1, s2]),
    ];
}

export function decoder5to32(select: Bit5): Bit32 {
    const [s0, s1, s2, s3, s4] = select;
    const [s0i, s1i, s2i, s3i, s4i] = [inverter(s0), inverter(s1), inverter(s2), inverter(s3), inverter(s4)];

    return [
        andGateNInp([s0i, s1i, s2i, s3i, s4i]),// 00000
        andGateNInp([s0i, s1i, s2i, s3i, s4]),// 00001
        andGateNInp([s0i, s1i, s2i, s3, s4i]),// 00010
        andGateNInp([s0i, s1i, s2i, s3, s4]),// 00011
        andGateNInp([s0i, s1i, s2, s3i, s4i]),// 00100
        andGateNInp([s0i, s1i, s2, s3i, s4]),// 00101
        andGateNInp([s0i, s1i, s2, s3, s4i]),// 00110
        andGateNInp([s0i, s1i, s2, s3, s4]),// 00111
        andGateNInp([s0i, s1, s2i, s3i, s4i]),// 01000
        andGateNInp([s0i, s1, s2i, s3i, s4]),// 01001
        andGateNInp([s0i, s1, s2i, s3, s4i]),// 01010
        andGateNInp([s0i, s1, s2i, s3, s4]),// 01011
        andGateNInp([s0i, s1, s2, s3i, s4i]),// 01100
        andGateNInp([s0i, s1, s2, s3i, s4]),// 01101
        andGateNInp([s0i, s1, s2, s3, s4i]),// 01110
        andGateNInp([s0i, s1, s2, s3, s4]),// 01111
        andGateNInp([s0, s1i, s2i, s3i, s4i]),// 10000
        andGateNInp([s0, s1i, s2i, s3i, s4]),// 10001
        andGateNInp([s0, s1i, s2i, s3, s4i]),// 10010
        andGateNInp([s0, s1i, s2i, s3, s4]),// 10011
        andGateNInp([s0, s1i, s2, s3i, s4i]),// 10100
        andGateNInp([s0, s1i, s2, s3i, s4]),// 10101
        andGateNInp([s0, s1i, s2, s3, s4i]),// 10110
        andGateNInp([s0, s1i, s2, s3, s4]),// 10111
        andGateNInp([s0, s1, s2i, s3i, s4i]),// 11000
        andGateNInp([s0, s1, s2i, s3i, s4]),// 11001
        andGateNInp([s0, s1, s2i, s3, s4i]),// 11010
        andGateNInp([s0, s1, s2i, s3, s4]),// 11011
        andGateNInp([s0, s1, s2, s3i, s4i]),// 11100
        andGateNInp([s0, s1, s2, s3i, s4]),// 11101
        andGateNInp([s0, s1, s2, s3, s4i]),// 11110
        andGateNInp([s0, s1, s2, s3, s4]),// 11111
    ];
}