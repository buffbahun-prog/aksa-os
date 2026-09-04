import { describe, expect, test } from "vitest";
import { shiftRotate32 } from "./shiftRotate32";
import type { Bit, Bit3, Bit32 } from "../types";

const bit = (n: number): Bit => (n ? 1 : 0);

function numberToBit32(value: number): Bit32 {
    const result = [];

    for (let i = 31; i >= 0; i--) {
        result.push(bit((value >>> i) & 1));
    }

    return result as Bit32;
}

// function numberToBit6(value: number): Bit6 {
//     const result = [];

//     for (let i = 5; i >= 0; i--) {
//         result.push(bit((value >>> i) & 1));
//     }

//     return result as Bit6;
// }

function bit32ToNumber(bits: Bit32): number {
    let result = 0;

    for (const b of bits) {
        result = ((result << 1) | b) >>> 0;
    }

    return result >>> 0;
}

function control(
    shiftDir: Bit,
    rotate: Bit,
    withCarry: Bit,
): Bit3 {
    return [shiftDir, rotate, withCarry];
}

function run(
    value: number,
    shift: number,
    carry: Bit,
    ctrl: Bit3,
) {
    const result = shiftRotate32(
        numberToBit32(value >>> 0) as Bit32,
        numberToBit32(shift),
        carry,
        ctrl,
    );

    return {
        result: bit32ToNumber(result.result),
        carry: result.carry,
    };
}

describe("000 - no operation", () => {
    test("preserves zero", () => {
        expect(run(
            0x00000000,
            0,
            0,
            control(0, 0, 0),
        )).toEqual({
            result: 0x00000000,
            carry: 0,
        });
    });

    test("preserves all ones", () => {
        expect(run(
            0xffffffff,
            0,
            0,
            control(0, 0, 0),
        )).toEqual({
            result: 0xffffffff,
            carry: 0,
        });
    });

    test("preserves arbitrary value", () => {
        expect(run(
            0x12345678,
            17,
            0,
            control(0, 0, 0),
        )).toEqual({
            result: 0x12345678,
            carry: 0,
        });
    });

    test("carry is unchanged", () => {
        expect(run(
            0xdeadbeef,
            31,
            1,
            control(0, 0, 0),
        )).toEqual({
            result: 0xdeadbeef,
            carry: 1,
        });
    });
});

describe("001 - logical left shift", () => {
    test("shift by 0", () => {
        expect(run(
            0x12345678,
            0,
            0,
            control(0, 0, 1),
        ).result).toBe(0x12345678);
    });

    test("shift by 1", () => {
        expect(run(
            0x12345678,
            1,
            0,
            control(0, 0, 1),
        ).result).toBe(0x2468acf0);
    });

    test("shift by 4", () => {
        expect(run(
            0x12345678,
            4,
            0,
            control(0, 0, 1),
        ).result).toBe(0x23456780);
    });

    test("shift by 8", () => {
        expect(run(
            0x12345678,
            8,
            0,
            control(0, 0, 1),
        ).result).toBe(0x34567800);
    });

    test("shift by 16", () => {
        expect(run(
            0x12345678,
            16,
            0,
            control(0, 0, 1),
        ).result).toBe(0x56780000);
    });

    test("shift by 31", () => {
        expect(run(
            0x12345678,
            31,
            0,
            control(0, 0, 1),
        ).result).toBe(0);
    });

    test("all ones shifted by 1", () => {
        expect(run(
            0xffffffff,
            1,
            0,
            control(0, 0, 1),
        ).result).toBe(0xfffffffe);
    });

    test("MSB shifted out", () => {
        expect(run(
            0x80000000,
            1,
            0,
            control(0, 0, 1),
        ).result).toBe(0);
    });

    test("LSB enters as zero", () => {
        expect(run(
            0x00000001,
            1,
            0,
            control(0, 0, 1),
        ).result).toBe(2);
    });

    test("zero remains zero", () => {
        expect(run(
            0,
            13,
            0,
            control(0, 0, 1),
        ).result).toBe(0);
    });
});

