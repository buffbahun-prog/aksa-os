import { andGate, andGateNInp, inverter, nandGate } from "../../virtual-machine/C.P.U/gates";
import { shiftRotate8 } from "../../virtual-machine/C.P.U/shiftRotate32";
import type { Bit, Bit3, Bit8 } from "../../virtual-machine/types";
import { binaryToDecimal } from "../../virtual-machine/utils/convertion";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";
import { Selector2to1Circuit } from "./Selector2to1";
import { Selector8Bit2to1Circuit } from "./Selector8Bit2to1";

export class ShifterRotator8BitsCircuit extends LevelledCircuit {
    private inpLen = 8;
    private shiftLen = 3;
    private controlLen = 3;

    private shiftBits = Array.from({length: this.shiftLen}).fill(0) as Bit3;
    private controlBits = Array.from({length: this.controlLen}).fill(0) as Bit3;
    private inpBits = Array.from({length: this.inpLen}).fill(0) as Bit8;

    private controlWires: WireResult[][] = Array.from({length: this.controlLen});
    private controlConns: ConnectorResult[][] = Array.from({length: this.controlLen});

    private shiftWires: WireResult[][] = Array.from({length: this.shiftLen});
    private shiftOnValidWires: WireResult[] = Array.from({length: this.shiftLen});

    private inpWires: WireResult[][] = Array.from({length: this.inpLen});
    private inpConns: ConnectorResult[][] = Array.from({length: this.inpLen});

    private muxInpWires1: WireResult[][] = Array.from({length: this.inpLen});
    private muxInpConns1: ConnectorResult[] = Array.from({length: this.inpLen});

    private muxInpWires2: WireResult[][] = Array.from({length: this.inpLen});
    private muxInpConns2: ConnectorResult[] = Array.from({length: this.inpLen});

    private muxInpWires3: WireResult[][] = Array.from({length: this.inpLen});
    private muxInpConns3: ConnectorResult[] = Array.from({length: this.inpLen});

    private muxInpWires4: WireResult[][] = Array.from({length: this.inpLen});
    private muxInpConns4: ConnectorResult[] = Array.from({length: this.inpLen});

    private mux8bit2to1DirRev1!: Selector8Bit2to1Circuit;
    private mux8bit2to1DirRev2!: Selector8Bit2to1Circuit;

    private mux8bit2to1Brl4!: Selector8Bit2to1Circuit;
    private mux2to1Brl4Fill: Selector2to1Circuit[] = Array.from({length: 4});
    private mux2to1Brl4FillWire: WireResult[][] = Array.from({length: 4});

    private mux8bit2to1Brl2!: Selector8Bit2to1Circuit;
    private mux2to1Brl2Fill: Selector2to1Circuit[] = Array.from({length: 2});
    private mux2to1Brl2FillWire: WireResult[][] = Array.from({length: 2});

    private mux8bit2to1Brl1!: Selector8Bit2to1Circuit;
    private mux2to1Brl1Fill: Selector2to1Circuit[] = Array.from({length: 1});
    private mux2to1Brl1FillWire: WireResult[][] = Array.from({length: 1});

    private isArthematicRightShiftWires: WireResult[] = [];
    private isArthematicRightShiftConns: ConnectorResult[] = [];

    private rotateInvWire!: WireResult;
    private isArthematicRightShiftInvWire!: WireResult;
    private shiftFillSignWires: WireResult[] = [];
    private shiftFillSignConns: ConnectorResult[] = [];
    private isValidOpWires: WireResult[] = [];
    private isValidOpConns: ConnectorResult[] = [];

    private outputWires: WireResult[][] = Array.from({length: this.inpLen});
    private outputConns: ConnectorResult[][] = Array.from({length: this.inpLen});

    private shiftByBitsLabel: TextResult[] = Array.from({length: this.shiftLen});
    private controlBitsLabel: TextResult[] = Array.from({length: this.controlLen});
    private inpBitsLabel: TextResult[] = Array.from({length: this.inpLen});
    private outputBitsLabel: TextResult[] = Array.from({length: this.inpLen});

    private shiftByDecimalLabel!: TextResult;

    private finalOut: Bit8 = Array.from({length: this.inpLen}).fill(0) as Bit8;

    private hideConnAndSwitch: boolean;

    constructor(hide = false) {

        super(2);

        this.hideConnAndSwitch = hide;

        this.build();

        this.update();
    }

    getMaxLevel() {
        return this.maxLevel;
    }

    // =========================================================
    // BUILD
    // =========================================================

    protected build(): void {
        switch (this.level) {
            case 0:
                this.build0();
                break;
            case 1:
            case 2:
                this.build1();
                break;
        }
    }

    // =========================================================
    // UPDATE
    // =========================================================

    protected update(): void {
        switch (this.level) {
            case 0:
                this.update0();
                break;
            case 1:
            case 2:
                this.update1();
                break;
        }
        
    }

    private addShifterRotatorOperationLegend(): void {
       const operations = [
           ["000", "Left Shift",                  "LSL"],
           ["001", "Right Shift",                 "LSR"],
           ["010", "Left Rotate",                 "ROL"],
           ["011", "Right Rotate",                "ROR"],
           ["100", "Invalid",                     "---"],
           ["101", "Arithmetic Right Shift",      "ASR"],
           ["110", "Invalid",                     "---"],
           ["111", "Invalid",                     "---"],
       ];
   
       const x = 15;
       const y = 2700;
       const width = 995;
       const rowHeight = 100;
       const height = operations.length * rowHeight;
   
       // Outer border
       this.view.addWire(
           { x, y },
           height,
           "vert",
       );
   
       this.view.addWire(
           { x: x + width, y },
           height,
           "vert",
       );
   
       this.view.addWire(
           { x, y },
           width,
           "horz",
       );
   
       this.view.addWire(
           { x, y: y + height },
           width,
           "horz",
       );
   
       this.view.addWire(
            { x: x + 153, y },
            height,
            "vert",
        );

        this.view.addWire(
            { x: x + 825, y },
            height,
            "vert",
        );
   
       // Rows
       operations.forEach(([opcode, operation, expression], i) => {
           const rowY = y + i * rowHeight;
       
           // Horizontal row separator
           if (i > 0) {
               this.view.addWire(
                   { x, y: rowY },
                   width,
                   "horz",
               );
           }
       
           this.view.addText(
               {
                   x: x + 75,
                   y: rowY + 50,
               },
               opcode,
               { fontSize: 60 },
           );
       
           this.view.addText(
               {
                   x: x + 480,
                   y: rowY + 50,
               },
               operation,
               { fontSize: 60 },
           );
       
           this.view.addText(
               {
                   x: x + 910,
                   y: rowY + 50,
               },
               expression,
               { fontSize: 60 },
           );
       });
    }

