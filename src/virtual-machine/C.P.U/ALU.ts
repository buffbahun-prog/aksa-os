import type { Bit, Bit2, Bit3, Bit32, Bit4, Bit5 } from "../types";
import { fullAdder } from "./adders";
import { andGate, andGateNInp, inverter, norGateNInp, orGate, xorGate } from "./gates";
import { mux2To1, mux4To1, mux8To1 } from "./mux_demux";

// control signals
// [ input 1 invert, input 2 invert/negetive, ...operations(2 bit)]
// operations
// [0,0] -> AND
// [0,1] -> OR
// [1,0] -> XOR
// [1,1] -> ADD
export function aluBit1(carryIn: Bit, inp1: Bit, inp2: Bit, controlBits: Bit4): [result: Bit, carryOut: Bit] {
    const inp1Invert = controlBits[0];
    const inp2Invert = controlBits[1];
    const operationBits = controlBits.slice(2) as Bit2;

    const inp1Transformed = xorGate(inp1, inp1Invert);
    const inp2Transformed = xorGate(inp2, inp2Invert);

    const andResult = andGate(inp1Transformed, inp2Transformed);
    const orResult = orGate(inp1Transformed, inp2Transformed);
    const xorResult = xorGate(inp1Transformed, inp2Transformed);

    const [addResult, carryOut] = fullAdder(carryIn, inp1Transformed, inp2Transformed);

    const result = mux4To1(
        [
            andResult,
            orResult,
            xorResult,
            addResult,
        ]
        ,
        operationBits
    );

    return [result, carryOut];
}


// 000 -> AND   A & B
// 001 -> OR    A | B
// 010 -> XOR   A ^ B
// 011 -> NOT   ~A
// 100 -> ADD   A + B
// 101 -> SUB   A - B
// 110 -> SLT   A < B (signed)
// 111 -> SLTU  A < B (unsigned)
export function ALU(inp1: Bit32, inp2: Bit32, controlBits: Bit3): [result: Bit32, carryOut: Bit, overflow: Bit, zero: Bit] {

    // map
    // AND  000 --> [0,0,0,0]
    // OR   001 --> [0,0,0,1]
    // XOR  010 --> [0,0,1,0]
    // NOT  011 --> [1,0,0,0] B all 1
    // ADD  100 --> [0,0,1,1]
    // SUB  101 --> [0,1,1,1] CarryIn = 1
    // SLT  110 --> [0,1,1,1] CarryIn = 1, lsb = carryOut/borrow and rest 0
    // SLTU 111 --> [0,1,1,1] CarryIn = 1, lsb = overflow xor msb and rest 0

    const isNotOp = andGateNInp([inverter(controlBits[0]), controlBits[1], controlBits[2]]);
    const isXorOp = andGateNInp([inverter(controlBits[0]), controlBits[1], inverter(controlBits[2])]);
    const isOrOp = andGateNInp([inverter(controlBits[0]), inverter(controlBits[1]), controlBits[2]]);

    const isSubOp = andGate(controlBits[0], orGate(controlBits[1], controlBits[2]));

    const bitAluControlBits = [
        isNotOp,
        isSubOp,
        orGate(isXorOp, controlBits[0]),
        orGate(isOrOp, controlBits[0]),
    ] as Bit4;

    const carryIn = isSubOp;

    let rippleCarryIn = carryIn;
    let rippleCarryOut = carryIn;

    const bitAluResult: Bit[] = [];

    for (let i = 31; i >= 0; i--) {
        const [resultBit, carryOut] = aluBit1(
            rippleCarryOut,
            inp1[i],
            orGate(inp2[i], isNotOp), // if NOT operation, input 2 set all to Bit 1 
            bitAluControlBits,
        );

        bitAluResult.unshift(resultBit);

        rippleCarryIn = rippleCarryOut;
        rippleCarryOut = carryOut;
    }

    const carryOut = rippleCarryOut;

    const overflow = xorGate(rippleCarryIn, rippleCarryOut);

    const isLessThanOp = andGate(isSubOp, controlBits[1]);
    const isSltOp = andGate(isLessThanOp, inverter(controlBits[2]));
    const isSltuOp = andGate(isLessThanOp, controlBits[2]);

    const msb = bitAluResult[0];
    const result = bitAluResult.map((bit, indx) => {
        const isLessThanForUnsigned = xorGate(isSubOp, carryOut);
        const isLessThanForSigned = xorGate(msb, overflow);
        const isSignedOp = andGate(isSltOp, inverter(isSltuOp));
        const isLessThan = mux2To1(isLessThanForSigned, isLessThanForUnsigned, isSignedOp);
        return indx < 31 ? andGate(isLessThanOp, bit) : mux2To1(bit, isLessThan, isLessThanOp);
    }) as Bit32;

    const zero = norGateNInp(result);

    return [result, carryOut, overflow, zero];
}

// export function aluMSB(carryIn: Bit, inp1: Bit, inp2: Bit, controlBits: Bit5): [result: Bit, carryOut: Bit, overflow: Bit] {
//     const inp1Invert = controlBits[0];
//     const inp2Invert = controlBits[1];
//     const operationBits = controlBits.slice(2) as Bit3;

//     const inp1Transformed = xorGate(inp1, inp1Invert);
//     const inp2Transformed = xorGate(inp2, inp2Invert);

//     const andResult = andGate(inp1Transformed, inp2Transformed);
//     const orResult = orGate(inp1Transformed, inp2Transformed);
//     const xorResult = xorGate(inp1Transformed, inp2Transformed);

//     const [addResult, carryOut] = fullAdder(carryIn, inp1Transformed, inp2Transformed);
//     const overflow = xorGate(carryIn, carryOut);

//     const sltResult = less;
//     const sltuResult = less;

//     const set = mux2To1(
//         xorGate(addResult, overflow),
//         inverter(carryOut),
//         andGateNInp([operationBits[0], inverter(operationBits[1]), operationBits[2]]),
//     );

//     const result = mux8To1(
//         [
//             0,
//             andResult,
//             orResult,
//             xorResult,
//             addResult,
//             sltResult,
//             sltuResult,
//             0
//         ]
//         ,
//         operationBits
//     );

//     return [result, carryOut, overflow, set];
// }