describe("100 - arithmetic right shift", () => {
    test("positive number shift by 1", () => {
        expect(run(
            0x40000000,
            1,
            0,
            control(1, 0, 0),
        ).result).toBe(0x20000000);
    });

    test("negative number shift by 1", () => {
        expect(run(
            0x80000000,
            1,
            0,
            control(1, 0, 0),
        ).result).toBe(0xc0000000);
    });

    test("negative number shift by 4", () => {
        expect(run(
            0x80000000,
            4,
            0,
            control(1, 0, 0),
        ).result).toBe(0xf8000000);
    });

    test("negative number shift by 8", () => {
        expect(run(
            0x80000000,
            8,
            0,
            control(1, 0, 0),
        ).result).toBe(0xff800000);
    });

    test("negative number shift by 16", () => {
        expect(run(
            0x80000000,
            16,
            0,
            control(1, 0, 0),
        ).result).toBe(0xffff8000);
    });

    test("negative number shift by 31", () => {
        expect(run(
            0x80000000,
            31,
            0,
            control(1, 0, 0),
        ).result).toBe(0xffffffff);
    });

    test("all ones remains all ones", () => {
        expect(run(
            0xffffffff,
            31,
            0,
            control(1, 0, 0),
        ).result).toBe(0xffffffff);
    });

    test("positive zero-fill is correct", () => {
        expect(run(
            0x7fffffff,
            1,
            0,
            control(1, 0, 0),
        ).result).toBe(0x3fffffff);
    });

    test("sign bit propagates", () => {
        expect(run(
            0x80000001,
            4,
            0,
            control(1, 0, 0),
        ).result).toBe(0xf8000000);
    });
});

describe("101 - logical right shift", () => {
    test("shift by 0", () => {
        expect(run(
            0x12345678,
            0,
            0,
            control(1, 0, 1),
        ).result).toBe(0x12345678);
    });

    test("shift by 1", () => {
        expect(run(
            0x12345678,
            1,
            0,
            control(1, 0, 1),
        ).result).toBe(0x091a2b3c);
    });

    test("shift by 4", () => {
        expect(run(
            0x12345678,
            4,
            0,
            control(1, 0, 1),
        ).result).toBe(0x01234567);
    });

    test("shift by 8", () => {
        expect(run(
            0x12345678,
            8,
            0,
            control(1, 0, 1),
        ).result).toBe(0x00123456);
    });

    test("shift by 16", () => {
        expect(run(
            0x12345678,
            16,
            0,
            control(1, 0, 1),
        ).result).toBe(0x00001234);
    });

    test("shift by 31", () => {
        expect(run(
            0xffffffff,
            31,
            0,
            control(1, 0, 1),
        ).result).toBe(1);
    });

    test("negative-looking value gets zero-filled", () => {
        expect(run(
            0x80000000,
            1,
            0,
            control(1, 0, 1),
        ).result).toBe(0x40000000);
    });

    test("zero remains zero", () => {
        expect(run(
            0,
            17,
            0,
            control(1, 0, 1),
        ).result).toBe(0);
    });
});

describe("010 - left rotate", () => {
    const value = 0x12345678;

    test("rotate by 0", () => {
        expect(run(
            value,
            0,
            0,
            control(0, 1, 0),
        ).result).toBe(value);
    });

    test("rotate by 1", () => {
        expect(run(
            value,
            1,
            0,
            control(0, 1, 0),
        ).result).toBe(0x2468acf0);
    });

    test("rotate by 4", () => {
        expect(run(
            value,
            4,
            0,
            control(0, 1, 0),
        ).result).toBe(0x23456781);
    });

    test("rotate by 8", () => {
        expect(run(
            value,
            8,
            0,
            control(0, 1, 0),
        ).result).toBe(0x34567812);
    });

    test("rotate by 16", () => {
        expect(run(
            value,
            16,
            0,
            control(0, 1, 0),
        ).result).toBe(0x56781234);
    });

    test("rotate by 31", () => {
        expect(run(
            value,
            31,
            0,
            control(0, 1, 0),
        ).result).toBe(0x091a2b3c);
    });

    test("rotate by 32 returns original", () => {
        expect(run(
            value,
            32,
            0,
            control(0, 1, 0),
        ).result).toBe(value);
    });

    test("all zeros remain zero", () => {
        expect(run(
            0,
            17,
            0,
            control(0, 1, 0),
        ).result).toBe(0);
    });

    test("all ones remain ones", () => {
        expect(run(
            0xffffffff,
            17,
            0,
            control(0, 1, 0),
        ).result).toBe(0xffffffff);
    });

    test("single bit rotates around entire word", () => {
        expect(run(
            0x00000001,
            1,
            0,
            control(0, 1, 0),
        ).result).toBe(0x00000002);

        expect(run(
            0x00000001,
            31,
            0,
            control(0, 1, 0),
        ).result).toBe(0x80000000);
    });
});

