import type { Bit, Bit3, Bit32, Bit6 } from "../types";
import { bitAdder6 } from "./adders";
import { andGate, andGateNInp, inverter, norGateNInp, orGate, orGateNInp } from "./gates";
import { mux2To1 } from "./mux_demux";


// controlBits -> [left/right, shift/rotate, without-carry/with-carry]
//               [0/1,        0/1,          0/1]
//
// 000 -> no operation
// 001 -> left shift
// 010 -> left rotate without-carry
// 011 -> left rotate with-carry
// 100 -> right shift arithmetic
// 101 -> right shift
// 110 -> right rotate without-carry
// 111 -> right rotate with-carry

export function shiftRotate32(
    data: Bit32,
    shiftBy: Bit32,
    carryBit: Bit,
    controlBits: Bit3,
): { result: Bit32; carry: Bit } {

    // ------------------------------------------------------------
    // Control
    // ------------------------------------------------------------

    const [shiftDirection, rotate, rotateWithCarry] = controlBits;

    const operationEnabled = orGateNInp(controlBits);

    const arithmeticShift = andGateNInp([
        shiftDirection,
        inverter(rotate),
        inverter(rotateWithCarry),
    ]);

    const signBit = data[0];

    const rotateWithCarryEnabled = andGate(rotate, rotateWithCarry);
    const rotateRightWithCarry = andGate(
        shiftDirection,
        rotateWithCarryEnabled,
    );

    const shiftAmount = normalizedShiftAmt(
        shiftBy,
        rotateWithCarryEnabled,
    );

    // ------------------------------------------------------------
    // Normalize input direction
    //
    // The barrel stages always perform their operation in the
    // same direction. For a right operation, reverse the data
    // before entering the barrel shifter.
    // ------------------------------------------------------------

    const directionNormalizedData = data
        .map((bit, index) =>
            mux2To1(
                bit,
                data[data.length - (index + 1)],
                shiftDirection,
            )
        )
        .map((bit, index, normalizedData) =>
            mux2To1(
                bit,
                index >= normalizedData.length - 1
                    ? carryBit
                    : normalizedData[index + 1],
                rotateRightWithCarry,
            )
        ) as Bit32;

    let stageCarry = mux2To1(
        carryBit,
        data[data.length - 1],
        rotateRightWithCarry,
    );

    // ------------------------------------------------------------
    // Barrel shifter stage
    // ------------------------------------------------------------

    const barrelStage = (
        shiftAmount: number,
        index: number,
        inputData: Bit32,
        stageEnabled: Bit,
    ): Bit => {

        const fillStartIndex = inputData.length - shiftAmount;
        const isFillPosition = index >= fillStartIndex;

        // --------------------------------------------------------
        // Shift
        // --------------------------------------------------------

        const shiftFillBit = andGate(
            arithmeticShift,
            signBit,
        );

        const shiftedBit = isFillPosition
            ? shiftFillBit
            : inputData[index + shiftAmount];

        // --------------------------------------------------------
        // Rotate
        // --------------------------------------------------------

        const rotatedBit = isFillPosition
            ? mux2To1(
                inputData[index - fillStartIndex],
                index === fillStartIndex
                    ? stageCarry
                    : inputData[index - fillStartIndex - 1],
                rotateWithCarryEnabled,
            )
            : inputData[index + shiftAmount];

        // --------------------------------------------------------
        // Select shift or rotate
        // --------------------------------------------------------

        const transformedBit = mux2To1(
            shiftedBit,
            rotatedBit,
            rotate,
        );

        // --------------------------------------------------------
        // Enable / bypass this barrel stage
        // --------------------------------------------------------

        return mux2To1(
            inputData[index],
            transformedBit,
            stageEnabled,
        );
    };

    // ------------------------------------------------------------
    // Barrel shifter
    //
    // Stages:
    //
    //   1 -> 16 -> 8 -> 4 -> 2 -> 1
    //
    // This ordering allows a shift of 32 to be represented as:
    //
    //   1 + 16 + 8 + 4 + 2 + 1 = 32
    //
    // which is required for rotate-through-carry.
    // ------------------------------------------------------------

    // 1-place shifter / rotator
    const shift1Data = directionNormalizedData.map(
        (_, index, inputData) =>
            barrelStage(
                1,
                index,
                inputData as Bit32,
                shiftAmount[0],
            )
    );

    stageCarry = mux2To1(
        stageCarry,
        directionNormalizedData[0],
        shiftAmount[0],
    );

    // 16-place shifter / rotator
    const shift16Data = shift1Data.map(
        (_, index, inputData) =>
            barrelStage(
                16,
                index,
                inputData as Bit32,
                shiftAmount[1],
            )
    );

    stageCarry = mux2To1(
        stageCarry,
        shift1Data[15],
        shiftAmount[1],
    );

    // 8-place shifter / rotator
    const shift8Data = shift16Data.map(
        (_, index, inputData) =>
            barrelStage(
                8,
                index,
                inputData as Bit32,
                shiftAmount[2],
            )
    );

    stageCarry = mux2To1(
        stageCarry,
        shift16Data[7],
        shiftAmount[2],
    );

    // 4-place shifter / rotator
    const shift4Data = shift8Data.map(
        (_, index, inputData) =>
            barrelStage(
                4,
                index,
                inputData as Bit32,
                shiftAmount[3],
            )
    );

    stageCarry = mux2To1(
        stageCarry,
        shift8Data[3],
        shiftAmount[3],
    );

    // 2-place shifter / rotator
    const shift2Data = shift4Data.map(
        (_, index, inputData) =>
            barrelStage(
                2,
                index,
                inputData as Bit32,
                shiftAmount[4],
            )
    );

    stageCarry = mux2To1(
        stageCarry,
        shift4Data[1],
        shiftAmount[4],
    );

    // 1-place shifter / rotator
    const finalShiftData = shift2Data.map(
        (_, index, inputData) =>
            barrelStage(
                1,
                index,
                inputData as Bit32,
                shiftAmount[5],
            )
    );

    stageCarry = mux2To1(
        stageCarry,
        shift2Data[0],
        shiftAmount[5],
    );

    // ------------------------------------------------------------
    // Restore original direction
    //
    // The barrel shifter operates in the normalized direction.
    // Reverse the data again when the requested operation is right.
    // ------------------------------------------------------------

    const directionRestoredData = finalShiftData
        .map((bit, index, transformedData) =>
            mux2To1(
                bit,
                transformedData[transformedData.length - (index + 1)],
                shiftDirection,
            )
        )
        .map((bit, index, restoredData) =>
            mux2To1(
                bit,
                index >= restoredData.length - 1
                    ? stageCarry
                    : restoredData[index + 1],
                rotateRightWithCarry,
            )
        ) as Bit32;

    stageCarry = mux2To1(
        stageCarry,
        finalShiftData[finalShiftData.length - 1],
        rotateRightWithCarry,
    );

    // -----------------------------------------------------------
    // If shift and shift amount greater then 011111 then
    // arthematic right shift all bits sign bits
    // normal shift all 0
    // -----------------------------------------------------------

    const isShift = inverter(rotate);
    const fillValue = andGate(arithmeticShift, signBit);
    const shiftOverflowData = directionRestoredData.map(
        bit =>
            mux2To1(
                bit,
                fillValue,
                andGate(
                    isShift,
                    orGateNInp(
                        shiftBy.slice(0, 27)
                    )
                )
            )
    );

    // ------------------------------------------------------------
    // Operation enable
    //
    // 000 means no operation, so preserve the original input.
    // ------------------------------------------------------------

    const result = shiftOverflowData.map(
        (bit, index) =>
            mux2To1(
                data[index],
                bit,
                operationEnabled,
            )
    ) as Bit32;

    // Carry only changes for rotate-through-carry.
    const finalCarry = mux2To1(
        carryBit,
        stageCarry,
        rotateWithCarryEnabled,
    );

    return {
        result,
        carry: finalCarry,
    };
}


