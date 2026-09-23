import { bitAdder8 } from "../../virtual-machine/C.P.U/adders";
import { ALU8Bit } from "../../virtual-machine/C.P.U/ALU";
import { andGate, inverter, nandGateNInp, norGateNInp, orGate, xorGate } from "../../virtual-machine/C.P.U/gates";
import type { Bit, Bit3, Bit4, Bit8 } from "../../virtual-machine/types";
import { binaryToDecimal, decimalToBinary } from "../../virtual-machine/utils/convertion";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";
import { ALU1BitCircuit } from "./ALU1BitCircuit";
import { Selector2to1Circuit } from "./Selector2to1";

export class ALU8BitsCircuit extends LevelledCircuit {

    private inputDataBits1: Bit8 = Array.from({length: 8}).fill(0) as Bit8;
    private inputDataBits2: Bit8 = Array.from({length: 8}).fill(0) as Bit8;

    private inp1Wire: WireResult[][] = [];
    private inp2Wire: WireResult[][] = [];

    private controlBits: Bit3 = Array.from({length: 3}).fill(0) as Bit3;

    private control0Wires: WireResult[] = [];
    private control0Connectors: ConnectorResult[] = [];

    private control1Wires: WireResult[] = [];
    private control1Connectors: ConnectorResult[] = [];

    private control2Wires: WireResult[] = [];
    private control2Connectors: ConnectorResult[] = [];

    private notOutWire!: WireResult;
    private orOutWire!: WireResult;

    private noPassBOpWires: WireResult[] = [];
    private noPassBOpConns: ConnectorResult[] = [];
    private bInverseWires: WireResult[] = [];
    private bInverseConns: ConnectorResult[] = [];
    private op0Wires: WireResult[] = [];
    private op0Conns: ConnectorResult[] = [];
    private op1Wires: WireResult[] = [];
    private op1Conns: ConnectorResult[] = [];

    private passBAndOutWires: WireResult[] = [];

    carryInWires: WireResult[][] = [];
    msbCarryInWire!: WireResult;
    msbCarryInConn!: ConnectorResult;

    carryOutWires: WireResult[] = [];
    carryOutConns: ConnectorResult[] = [];

    overflowWires: WireResult[] = [];
    overflowConns: ConnectorResult[] = [];

    alu1BitCircuit: ALU1BitCircuit[] = [];
    alu1BitResultWires: WireResult[][] = [];
    alu1BitResultConns: ConnectorResult[][] = [];

    signedLessLsbWire!: WireResult;
    unsignedLessLsbWire!: WireResult;
    signBitMux!: Selector2to1Circuit;
    lessSignWires: WireResult[] = [];

    isSltOpWires: WireResult[] = [];
    isSltOpConns: ConnectorResult[] = [];
    isNotSltOpWires: WireResult[] = [];
    isNotSltOpConns: ConnectorResult[] = [];

    lsbBitMux!: Selector2to1Circuit;

    resultOutputWires: WireResult[][] = [];
    resultOutputConns: ConnectorResult[][] = [];

    norOutWire!: WireResult;
    norOutWireh!: WireResult;
    norOutConn!: ConnectorResult;

    inp1BitLabels: TextResult[] = Array.from({length: 8});
    inp2BitLabels: TextResult[] = Array.from({length: 8});
    outputBitLabels: TextResult[] = Array.from({length: 8});

    controlBitLabels: TextResult[] = Array.from({length: 3});

    inp1BinLabel!: TextResult;
    inp1DecLabel!: TextResult;
    inp2BinLabel!: TextResult;
    inp2DecLabel!: TextResult;
    outputBinLabel!: TextResult;
    outputDecLabel!: TextResult;

    carryOutBitLabel!: TextResult;
    overflowBitLabel!: TextResult;
    zeroBitLabel!: TextResult;

    private finalOut: [result: Bit8, carryOut: Bit, overflow: Bit, zeroFlag: Bit] = [Array.from({length: 8}).fill(0) as Bit8, 0, 0, 1];

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
        this.inp1Wire = [];
        this.inp2Wire = [];
        this.control0Wires = [];
        this.control1Wires = [];
        this.control2Wires = [];
        this.control0Connectors = [];
        this.control1Connectors = [];
        this.control2Connectors = [];
        this.noPassBOpWires = [];
        this.noPassBOpConns = [];
        this.bInverseWires = [];
        this.bInverseConns = [];
        this.op0Wires = [];
        this.op0Conns = [];
        this.op1Wires = [];
        this.op1Conns = [];
        this.carryInWires = [];
        this.alu1BitCircuit = [];
        this.passBAndOutWires = [];
        this.carryOutWires = [];
        this.carryOutConns = [];
        this.alu1BitResultWires = [];
        this.alu1BitResultConns = [];
        this.isSltOpWires = [];
        this.isSltOpConns = [];
        this.isNotSltOpWires = [];
        this.isNotSltOpConns = [];
        this.resultOutputWires = [];
        this.resultOutputConns = [];
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

   private addAluOperationLegend(): void {
       const operations = [
           ["000", "AND",    "A & B"],
           ["001", "OR",     "A | B"],
           ["010", "XOR",    "A ^ B"],
           ["011", "PASS_B", "B"],
           ["100", "ADD",    "A + B"],
           ["101", "SUB",    "A - B"],
           ["110", "SLT",    "A < B"],
           ["111", "SLTU",   "A < B"],
       ];
   
       const x = -800;
       const y = 2470;
       const width = 455;
       const rowHeight = 60;
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
            { x: x + 103, y },
            height,
            "vert",
        );