describe("011 - rotate left through carry", () => {
    test("RCL 0 preserves value and carry", () => {
        expect(run(
            0x12345678,
            0,
            1,
            control(0, 1, 1),
        )).toEqual({
            result: 0x12345678,
            carry: 1,
        });
    });

    test("RCL 1 with carry 0", () => {
        expect(run(
            0x80000000,
            1,
            0,
            control(0, 1, 1),
        )).toEqual({
            result: 0x00000000,
            carry: 1,
        });
    });

    test("RCL 1 with carry 1", () => {
        expect(run(
            0x00000000,
            1,
            1,
            control(0, 1, 1),
        )).toEqual({
            result: 0x00000001,
            carry: 0,
        });
    });

    test("RCL 1 normal pattern", () => {
        expect(run(
            0x12345678,
            1,
            0,
            control(0, 1, 1),
        )).toEqual({
            result: 0x2468acf0,
            carry: 0,
        });
    });

    test("RCL 1 inserts carry", () => {
        expect(run(
            0x12345678,
            1,
            1,
            control(0, 1, 1),
        )).toEqual({
            result: 0x2468acf1,
            carry: 0,
        });
    });

    test("RCL 4", () => {
        expect(run(
            0x12345678,
            4,
            1,
            control(0, 1, 1),
        )).toEqual({
            result: 0x23456788,
            carry: 1,
        });
    });

    test("RCL 8", () => {
        expect(run(
            0x12345678,
            8,
            0,
            control(0, 1, 1),
        )).toEqual({
            result: 0x34567809,
            carry: 0,
        });
    });

    test("RCL 16", () => {
        expect(run(
            0x12345678,
            16,
            0,
            control(0, 1, 1),
        )).toEqual({
            result: 0x5678091a,
            carry: 0,
        });
    });

    test("RCL 32", () => {
    expect(run(
        0x12345678,
        32,
        1,
        control(0, 1, 1),
    )).toEqual({
        result: 0x891a2b3c,
        carry: 0,
    });
});

    test("RCL 33 returns original value and carry", () => {
        expect(run(
            0x12345678,
            33,
            1,
            control(0, 1, 1),
        )).toEqual({
            result: 0x12345678,
            carry: 1,
        });
    });

    test("RCL 34 is equivalent to RCL 1", () => {
        expect(run(
            0x12345678,
            34,
            0,
            control(0, 1, 1),
        )).toEqual({
            result: 0x2468acf0,
            carry: 0,
        });
    });
});


describe("111 - rotate right through carry", () => {
    test("RCR 0 preserves value and carry", () => {
        expect(run(
            0x12345678,
            0,
            1,
            control(1, 1, 1),
        )).toEqual({
            result: 0x12345678,
            carry: 1,
        });
    });

    test("RCR 1 with carry 0", () => {
        expect(run(
            0x00000001,
            1,
            0,
            control(1, 1, 1),
        )).toEqual({
            result: 0x00000000,
            carry: 1,
        });
    });

    test("RCR 1 with carry 1", () => {
        expect(run(
            0x00000000,
            1,
            1,
            control(1, 1, 1),
        )).toEqual({
            result: 0x80000000,
            carry: 0,
        });
    });

    test("RCR 1 inserts carry", () => {
        expect(run(
            0x12345678,
            1,
            1,
            control(1, 1, 1),
        )).toEqual({
            result: 0x891a2b3c,
            carry: 0,
        });
    });

    test("RCR 4", () => {
        expect(run(
            0x12345678,
            4,
            1,
            control(1, 1, 1),
        )).toEqual({
            result: 0x11234567,
            carry: 1,
        });
    });

    test("RCR 8", () => {
        expect(run(
            0x12345678,
            8,
            0,
            control(1, 1, 1),
        )).toEqual({
            result: 0xf0123456,
            carry: 0,
        });
    });

    test("RCR 16", () => {
        expect(run(
            0x12345678,
            16,
            0,
            control(1, 1, 1),
        )).toEqual({
            result: 0xacf01234,
            carry: 0,
        });
    });

    test("RCR 32 with carry 0", () => {
    expect(run(
        0x12345678,
        32,
        0,
        control(1, 1, 1),
    )).toEqual({
        result: 0x2468acf0,
        carry: 0,
    });
});

  test("RCR 32 with carry 1", () => {
    expect(run(
        0x12345678,
        32,
        1,
        control(1, 1, 1),
    )).toEqual({
        result: 0x2468acf1, // 610839793
        carry: 0,
    });
});
});