    private build0() {
        if (!this.hideConnAndSwitch) {
            this.addShifterRotatorOperationLegend();
            this.shiftByDecimalLabel = this.view.addText(
                {
                    x: 70,
                    y: 300,
                },
                "Shift By: ",
                {fontSize: 60}
            );
        }


        this.view.addBox(
            {
                x: 2192,
                y: 1500,
            },
            {
                width: 4120,
                height: 2200,
            }
        );

        this.view.addText(
            {
                x: 2100,
                y: 1400,
            },
            "8 Bits Shifter / Rotator",
            {fontSize: 150}
        );
       
       for (let i = 0; i < this.shiftLen; i++) {
            this.shiftWires[i] = [
                this.view.addWire(
                    {
                        x: -17,
                        y: 500 + (i * 70),
                    },
                    150,
                    "horz"
                ),
            ];

            this.view.addText(
                {
                    x: 200,
                    y: 500 + (i * 70),
                },
                `S${i}`,
                {fontSize: 50},
            );

            if (!this.hideConnAndSwitch) {
                this.shiftByBitsLabel[i] = this.view.addText(
                    {
                        x: 10,
                        y: 470 + (i * 70),
                    },
                    "",
                    {fontSize: 35},
                );

                const shiftSwitch = this.view.addSwitch(
                    {
                        x: -17,
                        y: 500 + (i * 70),
                    },
                    16,
                    (bit) => {
                        this.shiftBits[i] = bit;
                        this.update();
                    }
                );

                this.view.setSwitchBit(shiftSwitch.switchId, this.shiftBits[i]);
            }
        }

        const shiftByY = 70;
        for (let i = 0; i < this.inpLen; i++) {
            this.inpWires[i] = [
                this.view.addWire(
                    {
                        x: -17,
                        y: 890 + (shiftByY * i),
                    },
                    150,
                    "horz",
                ),
            ];

            this.outputWires[i] = [
                this.view.addWire(
                    {
                        x: 4258,
                        y: 907.5 + ((shiftByY + 83.9) * i),
                    },
                    100,
                    "horz",
                ),
            ];

            this.view.addText(
                {
                    x: 200,
                    y: 890 + (shiftByY * i),
                },
                `A${i}`,
                {fontSize: 50},
            );

            this.view.addText(
                    {
                        x: 4258 - 70,
                        y: 907.5 + ((shiftByY + 83.9) * i),
                    },
                    `R${i}`,
                    {fontSize: 50},
            );

            if (!this.hideConnAndSwitch) {
                this.outputConns[i] = [
                    this.view.addConnector(
                      {
                        x: 4258 + 100,
                        y: 907.5 + ((shiftByY + 83.9) * i),
                      },  
                    ),
                ];

                this.outputBitsLabel[i] =  this.view.addText(
                    {
                        x: 4258 + 80,
                        y: 880.5 + ((shiftByY + 83.9) * i),
                    },
                    ``,
                    {fontSize: 35},
                );
            }

            if (!this.hideConnAndSwitch) {

                this.inpBitsLabel[i] = this.view.addText(
                    {
                        x: 25,
                        y: 860 + (shiftByY * i),
                    },
                    "",
                    {fontSize: 35},
                );


                const inpSwitch = this.view.addSwitch(
                    {
                        x: -17,
                        y: 890 + (shiftByY * i),
                    },
                    16,
                    (bit) => {
                        this.inpBits[i] = bit;
                        this.update();
                    }
                );

                this.view.setSwitchBit(inpSwitch.switchId, this.inpBits[i]);
            }
        }

        // control 0 (msb)
        this.controlWires[0] = [
            this.view.addWire(
                {
                    x: -17,
                    y: 2300,
                },
                150,
                "horz"
            ),
        ];

        this.view.addText(
            {
                x: 200,
                y: 2300,
            },
            `C0`,
            {fontSize: 50},
        );

        if (!this.hideConnAndSwitch) {
            this.controlBitsLabel[0] = this.view.addText(
                {
                    x: 25,
                    y: 2270,
                },
                ``,
                {fontSize: 35},
            );

            const controlSwitch0 = this.view.addSwitch(
                {
                    x: -17,
                    y: 2300,
                },
                16,
                (bit) => {
                    this.controlBits[0] = bit;
                    this.update();
                }
            );

            this.view.setSwitchBit(controlSwitch0.switchId, this.controlBits[0]);
        }

        // control 1 (rotate)
        this.controlWires[1] = [
            this.view.addWire(
                {
                    x: -17,
                    y: 2300 + 70,
                },
                150,
                "horz"
            ),
        ];

        this.view.addText(
            {
                x: 200,
                y: 2300 + 70,
            },
            `C1`,
            {fontSize: 50},
        );

        if (!this.hideConnAndSwitch) {
            this.controlBitsLabel[1] = this.view.addText(
                {
                    x: 25,
                    y: 2270 + 70,
                },
                ``,
                {fontSize: 35},
            );

            const controlSwitch1 = this.view.addSwitch(
                {
                    x: -17,
                    y: 2300 + 70,
                },
                16,
                (bit) => {
                    this.controlBits[1] = bit;
                    this.update();
                }
            );

            this.view.setSwitchBit(controlSwitch1.switchId, this.controlBits[1]);
        }

        // control 2 (rightDir)
        this.controlWires[2] = [
            this.view.addWire(
                {
                    x: -17,
                    y: 2300 + 70 * 2,
                },
                150,
                "horz"
            ),
        ];

        this.view.addText(
                {
                    x: 200,
                    y: 2300 + 140,
                },
                `C2`,
                {fontSize: 50},
            );

        if (!this.hideConnAndSwitch) {

            this.controlBitsLabel[2] = this.view.addText(
                {
                    x: 25,
                    y: 2270 + 140,
                },
                ``,
                {fontSize: 35},
            );

            const controlSwitch2 = this.view.addSwitch(
                {
                    x: -17,
                    y: 2300 + 70 + 70,
                },
                16,
                (bit) => {
                    this.controlBits[2] = bit;
                    this.update();
                }
            );

            this.view.setSwitchBit(controlSwitch2.switchId, this.controlBits[2]);
        }
    }

