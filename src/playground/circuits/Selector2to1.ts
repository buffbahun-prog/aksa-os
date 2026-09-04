import { andGate, inverter, orGateNInp } from "../../virtual-machine/C.P.U/gates";
import { mux2To1 } from "../../virtual-machine/C.P.U/mux_demux";
import type { Bit } from "../../virtual-machine/types";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";

export class Selector2to1Circuit extends LevelledCircuit {

    private totalDataInput = 2;
    private totalSelectInput = 1;

    private inpDataBit: Bit[] = Array.from({length: this.totalDataInput}).fill(0) as Bit[];
    private inpSelectBit: Bit[] = Array.from({length: this.totalSelectInput}).fill(0) as Bit[];

    private finalOut: Bit = 0;

    // =========================================================
    // INPUT DATA
    // =========================================================

    private inpDataBitLabel: TextResult[] = Array.from({length: this.totalDataInput});
    private inpDataWire: WireResult[] = Array.from({length: this.totalDataInput});

    private outAndWireh: WireResult[] = Array.from({length: this.totalDataInput});
    private outAndWirehv: WireResult[] = Array.from({length: this.totalDataInput});
    private outAndWirehvh: WireResult[] = Array.from({length: this.totalDataInput});

    // =========================================================
    // INPUT SELECT
    // =========================================================

    private inpSelectBitLabel: TextResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectWire: WireResult[] = Array.from({length: this.totalSelectInput});

    private inpSelectWireh: WireResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectWirehv: WireResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectWirehvh: WireResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectWirehvn1: WireResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectWirehvn2: WireResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectWirehvnh2: WireResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectConnNot: ConnectorResult[] = Array.from({length: this.totalSelectInput});

    // =========================================================
    // OUTPUT
    // =========================================================

    private outBitLabel!: TextResult;
    private outWire!: WireResult;
    private outConnector!: ConnectorResult;

    private hideConnAndSwitch: boolean;

