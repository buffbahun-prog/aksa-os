import type { Bit, Bit32, Bit6, Bit8 } from "../types";
import { andGate, orGate, xorGate } from "./gates";

export function halfAdder(bit0: Bit, bit1: Bit): [sum: Bit, carryOut: Bit] {
    return [
        xorGate(bit0, bit1),
        andGate(bit0, bit1),
    ]
}

export function fullAdder(carryIn: Bit, bit0: Bit, bit1: Bit): [sum: Bit, carryOut: Bit] {
    const [sumWithoutCarry, carry1] = halfAdder(bit0, bit1);
    const [sum, carry2] = halfAdder(carryIn, sumWithoutCarry);
    return [
        sum,
        orGate(carry1, carry2),
    ];
}

export function bit8Adder(carryIn: Bit, inp0: Bit8, inp1: Bit8): [sum: Bit8, carryOut: Bit] {
    const [sum0, carry0] = fullAdder(carryIn, inp0[7], inp1[7]);
    const [sum1, carry1] = fullAdder(carry0, inp0[6], inp1[6]);
    const [sum2, carry2] = fullAdder(carry1, inp0[5], inp1[5]);
    const [sum3, carry3] = fullAdder(carry2, inp0[4], inp1[4]);
    const [sum4, carry4] = fullAdder(carry3, inp0[3], inp1[3]);
    const [sum5, carry5] = fullAdder(carry4, inp0[2], inp1[2]);
    const [sum6, carry6] = fullAdder(carry5, inp0[1], inp1[1]);
    const [sum7, carry7] = fullAdder(carry6, inp0[0], inp1[0]);

    return [
        [sum7, sum6, sum5, sum4, sum3, sum2, sum1, sum0],
        carry7
    ];
}

export function bitAdder8(carryIn: Bit, inp0: Bit8, inp1: Bit8): [sum: Bit8, carryOut: Bit , lastBitCarryIn: Bit] {
    const [sum0, carry0] = fullAdder(carryIn, inp0[7], inp1[7]);
    const [sum1, carry1] = fullAdder(carry0, inp0[6], inp1[6]);
    const [sum2, carry2] = fullAdder(carry1, inp0[5], inp1[5]);
    const [sum3, carry3] = fullAdder(carry2, inp0[4], inp1[4]);
    const [sum4, carry4] = fullAdder(carry3, inp0[3], inp1[3]);
    const [sum5, carry5] = fullAdder(carry4, inp0[2], inp1[2]);
    const [sum6, carry6] = fullAdder(carry5, inp0[1], inp1[1]);
    const [sum7, carry7] = fullAdder(carry6, inp0[0], inp1[0]);


    return [
        [sum7, sum6, sum5, sum4, sum3, sum2, sum1, sum0],
        carry7,
        carry6,
    ]
}

export function bitAdder32(carryIn: Bit, inp0: Bit32, inp1: Bit32): [sum: Bit32, carryOut: Bit, overflow: Bit] {
    const [byte0Sum, carryOut0] = bitAdder8(carryIn,
                                           inp0.slice(24, 32) as Bit8,
                                           inp1.slice(24, 32) as Bit8
                                        );
    const [byte1Sum, carryOut1] = bitAdder8(carryOut0,
                                            inp0.slice(16, 24) as Bit8,
                                            inp1.slice(16, 24) as Bit8,
                                        );
    const [byte2Sum, carryOut2] = bitAdder8(carryOut1,
                                            inp0.slice(8, 16) as Bit8,
                                            inp1.slice(8, 16) as Bit8,
                                        );
    const [byte3Sum, carryOut3, lastBitCarryIn] = bitAdder8(carryOut2,
                                            inp0.slice(0, 8) as Bit8,
                                            inp1.slice(0, 8) as Bit8,
                                        );

    return [
        [...byte3Sum, ...byte2Sum, ...byte1Sum, ...byte0Sum],
        // for add operation if 1 carry is the literal carry while addition,
        // and for sub 1 means A >= B and the result is positive,
        // so no borrow needed
        carryOut3,
        // for add operation 2 inputs same sign but output different sign.
        // (+A) + (+B) should have output also (+) sign, if not overflow
        // (-A) + (-B) should have output also (-) sign, if not overflow
        // for sub operation 2 input different sign but output sign different
        // from the first input. (+A) - (-B) should always be the sign that of A(+),
        // if not its overflow
        // we could have done suppose A and B are two msb(sign bit) of the two
        // inputs and C is the sign bit of the output. Now the overflow conditions
        // are:
        // Add: overflow = (~A.~B.C) + (A.B.~C)
        // Sub: overflow = (A.~B.~C) + (~A.B.C)
        // But looking closly t what carry input comes to the sign bit and what
        // carry output the sign bit produces, the xor result of these two carryInput
        // and carryOutput is the same as the above overflow conditions
        xorGate(lastBitCarryIn, carryOut3),
    ]
}

export function bitAdderSubstractor32(subMode: Bit, carryIn: Bit, inp0: Bit32, inp1: Bit32): [result: Bit32, carryOut: Bit, overflow: Bit] {
    const invertedOnSubInp1 = inp1.map(bit => xorGate(subMode, bit)) as Bit32;
    return bitAdder32(
        // A(inp0) - B(inp1) - C(carry/borrow)
        // A + (~B + 1) - C
        // A + ~B + (1 - C)
        // now 1 - C = ~C, but only when subMode is 1
        // so when subMode 0(while add) -> carryIn is as it is
        // and when subMode 1 -> CarryIn should be inversed
        // xor(subMode, carryIn) gives exactly this condition
        // A + ~B + ~C for subMode = 1,
        // A + B + C for submodee = 0
        // A + xor(subMode, B) + xor(subMode, carryIn)
        xorGate(subMode, carryIn),
        inp0,
        invertedOnSubInp1,
    );
}

export function bitAdder6(carryIn: Bit, inp0: Bit6, inp1: Bit6): [sum: Bit6, carryOut: Bit , lastBitCarryIn: Bit] {
    const [sum0, carry0] = fullAdder(carryIn, inp0[5], inp1[5]);
    const [sum1, carry1] = fullAdder(carry0, inp0[4], inp1[4]);
    const [sum2, carry2] = fullAdder(carry1, inp0[3], inp1[3]);
    const [sum3, carry3] = fullAdder(carry2, inp0[2], inp1[2]);
    const [sum4, carry4] = fullAdder(carry3, inp0[1], inp1[1]);
    const [sum5, carry5] = fullAdder(carry4, inp0[0], inp1[0]);


    return [
        [sum5, sum4, sum3, sum2, sum1, sum0],
        carry5,
        carry4,
    ]
}