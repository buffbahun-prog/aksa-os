import type { Bit, Bit2, Bit3, Bit32, Bit4, Bit8 } from "../types";
import { fullAdder } from "./adders";
import { andGate, andGateNInp, inverter, nandGateNInp, norGateNInp, orGate, xorGate } from "./gates";
import { mux2To1, mux4To1 } from "./mux_demux";

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


// 000 -> AND     A & B
// 001 -> OR      A | B
// 010 -> XOR     A ^ B
// 011 -> PASS_B  B
// 100 -> ADD     A + B
// 101 -> SUB     A - B
// 110 -> SLT     A < B (signed)
// 111 -> SLTU    A < B (unsigned)
export function ALU(inp1: Bit32, inp2: Bit32, controlBits: Bit3): [result: Bit32, carryOut: Bit, overflow: Bit, zero: Bit] {

    // map
    // AND     000 --> [0,0,0,0]
    // OR      001 --> [0,0,0,1]
    // XOR     010 --> [0,0,1,0]
    // PASS_B  011 --> [0,0,1,1] final mux pass B
    // ADD     100 --> [0,0,1,1]
    // SUB     101 --> [0,1,1,1] CarryIn = 1
    // SLT     110 --> [0,1,1,1] CarryIn = 1, lsb = carryOut/borrow and rest 0
    // SLTU    111 --> [0,1,1,1] CarryIn = 1, lsb = overflow xor msb and rest 0

   const mappedAluCode = [
    0,
    andGate(controlBits[0], orGate(controlBits[1], controlBits[2])),
    orGate(controlBits[0], controlBits[1]),
    orGate(controlBits[0], controlBits[2]),
   ] as Bit4;

   const negateB = mappedAluCode[1];
   const carryIn = negateB;

   const isNotPassBOp = nandGateNInp([
    inverter(controlBits[0]),
    controlBits[1],
    controlBits[2],
   ]);

   let msbCarryOut = carryIn;
   let msbCarryIn = carryIn;

   const aluResult = Array.from({length: 32}) as Bit32;

   for (let i = 31; i >= 0; i--) {
    const a = inp1[i];
    const b = andGate(inp2[i], isNotPassBOp);

    const [result, carryOut] = aluBit1(msbCarryOut, a, b, mappedAluCode);
    msbCarryIn = msbCarryOut;
    msbCarryOut = carryOut;

    aluResult[i] = result;
   }

   const carryOut = msbCarryOut;

   const overflow = xorGate(msbCarryIn, msbCarryOut);

   const signedLess = xorGate(
        aluResult[0],
        overflow,
    );

   const unsignedLess = inverter(carryOut);

   const isLess = mux2To1(
        signedLess,
        unsignedLess,
        controlBits[2],
   );

   const issltOp = andGate(negateB, controlBits[1]);

   const aluResultExceptLsb = aluResult.slice(0, 31);
   const aluResultLsb = aluResult[31];

   const finalResult = [
    ...aluResultExceptLsb.map(bit => andGate(issltOp, bit)),
    mux2To1(aluResultLsb, isLess, issltOp),
   ] as Bit32;

   return [finalResult, carryOut, overflow, norGateNInp(finalResult)];
}

export function ALU8Bit(inp1: Bit8, inp2: Bit8, controlBits: Bit3): [result: Bit8, carryOut: Bit, overflow: Bit, zero: Bit] {
   const mappedAluCode = [
    0,
    andGate(controlBits[0], orGate(controlBits[1], controlBits[2])),
    orGate(controlBits[0], controlBits[1]),
    orGate(controlBits[0], controlBits[2]),
   ] as Bit4;

   const negateB = mappedAluCode[1];
   const carryIn = negateB;

   let msbCarryOut = carryIn;
   let msbCarryIn = carryIn;

   const aluResult = Array.from({length: 8}) as Bit8;

   for (let i = 7; i >= 0; i--) {
    const a = inp1[i];
    const b = inp2[i];

    const [result, carryOut] = aluBit1(msbCarryOut, a, b, mappedAluCode);
    msbCarryIn = msbCarryOut;
    msbCarryOut = carryOut;

    aluResult[i] = result;
   }

   const carryOut = msbCarryOut;

   const overflow = xorGate(msbCarryIn, msbCarryOut);

   const signedLess = xorGate(
        aluResult[0],
        overflow,
    );

   const unsignedLess = inverter(carryOut);

   const isLess = mux2To1(
        signedLess,
        unsignedLess,
        controlBits[2],
   );

   const issltOp = andGate(negateB, controlBits[1]);

   const aluResultExceptLsb = aluResult.slice(0, 7);
   const aluResultLsb = aluResult[7];

   const afterSltResult = [
    ...aluResultExceptLsb.map(bit => andGate(issltOp, bit)),
    mux2To1(aluResultLsb, isLess, issltOp),
   ] as Bit8;

   const isPassBOp = andGateNInp([
    inverter(controlBits[0]),
    controlBits[1],
    controlBits[2],
   ]);

   const finalResult = afterSltResult.map((bit, indx) => mux2To1(
    bit,
    inp2[indx],
    isPassBOp,
   )) as Bit8;

   return [finalResult, carryOut, overflow, norGateNInp(finalResult)];
}