    constructor(hide = false) {

        super(1);

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
                this.update1();
                break;
        }
        
    }

    private build0() {
        this.view.addBox(
            {
                x: 600,
                y: 300,
            },
            {
                width: 200,
                height: 300,
            }
        );

        this.view.addText(
            {
                x: 600,
                y: 300,
            },
            "2 X 1 Selector",
            {
                fontSize: 25,
                orientation: "vert"
            }
        );

        const wireDataStartX = 390;
        const wireDataStartY = 250;
        const wireDataShiftY = 100;
        for (let pin = 0; pin < this.totalDataInput; pin++) {

            this.inpDataWire[pin] = this.view.addWire(
                {
                    x: wireDataStartX,
                    y: wireDataStartY + (pin * wireDataShiftY),
                },
                106,
                "horz",
            );

            if (!this.hideConnAndSwitch)
            this.inpDataBitLabel[pin] = this.view.addText(
                {
                    x: wireDataStartX + 20,
                    y: wireDataStartY + (pin * wireDataShiftY) - 20,
                },
                "",
                {
                    fontSize: 30,
                }
            );

            this.view.addText(
                {
                    x: wireDataStartX + 140,
                    y: wireDataStartY + (pin * wireDataShiftY)
                },
                "D" + pin,
                {
                    fontSize: 30,
                }
            );

            if (!this.hideConnAndSwitch) {
                const switchData = this.view.addSwitch(
                    {
                        x: wireDataStartX,
                        y: wireDataStartY + (pin * wireDataShiftY),
                    },
                    12,
                    (bit) => {

                        this.inpDataBit[pin] =
                            bit;

                        this.update();
                    },
                );
                this.view.setSwitchBit(switchData.switchId, this.inpDataBit[pin]);
            }
        }

        const wireSelStartX = 600;
        const wireSelStartY = 80;
        const wireSelShiftX = 100;
        for (let pin = 0; pin < this.totalSelectInput; pin++) {

            this.inpSelectWire[pin] = this.view.addWire(
                {
                    x: wireSelStartX + (pin * wireSelShiftX),
                    y: wireSelStartY,
                },
                66,
                "vert",
            );

            if (!this.hideConnAndSwitch)
            this.inpSelectBitLabel[pin] = this.view.addText(
                {
                    x: wireSelStartX + (pin * wireSelShiftX) + 30,
                    y: wireSelStartY - 10,
                },
                "",
                {
                    fontSize: 30,
                }
            );

            this.view.addText(
                {
                    x: wireSelStartX + (pin * wireSelShiftX),
                    y: wireSelStartY + 95,
                },
                "S" + pin,
                {
                    fontSize: 30,
                }
            );

            if (!this.hideConnAndSwitch) {
                const switchSel = this.view.addSwitch(
                    {
                        x: wireSelStartX + (pin * wireSelShiftX),
                        y: wireSelStartY,
                    },
                    12,
                    (bit) => {

                        this.inpSelectBit[pin] =
                            bit;

                        this.update();
                    },
                );
                this.view.setSwitchBit(switchSel.switchId, this.inpSelectBit[pin]);
            }
        }

        this.view.addText(
            {
                x: 675,
                y: 300,
            },
            "Q",
            {
                fontSize: 30,
            }
        );

        this.outWire = this.view.addWire(
            {
                x: 703,
                y: 300,
            },
            106,
            "horz",
        );

        if (!this.hideConnAndSwitch) {
            this.outConnector = this.view.addConnector(
                {
                    x: 703 + 106,
                    y: 300,
                }
            );

            this.outBitLabel = this.view.addText(
                {
                    x: 703 + 106 + 20,
                    y: 300 - 20,
                },
                "",
                {
                    fontSize: 30
                }
            );
        }
    }

    private build1() {

        const wireDataStartX = 390;
        const wireDataStartY = 250;
        const wireDataShiftY = 100;
        for (let pin = 0; pin < this.totalDataInput; pin++) {

            this.inpDataWire[pin] = this.view.addWire(
                {
                    x: wireDataStartX,
                    y: wireDataStartY + (pin * wireDataShiftY),
                },
                106,
                "horz",
            );

            if (!this.hideConnAndSwitch)
            this.inpDataBitLabel[pin] = this.view.addText(
                {
                    x: wireDataStartX + 20,
                    y: wireDataStartY + (pin * wireDataShiftY) - 20,
                },
                "",
                {
                    fontSize: 30,
                }
            );

            if (!this.hideConnAndSwitch)
            this.view.addText(
                {
                    x: wireDataStartX - 50,
                    y: wireDataStartY + (pin * wireDataShiftY)
                },
                "D" + pin,
                {
                    fontSize: 30,
                }
            );

            if (!this.hideConnAndSwitch) {
                const switchData = this.view.addSwitch(
                    {
                        x: wireDataStartX,
                        y: wireDataStartY + (pin * wireDataShiftY),
                    },
                    12,
                    (bit) => {

                        this.inpDataBit[pin] =
                            bit;

                        this.update();
                    },
                );
                this.view.setSwitchBit(switchData.switchId, this.inpDataBit[pin]);
            }

            this.view.addAndGate(
                {
                    x: wireDataStartX + 150,
                    y: wireDataStartY + 20 + (pin * wireDataShiftY)
                },
                {
                    width: 80,
                    height: 80,
                }
            );

            this.outAndWireh[pin] =  this.view.addWire(
                {
                    x: wireDataStartX + 150 + 43,
                    y: wireDataStartY + 20 + (pin * wireDataShiftY)
                },
                20,
                "horz"
            );

            this.outAndWirehv[pin] = this.view.addWire(
                {
                    x: wireDataStartX + 150 + 43 + 20,
                    y: wireDataStartY + 20 + (pin * wireDataShiftY)
                },
                pin === 0 ? 20 : -50,
                "vert"
            );

            this.outAndWirehvh[pin] = this.view.addWire(
                {
                    x: wireDataStartX + 150 + 43 + 20,
                    y: wireDataStartY + 20 + (pin * wireDataShiftY) + (pin === 0 ? 20 : -50)
                },
                80,
                "horz"
            );
        }

        const wireSelStartX = 600;
        const wireSelStartY = 80;
        const wireSelShiftX = 100;
        for (let pin = 0; pin < this.totalSelectInput; pin++) {

            this.inpSelectWire[pin] = this.view.addWire(
                {
                    x: wireSelStartX + (pin * wireSelShiftX),
                    y: wireSelStartY,
                },
                66,
                "vert",
            );

            if (!this.hideConnAndSwitch)
            this.inpSelectBitLabel[pin] = this.view.addText(
                {
                    x: wireSelStartX + (pin * wireSelShiftX) + 30,
                    y: wireSelStartY - 10,
                },
                "",
                {
                    fontSize: 30,
                }
            );

            if (!this.hideConnAndSwitch)
            this.view.addText(
                {
                    x: wireSelStartX + (pin * wireSelShiftX),
                    y: wireSelStartY - 40,
                },
                "S" + pin,
                {
                    fontSize: 30,
                }
            );

            this.inpSelectWireh[pin] = this.view.addWire(
                {
                    x: wireSelStartX + (pin * wireSelShiftX),
                    y: wireSelStartY + 66,
                },
                -165,
                "horz",
            );

            this.inpSelectWirehv[pin] = this.view.addWire(
                {
                    x: wireSelStartX + (pin * wireSelShiftX) - 165,
                    y: wireSelStartY + 66,
                },
                240,
                "vert",
            );

            this.inpSelectWirehvh[pin] = this.view.addWire(
                {
                    x: wireSelStartX + (pin * wireSelShiftX) - 165,
                    y: wireSelStartY + 66 + 240,
                },
                61,
                "horz",
            );

            this.inpSelectWirehvn1[pin] = this.view.addWire(
                {
                    x: wireSelStartX + (pin * wireSelShiftX) - 130,
                    y: wireSelStartY + 66,
                },
                30,
                "vert",
            );

            this.inpSelectConnNot[pin] = this.view.addConnector(
                {
                    x: wireSelStartX + (pin * wireSelShiftX) - 130,
                    y: wireSelStartY + 66,
                },
            );

            this.view.addNotGate(
                {
                    x: wireSelStartX + (pin * wireSelShiftX) - 130,
                    y: wireSelStartY + 66 + 30 + 15,
                },
                {
                    width: 30,
                    height: 30,
                },
                true,
                "down"
            );

            this.inpSelectWirehvn2[pin] = this.view.addWire(
                {
                    x: wireSelStartX + (pin * wireSelShiftX) - 130,
                    y: wireSelStartY + 66 + 30 + 15 + 38,
                },
                55,
                "vert",
            );

            this.inpSelectWirehvnh2[pin] = this.view.addWire(
                {
                    x: wireSelStartX + (pin * wireSelShiftX) - 130,
                    y: wireSelStartY + 66 + 30 + 15 + 38 + 55,
                },
                26,
                "horz",
            );

            if (!this.hideConnAndSwitch) {
                const switchSel = this.view.addSwitch(
                    {
                        x: wireSelStartX + (pin * wireSelShiftX),
                        y: wireSelStartY,
                    },
                    12,
                    (bit) => {

                        this.inpSelectBit[pin] =
                            bit;

                        this.update();
                    },
                );
                this.view.setSwitchBit(switchSel.switchId, this.inpSelectBit[pin]);
            }
        }

        this.view.addOrGate(
            {
                x: 700,
                y: 300,
            },
            {
                width: 80,
                height: 80,
            }
        );

        if (!this.hideConnAndSwitch)
        this.view.addText(
            {
                x: 675 + 170,
                y: 300,
            },
            "Q",
            {
                fontSize: 30,
            }
        );

        this.outWire = this.view.addWire(
            {
                x: 740,
                y: 300,
            },
            106 - 35,
            "horz",
        );

        if (!this.hideConnAndSwitch) {
            this.outConnector = this.view.addConnector(
                {
                    x: 703 + 106,
                    y: 300,
                }
            );

            this.outBitLabel = this.view.addText(
                {
                    x: 703 + 106 + 20,
                    y: 300 - 20,
                },
                "",
                {
                    fontSize: 30
                }
            );
        }
    }

    private update0() {
        for (let pin = 0; pin < this.totalDataInput; pin++) {
            const d = this.inpDataBit[pin];

            this.setSignal(
                d,
                this.inpDataWire[pin],
            );

            if (!this.hideConnAndSwitch) {
                this.view.setTextBitAnimated(this.inpDataBitLabel[pin].textId, d);
            }
        }

        for (let pin = 0; pin < this.totalSelectInput; pin++) {
            const s = this.inpSelectBit[pin];

            this.setSignal(
                s,
                this.inpSelectWire[pin],
            );

            if (!this.hideConnAndSwitch) {
                this.view.setTextBitAnimated(this.inpSelectBitLabel[pin].textId, s);
            }
        }

        const outputBit = mux2To1(this.inpDataBit[0], this.inpDataBit[1], this.inpSelectBit[0]);
        this.finalOut = outputBit;

        this.setSignal(
            outputBit,
            this.outWire,
            this.outConnector,
        );

        if (!this.hideConnAndSwitch) {
            this.view.setTextBitAnimated(this.outBitLabel.textId, outputBit);
        }
    }

    private update1() {
        const andOutList: Bit[] = [];
        for (let pin = 0; pin < this.totalDataInput; pin++) {
            const d = this.inpDataBit[pin];

            this.setSignal(
                d,
                this.inpDataWire[pin],
            );

            const s = pin === 0 ? inverter(this.inpSelectBit[0]) : this.inpSelectBit[0];

            const andOut = andGate(d, s);
            andOutList.push(andOut);

            this.setSignal(
                andOut,
                this.outAndWireh[pin],
                undefined,
                this.outAndWirehv[pin],
                this.outAndWirehvh[pin],
            );

            if (!this.hideConnAndSwitch) {
                this.view.setTextBitAnimated(this.inpDataBitLabel[pin].textId, d);
            }
        }

        for (let pin = 0; pin < this.totalSelectInput; pin++) {
            const s = this.inpSelectBit[pin];

            this.setSignal(
                s,
                this.inpSelectWire[pin],
                this.inpSelectConnNot[pin],
                this.inpSelectWirehvn1[pin],
                this.inpSelectWireh[pin],
                this.inpSelectWirehv[pin],
                this.inpSelectWirehvh[pin]
            );

            const sNot = inverter(s);

            this.setSignal(
                sNot,
                this.inpSelectWirehvn2[pin],
                undefined,
                this.inpSelectWirehvnh2[pin],
            );

            if (!this.hideConnAndSwitch) {
                this.view.setTextBitAnimated(this.inpSelectBitLabel[pin].textId, s);
            }
        }

        const outputBit = orGateNInp(andOutList);
        this.finalOut = outputBit;

        this.setSignal(
            outputBit,
            this.outWire,
            this.outConnector,
        );

        if (!this.hideConnAndSwitch) {
            this.view.setTextBitAnimated(this.outBitLabel.textId, outputBit);
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

    setInputs(inpData: [d0: Bit, d1: Bit], inpSelect: [s0: Bit]): Bit {
        this.inpDataBit = inpData;
        this.inpSelectBit = inpSelect;
        this.update();
        return this.finalOut;
    }
}