        this.view.addWire(
            { x: x + 285, y },
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
                   x: x + 50,
                   y: rowY + 40,
               },
               opcode,
               { fontSize: 40 },
           );
       
           this.view.addText(
               {
                   x: x + 180,
                   y: rowY + 40,
               },
               operation,
               { fontSize: 40 },
           );
       
           this.view.addText(
               {
                   x: x + 360,
                   y: rowY + 40,
               },
               expression,
               { fontSize: 40 },
           );
       });
   }
    
    private build0() {
        if (!this.hideConnAndSwitch) this.addAluOperationLegend();

        if (!this.hideConnAndSwitch) {
            this.inp1BinLabel = this.view.addText(
                {
                    x: -500,
                    y: 600,
                },
                "A Binary: ",
                {fontSize: 40}
            );

            this.inp1DecLabel = this.view.addText(
                {
                    x: -580,
                    y: 700,
                },
                "A Decimal: ",
                {fontSize: 40}
            );

            this.inp2BinLabel = this.view.addText(
                {
                    x: -500,
                    y: 1700,
                },
                "B Binary: ",
                {fontSize: 40}
            );

            this.inp2DecLabel = this.view.addText(
                {
                    x: -580,
                    y: 1800,
                },
                "B Decimal: ",
                {fontSize: 40}
            );

            this.outputBinLabel = this.view.addText(
                {
                    x: 2190,
                    y: 1300,
                },
                "R Binary: ",
                {fontSize: 40}
            );

            this.outputDecLabel = this.view.addText(
                {
                    x: 2190,
                    y: 1400,
                },
                "R Decimal: ",
                {fontSize: 40}
            );
        }

        this.view.addBox(
            {
                x: 875,
                y: 1400,
            },
            {
                width: 1850,
                height: 2800,
            }
        );

        this.view.addText(
            {
                x: 875,
                y: 1400,
            },
            "ALU 8 Bits",
            {fontSize: 100}
        );

        const shiftYBy = 270;
        for (let i = 0; i < 8; i++) {

            if (!this.hideConnAndSwitch) {
                this.inp1BitLabels[i] = this.view.addText(
                    {
                        x: -200,
                        y: 150 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                    },
                    "",
                    {fontSize: 40}
                );

                this.inp2BitLabels[i] = this.view.addText(
                    {
                        x: -200,
                        y: 1305 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                    },
                    "",
                    {fontSize: 40}
                );

                this.outputBitLabels[i] = this.view.addText(
                    {
                        x: 1950,
                        y: 480 + (shiftYBy * i)
                    },
                    "",
                    {fontSize: 40}
                );
            }

            this.view.addText(
                {
                    x: 0,
                    y: 195 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                },
                `A${i}`,
                {fontSize: 40}
            );

            this.view.addText(
                {
                    x: 0,
                    y: 1350 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                },
                `B${i}`,
                {fontSize: 40}
            );

            this.view.addText(
                {
                    x: 1750,
                    y: 522 + (shiftYBy * i)
                },
                `R${i}`,
                {fontSize: 40}
            );

            this.inp1Wire.push(
                [
                    this.view.addWire(
                        {
                            x: -200,
                            y: 195 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                        },
                        150,
                        "horz"
                    ),
                ]
            );

            this.inp2Wire.push(
                [
                    this.view.addWire(
                        {
                            x: -200,
                            y: 1350 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                        },
                        150,
                        "horz"
                    ),
                ]
            );

            if (!this.hideConnAndSwitch) {
                const switchInp1 = this.view.addSwitch(
                    {
                        x: -200,
                        y: 195 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                    },
                    12,
                    (bit) => {
                        this.inputDataBits1[i] = bit;
                        this.update();
                    }
                );

                const switchInp2 = this.view.addSwitch(
                    {
                        x: -200,
                        y: 1350 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                    },
                    12,
                    (bit) => {
                        this.inputDataBits2[i] = bit;
                        this.update();
                    }
                );

                this.view.setSwitchBit(switchInp1.switchId, this.inputDataBits1[i]);
                this.view.setSwitchBit(switchInp2.switchId, this.inputDataBits2[i]);
            }

                this.resultOutputWires.push(
                    [
                        this.view.addWire(
                            {
                                x: 1800,
                                y: 522 + (shiftYBy * i),
                            },
                            150,
                            "horz",
                        ),
                    ]
                );
                this.resultOutputConns.push(
                    !this.hideConnAndSwitch ?
                    [
                        this.view.addConnector(
                            {
                                x: 1585 + 365,
                                y: 522 + (shiftYBy * i),
                            },
                        ),
                    ] : []
                );
            }

        this.norOutWireh = this.view.addWire(
            {
                x: 1800,
                y: 285 - 30,
            },
            150,
            "horz",
        );

        if (!this.hideConnAndSwitch)
        this.norOutConn = this.view.addConnector(
            {
                x: 1726 + 225,
                y: 285 - 30,
            },
        );

        this.carryOutWires = [
            this.view.addWire(
                {
                    x: 1800,
                    y: 120,
                },
                150,
                "horz"
            ),
        ];

        this.overflowWires = [
            this.view.addWire(
                {
                    x: 1800,
                    y: 382 - 200,
                },
                150,
                "horz",
            ),
        ];

        this.overflowConns = !this.hideConnAndSwitch ? [
            this.view.addConnector(
                {
                    x: 820 + 150 + 980,
                    y: 382 - 200,
                },
            ),
        ] : [];

        this.carryOutConns = !this.hideConnAndSwitch ? [
            this.view.addConnector(
                {
                    x: 465 + 1485,
                    y: 120,
                }
            ),
        ] : [];

        // cotrol 0
        this.control0Wires.push(
        this.view.addWire(
            {
                x: -200,
                y: 2550,
            },
            150,
            "horz",
        ),
        );

        // cotrol 1
        this.control1Wires.push(
            this.view.addWire(
            {
                x: -200,
                y: 2600,
            },
            150,
            "horz",
        ),
        );

        // cotrol 2
        this.control2Wires.push(
        this.view.addWire(
            {
                x: -200,
                y: 2650,
            },
            150,
            "horz",
        ),
        );

            this.view.addText(
                {
                    x: 1640,
                    y: 120,
                },
                "Carryout (CO)",
                {fontSize: 40}
            );

            this.view.addText(
                {
                    x: 1650,
                    y: 185,
                },
                "Overflow (V)",
                {fontSize: 40}
            );

            this.view.addText(
                {
                    x: 1650,
                    y: 260,
                },
                "Zero Flag (Z)",
                {fontSize: 40}
            );

            if (!this.hideConnAndSwitch) {
                this.carryOutBitLabel = this.view.addText(
                    {
                        x: 1940,
                        y: 90,
                    },
                    "",
                    {fontSize: 40}
                );

                this.overflowBitLabel = this.view.addText(
                    {
                        x: 1940,
                        y: 155,
                    },
                    "",
                    {fontSize: 40}
                );

                this.zeroBitLabel = this.view.addText(
                    {
                        x: 1940,
                        y: 230,
                    },
                    "",
                    {fontSize: 40}
                );
            }

            for (let controlPin = 0; controlPin < this.controlBits.length; controlPin++) {
                if (!this.hideConnAndSwitch) {
                    this.controlBitLabels[controlPin] = this.view.addText(
                        {
                            x: -165,
                            y: 2530 + (controlPin * 50),
                        },
                        "",
                        {fontSize: 40}
                    );

                    const controlSwitch = this.view.addSwitch(
                    {
                        x: -200,
                        y: 2550 + (controlPin * 50),
                    },
                    12,
                    (bit) => {
                        this.controlBits[controlPin] = bit;
                        this.update();
                    },
                );

                this.view.setSwitchBit(controlSwitch.switchId, this.controlBits[controlPin]);
                }

                this.view.addText(
                    {
                        x: 0,
                        y: 2550 + (controlPin * 50)
                    },
                    `C${controlPin}`,
                    {fontSize: 40}
                );
            }
    }

    private build1() {
        const level = this.level;

        if (!this.hideConnAndSwitch) this.addAluOperationLegend();

        if (!this.hideConnAndSwitch) {
            this.inp1BinLabel = this.view.addText(
                {
                    x: -500,
                    y: 600,
                },
                "A Binary: ",
                {fontSize: 40}
            );

            this.inp1DecLabel = this.view.addText(
                {
                    x: -580,
                    y: 700,
                },
                "A Decimal: ",
                {fontSize: 40}
            );

            this.inp2BinLabel = this.view.addText(
                {
                    x: -500,
                    y: 1700,
                },
                "B Binary: ",
                {fontSize: 40}
            );

            this.inp2DecLabel = this.view.addText(
                {
                    x: -580,
                    y: 1800,
                },
                "B Decimal: ",
                {fontSize: 40}
            );

            this.outputBinLabel = this.view.addText(
                {
                    x: 2250,
                    y: 1300,
                },
                "R Binary: ",
                {fontSize: 40}
            );

            this.outputDecLabel = this.view.addText(
                {
                    x: 2250,
                    y: 1450,
                },
                "R Decimal: ",
                {fontSize: 40}
            );
        }

        const shiftYBy = 270;
        for (let i = 0; i < 8; i++) {
            const alu1Bit = new ALU1BitCircuit(true);
            this.alu1BitCircuit.push(alu1Bit);
            alu1Bit.setLevel(level - 1, false);
            alu1Bit.getView.moveBy(200, 100 + (i * shiftYBy));
            alu1Bit.getView.resize(.4);
            this.view.element.appendChild(alu1Bit.element);

            if (!this.hideConnAndSwitch) {
                this.inp1BitLabels[i] = this.view.addText(
                    {
                        x: -200,
                        y: 150 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                    },
                    "",
                    {fontSize: 40}
                );

                this.inp2BitLabels[i] = this.view.addText(
                    {
                        x: -200,
                        y: 1305 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                    },
                    "",
                    {fontSize: 40}
                );

                this.outputBitLabels[i] = this.view.addText(
                    {
                        x: 1950,
                        y: 480 + (shiftYBy * i)
                    },
                    "",
                    {fontSize: 40}
                );
            }

            if (!this.hideConnAndSwitch) {
                this.view.addText(
                    {
                        x: -250,
                        y: 195 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                    },
                    `A${i}`,
                    {fontSize: 30}
                );

                this.view.addText(
                    {
                        x: -250,
                        y: 1350 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                    },
                    `B${i}`,
                    {fontSize: 30}
                );

                this.view.addText(
                    {
                        x: 1995,
                        y: 522 + (shiftYBy * i)
                    },
                    `R${i}`,
                    {fontSize: 30}
                );
            }

            this.inp1Wire.push(
                [
                    this.view.addWire(
                        {
                            x: -200,
                            y: 195 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                        },
                        (300) - (30 * i),
                        "horz"
                    ),
                    this.view.addWire(
                        {
                            x: 100 - (30 * i),
                            y: 195 + (shiftYBy * i),
                        },
                        -(10 + ((shiftYBy - 130) * i)),
                        "vert"
                    ),
                    this.view.addWire(
                        {
                            x: 100 - (30 * i),
                            y: 195 + (shiftYBy * i),
                        },
                        51 + (30 * i),
                        "horz"
                    ),
                ]
            );

            this.inp2Wire.push(
                [
                    this.view.addWire(
                        {
                            x: -200,
                            y: 1350 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                        },
                        (170) + (30 * i),
                        "horz"
                    ),
                    this.view.addWire(
                        {
                            x: -30 + (30 * i),
                            y: 238 + (shiftYBy * i),
                        },
                        (1100 - ((shiftYBy - 130) * i)),
                        "vert"
                    ),
                    this.view.addWire(
                        {
                            x: -30 + (30 * i),
                            y: 238 + (shiftYBy * i),
                        },
                        288 - (30 * i),
                        "horz"
                    ),
                ]
            );

            this.view.addWire(
                {
                    x: 200,
                    y: 160 + (i * shiftYBy)
                },
                70,
                "horz",
            );

            this.view.addWire(
                {
                    x: 270,
                    y: 160 + (i * shiftYBy)
                },
                22,
                "vert",
            );

            this.bInverseWires.push(
            this.view.addWire(
                {
                    x: 230,
                    y: 140 + (i * shiftYBy)
                },
                60,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 291,
                    y: 140 + (i * shiftYBy)
                },
                42,
                "vert",
            ),
            );

            if (i > 0) this.bInverseConns.push(
                this.view.addConnector(
                {
                    x: 230,
                    y: 140 + (i * shiftYBy),
                },
            ),
            );

            this.carryInWires.push(
            [
            this.view.addWire(
                {
                    x: 373.7,
                    y: 386 + (i * shiftYBy),
                },
                30,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 375,
                    y: 417 + (i * shiftYBy),
                },
                88,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 375 + 88,
                    y: 417 + (i * shiftYBy),
                },
                35,
                "vert",
            ),
            ]
            );

            if (i <= 0) {
                this.msbCarryInWire = this.view.addWire(
                    {
                        x: 373,
                        y: 395,
                    },
                    400,
                    "horz"
                );

                this.msbCarryInConn = this.view.addConnector(
                    {
                        x: 373,
                        y: 395,
                    },
                );
            }

            this.op0Wires.push(
            this.view.addWire(
                {
                    x: 510,
                    y: 140 + (i * shiftYBy),
                },
                100,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 510,
                    y: 140 + (i * shiftYBy),
                },
                42,
                "vert",
            )
            );

            if (i > 0)
            this.op0Conns.push(
            this.view.addConnector(
                {
                    x: 610,
                    y: 140 + (i * shiftYBy),
                }
            )
            );

            this.op1Wires.push(
            this.view.addWire(
                {
                    x: 530,
                    y: 160 + (i * shiftYBy),
                },
                170,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 530,
                    y: 160 + (i * shiftYBy),
                },
                22,
                "vert",
            ),
            );

            if (i > 0)
            this.op1Conns.push(
                this.view.addConnector(
                    {
                        x: 700,
                        y: 160 + (i * shiftYBy)
                    }
                ),
            );

            this.view.addAndGate(
                {
                    x: 170,
                    y: 205 + (i * shiftYBy),
                },
                {
                    width: 30,
                    height: 30,
                }
            );

            this.noPassBOpWires.push(
            this.view.addWire(
                {
                    x: 130,
                    y: 214 + (i * shiftYBy),
                },
                21,
                "horz"
            ));

            if (i > 0) this.noPassBOpConns.push(
            this.view.addConnector(
                {
                    x: 130,
                    y: 214 + (i * shiftYBy),
                },
            ))

            this.passBAndOutWires.push(
            this.view.addWire(
                {
                    x: 188,
                    y: 206 + (i * shiftYBy),
                },
                70,
                "horz"
            ));

            if (i > 0) this.view.addConnector(
                {
                    x: 200,
                    y: 160 + (i * shiftYBy),
                },
            );

            if (!this.hideConnAndSwitch) {
                const switchInp1 = this.view.addSwitch(
                    {
                        x: -200,
                        y: 195 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                    },
                    12,
                    (bit) => {
                        this.inputDataBits1[i] = bit;
                        this.update();
                    }
                );

                const switchInp2 = this.view.addSwitch(
                    {
                        x: -200,
                        y: 1350 + (shiftYBy * i) - (10 + ((shiftYBy - 130) * i)),
                    },
                    12,
                    (bit) => {
                        this.inputDataBits2[i] = bit;
                        this.update();
                    }
                );

                this.view.setSwitchBit(switchInp1.switchId, this.inputDataBits1[i]);
                this.view.setSwitchBit(switchInp2.switchId, this.inputDataBits2[i]);
            }

            this.alu1BitResultWires.push([
                this.view.addWire(
                    {
                        x: 582,
                        y: 256 + (shiftYBy * i),
                    },
                    410,
                    "horz",
                ),
                this.view.addWire(
                    {
                        x: 582 + 410,
                        y: 256 + (shiftYBy * i),
                    },
                    230,
                    "vert",
                ),
                this.view.addWire(
                    {
                        x: 582 + 410,
                        y: 256 + (shiftYBy * i) + 230,
                    },
                    530,
                    "horz",
                ),
            ]);

            if (i <= 0) {
                this.alu1BitResultWires[0].push(
                    this.view.addWire(
                        {
                            x: 850,
                            y: 256 + (shiftYBy * i),
                        },
                        40,
                        "vert",
                    ),
                    this.view.addWire(
                        {
                            x: 850,
                            y: 256 + (shiftYBy * i) + 40,
                        },
                        50,
                        "horz",
                    ),
                );

                this.alu1BitResultConns.push([
                    this.view.addConnector(
                    {
                        x: 850,
                        y: 256 + (shiftYBy * i),
                    }
                    ),
                    ]);
            }

            if (i < 7) {
                this.isNotSltOpWires.push(
                    this.view.addWire(
                    {
                        x: 1020 + 300,
                        y: 560 + (shiftYBy * i),
                    },
                    200,
                    "horz"
                ),
                );

                if (i > 0)
                    this.isNotSltOpConns.push(
                        this.view.addConnector(
                            {
                                x: 1020 + 300,
                                y: 560 + (shiftYBy * i),
                            },
                        ),
                    );

                this.view.addAndGate(
                    {
                        x: 1540,
                        y: 522 + (shiftYBy * i),
                    },
                    {
                        width: 90,
                        height: 100,
                    }
                )

                this.resultOutputWires.push(
                    [
                        this.view.addWire(
                            {
                                x: 1585,
                                y: 522 + (shiftYBy * i),
                            },
                            365,
                            "horz",
                        ),
                        this.view.addWire(
                            {
                                x: 1620 + (30 * i),
                                y: 380,
                            },
                            140 + (shiftYBy * i),
                            "vert"
                        ),
                    ]
                );
                this.resultOutputConns.push(
                    [
                        this.view.addConnector(
                            {
                                x: 1585 + 365,
                                y: 522 + (shiftYBy * i),
                            },
                            !this.hideConnAndSwitch ? 6 : 0
                        ),
                        this.view.addConnector(
                            {
                                x: 1620 + (30 * i),
                                y: 380 + 140 + (shiftYBy * i),
                            },
                        ),
                    ]
                );

            } else {
                this.isSltOpWires.push(
                    this.view.addWire(
                        {
                            x: 1020 + 300,
                            y: 360 + (shiftYBy * i),
                        },
                        275,
                        "horz"
                    ),
                    this.view.addWire(
                        {
                            x: 1020 + 300 + 275,
                            y: 360 + (shiftYBy * i),
                        },
                        50,
                        "vert"
                    ),
                );

                this.isSltOpConns.push(
                    this.view.addConnector(
                        {
                            x: 1020 + 300,
                            y: 360 + (shiftYBy * i),
                        },
                    ),
                );

                this.lsbBitMux = new Selector2to1Circuit(true);
                this.lsbBitMux.setLevel(level - 1, false);
                this.lsbBitMux.getView.moveBy(1158, 2194);
                this.lsbBitMux.getView.resize(.73);
                this.view.element.appendChild(this.lsbBitMux.element);

                this.resultOutputWires.push(
                    [
                        this.view.addWire(
                            {
                                x: 1670,
                                y: 523 + (shiftYBy * i),
                            },
                            280,
                            "horz",
                        ),
                        this.view.addWire(
                            {
                                x: 1620 + (30 * i),
                                y: 380,
                            },
                            143 + (shiftYBy * i),
                            "vert"
                        ),
                    ]
                );
                this.resultOutputConns.push(
                    [
                        this.view.addConnector(
                            {
                                x: 1670 + 280,
                                y: 523 + (shiftYBy * i),
                            },
                            !this.hideConnAndSwitch ? 6 : 0
                        ),
                        this.view.addConnector(
                            {
                                x: 1620 + (30 * i),
                                y: 380 + 143 + (shiftYBy * i),
                            },
                        ),
                    ]
                );
            }

        }

        this.view.addNorGate(
            {
                x: 1726,
                y: 355,
            },
            {
                width: 100,
                height: 250,
            },
            true,
            "up"
        );

        this.norOutWire = this.view.addWire(
            {
                x: 1726,
                y: 285,
            },
            -30,
            "vert"
        );

        this.norOutWireh = this.view.addWire(
            {
                x: 1726,
                y: 285 - 30,
            },
            225,
            "horz",
        );

        if (!this.hideConnAndSwitch)
        this.norOutConn = this.view.addConnector(
            {
                x: 1726 + 225,
                y: 285 - 30,
            },
        );

        this.isSltOpWires.push(
            this.view.addWire(
                {
                    x: 1020,
                    y: 2560,
                },
                300,
                "horz"
            ),
            this.view.addWire(
                {
                    x: 1020 + 300,
                    y: 2560,
                },
                -330,
                "vert"
            ),
        );

        this.view.addNotGate(
            {
                x: 1320,
                y: 2230,
            },
            {
                width: 20,
                height: 40,
            },
            true,
            "up"
        );

        this.isNotSltOpWires.push(
            this.view.addWire(
                {
                    x: 1320,
                    y: 2200,
                },
                -1640,
                "vert"
            ),
        );

        this.carryOutWires = [
            this.view.addWire(
                {
                    x: 465,
                    y: 120,
                },
                62,
                "vert"
            ),
            this.view.addWire(
                {
                    x: 465,
                    y: 120,
                },
                1485,
                "horz"
            ),
            this.view.addWire(
                {
                    x: 725,
                    y: 120,
                },
                245,
                "vert"
            ),
            this.view.addWire(
                {
                    x: 725,
                    y: 120 + 245,
                },
                42,
                "horz"
            ),
            this.view.addWire(
                {
                    x: 1025,
                    y: 120,
                },
                258,
                "vert"
            ),
            this.view.addWire(
                {
                    x: 1025,
                    y: 378,
                },
                50,
                "horz"
            ),
        ];

        this.view.addXorGate(
            {
                x: 790,
                y: 382,
            },
            {
                width: 60,
                height: 60,
            }
        );

        this.overflowWires = [
            this.view.addWire(
                {
                    x: 820,
                    y: 382,
                },
                150,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 820 + 150,
                    y: 382,
                },
                -200,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 820 + 150,
                    y: 382 - 200,
                },
                980,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 850,
                    y: 382,
                },
                -40,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 850,
                    y: 382 - 40,
                },
                50,
                "horz",
            ),
        ];

        this.overflowConns = [
            this.view.addConnector(
                {
                    x: 820 + 150 + 980,
                    y: 382 - 200,
                },
                !this.hideConnAndSwitch ? 6 : 0
            ),
            this.view.addConnector(
                {
                    x: 850,
                    y: 382,
                },
            ),
        ];

        this.view.addXorGate(
            {
                x: 925,
                y: 318,
            },
            {
                width: 60,
                height: 70,
            }
        );

        this.signedLessLsbWire = this.view.addWire(
            {
                x: 955,
                y: 318,
            },
            292,
            "horz"
        );

        this.carryOutConns = [
            this.view.addConnector(
                {
                    x: 465 + 1485,
                    y: 120,
                },
                !this.hideConnAndSwitch ? 6 : 0
            ),
            this.view.addConnector(
                {
                    x: 725,
                    y: 120,
                }
            ),
            this.view.addConnector(
                {
                    x: 1025,
                    y: 120,
                },
            ),
        ];

        this.view.addNotGate(
            {
                x: 1100,
                y: 378,
            },
            {
                width: 40,
                height: 40,
            }
        );

        this.unsignedLessLsbWire = this.view.addWire(
                {
                    x: 1025 + 116,
                    y: 378,
                },
                110,
                "horz"
            ),

        this.signBitMux = new Selector2to1Circuit(true);
        this.signBitMux.setLevel(level - 1, false);
        this.signBitMux.getView.moveBy(950, 168);
        this.signBitMux.getView.resize(.6);
        this.view.element.appendChild(this.signBitMux.element);

        this.lessSignWires = [
            this.view.addWire(
                {
                    x: 1373,
                    y: 348,
                },
                70,
                "horz",
            ),
            this.view.addWire(
                {
                    x: 1373 + 70,
                    y: 348,
                },
                2100,
                "vert",
            ),
            this.view.addWire(
                {
                    x: 1373 + 70,
                    y: 348 + 2100,
                },
                80,
                "horz",
            ),
        ]

        this.view.addWire(
           {
                x: 200,
                y: 2300,
            },
            -2140,
            "vert"
        );

        this.view.addConstant(
            {
                x: 200,
                y: 2300,
            },
            0,
            10
        );

        this.view.addAndGate(
            {
                x: 230,
                y: 2400,
            },
            {
                width: 60,
                height: 60,
            },
            true,
            "up",
        );

        this.bInverseWires.push(
        this.view.addWire(
            {
                x: 229,
                y: 2370,
            },
            -2230,
            "vert"
        ),
        this.view.addWire(
            {
                x: 229,
                y: 2344,
            },
            234,
            "horz"
        ),
        this.view.addWire(
            {
                x: 229 + 234,
                y: 2344,
            },
            400,
            "horz"
        ),
        this.view.addWire(
            {
                x: 229 + 234 + 400,
                y: 2344,
            },
            180,
            "vert"
        ),
        this.view.addWire(
            {
                x: 229 + 234 + 400,
                y: 2344 + 180,
            },
            80,
            "horz"
        ),
        );

        this.bInverseConns.push(
        this.view.addConnector(
            {
                x: 229,
                y: 2344,
            },
        ),
        this.view.addConnector(
            {
                x: 229 + 234,
                y: 2344,
            },
        ),
        );

        this.view.addOrGate(
            {
                x: 250,
                y: 2480,
            },
            {
                width: 40,
                height: 40,
            },
            true,
            "up",
        );

        this.view.addOrGate(
            {
                x: 510 + 100,
                y: 2400,
            },
            {
                width: 60,
                height: 60,
            },
            true,
            "up",
        );

        this.op0Wires.push(
        this.view.addWire(
            {
                x: 610,
                y: 2370,
            },
            -2230,
            "vert"
        ));

        this.view.addOrGate(
            {
                x: 530 + 170,
                y: 2400,
            },
            {
                width: 60,
                height: 60,
            },
            true,
            "up",
        );

        this.op1Wires.push(
        this.view.addWire(
            {
                x: 700,
                y: 2370,
            },
            -2210,
            "vert"
        ));

        // cotrol 0
        this.control0Wires.push(
        this.view.addWire(
            {
                x: -200,
                y: 2550,
            },
            880,
            "horz",
        ),
        this.view.addWire(
            {
                x: 100 + 580,
                y: 2550,
            },
            -127,
            "vert",
        ),
        this.view.addWire(
            {
                x: 100 + 490,
                y: 2550,
            },
            -127,
            "vert",
        ),
        this.view.addWire(
            {
                x: 100 + 110,
                y: 2550,
            },
            -117,
            "vert",
        ),
        this.view.addWire(
            {
                x: 100 + 10,
                y: 2550,
            },
            -31,
            "vert",
        ),
        );

        this.control0Connectors.push(
        this.view.addConnector(
            {
                x: 110,
                y: 2550,
            }
        ),
        this.view.addConnector(
            {
                x: 100 + 490,
                y: 2550,
            }
        ),
        this.view.addConnector(
            {
                x: 100 + 110,
                y: 2550,
            }
        )
        );

        // cotrol 1
        this.control1Wires.push(
            this.view.addWire(
            {
                x: -200,
                y: 2600,
            },
            830,
            "horz",
        ),
        this.view.addWire(
            {
                x: 100 + 530,
                y: 2600,
            },
            -127 - 50,
            "vert",
        ),
        this.view.addWire(
            {
                x: 100 + 140,
                y: 2600,
            },
            -106,
            "vert",
        ),
        this.view.addWire(
            {
                x: 100 + 30,
                y: 2600,
            },
            -127 - 40,
            "vert",
        ),
        this.view.addWire(
            {
                x: 630,
                y: 2600,
            },
            320,
            "horz",
        ),
        );

        this.control1Connectors.push(
        this.view.addConnector(
            {
                x: 100 + 140,
                y: 2600,
            }
        ),
        this.view.addConnector(
            {
                x: 100 + 30,
                y: 2600,
            }
        ),
        this.view.addConnector(
            {
                x: 630,
                y: 2600,
            },
        ),
        );

        // cotrol 2
        this.control2Wires.push(
        this.view.addWire(
            {
                x: -200,
                y: 2650,
            },
            920,
            "horz",
        ),
        this.view.addWire(
            {
                x: 100 + 620,
                y: 2650,
            },
            -127 - 100,
            "vert",
        ),
        this.view.addWire(
            {
                x: 100 + 160,
                y: 2650,
            },
            -156,
            "vert",
        ),
        this.view.addWire(
            {
                x: 100 + 50,
                y: 2650,
            },
            -127 - 100,
            "vert",
        ),
        this.view.addWire(
            {
                x: 720,
                y: 2650,
            },
            500,
            "horz",
        ),
        this.view.addWire(
            {
                x: 720 + 500,
                y: 2650,
            },
            -2435,
            "vert",
        ),
        this.view.addWire(
            {
                x: 720 + 500,
                y: 2650 - 2435,
            },
            90,
            "horz",
        ),
        this.view.addWire(
            {
                x: 720 + 500 + 90,
                y: 2650 - 2435,
            },
            40,
            "vert",
        ),
        );

        this.control2Connectors.push(
        this.view.addConnector(
            {
                x: 100 + 50,
                y: 2650,
            }
        ),
        this.view.addConnector(
            {
                x: 100 + 160,
                y: 2650,
            }
        ),
        this.view.addConnector(
            {
                x: 720,
                y: 2650,
            },
        ),
        );

        // control or(1,2)
        this.orOutWire = this.view.addWire(
            {
                x: 100 + 150,
                y: 2460,
            },
            -27,
            "vert",
        );

        // noPassBop
        this.view.addNandGate(
            {
                x: 130,
                y: 2400,
            },
            {
                width: 60,
                height: 60,
            },
            true,
            "up",
        );

        this.view.addNotGate(
            {
                x: 110,
                y: 2500,
            },
            {
                width: 30,
                height: 30,
            },
            true,
            "up",
        );

        this.notOutWire = this.view.addWire(
            {
                x: 110,
                y: 2463.5,
            },
            -30,
            "vert",
        );

        this.noPassBOpWires.push(
        this.view.addWire(
            {
                x: 130,
                y: 2350,
            },
            -2135,
            "vert",
        ));

        this.view.addAndGate(
            {
                x: 630 + 350,
                y: 2560,
            },
            {
                width: 80,
                height: 95,
            }
        );

        if (!this.hideConnAndSwitch) {
            this.view.addText(
                {
                    x: 2100,
                    y: 120,
                },
                "Carryout (CO)",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 2090,
                    y: 180,
                },
                "Overflow (V)",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 2090,
                    y: 255,
                },
                "Zero Flag (Z)",
                {fontSize: 30}
            );
        }

        if (!this.hideConnAndSwitch) {
                this.carryOutBitLabel = this.view.addText(
                    {
                        x: 1940,
                        y: 90,
                    },
                    "",
                    {fontSize: 40}
                );
            
                this.overflowBitLabel = this.view.addText(
                    {
                        x: 1940,
                        y: 155,
                    },
                    "",
                    {fontSize: 40}
                );
            
                this.zeroBitLabel = this.view.addText(
                    {
                        x: 1940,
                        y: 230,
                    },
                    "",
                    {fontSize: 40}
                );
            }

        if (!this.hideConnAndSwitch) {
            for (let controlPin = 0; controlPin < this.controlBits.length; controlPin++) {
                this.controlBitLabels[controlPin] = this.view.addText(
                    {
                        x: -165,
                        y: 2530 + (controlPin * 50),
                    },
                    "",
                    {fontSize: 40}
                );

                const controlSwitch = this.view.addSwitch(
                    {
                        x: -200,
                        y: 2550 + (controlPin * 50),
                    },
                    12,
                    (bit) => {
                        this.controlBits[controlPin] = bit;
                        this.update();
                    },
                );

                this.view.setSwitchBit(controlSwitch.switchId, this.controlBits[controlPin]);

                this.view.addText(
                    {
                        x: -250,
                        y: 2550 + (controlPin * 50)
                    },
                    `C${controlPin}`,
                    {fontSize: 30}
                );
            }
        }
    }

    private update0() {
        // control bits
        const controlBit0 = this.controlBits[0];
        const controlBit1 = this.controlBits[1];
        const controlBit2 = this.controlBits[2];

        this.setSignal(controlBit0, this.control0Wires, this.control0Connectors);
        this.setSignal(controlBit1, this.control1Wires, this.control1Connectors);
        this.setSignal(controlBit2, this.control2Wires, this.control2Connectors);

        if (!this.hideConnAndSwitch) {
            this.view.setTextBitAnimated(this.controlBitLabels[0].textId, controlBit0);
            this.view.setTextBitAnimated(this.controlBitLabels[1].textId, controlBit1);
            this.view.setTextBitAnimated(this.controlBitLabels[2].textId, controlBit2);
        }

        for (let i = 7; i >= 0; i--) {
            const inp1Bit = this.inputDataBits1[i];
            const inp2Bit = this.inputDataBits2[i];

            this.setSignal(inp1Bit, this.inp1Wire[i], []);
            this.setSignal(inp2Bit, this.inp2Wire[i], []);
            if (this.inp1BitLabels[i]?.textId && this.inp2BitLabels[i]?.textId) {
                this.view.setTextBitAnimated(this.inp1BitLabels[i].textId, inp1Bit);
                this.view.setTextBitAnimated(this.inp2BitLabels[i].textId, inp2Bit);
            }
        }

        const controlBits = [controlBit0, controlBit1, controlBit2] as Bit3;

        const [finalResult, carryOut, overflow, zero] = ALU8Bit(this.inputDataBits1, this.inputDataBits2, controlBits);
        
        this.setSignal(carryOut, this.carryOutWires, this.carryOutConns);
        
        this.setSignal(overflow, this.overflowWires, this.overflowConns);

        if (!this.hideConnAndSwitch) {
            this.view.setTextBitAnimated(this.carryOutBitLabel.textId, carryOut);
            this.view.setTextBitAnimated(this.overflowBitLabel.textId, overflow);
            this.view.setTextBitAnimated(this.zeroBitLabel.textId, zero);
        }
        

        finalResult.forEach((bit, indx) => {
            this.setSignal(bit, this.resultOutputWires[indx], this.resultOutputConns[indx]);
            if (this.outputBitLabels[indx]?.textId) this.view.setTextBitAnimated(this.outputBitLabels[indx].textId, bit);
        });

        this.setSignal(zero, [this.norOutWireh], this.norOutConn ? [this.norOutConn] : []);

        if (this.inp1BinLabel) this.view.setText(this.inp1BinLabel.textId, `A Binary: ${this.inputDataBits1.join("")}`);
        if (this.inp1DecLabel) {
            if (controlBit0 === 1 && controlBit1 === 1 && controlBit2 === 0 && this.inputDataBits1[0] === 1) {
                const invBits = this.inputDataBits1.map(bit => inverter(bit));
                const transformedVal = bitAdder8(1, invBits as Bit8, decimalToBinary(0, 8) as Bit8)[0];
                this.view.setText(this.inp1DecLabel.textId, `A Decimal: -${binaryToDecimal(transformedVal)}`)
            }
            else this.view.setText(this.inp1DecLabel.textId, `A Decimal: ${binaryToDecimal(this.inputDataBits1)}`);
        }

        if (this.inp2BinLabel) this.view.setText(this.inp2BinLabel.textId, `B Binary: ${this.inputDataBits2.join("")}`);
        if (this.inp2DecLabel) {
            if (controlBit0 === 1 && controlBit1 === 1 && controlBit2 === 0 && this.inputDataBits2[0] === 1) {
                const invBits = this.inputDataBits2.map(bit => inverter(bit));
                const transformedVal = bitAdder8(1, invBits as Bit8, decimalToBinary(0, 8) as Bit8)[0];
                this.view.setText(this.inp2DecLabel.textId, `B Decimal: -${binaryToDecimal(transformedVal)}`)
            }
            else this.view.setText(this.inp2DecLabel.textId, `B Decimal: ${binaryToDecimal(this.inputDataBits2)}`);
        }

        if (this.outputBinLabel) this.view.setText(this.outputBinLabel.textId, `R Binary: ${finalResult.join("")}`);
        if (this.outputDecLabel) this.view.setText(this.outputDecLabel.textId, `R Decimal: ${binaryToDecimal(finalResult)}`);
        
        this.finalOut = [finalResult, carryOut, overflow, zero];
    }

    private update1() {
        // control bits
        const controlBit0 = this.controlBits[0];
        const controlBit1 = this.controlBits[1];
        const controlBit2 = this.controlBits[2];

        this.setSignal(controlBit0, this.control0Wires, this.control0Connectors);
        this.setSignal(controlBit1, this.control1Wires, this.control1Connectors);
        this.setSignal(controlBit2, this.control2Wires, this.control2Connectors);

        if (!this.hideConnAndSwitch) {
            this.view.setTextBitAnimated(this.controlBitLabels[0].textId, controlBit0);
            this.view.setTextBitAnimated(this.controlBitLabels[1].textId, controlBit1);
            this.view.setTextBitAnimated(this.controlBitLabels[2].textId, controlBit2);
        }

        // mapped controls
        const notOutBit = inverter(controlBit0);
        this.setSignal(notOutBit, [this.notOutWire], []);
        const noPassBOpBit = nandGateNInp([notOutBit, controlBit1, controlBit2]);
        this.setSignal(noPassBOpBit, this.noPassBOpWires, this.noPassBOpConns);


        const orOutBit = orGate(controlBit1, controlBit2);
        this.setSignal(orOutBit, [this.orOutWire], []);

        const bInverseBit = andGate(controlBit0, orOutBit);
        this.setSignal(bInverseBit, this.bInverseWires, this.bInverseConns);

        const op0Bit = orGate(controlBit0, controlBit1);
        this.setSignal(op0Bit, this.op0Wires, this.op0Conns);

        const op1Bit = orGate(controlBit0, controlBit2);
        this.setSignal(op1Bit, this.op1Wires, this.op1Conns);

        let msbCarryOut = bInverseBit;
        let msbCarryIn = bInverseBit;
        let results: Bit8 = Array.from({length: 8}).fill(0) as Bit8;
        for (let i = 7; i >= 0; i--) {
            const inp1Bit = this.inputDataBits1[i];
            const inp2Bit = this.inputDataBits2[i];
            this.setSignal(msbCarryOut, this.carryInWires[i], []);

            this.setSignal(inp1Bit, this.inp1Wire[i], []);
            this.setSignal(inp2Bit, this.inp2Wire[i], []);

            if (this.inp1BitLabels[i]?.textId && this.inp2BitLabels[i]?.textId) {
                this.view.setTextBitAnimated(this.inp1BitLabels[i].textId, inp1Bit);
                this.view.setTextBitAnimated(this.inp2BitLabels[i].textId, inp2Bit);
            }

            const passBOpAndBit = andGate(inp1Bit, noPassBOpBit);
            this.setSignal(passBOpAndBit, [this.passBAndOutWires[i]], []);

            const mappedControlBits = [0, bInverseBit, op0Bit, op1Bit] as Bit4;
            const [result, carryOut] = this.alu1BitCircuit[i].setInputs(msbCarryOut, passBOpAndBit, inp2Bit, mappedControlBits);
            results[i] = result;
            this.setSignal(result, this.alu1BitResultWires[i], this.alu1BitResultConns[i] ?? []);
            msbCarryIn = msbCarryOut;
            msbCarryOut = carryOut;
        }

        this.setSignal(msbCarryIn, [this.msbCarryInWire], [this.msbCarryInConn]);

        const carryOut = msbCarryOut;
        this.setSignal(carryOut, this.carryOutWires, this.carryOutConns);
        
        const overflow = xorGate(msbCarryIn, msbCarryOut);
        this.setSignal(overflow, this.overflowWires, this.overflowConns);
        
        const signedLess = xorGate(
             results[0],
             overflow,
        );
        this.setSignal(signedLess, [this.signedLessLsbWire], []);
    
        const unsignedLess = inverter(carryOut);
        this.setSignal(unsignedLess, [this.unsignedLessLsbWire], []);
    
        const isLess = this.signBitMux.setInputs([signedLess, unsignedLess], [controlBit2]);
        this.setSignal(isLess, this.lessSignWires, []);
        
        const issltOp = andGate(bInverseBit, controlBit1);
        this.setSignal(issltOp, this.isSltOpWires, this.isSltOpConns);

        const isNotSltOp = inverter(issltOp);
        this.setSignal(isNotSltOp, this.isNotSltOpWires, this.isNotSltOpConns);
        
        const aluResultExceptLsb = results.slice(0, 7);
        const aluResultLsb = results[7];
        
        const finalResult = [
         ...aluResultExceptLsb.map(bit => andGate(isNotSltOp, bit)),
         this.lsbBitMux.setInputs([aluResultLsb, isLess], [issltOp]),
        ] as Bit8;

        finalResult.forEach((bit, indx) => {
            this.setSignal(bit, this.resultOutputWires[indx], this.resultOutputConns[indx]);
            if (this.outputBitLabels[indx]?.textId) this.view.setTextBitAnimated(this.outputBitLabels[indx].textId, bit);
        });

        const zeroFlag = norGateNInp(finalResult);
        this.setSignal(zeroFlag, [this.norOutWire, this.norOutWireh], this.norOutConn ? [this.norOutConn] : []);

        if (!this.hideConnAndSwitch) {
            this.view.setTextBitAnimated(this.carryOutBitLabel.textId, carryOut);
            this.view.setTextBitAnimated(this.overflowBitLabel.textId, overflow);
            this.view.setTextBitAnimated(this.zeroBitLabel.textId, zeroFlag);
        }

        if (this.inp1BinLabel) this.view.setText(this.inp1BinLabel.textId, `A Binary: ${this.inputDataBits1.join("")}`);
        if (this.inp1DecLabel) {
            if (controlBit0 === 1 && controlBit1 === 1 && controlBit2 === 0 && this.inputDataBits1[0] === 1) {
                const invBits = this.inputDataBits1.map(bit => inverter(bit));
                const transformedVal = bitAdder8(1, invBits as Bit8, decimalToBinary(0, 8) as Bit8)[0];
                this.view.setText(this.inp1DecLabel.textId, `A Decimal: -${binaryToDecimal(transformedVal)}`)
            }
            else this.view.setText(this.inp1DecLabel.textId, `A Decimal: ${binaryToDecimal(this.inputDataBits1)}`);
        }

        if (this.inp2BinLabel) this.view.setText(this.inp2BinLabel.textId, `B Binary: ${this.inputDataBits2.join("")}`);
        if (this.inp2DecLabel) {
            if (controlBit0 === 1 && controlBit1 === 1 && controlBit2 === 0 && this.inputDataBits2[0] === 1) {
                const invBits = this.inputDataBits2.map(bit => inverter(bit));
                const transformedVal = bitAdder8(1, invBits as Bit8, decimalToBinary(0, 8) as Bit8)[0];
                this.view.setText(this.inp2DecLabel.textId, `B Decimal: -${binaryToDecimal(transformedVal)}`)
            }
            else this.view.setText(this.inp2DecLabel.textId, `B Decimal: ${binaryToDecimal(this.inputDataBits2)}`);
        }

        if (this.outputBinLabel) this.view.setText(this.outputBinLabel.textId, `R Binary: ${finalResult.join("")}`);
        if (this.outputDecLabel) this.view.setText(this.outputDecLabel.textId, `R Decimal: ${binaryToDecimal(finalResult)}`);
        
        this.finalOut = [finalResult, carryOut, overflow, zeroFlag];
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
            const connector
            of connectors
        ) {

            this.view.setConnectorBit(
                connector.connectorId,
                bit,
            );
        }
    }

    setInputs(inpData1: Bit8, inpData2: Bit8, controlBits: Bit3): [result: Bit8, carryOut: Bit, overflow: Bit, zeroFlag: Bit] {
        this.inputDataBits1 = inpData1;
        this.inputDataBits2 = inpData2;
        this.controlBits = controlBits;
        this.update();
        return this.finalOut;
    }
}