    private build1() {
        if (!this.hideConnAndSwitch) {
            this.addShifterRotatorOperationLegend();
            this.shiftByDecimalLabel = this.view.addText(
                {
                    x: 70,
                    y: 300,
                },
                "Shift By: ",
                {fontSize: 60}
            );
        }

        const level = this.level;

        for (let i = 0; i < this.shiftLen; i++) {
            this.shiftWires[i] = [
                this.view.addWire(
                    {
                        x: -17,
                        y: 500 + (i * 70),
                    },
                    1550 + (900 * i),
                    "horz"
                ),
                this.view.addWire(
                    {
                        x: -17 + 1550 + (900 * i),
                        y: 500 + (i * 70),
                    },
                    225 - (i * 70),
                    "vert"
                ),
            ];

            this.shiftOnValidWires[i] = this.view.addWire(
                {
                    x: 1520 + (900 * i),
                    y: 795,
                },
                70,
                "vert",
            );

            if (!this.hideConnAndSwitch) {
                this.view.addText(
                    {
                        x: -77,
                        y: 500 + (i * 70),
                    },
                    `S${i}`,
                    {fontSize: 40},
                );

                this.shiftByBitsLabel[i] = this.view.addText(
                    {
                        x: 10,
                        y: 470 + (i * 70),
                    },
                    "",
                    {fontSize: 35},
                );

                const shiftSwitch = this.view.addSwitch(
                    {
                        x: -17,
                        y: 500 + (i * 70),
                    },
                    16,
                    (bit) => {
                        this.shiftBits[i] = bit;
                        this.update();
                    }
                );

                this.view.setSwitchBit(shiftSwitch.switchId, this.shiftBits[i]);
            }
        }

        const shiftByY = 70;
        for (let i = 0; i < this.inpLen; i++) {
            this.inpWires[i] = [
                this.view.addWire(
                    {
                        x: -17,
                        y: 890 + (shiftByY * i),
                    },
                    284,
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: 50 + ((shiftByY - 54) * i),
                        y: 890 + (shiftByY * i),
                    },
                    1112 - ((shiftByY + 70) * i),
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 50 + ((shiftByY - 54) * i),
                        y: 891 + (shiftByY * i) + (1112 - ((shiftByY + 70) * i)),
                    },
                    217 - ((shiftByY - 54) * i),
                    "horz",
                ),
            ];

            this.inpConns[i] = [this.view.addConnector(
                {
                    x: 50 + ((shiftByY - 54) * i),
                    y: 890 + (shiftByY * i),
                },
            )];

