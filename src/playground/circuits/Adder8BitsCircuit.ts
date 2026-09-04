import { bit8Adder } from "../../virtual-machine/C.P.U/adders";
import type { Bit, Bit8 } from "../../virtual-machine/types";
import { binaryToDecimal } from "../../virtual-machine/utils/convertion";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";
import { FullAdderCircuit } from "./FullAdder";

export class Adder8BitsCircuit extends LevelledCircuit {

    private inpBit1: Bit8 = Array.from({length: 8}).fill(0) as Bit8;
    private inpBit2: Bit8 = Array.from({length: 8}).fill(0) as Bit8;
    private carryInBit: Bit = 0;

    private finalOut: [sum: Bit8, carryOut: Bit] = [Array.from({length: 8}).fill(0) as Bit8, 0];

    // =========================================================
    // INPUT 1
    // =========================================================

    private inpBitLabel1: TextResult[] = Array.from({length: 8});
    private inpWire1: WireResult[] = Array.from({length: 8});

    // =========================================================
    // INPUT 2
    // =========================================================

    private inpBitLabel2: TextResult[] = Array.from({length: 8});
    private inpWire2: WireResult[] = Array.from({length: 8});

    // =========================================================
    // CARRY IN INPUT
    // =========================================================

    private carryInBitLabel!: TextResult;
    private carryInWire!: WireResult;
    private carryInWireVert!: WireResult;
    private carryInWirev: WireResult[] = Array.from({length: 7});
    private carryInWirevh: WireResult[] = Array.from({length: 7});
    private carryInWirevhv: WireResult[] = Array.from({length: 7});

    // =========================================================
    // SUM OUTPUT
    // =========================================================

    private outBitLabelSum: TextResult[] = Array.from({length: 8});
    private outWireSum: WireResult[] = Array.from({length: 8});
    private outConnectorSum: ConnectorResult[] = Array.from({length: 8});

    // =========================================================
    // CARRY OUTPUT
    // =========================================================

    private outBitLabelCarry!: TextResult;
    private outWireCarry!: WireResult;
    private outWireCarryVert!: WireResult;
    private outConnectorCarry!: ConnectorResult;

    private hideConnAndSwitch: boolean;

    // =========================================================
    // FULL ADDER
    // =========================================================
    private fullAdder: FullAdderCircuit[] = Array.from({length: 8});

    private inp1DecimalText!: TextResult;
    private inp2DecimalText!: TextResult;
    private carryInDecimalText!: TextResult;
    private sumWithCarryDecimalText!: TextResult;