test("RCR 32 with carry 0", () => {
    expect(run(
        0x12345678,
        32,
        0,
        control(1, 1, 1),
    )).toEqual({
        result: 0x2468acf0,
        carry: 0,
    });
});


describe("carry preservation", () => {
    const controls: Bit3[] = [
        control(0, 0, 0), // NOP
        control(0, 1, 0), // ROL
        control(1, 1, 0), // ROR
    ];

    for (const ctrl of controls) {
        for (const carry of [0, 1] as Bit[]) {
            test(`preserves carry=${carry}`, () => {
                const result = run(
                    0x12345678,
                    7,
                    carry,
                    ctrl,
                );

                expect(result.carry).toBe(carry);
            });
        }
    }
});

describe("all shift amounts", () => {
    const values = [
        0x00000000,
        0x00000001,
        0x00000002,
        0x00000003,
        0x7fffffff,
        0x80000000,
        0x80000001,
        0xaaaaaaaa,
        0x55555555,
        0xffffffff,
        0x12345678,
        0xdeadbeef,
    ];

    const operations = [
        control(0, 0, 1), // LSL
        control(1, 0, 0), // ASR
        control(1, 0, 1), // LSR
        control(0, 1, 0), // ROL
        control(1, 1, 0), // ROR
    ];

    for (const value of values) {
        for (const ctrl of operations) {
            for (let shift = 0; shift <= 31; shift++) {
                test(
                    `${value.toString(16)} shift=${shift} ctrl=${ctrl.join("")}`,
                    () => {
                        // Reference implementation goes here.
                    },
                );
            }
        }
    }
});

function reference(
    value: number,
    shift: number,
    carry: Bit,
    ctrl: Bit3,
): { result: number; carry: Bit } {
    const [shiftDir, rotate, withCarry] = ctrl;

    if (ctrl.every((b) => b === 0)) {
        return {
            result: value >>> 0,
            carry,
        };
    }

    if (rotate && withCarry) {
        let state =
            BigInt(carry) |
            (BigInt(value >>> 0) << 1n);

        const amount = shift % 33;

        if (shiftDir === 0) {
            // RCL
            state =
                ((state << BigInt(amount)) |
                (state >> BigInt(33 - amount))) &
                ((1n << 33n) - 1n);
        } else {
            // RCR
            state =
                ((state >> BigInt(amount)) |
                (state << BigInt(33 - amount))) &
                ((1n << 33n) - 1n);
        }

        return {
            result: Number((state >> 1n) & 0xffffffffn) >>> 0,
            carry: Number(state & 1n) as Bit,
        };
    }

    if (rotate) {
        const amount = shift % 32;

        if (amount === 0) {
            return {
                result: value >>> 0,
                carry,
            };
        }

        if (shiftDir === 0) {
            const result =
                ((value << amount) |
                (value >>> (32 - amount))) >>> 0;

            return {
                result,
                carry: carry,
            };
        }

        const result =
            ((value >>> amount) |
            (value << (32 - amount))) >>> 0;

        return {
            result,
            carry,
        };
    }

    if (shiftDir === 0) {
        const result =
            shift >= 32
                ? 0
                : (value << shift) >>> 0;

        return {
            result,
            carry,
        };
    }

    if (withCarry === 0) {
        const signed = value | 0;

        const result =
            shift >= 32
                ? (signed < 0 ? 0xffffffff : 0)
                : signed >> shift;

        return {
            result: result >>> 0,
            carry,
        };
    }

    const result =
        shift >= 32
            ? 0
            : value >>> shift;

    return {
        result,
        carry,
    };
}

describe("randomized reference comparison", () => {
    test("10,000 random cases", () => {
        let state = 0x12345678;

        function random32() {
            state = Math.imul(
                state ^ (state >>> 16),
                0x45d9f3b,
            );

            state ^= state >>> 16;

            return state >>> 0;
        }

        for (let i = 0; i < 10_000; i++) {
            const value = random32();
            const shift = random32() & 0x3f;
            const carry = (random32() & 1) as Bit;

            const ctrlValue = random32() & 0x7;

            const ctrl: Bit3 = [
                ((ctrlValue >> 2) & 1) as Bit,
                ((ctrlValue >> 1) & 1) as Bit,
                (ctrlValue & 1) as Bit,
            ];

            const actual = run(
                value,
                shift,
                carry,
                ctrl,
            );

            const expected = reference(
                value,
                shift,
                carry,
                ctrl,
            );

            expect(actual).toEqual(expected);
        }
    });
});