            this.muxInpWires1[i] = [
                this.view.addWire(
                    {
                        x: 659,
                        y: 907.5 + ((shiftByY + 84) * i),
                    },
                    250 + ((shiftByY - 48) * i),
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: 659 + 250 + ((shiftByY - 48) * i),
                        y: 907.5 + ((shiftByY + 84) * i),
                    },
                    -17.5 - ((shiftByY + 14) * i),
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 659 + 250 + ((shiftByY - 48) * i),
                        y: 907.5 + ((shiftByY + 84) * i) - 17.5 - ((shiftByY + 14) * i),
                    },
                    257 - ((shiftByY - 48) * i),
                    "horz",
                ),
            ];
            if (i < 4) {
                this.muxInpWires1[i].push(
                    this.view.addWire(
                        {
                            x: 710 - (10 * i),
                            y: 910 + ((shiftByY + 83) * i),
                        },
                        574,
                        "vert",
                    ),
                    this.view.addWire(
                        {
                            x: 710 - (10 * i),
                            y: 910 + ((shiftByY + 83) * i) + 574,
                        },
                        87 + (10 * i),
                        "horz",
                    ),
                );

                this.muxInpConns1[i] = this.view.addConnector(
                    {
                        x: 710 - (10 * i),
                        y: 909 + ((shiftByY + 84) * i),
                    }
                );
            }
            else {
                this.muxInpWires1[i].push(
                    this.view.addWire(
                        {
                            x: 659 + 250 + ((shiftByY - 48) * i),
                            y: 1233 + ((shiftByY) * i),
                        },
                        257 - ((shiftByY - 48) * i),
                        "horz",
                    ),
                );

                this.muxInpConns1[i] = this.view.addConnector(
                    {
                        x: 659 + 250 + ((shiftByY - 48) * i),
                        y: 1233 + ((shiftByY) * i),
                    }
                );
            }

            const xShift = 900;
            this.muxInpWires2[i] = [
                this.view.addWire(
                    {
                        x: 659 + xShift,
                        y: 907.5 + ((shiftByY + 84) * i),
                    },
                    250 + ((shiftByY - 48) * i),
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: 659 + xShift + 250 + ((shiftByY - 48) * i),
                        y: 907.5 + ((shiftByY + 84) * i),
                    },
                    -17.5 - ((shiftByY + 14) * i),
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 659 + xShift + 250 + ((shiftByY - 48) * i),
                        y: 907.5 + ((shiftByY + 84) * i) - 17.5 - ((shiftByY + 14) * i),
                    },
                    257 - ((shiftByY - 48) * i),
                    "horz",
                ),
            ];

            if (i < 2) {
                this.muxInpWires2[i].push(
                    this.view.addWire(
                        {
                            x: 710 + 875 - (10 * i),
                            y: 910 + ((shiftByY + 83) * i),
                        },
                        882,
                        "vert",
                    ),
                    this.view.addWire(
                        {
                            x: 710 + 875 - (10 * i),
                            y: 910 + ((shiftByY + 83) * i) + 882,
                        },
                        62 + (10 * i),
                        "horz",
                    ),
                );

                this.muxInpConns2[i] = this.view.addConnector(
                    {
                        x: 710 + 875 - (10 * i),
                        y: 909 + ((shiftByY + 84) * i),
                    }
                );
            }
            else {
                this.muxInpWires2[i].push(
                    this.view.addWire(
                        {
                            x: 659 + 875 + 340 - ((shiftByY - 60) * i),
                            y: 907.5 + ((shiftByY + 84) * i),
                        },
                        1373 - 907.5 - 84*i,
                        "vert",
                    ),
                    this.view.addWire(
                        {
                            x: 659 + 875 + 340 - ((shiftByY - 60) * i),
                            y: 1373 + ((shiftByY) * i),
                        },
                        192 + ((shiftByY - 60) * i),
                        "horz",
                    ),
                );

                this.muxInpConns2[i] = this.view.addConnector(
                    {
                        x: 659 + 875 + 340 - ((shiftByY - 60) * i),
                        y: 907.5 + ((shiftByY + 84) * i),
                    }
                );
            }

            this.muxInpWires3[i] = [
                this.view.addWire(
                    {
                        x: 659 + xShift * 2,
                        y: 907.5 + ((shiftByY + 84) * i),
                    },
                    250 + ((shiftByY - 48) * i),
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: 659 + xShift * 2 + 250 + ((shiftByY - 48) * i),
                        y: 907.5 + ((shiftByY + 84) * i),
                    },
                    -17.5 - ((shiftByY + 14) * i),
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 659 + xShift * 2 + 250 + ((shiftByY - 48) * i),
                        y: 907.5 + ((shiftByY + 84) * i) - 17.5 - ((shiftByY + 14) * i),
                    },
                    257 - ((shiftByY - 48) * i),
                    "horz",
                ),
            ];

            if (i < 1) {
                this.muxInpWires3[i].push(
                    this.view.addWire(
                        {
                            x: 725 + 875 * 2 - (10 * i),
                            y: 910 + ((shiftByY + 83) * i),
                        },
                        1038,
                        "vert",
                    ),
                    this.view.addWire(
                        {
                            x: 725 + 875 * 2 - (10 * i),
                            y: 910 + ((shiftByY + 83) * i) + 1038,
                        },
                        72 + (10 * i),
                        "horz",
                    ),
                );

                this.muxInpConns3[i] = this.view.addConnector(
                    {
                        x: 725 + 875 * 2 - (10 * i),
                        y: 909 + ((shiftByY + 84) * i),
                    }
                );
            }
            else {
                this.muxInpWires3[i].push(
                    this.view.addWire(
                        {
                            x: 651 + 875 * 2 + 340 - ((shiftByY - 60) * i),
                            y: 907.5 + ((shiftByY + 84) * i),
                        },
                        1443 - 907.5 - 84*i,
                        "vert",
                    ),
                    this.view.addWire(
                        {
                            x: 651 + 875 * 2 + 340 - ((shiftByY - 60) * i),
                            y: 1443 + ((shiftByY) * i),
                        },
                        224 + ((shiftByY - 60) * i),
                        "horz",
                    ),
                );

                this.muxInpConns3[i] = this.view.addConnector(
                    {
                        x: 651 + 875 * 2 + 340 - ((shiftByY - 60) * i),
                        y: 907.5 + ((shiftByY + 84) * i),
                    }
                );
            }

            this.muxInpWires4[i] = [
                this.view.addWire(
                    {
                        x: 659 + xShift * 3,
                        y: 907.5 + ((shiftByY + 84) * i),
                    },
                    100 + ((shiftByY - 48) * i),
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: 659 + xShift * 3 + 100 + ((shiftByY - 48) * i),
                        y: 907.5 + ((shiftByY + 84) * i),
                    },
                    -17.5 - ((shiftByY + 14) * i),
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 659 + xShift * 3 + 100 + ((shiftByY - 48) * i),
                        y: 907.5 + ((shiftByY + 84) * i) - 17.5 - ((shiftByY + 14) * i),
                    },
                    407 - ((shiftByY - 48) * i),
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: 830 + xShift * 3 + 100 + ((shiftByY - 51) * i),
                        y: 907.5 + ((shiftByY + 84) * i) - 17.5 - ((shiftByY + 14) * i),
                    },
                    1113 - (shiftByY * 2 * i),
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 830 + xShift * 3 + 100 + ((shiftByY - 51) * i),
                        y: 907.5 + ((shiftByY + 84) * i) - 17.5 - ((shiftByY + 14) * i) + 1113 - (shiftByY * 2 * i),
                    },
                    235 - (i * 19),
                    "horz",
                ),
            ];

            this.muxInpConns4[i] = this.view.addConnector(
                {
                    x: 830 + xShift * 3 + 100 + ((shiftByY - 51) * i),
                    y: 907.5 + ((shiftByY + 84) * i) - 17.5 - ((shiftByY + 14) * i),
                }
            );

            this.outputWires[i] = [
                this.view.addWire(
                    {
                        x: 4258,
                        y: 907.5 + ((shiftByY + 83.9) * i),
                    },
                    100,
                    "horz",
                ),
            ];

            if (!this.hideConnAndSwitch) {
                this.outputConns[i] = [
                    this.view.addConnector(
                      {
                        x: 4258 + 100,
                        y: 907.5 + ((shiftByY + 83.9) * i),
                      },  
                    ),
                ];

                this.view.addText(
                    {
                        x: 4258 + 150,
                        y: 907.5 + ((shiftByY + 83.9) * i),
                    },
                    `R${i}`,
                    {fontSize: 40},
                );

                this.outputBitsLabel[i] =  this.view.addText(
                    {
                        x: 4258 + 80,
                        y: 880.5 + ((shiftByY + 83.9) * i),
                    },
                    ``,
                    {fontSize: 35},
                );
            }

            if (!this.hideConnAndSwitch) {
                this.view.addText(
                    {
                        x: -77,
                        y: 890 + (shiftByY * i),
                    },
                    `A${i}`,
                    {fontSize: 40},
                );

                this.inpBitsLabel[i] = this.view.addText(
                    {
                        x: 25,
                        y: 860 + (shiftByY * i),
                    },
                    "",
                    {fontSize: 35},
                );


                const inpSwitch = this.view.addSwitch(
                    {
                        x: -17,
                        y: 890 + (shiftByY * i),
                    },
                    16,
                    (bit) => {
                        this.inpBits[i] = bit;
                        this.update();
                    }
                );

                this.view.setSwitchBit(inpSwitch.switchId, this.inpBits[i]);
            }
        }

        // isArthematicRightShift
        this.view.addAndGate(
            {
                x: 500,
                y: 2200,
            },
            {
                width: 100,
                height: 100,
            }
        );

        this.isArthematicRightShiftWires = [
            this.view.addWire(
                {
                    x: 550,
                    y: 2200,
                },
                230,
                "horz"
            ),
            this.view.addWire(
                {
                    x: 600,
                    y: 2200,
                },
                -60,
                "vert"
            ),
            this.view.addWire(
                {
                    x: 600,
                    y: 2200 - 60,
                },
                80,
                "horz"
            ),
        ];

        this.isArthematicRightShiftConns = [
            this.view.addConnector(
                {
                    x: 600,
                    y: 2200,
                },
            ),
        ];

        this.isArthematicRightShiftInvWire = this.view.addWire(
            {
                x: 800,
                y: 2200,
            },
            160,
            "horz",
        );

        this.rotateInvWire =  this.view.addWire(
            {
                x: 350,
                y: 2200,
            },
            95,
            "horz"
        );

        this.view.addNotGate(
            {
                x: 350,
                y: 2200,
            },
            {
                width: 40,
                height: 40,
            }
        );

        // shiftFillBit
        this.view.addAndGate(
            {
                x: 700,
                y: 2120,
            },
            {
                width: 80,
                height: 80,
            }
        );

        this.inpWires[0].push(
            this.view.addWire(
                {
                    x: 100,
                    y: 2005,
                },
                95,
                "vert"
            ),
            this.view.addWire(
                {
                    x: 100,
                    y: 2005 + 95,
                },
                560,
                "horz"
            ),
        );

        this.inpConns[0].push(
            this.view.addConnector(
                {
                    x: 100,
                    y: 2005,
                },
            ),
        );

        this.shiftFillSignWires = [
            this.view.addWire(
                {
                    x: 740,
                    y: 2120,
                },
                1775,
                "horz"
            ),
            this.view.addWire(
                {
                    x: 740 + 1775,
                    y: 2120,
                },
                -202,
                "vert"
            ),
            this.view.addWire(
                {
                    x: 740 + 1775,
                    y: 2120 - 202,
                },
                32,
                "horz"
            ),
            this.view.addWire(
                {
                    x: 740 + 875,
                    y: 2120,
                },
                -357,
                "vert"
            ),
            this.view.addWire(
                {
                    x: 740 + 875,
                    y: 2120 - 357,
                },
                32,
                "horz"
            ),
            this.view.addWire(
                {
                    x: 740 + 25,
                    y: 2120,
                },
                -665,
                "vert"
            ),
            this.view.addWire(
                {
                    x: 740 + 25,
                    y: 2120 - 665,
                },
                32,
                "horz"
            ),
        ];

        this.shiftFillSignConns = [
            this.view.addConnector(
                {
                    x: 740 + 875,
                    y: 2120,
                },
            ),
            this.view.addConnector(
                {
                    x: 740 + 25,
                    y: 2120,
                },
            ),
        ];

        // isValidOp
        this.view.addNandGate(
            {
                x: 1000,
                y: 2220
            },
            {
                width: 80,
                height: 80,
            },
        );

        this.view.addNotGate(
            {
                x: 800,
                y: 2200
            },
            {
                width: 40,
                height: 40,
            },
        );

        this.view.addAndGate(
            {
                x: 1520,
                y: 760,
            },
            {
                width: 60,
                height: 60,
            },
            true,
            "down"
        );

        this.view.addAndGate(
            {
                x: 1520 + 900,
                y: 760,
            },
            {
                width: 60,
                height: 60,
            },
            true,
            "down"
        );

        this.view.addAndGate(
            {
                x: 1520 + 1800,
                y: 760,
            },
            {
                width: 60,
                height: 60,
            },
            true,
            "down"
        );

        this.isValidOpWires = [
            this.view.addWire(
                {
                    x: 1060,
                    y: 2220,
                },
                1870,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 1130,
                    y: 2220,
                },
                -1520,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 1130,
                    y: 2220 - 1520,
                },
                370,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 1130 + 370,
                    y: 2220 - 1520,
                },
                30,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 1130 + 900,
                    y: 2220,
                },
                -1520,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 1130 + 900,
                    y: 2220 - 1520,
                },
                370,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 1130 + 370 + 900,
                    y: 2220 - 1520,
                },
                30,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 1130 + 1800,
                    y: 2220,
                },
                -1520,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 1130 + 1800,
                    y: 2220 - 1520,
                },
                370,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 1130 + 370 + 1800,
                    y: 2220 - 1520,
                },
                30,
                "vert",
            ),
        ];

        this.isValidOpConns = [
            this.view.addConnector(
                {
                    x: 1130,
                    y: 2220,
                }
            ),
            this.view.addConnector(
                {
                    x: 1130 + 900,
                    y: 2220,   
                }
            ),
        ]


        // control 0 (msb)
        this.controlWires[0] = [
            this.view.addWire(
                {
                    x: -17,
                    y: 2300,
                },
                940,
                "horz"
            ),
            this.view.addWire(
                {
                    x: -17 + 940,
                    y: 2300,
                },
                -55,
                "vert"
            ),
            this.view.addWire(
                {
                    x: -17 + 940,
                    y: 2300 - 55,
                },
                32,
                "horz"
            ),
            this.view.addWire(
                {
                    x: 420,
                    y: 2300,
                },
                -60,
                "vert"
            ),
            this.view.addWire(
                {
                    x: 420,
                    y: 2300 - 60,
                },
                28,
                "horz"
            ),
        ];

        this.controlConns[0] = [
            this.view.addConnector(
                {
                    x: 420,
                    y: 2300,
                },
            ),
        ];

        if (!this.hideConnAndSwitch) {
            this.view.addText(
                {
                    x: -77,
                    y: 2300,
                },
                `C0`,
                {fontSize: 40},
            );

            this.controlBitsLabel[0] = this.view.addText(
                {
                    x: 25,
                    y: 2270,
                },
                ``,
                {fontSize: 35},
            );

            const controlSwitch0 = this.view.addSwitch(
                {
                    x: -17,
                    y: 2300,
                },
                16,
                (bit) => {
                    this.controlBits[0] = bit;
                    this.update();
                }
            );

            this.view.setSwitchBit(controlSwitch0.switchId, this.controlBits[0]);
        }

        // control 1 (rotate)
        this.controlWires[1] = [
            this.view.addWire(
                {
                    x: -17,
                    y: 2300 + 70,
                },
                2647,
                "horz"
            ),
            this.view.addWire(
                {
                    x: 300,
                    y: 2300 + 70,
                },
                -170,
                "vert"
            ),
            this.view.addWire(
                {
                    x: 300,
                    y: 2300 + 70 - 170,
                },
                25,
                "horz"
            ),
            this.view.addWire(
                {
                    x: -17 + 2647,
                    y: 2300 + 70,
                },
                -505,
                "vert"
            ),
            this.view.addWire(
                {
                    x: 880,
                    y: 2300 + 70,
                },
                -970,
                "vert"
            ),
            this.view.addWire(
                {
                    x: 880 + 850,
                    y: 2300 + 70,
                },
                -660,
                "vert"
            ),
        ];

        this.controlConns[1] = [
            this.view.addConnector(
                {
                    x: 880,
                    y: 2300 + 70,
                },
            ),
            this.view.addConnector(
                {
                    x: 880 + 850,
                    y: 2300 + 70,
                },
            ),
            this.view.addConnector(
                {
                    x: 300,
                    y: 2300 + 70,
                },
            ),
        ];

        if (!this.hideConnAndSwitch) {
            this.view.addText(
                {
                    x: -77,
                    y: 2300 + 70,
                },
                `C1`,
                {fontSize: 40},
            );

            this.controlBitsLabel[1] = this.view.addText(
                {
                    x: 25,
                    y: 2270 + 70,
                },
                ``,
                {fontSize: 35},
            );

            const controlSwitch1 = this.view.addSwitch(
                {
                    x: -17,
                    y: 2300 + 70,
                },
                16,
                (bit) => {
                    this.controlBits[1] = bit;
                    this.update();
                }
            );

            this.view.setSwitchBit(controlSwitch1.switchId, this.controlBits[1]);
        }

        // control 2 (rightDir)
        this.controlWires[2] = [
            this.view.addWire(
                {
                    x: -17,
                    y: 2300 + 70 * 2,
                },
                3850,
                "horz"
            ),
            this.view.addWire(
                {
                    x: -17 + 3850,
                    y: 2300 + 70 * 2,
                },
                -1650,
                "vert"
            ),
            this.view.addWire(
                {
                    x: -17 + 3850,
                    y: 2300 + 70 * 2 - 1650,
                },
                387,
                "horz"
            ),
            this.view.addWire(
                {
                    x: -17 + 3850 + 387,
                    y: 2300 + 70 * 2 - 1650,
                },
                65,
                "vert"
            ),
            this.view.addWire(
                {
                    x: -17 + 250,
                    y: 2300 + 70 * 2,
                },
                -1650,
                "vert"
            ),
            this.view.addWire(
                {
                    x: -17 + 250,
                    y: 2300 + 70 * 2 - 1650,
                },
                387,
                "horz"
            ),
            this.view.addWire(
                {
                    x: -17 + 250 + 387,
                    y: 2300 + 70 * 2 - 1650,
                },
                65,
                "vert"
            ),
            this.view.addWire(
                {
                    x: -17 + 250,
                    y: 2300 + 70 * 2 - 275,
                },
                215,
                "horz"
            ),
        ];

        this.controlConns[2] = [
            this.view.addConnector(
                {
                    x: -17 + 250,
                    y: 2300 + 70 * 2,
                },
            ),
            this.view.addConnector(
                {
                    x: -17 + 250,
                    y: 2300 + 70 * 2 - 275,
                },
            ),
        ];

        if (!this.hideConnAndSwitch) {
            this.view.addText(
                {
                    x: -77,
                    y: 2300 + 140,
                },
                `C2`,
                {fontSize: 40},
            );

            this.controlBitsLabel[2] = this.view.addText(
                {
                    x: 25,
                    y: 2270 + 140,
                },
                ``,
                {fontSize: 35},
            );

            const controlSwitch2 = this.view.addSwitch(
                {
                    x: -17,
                    y: 2300 + 70 + 70,
                },
                16,
                (bit) => {
                    this.controlBits[2] = bit;
                    this.update();
                }
            );

            this.view.setSwitchBit(controlSwitch2.switchId, this.controlBits[2]);
        }

        this.mux8bit2to1DirRev1 = new Selector8Bit2to1Circuit(true);
        this.mux8bit2to1DirRev1.setLevel(level - 1, false);
        this.mux8bit2to1DirRev1.getView.moveBy(-115, 732.5);
        this.mux8bit2to1DirRev1.getView.resize(.7);
        this.view.element.appendChild(this.mux8bit2to1DirRev1.element);


        for (let i = 0; i < 4; i++) {
            this.mux2to1Brl4Fill[i] = new Selector2to1Circuit(true);
            this.mux2to1Brl4Fill[i].setLevel(level - 1, false);
            this.mux2to1Brl4Fill[i].getView.moveBy(650, 1380 + (153 * i));
            this.mux2to1Brl4Fill[i].getView.resize(.3);
            this.view.element.appendChild(this.mux2to1Brl4Fill[i].element);

            this.mux2to1Brl4FillWire[i] = [
                this.view.addWire(
                    {
                        x: 863,
                        y: 1470 + (153 * i),
                    },
                    120 - (15 * i),
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: 863 + 120 - (15 * i),
                        y: 1470 + (153 * i),
                    },
                    323 - (83 * i),
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 863 + 120 - (15 * i),
                        y: 1470 + (153 * i) + 323 - (83 * i),
                    },
                    182 + (i * 15),
                    "horz",
                ),
            ]

            this.controlWires[1].push(
                this.view.addWire(
                    {
                        x: 830,
                        y: 1400 + (153 * i),
                    },
                    23,
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 830,
                        y: 1400 + (153 * i),
                    },
                    50,
                    "horz",
                ),
            );

            if (i > 0)
            this.controlConns[1].push(
                this.view.addConnector(
                    {
                        x: 830 + 50,
                        y: 1400 + (153 * i),
                    },
                ),
            );

            if (i > 0)
            this.shiftFillSignWires.push(
                this.view.addWire(
                    {
                        x: 767,
                        y: 1455 + (153 * i),
                    },
                    32,
                    "horz",
                ),
            );
            if (i > 0)
            this.shiftFillSignConns.push(
                this.view.addConnector(
                    {
                        x: 767,
                        y: 1455 + (153 * i),
                    },
                ),
            );

        }
        this.mux8bit2to1Brl4 = new Selector8Bit2to1Circuit(true);
        this.mux8bit2to1Brl4.setLevel(level - 1, false);
        this.mux8bit2to1Brl4.getView.moveBy(-115 + 900, 732.5);
        this.mux8bit2to1Brl4.getView.resize(.7);
        this.view.element.appendChild(this.mux8bit2to1Brl4.element);

        let muxXShft = 850;
        for (let i = 0; i < 2; i++) {
            this.mux2to1Brl2Fill[i] = new Selector2to1Circuit(true);
            this.mux2to1Brl2Fill[i].setLevel(level - 1, false);
            this.mux2to1Brl2Fill[i].getView.moveBy(650 + muxXShft, 1687 + (153 * i));
            this.mux2to1Brl2Fill[i].getView.resize(.3);
            this.view.element.appendChild(this.mux2to1Brl2Fill[i].element);

            this.mux2to1Brl2FillWire[i] = [
                this.view.addWire(
                    {
                        x: 863 + muxXShft,
                        y: 1777 + (153 * i),
                    },
                    70 - (15 * i),
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: 863 + muxXShft + 70 - (15 * i),
                        y: 1777 + (153 * i),
                    },
                    156 - (83 * i),
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 863 + muxXShft + 70 - (15 * i),
                        y: 1777 + (153 * i) + 156 - (83 * i),
                    },
                    282 + (i * 15),
                    "horz",
                ),
            ]

            this.controlWires[1].push(
                this.view.addWire(
                    {
                        x: 830 + muxXShft,
                        y: 1707 + (153 * i),
                    },
                    23,
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 830 + muxXShft,
                        y: 1707 + (153 * i),
                    },
                    50,
                    "horz",
                ),
            );

            if (i > 0)
            this.controlConns[1].push(
                this.view.addConnector(
                    {
                        x: 830 + muxXShft + 50,
                        y: 1707 + (153 * i),
                    },
                ),
            );

            if (i > 0)
            this.shiftFillSignWires.push(
                this.view.addWire(
                    {
                        x: 830 + muxXShft - 63,
                        y: 1760 + (153 * i),
                    },
                    32,
                    "horz",
                ),
            );
            if (i > 0)
            this.shiftFillSignConns.push(
                this.view.addConnector(
                    {
                        x: 830 + muxXShft - 65,
                        y: 1760 + (153 * i),
                    },
                ),
            );

        }

        this.mux8bit2to1Brl2 = new Selector8Bit2to1Circuit(true);
        this.mux8bit2to1Brl2.setLevel(level - 1, false);
        this.mux8bit2to1Brl2.getView.moveBy(-115 + 900 + 900, 732.5);
        this.mux8bit2to1Brl2.getView.resize(.7);
        this.view.element.appendChild(this.mux8bit2to1Brl2.element);

        muxXShft = 900 + muxXShft;
        for (let i = 0; i < 1; i++) {
            this.mux2to1Brl1Fill[i] = new Selector2to1Circuit(true);
            this.mux2to1Brl1Fill[i].setLevel(level - 1, false);
            this.mux2to1Brl1Fill[i].getView.moveBy(650 + muxXShft, 1843 + (153 * i));
            this.mux2to1Brl1Fill[i].getView.resize(.3);
            this.view.element.appendChild(this.mux2to1Brl1Fill[i].element);

            this.mux2to1Brl1FillWire[i] = [
                this.view.addWire(
                    {
                        x: 863 + muxXShft,
                        y: 1933 + (153 * i),
                    },
                    40 - (15 * i),
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: 863 + muxXShft + 40 - (15 * i),
                        y: 1933 + (153 * i),
                    },
                    70 - (83 * i),
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 863 + muxXShft + 40 - (15 * i),
                        y: 1933 + (153 * i) + 70 - (83 * i),
                    },
                    312 + (i * 15),
                    "horz",
                ),
            ]

            this.controlWires[1].push(
                this.view.addWire(
                    {
                        x: 830 + muxXShft,
                        y: 1863 + (153 * i),
                    },
                    23,
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 830 + muxXShft,
                        y: 1863 + (153 * i),
                    },
                    50,
                    "horz",
                ),
            );
        }

        this.mux8bit2to1Brl1 = new Selector8Bit2to1Circuit(true);
        this.mux8bit2to1Brl1.setLevel(level - 1, false);
        this.mux8bit2to1Brl1.getView.moveBy(-115 + 900 + 900 + 900, 732.5);
        this.mux8bit2to1Brl1.getView.resize(.7);
        this.view.element.appendChild(this.mux8bit2to1Brl1.element);

        this.mux8bit2to1DirRev2 = new Selector8Bit2to1Circuit(true);
        this.mux8bit2to1DirRev2.setLevel(level - 1, false);
        this.mux8bit2to1DirRev2.getView.moveBy(-115 + 900 + 900 + 900 + 900, 732.5);
        this.mux8bit2to1DirRev2.getView.resize(.7);
        this.view.element.appendChild(this.mux8bit2to1DirRev2.element);
    }

    private update0() {
        for (let i = 0; i < this.shiftLen; i++) {
            const shiftBit = this.shiftBits[i];
            this.setSignal(shiftBit, this.shiftWires[i], []);
            if (this.shiftByBitsLabel[i]) this.view.setTextBitAnimated(this.shiftByBitsLabel[i].textId, shiftBit);
        }

        if (this.shiftByDecimalLabel) this.view.setText(this.shiftByDecimalLabel.textId, `Shift By: ${binaryToDecimal(this.shiftBits)}`);

        for (let i = 0; i < this.controlLen; i++) {
            const controlBit = this.controlBits[i];
            this.setSignal(controlBit, this.controlWires[i], []);
            if (this.controlBitsLabel[i]) this.view.setTextBitAnimated(this.controlBitsLabel[i].textId, controlBit);
        }

        for (let i = 0; i < this.inpLen; i++) {
            const inpBit = this.inpBits[i];
            this.setSignal(inpBit, this.inpWires[i], []);
            if (this.inpBitsLabel[i]) this.view.setTextBitAnimated(this.inpBitsLabel[i].textId, inpBit);
        }

        const transformedVal = shiftRotate8(this.inpBits, this.shiftBits, this.controlBits);
        transformedVal.forEach((bit, indx) => {
            this.setSignal(bit, this.outputWires[indx], this.outputConns[indx] ? this.outputConns[indx] : []);
            if (this.outputBitsLabel[indx]) this.view.setTextBitAnimated(this.outputBitsLabel[indx].textId, bit);
        });

        this.finalOut = transformedVal;
    }

    private update1() {
        for (let i = 0; i < this.shiftLen; i++) {
            const shiftBit = this.shiftBits[i];
            this.setSignal(shiftBit, this.shiftWires[i], []);
            if (this.shiftByBitsLabel[i]) this.view.setTextBitAnimated(this.shiftByBitsLabel[i].textId, shiftBit);
        }

        if (this.shiftByDecimalLabel) this.view.setText(this.shiftByDecimalLabel.textId, `Shift By: ${binaryToDecimal(this.shiftBits)}`);

        for (let i = 0; i < this.controlLen; i++) {
            const controlBit = this.controlBits[i];
            this.setSignal(controlBit, this.controlWires[i], this.controlConns[i]);
            if (this.controlBitsLabel[i]) this.view.setTextBitAnimated(this.controlBitsLabel[i].textId, controlBit);
        }

        for (let i = 0; i < this.inpLen; i++) {
            const inpBit = this.inpBits[i];
            this.setSignal(inpBit, this.inpWires[i], this.inpConns[i]);
            if (this.inpBitsLabel[i]) this.view.setTextBitAnimated(this.inpBitsLabel[i].textId, inpBit);
        }

        const [msb, rotate, rightDir] = this.controlBits;
        
        const invrtRotate = inverter(rotate);
        this.setSignal(invrtRotate, [this.rotateInvWire], []);

        const isArthematicRightShift = andGateNInp([msb, invrtRotate, rightDir]);
        this.setSignal(isArthematicRightShift, this.isArthematicRightShiftWires, this.isArthematicRightShiftConns);

        const invrIsArthematicRightShift = inverter(isArthematicRightShift);
        this.setSignal(invrIsArthematicRightShift, [this.isArthematicRightShiftInvWire], []);

        const isvalidOp = nandGate(msb, invrIsArthematicRightShift);
        this.setSignal(isvalidOp, this.isValidOpWires, this.isValidOpConns);
    
        const signBit = this.inpBits[0];
    
        const shiftFillBit = andGate(
            isArthematicRightShift,
            signBit,
        );
        this.setSignal(shiftFillBit, this.shiftFillSignWires, this.shiftFillSignConns);

        const rev1InpBits = this.inpBits
            .map((_, index) => this.inpBits[this.inpBits.length - (index + 1)]) as Bit8;
        const directionNormalizedData = this.mux8bit2to1DirRev1.setInputs(
            [
                this.inpBits,
                rev1InpBits,
            ],
            [rightDir],
        );

        directionNormalizedData
            .forEach((bit, i) => 
                this.setSignal(bit, this.muxInpWires1[i], [this.muxInpConns1[i]])
        );

        const shift4TransformedInp = [
            ...directionNormalizedData.slice(4),
            ...directionNormalizedData.slice(0, 4).map((bit, indx) => {
                const muxOut = this.mux2to1Brl4Fill[indx].setInputs([shiftFillBit, bit], [rotate]);
                this.setSignal(muxOut, this.mux2to1Brl4FillWire[indx], []);
                return muxOut;
            })
        ] as Bit8;
        
        const isBarrel4Active = andGate(isvalidOp, this.shiftBits[0]);
        this.setSignal(isBarrel4Active, [this.shiftOnValidWires[0]], []);

        const shift4OutData = this.mux8bit2to1Brl4.setInputs([directionNormalizedData, shift4TransformedInp], [isBarrel4Active]);
        shift4OutData.forEach((bit, indx) => this.setSignal(bit, this.muxInpWires2[indx], [this.muxInpConns2[indx]]));

        const shift2TransformedInp = [
            ...shift4OutData.slice(2),
            ...shift4OutData.slice(0, 2).map((bit, indx) => {
                const muxOut = this.mux2to1Brl2Fill[indx].setInputs([shiftFillBit, bit], [rotate]);
                this.setSignal(muxOut, this.mux2to1Brl2FillWire[indx], []);
                return muxOut;
            })
        ] as Bit8;
        
        const isBarrel2Active = andGate(isvalidOp, this.shiftBits[1]);
        this.setSignal(isBarrel2Active, [this.shiftOnValidWires[1]], []);

        const shift2OutData = this.mux8bit2to1Brl2.setInputs([shift4OutData, shift2TransformedInp], [isBarrel2Active]);
        shift2OutData.forEach((bit, indx) => this.setSignal(bit, this.muxInpWires3[indx], [this.muxInpConns3[indx]]));

        const shift1TransformedInp = [
            ...shift2OutData.slice(1),
            ...shift2OutData.slice(0, 1).map((bit, indx) => {
                const muxOut = this.mux2to1Brl1Fill[indx].setInputs([shiftFillBit, bit], [rotate]);
                this.setSignal(muxOut, this.mux2to1Brl1FillWire[indx], []);
                return muxOut;
            })
        ] as Bit8;
        
        const isBarrel1Active = andGate(isvalidOp, this.shiftBits[2]);
        this.setSignal(isBarrel1Active, [this.shiftOnValidWires[2]], []);

        const shift1OutData = this.mux8bit2to1Brl1.setInputs([shift2OutData, shift1TransformedInp], [isBarrel1Active]);
        shift1OutData.forEach((bit, indx) => this.setSignal(bit, this.muxInpWires4[indx], [this.muxInpConns4[indx]]));

        const rev2InpBits = shift1OutData
            .map((_, index) => shift1OutData[shift1OutData.length - (index + 1)]) as Bit8;
        const directionRestoredData = this.mux8bit2to1DirRev2.setInputs(
            [
                shift1OutData,
                rev2InpBits,
            ],
            [rightDir],
        );

        directionRestoredData.forEach((bit, indx) => {
            this.setSignal(bit, this.outputWires[indx], this.outputConns[indx] ?? []);
            if (this.outputBitsLabel[indx]) this.view.setTextBitAnimated(this.outputBitsLabel[indx].textId, bit);
        });
        
       this.finalOut = directionRestoredData;
    }

    // =========================================================
    // SIGNAL HELPER
    // =========================================================

    private setSignal(
        bit: Bit,
        wires: WireResult[],
        connectors: ConnectorResult[],
    ): void {
        for (
            const wire
            of wires
        ) {

            this.view.setWireBit(
                wire.wireId,
                bit,
            );
        }

        for (
            const conn
            of connectors
        ) {

            this.view.setConnectorBit(
                conn.connectorId,
                bit,
            );
        }
    }

    setInputs(inpData: Bit8, shiftBy: Bit3, controlBits: Bit3): Bit8 {
        this.inpBits = inpData;
        this.shiftBits = shiftBy;
        this.controlBits = controlBits;
        this.update();
        return this.finalOut;
    }
}