    constructor(hide = false) {

        super(3);

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
            case 3:
                this.build1(this.level);
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
            case 3:
                this.update1();
                break;
        }
        
    }

    private build0() {
        this.view.addBox(
            {
                x: 600,
                y: 400,
            },
            {
                width: 300,
                height: 600,
            }
        );

        if (!this.hideConnAndSwitch)
        this.carryInBitLabel = 
            this.view.addText(
                {
                    x: 330,
                    y: 120 + 525,
                },
                "",
                {fontSize: 30},
            );
        
        this.carryInWire =
            this.view.addWire(
                {
                    x: 300,
                    y: 140 + 525,
                },
                147,
                "horz",
            );

        this.view.addText(
                {
                    x: 475,
                    y: 143 + 525,
                },
                "CI",
                {fontSize: 30},
            );
        
        let y = 130;
        for (let pin = 0; pin < 8; pin++) {
            this.inpWire1[pin] =
            this.view.addWire(
                {
                    x: 300,
                    y,
                },
                147,
                "horz",
            );

            this.view.addText(
                {
                    x: 475,
                    y: y,
                },
                "A" + pin,
                {fontSize: 20},
            );
            
            if (!this.hideConnAndSwitch)
                this.inpBitLabel1[pin] = 
                    this.view.addText(
                        {
                            x: 330,
                            y: y - 12,
                        },
                        "",
                        {fontSize: 20},
                    );

            const inp1y = y + 270;
            this.inpWire2[pin] =
            this.view.addWire(
                {
                    x: 300,
                    y: inp1y,
                },
                147,
                "horz",
            );

            this.view.addText(
                {
                    x: 475,
                    y: inp1y,
                },
                "B" + pin,
                {fontSize: 20},
            );

            if (!this.hideConnAndSwitch)
                this.inpBitLabel2[pin] = 
                    this.view.addText(
                        {
                            x: 330,
                            y: inp1y - 12,
                        },
                        "",
                        {fontSize: 20},
                    );

            if (!this.hideConnAndSwitch) {
                 const switch1 = this.view.addSwitch(
                    {
                        x: 300,
                        y: y,
                    },
                    12,
                    (bit) => {

                        this.inpBit1[pin] =
                            bit;

                        this.update();
                    },
                );

                const switch2 = this.view.addSwitch(
                    {
                        x: 300,
                        y: inp1y,
                    },
                    12,
                    (bit) => {

                        this.inpBit2[pin] =
                            bit;

                        this.update();
                    },
                );

                this.view.setSwitchBit(switch1.switchId, this.inpBit1[pin]);
                this.view.setSwitchBit(switch2.switchId, this.inpBit2[pin]);
            }


            const sumY = 220 + (pin * 60);
            this.view.addText(
                {
                    x: 725,
                    y: sumY,
                },
                "S" + pin,
                {fontSize: 30},
            );

            this.outWireSum[pin] = this.view.addWire(
                {
                    x: 751,
                    y: sumY,
                },
                147,
                "horz"
            );

            if (!this.hideConnAndSwitch)
                this.outConnectorSum[pin] = this.view.addConnector(
                    {
                        x: 898,
                        y: sumY,
                    }
                );

            if (!this.hideConnAndSwitch)
                this.outBitLabelSum[pin] = this.view.addText(
                    {
                        x: 920,
                        y: sumY - 20,
                    },
                    "",
                    {
                        fontSize: 30,
                    }
                );

            y += 30;
        }

        this.view.addText(
            {
                x: 605,
                y: 400,
            },
            "Adder 8 Bit",
            {
                fontSize: 40,
                orientation: "vert",
            }
        );

        this.view.addText(
            {
                x: 718,
                y: 660 - 520,
            },
            "CO",
            {fontSize: 30},
        );

        this.outWireCarry = this.view.addWire(
            {
                x: 751,
                y: 660 - 520,
            },
            147,
            "horz"
        );

        if (!this.hideConnAndSwitch)
        this.outConnectorCarry = this.view.addConnector(
            {
                x: 898,
                y: 660 - 520,
            }
        );

        if (!this.hideConnAndSwitch)
        this.outBitLabelCarry = this.view.addText(
            {
                x: 920,
                y: 638 - 520,
            },
            "",
            {
                fontSize: 30,
            },
        );

        if (!this.hideConnAndSwitch) {
            const switch3 = this.view.addSwitch(
                {
                    x: 300,
                    y: 140 + 525,
                },
                12,
                (bit) => {

                    this.carryInBit =
                        bit;

                    this.update();
                },
            );

            this.view.setSwitchBit(switch3.switchId, this.carryInBit);
        }

        if (!this.hideConnAndSwitch) {
            this.inp1DecimalText = this.view.addText(
                {
                    x: 60,
                    y: 300,
                },
                "Input A",
                {fontSize: 20}
            );

            this.inp2DecimalText = this.view.addText(
                {
                    x: 60,
                    y: 400,
                },
                "Input B",
                {fontSize: 20}
            );

            this.carryInDecimalText = this.view.addText(
                {
                    x: 60,
                    y: 500,
                },
                "Carry In",
                {fontSize: 20}
            );

            this.sumWithCarryDecimalText = this.view.addText(
                {
                    x: 1050,
                    y: 400,
                },
                "Sum",
                {fontSize: 20},
            );
        }
    }

    private build1(level: 1 | 2 | 3) {
        const levelChangedx = level === 1 ? 0 : 110;
        const levelChangedy = level === 1 ? 0 : 8;

        const levelChangedyw2 = level === 1 ? 0 : level === 2 ? 4 : -9.2;

        const levelChangedywv = level === 1 ? 0: level === 2 ? 12 : 12;

        const levelChangedywvh = level === 3 ? 14 : 0;

        const levelChangedySwv = level === 3 ? 13.3 : 0;

        const levelChangedyCOw = level === 3 ? 26.7 : 0;

        const fullAdderdx = level === 1 ? 0 : 56;
        const fullAdderdy = level === 1 ? 0 : 20;

        const shiftYBy = 150;
        const wireWidth = 1.5;
        for (let pin = 0; pin < 8; pin++) {
            if (!this.hideConnAndSwitch) {
                const switch2 = this.view.addSwitch(
                    {
                        x: 360 - levelChangedx,
                        y: 150 + (pin * shiftYBy) + levelChangedy,
                    },
                    level === 3 ? 8 : 12,
                    (bit) => {

                        this.inpBit1[pin] =
                            bit;

                        this.update();
                    },
                );

                const switch3 = this.view.addSwitch(
                    {
                        x: 360 - levelChangedx,
                        y: 194 + (pin * shiftYBy) + levelChangedyw2,
                    },
                    level === 3 ? 8 : 12,
                    (bit) => {

                        this.inpBit2[pin] =
                            bit;

                        this.update();
                    },
                );

                this.view.setSwitchBit(switch2.switchId, this.inpBit1[pin]);
                this.view.setSwitchBit(switch3.switchId, this.inpBit2[pin]);
            }

            

            this.inpWire1[pin] = this.view.addWire(
                {
                    x: 369 - levelChangedx,
                    y: 150 + (pin * shiftYBy) + levelChangedy,
                },
                100,
                "horz",
                wireWidth
            );

            this.inpWire2[pin] = this.view.addWire(
                {
                    x: 369 - levelChangedx,
                    y: 194 + (pin * shiftYBy) + levelChangedyw2,
                },
                100,
                "horz",
                wireWidth
            );

            if (!this.hideConnAndSwitch) {
                this.inpBitLabel1[pin] = this.view.addText(
                    {
                        x: 380 - levelChangedx,
                        y: 130 + (pin * shiftYBy) + levelChangedy  + (level === 3 ? 6 : 0),
                    },
                    "",
                    {fontSize: level === 3 ? 18 : 20},
                );

                this.inpBitLabel2[pin] = this.view.addText(
                    {
                        x: 380 - levelChangedx,
                        y: 174 + (pin * shiftYBy) + levelChangedyw2 + (level === 3 ? 6 : 0),
                    },
                    "",
                    {fontSize: level === 3 ? 18 : 20},
                );

                this.view.addText(
                    {
                        x: 320 - levelChangedx,
                        y: 150 + (pin * shiftYBy) + levelChangedy,
                    },
                    "A" + pin,
                    {fontSize: 20},
                );

                this.view.addText(
                    {
                        x: 320 - levelChangedx,
                        y: 194 + (pin * shiftYBy) + levelChangedyw2,
                    },
                    "B" + pin,
                    {fontSize: 20},
                );

                if (pin < 7) {
                    this.carryInWirev[pin] = this.view.addWire(
                        {
                            x: 470 - levelChangedx,
                            y: 106.35 + (pin * shiftYBy) + levelChangedywv,
                        },
                        120 + levelChangedywvh,
                        "vert",
                        wireWidth
                    );

                    this.carryInWirevh[pin] = this.view.addWire(
                        {
                            x: 470 - levelChangedx,
                            y: 106.35 + 120 + (pin * shiftYBy) + levelChangedywv + levelChangedywvh,
                        },
                        240 + levelChangedx,
                        "horz",
                        wireWidth
                    );

                    this.carryInWirevhv[pin] = this.view.addWire(
                        {
                            x: 709.9,
                            y: 106.9 + 120 + (pin * shiftYBy) + levelChangedywv + levelChangedywvh,
                        },
                        100 - levelChangedywv + levelChangedywvh,
                        "vert",
                        wireWidth
                    );
                }
            }

            this.fullAdder[pin] = new FullAdderCircuit(true);
            this.fullAdder[pin].setLevel(level - 1, false);

            this.view.element.appendChild(
                this.fullAdder[pin].element
            );

            this.fullAdder[pin].getView.resize(.4);
            this.fullAdder[pin].getView.moveBy(350 - fullAdderdx, 50 + (pin * shiftYBy) + fullAdderdy);

            this.outWireSum[pin] = this.view.addWire(
                {
                    x: 710,
                    y: 118 + (pin * shiftYBy) + levelChangedySwv,
                },
                100,
                "horz",
                1
            );

            if (!this.hideConnAndSwitch) {
                this.outConnectorSum[pin] = this.view.addConnector(
                    {
                        x: 810,
                        y: 117.8 + (pin * shiftYBy) + levelChangedySwv,
                    }
                );

                this.outBitLabelSum[pin] = this.view.addText(
                    {
                        x: 810,
                        y: 95 + (pin * shiftYBy) + levelChangedySwv,
                    },
                    "",
                    {fontSize: 20}
                );

                this.view.addText(
                    {
                        x: 850,
                        y: 117.8 + (pin * shiftYBy) + levelChangedySwv,
                    },
                    "S" + pin,
                    {fontSize: 20}
                );
            }
        }

        this.carryInWireVert = this.view.addWire(
            {
                x: 469 - levelChangedx,
                y: 1156 + levelChangedywv,
            },
            143 - levelChangedywv,
            "vert",
            wireWidth
        );

        this.carryInWire = this.view.addWire(
            {
                x: 369 - levelChangedx,
                y: 1300,
            },
            100,
            "horz",
            wireWidth
        );

        if (!this.hideConnAndSwitch) {
            const switch1 = this.view.addSwitch(
                {
                    x: 359 - levelChangedx,
                    y: 1300,
                },
                12,
                (bit) => {
                    this.carryInBit =
                        bit;
                    this.update();
                },
            );
            this.view.setSwitchBit(switch1.switchId, this.carryInBit);


            this.carryInBitLabel = this.view.addText(
                {
                    x: 380 - levelChangedx,
                    y: 1280,
                },
                "",
                {fontSize: 20},
            );

            this.view.addText(
                {
                    x: 290 - levelChangedx,
                    y: 1300,
                },
                "Carry In",
                {fontSize: 20},
            );
        }

        this.outWireCarryVert = this.view.addWire(
            {
                x: 710,
                y: 178.1 + levelChangedyCOw,
            },
            -120 - levelChangedyCOw,
            "vert",
            wireWidth
        );
        
        this.outWireCarry = this.view.addWire(
            {
                x: 710,
                y: 178.1 - 120,
            },
            100,
            "horz",
            wireWidth
        );

        if (!this.hideConnAndSwitch) {
            this.outConnectorCarry = this.view.addConnector(
                {
                    x: 810,
                    y: 178.1 - 120,
                }
            );

            this.outBitLabelCarry = this.view.addText(
                {
                    x: 810,
                    y: 158.1 - 120,
                },
                "",
                {fontSize: 20}
            );

            this.view.addText(
                {
                    x: 885,
                    y: 178.1 - 120,
                },
                "Carry Out",
                {fontSize: 20}
            );
        }

        if (!this.hideConnAndSwitch) {
            this.inp1DecimalText = this.view.addText(
                {
                    x: 60,
                    y: 500,
                },
                "Input A",
                {fontSize: 20}
            );

            this.inp2DecimalText = this.view.addText(
                {
                    x: 60,
                    y: 600,
                },
                "Input B",
                {fontSize: 20}
            );

            this.carryInDecimalText = this.view.addText(
                {
                    x: 60,
                    y: 700,
                },
                "Carry In",
                {fontSize: 20}
            );

            this.sumWithCarryDecimalText = this.view.addText(
                {
                    x: 1050,
                    y: 600,
                },
                "Sum",
                {fontSize: 20},
            );
        }
    }

    private update0() {
        const ci = this.carryInBit;
        for (let pin = 0; pin < 8; pin++) {
            const a = this.inpBit1[pin];
            const b = this.inpBit2[pin];

            this.setSignal(
                a,
                this.inpWire1[pin],
            );

            this.setSignal(
                b,
                this.inpWire2[pin],
            );

            if (!this.hideConnAndSwitch) {
               this.view.setTextBitAnimated(this.inpBitLabel1[pin].textId, a);
               this.view.setTextBitAnimated(this.inpBitLabel2[pin].textId, b);
               this.view.setTextBitAnimated(this.carryInBitLabel.textId, ci);
            }
        }

        this.setSignal(
            ci,
            this.carryInWire,
        );

        const [sum, carryOut] = bit8Adder(
            ci,
            this.inpBit1,
            this.inpBit2,
        );

        this.finalOut = [sum, carryOut];

        sum.forEach((sm, i) => {
            this.setSignal(
                sm,
                this.outWireSum[i],
                this.hideConnAndSwitch ? undefined : this.outConnectorSum[i],
            );
            if (!this.hideConnAndSwitch)
                this.view.setTextBitAnimated(this.outBitLabelSum[i].textId, sm);
        });

        this.setSignal(
            carryOut,
            this.outWireCarry,
            this.hideConnAndSwitch ? undefined : this.outConnectorCarry,
        );
        if (!this.hideConnAndSwitch)
            this.view.setTextBitAnimated(this.outBitLabelCarry.textId, carryOut);


        if (!this.hideConnAndSwitch) {
            this.view.setText(this.inp1DecimalText.textId, "Input A: " + binaryToDecimal(this.inpBit1).toString());
            this.view.setText(this.inp2DecimalText.textId, "Input B: " + binaryToDecimal(this.inpBit2).toString());
            this.view.setText(this.carryInDecimalText.textId, "Carry In: " + (this.carryInBit).toString());
            this.view.setText(this.sumWithCarryDecimalText.textId, "Sum + Carryout: " + (binaryToDecimal([carryOut, ...sum])).toString());
        }
    }

    private update1() {
        const ci = this.carryInBit;

        this.setSignal(
            ci,
            this.carryInWire,
            undefined,
            this.carryInWireVert,
        );
        if (!this.hideConnAndSwitch)
            this.view.setTextBitAnimated(this.carryInBitLabel.textId, ci);

        let rippleCarryOut = this.carryInBit;
        for (let pin = 7; pin >= 0; pin--) {
            const a = this.inpBit1[pin];
            const b = this.inpBit2[pin];

            this.setSignal(
                a,
                this.inpWire1[pin]
            );

            this.setSignal(
                b,
                this.inpWire2[pin]
            );

            if (!this.hideConnAndSwitch) {
                this.view.setTextBitAnimated(this.inpBitLabel1[pin].textId, a);
                this.view.setTextBitAnimated(this.inpBitLabel2[pin].textId, b);
            }

            const [sum, carryOut] = this.fullAdder[pin].setInputs(rippleCarryOut, a, b);

            this.setSignal(
                sum,
                this.outWireSum[pin],
                this.hideConnAndSwitch ? undefined : this.outConnectorSum[pin]
            );

            if (!this.hideConnAndSwitch) {
                this.view.setTextBitAnimated(this.outBitLabelSum[pin].textId, sum);
            }

            if (pin > 0)
            this.setSignal(
                carryOut,
                this.carryInWirev[pin - 1],
                undefined,
                this.carryInWirevh[pin - 1],
                this.carryInWirevhv[pin - 1],
            );

            rippleCarryOut = carryOut;
        }

        this.setSignal(
            rippleCarryOut,
            this.outWireCarryVert,
            this.hideConnAndSwitch ? undefined : this.outConnectorCarry,
            this.outWireCarry,
        );

        if (!this.hideConnAndSwitch) {
            this.view.setTextBitAnimated(
                this.outBitLabelCarry.textId,
                rippleCarryOut,
            );
        }

        const [sum, carryOut] = bit8Adder(
            ci,
            this.inpBit1,
            this.inpBit2,
        );

        this.finalOut = [sum, carryOut];

        if (!this.hideConnAndSwitch) {
            this.view.setText(this.inp1DecimalText.textId, "Input A: " + binaryToDecimal(this.inpBit1).toString());
            this.view.setText(this.inp2DecimalText.textId, "Input B: " + binaryToDecimal(this.inpBit2).toString());
            this.view.setText(this.carryInDecimalText.textId, "Carry In: " + (this.carryInBit).toString());
            this.view.setText(this.sumWithCarryDecimalText.textId, "Sum + Carryout: " + (binaryToDecimal([carryOut, ...sum])).toString());
        }
    }

    // =========================================================
    // SIGNAL HELPER
    // =========================================================

    private setSignal(
        bit: Bit,
        wire: WireResult,
        connector?: ConnectorResult,
        ...additionalWires: WireResult[]
    ): void {

        this.view.setWireBit(
            wire.wireId,
            bit,
        );

        if (connector) this.view.setConnectorBit(
            connector.connectorId,
            bit,
        );

        for (
            const additionalWire
            of additionalWires
        ) {

            this.view.setWireBit(
                additionalWire.wireId,
                bit,
            );
        }
    }

    setInputs(carryIn: Bit, inp1: Bit8, inp2: Bit8): [sum: Bit8, carryOut: Bit] {
        this.inpBit1 = inp1;
        this.inpBit2 = inp2;
        this.carryInBit = carryIn;
        this.update();
        return this.finalOut;
    }
}