function normalizedShiftAmt(
    shiftBy: Bit32,
    rotateWithCarry: Bit,
): Bit6 {

    const shiftAmount = shiftBy.slice(32 - 6) as Bit6;

    shiftAmount[0] = andGate(
        rotateWithCarry,
        shiftAmount[0],
    );

    const isShiftBy32 = andGate(
        shiftAmount[0],
        norGateNInp(shiftAmount.slice(1)),
    );

    const shouldModulo33 = andGateNInp([
        rotateWithCarry,
        shiftAmount[0],
        inverter(isShiftBy32),
    ]);

    const negative33OrZero = [
        0,
        shouldModulo33,
        shouldModulo33,
        shouldModulo33,
        shouldModulo33,
        shouldModulo33,
    ] as Bit6;

    const moduloResult = bitAdder6(
        0,
        shiftAmount,
        negative33OrZero,
    )[0];

    // Normal shift/rotate:
    //     32 -> 0
    //
    // Rotate-through-carry:
    //     33 -> 0
    //
    // Instead of:
    //     32 -> 16 -> 8 -> 4 -> 2 -> 1
    //
    // We use:
    //     1 -> 16 -> 8 -> 4 -> 2 -> 1
    //
    // so that shift-by-32 becomes:
    //     1 + 16 + 8 + 4 + 2 + 1 = 32

    return moduloResult.map(
        bit => orGate(isShiftBy32, bit)
    ) as Bit6;
}