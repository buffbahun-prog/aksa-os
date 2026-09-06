import { andGateNInp, inverter, orGateNInp } from "../../virtual-machine/C.P.U/gates";
import { mux4To1 } from "../../virtual-machine/C.P.U/mux_demux";
import type { Bit, Bit2, Bit4 } from "../../virtual-machine/types";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";

export class Selector4to1Circuit extends LevelledCircuit {

    private totalDataInput = 4;
    private totalSelectInput = 2;

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
    private inpSelectWirevh: WireResult[] = Array.from({length: this.totalSelectInput});
    // private inpSelectWirehvh: WireResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectWirehvn1: WireResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectWirehvn2: WireResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectWirehvnh2: WireResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectConnNot: ConnectorResult[] = Array.from({length: this.totalSelectInput});

    private inpSelectJoinConn: ConnectorResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectJoinConnNot: ConnectorResult[] = Array.from({length: this.totalSelectInput});

    private inpSelectJoinWire: WireResult[] = Array.from({length: this.totalSelectInput});
    private inpSelectJoinWireNot: WireResult[] = Array.from({length: this.totalSelectInput});


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
                y: 400,
            },
            {
                width: 400,
                height: 600,
            }
        );

        this.view.addText(
            {
                x: 600,
                y: 400,
            },
            "4 X 1 Selector",
            {
                fontSize: 30,
                orientation: "vert"
            }
        );

        const wireDataStartX = 290;
        const wireDataStartY = 200;
        const wireDataShiftY = 150;
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

        const wireSelStartX = 450;
        const wireSelStartY = 30;
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
                x: 775,
                y: 400,
            },
            "Q",
            {
                fontSize: 30,
            }
        );

        this.outWire = this.view.addWire(
            {
                x: 803,
                y: 400,
            },
            106,
            "horz",
        );

        if (!this.hideConnAndSwitch) {
            this.outConnector = this.view.addConnector(
                {
                    x: 703 + 206,
                    y: 400,
                }
            );

            this.outBitLabel = this.view.addText(
                {
                    x: 803 + 106 + 20,
                    y: 400 - 20,
                },
                "",
                {
                    fontSize: 30
                }
            );
        }
    }

    private build1() {

        const wireDataStartX = 290;
        const wireDataStartY = 200;
        const wireDataShiftY = 150;
        const xExtend = 170;
        const andOutWireLen = [
            {
                h: 60,
                v: 140,
                vh: 62,
            },
            {
                h: 40,
                v: 20,
                vh: 87,
            },
            {
                h: 40,
                v: -100,
                vh: 87,
            },
            {
                h: 60,
                v: -220,
                vh: 62,
            }
        ]
        for (let pin = 0; pin < this.totalDataInput; pin++) {

            this.inpDataWire[pin] = this.view.addWire(
                {
                    x: wireDataStartX,
                    y: wireDataStartY + (pin * wireDataShiftY),
                },
                106 + xExtend,
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
                    x: wireDataStartX + 150 + xExtend,
                    y: wireDataStartY + 20 + (pin * wireDataShiftY)
                },
                {
                    width: 80,
                    height: 80,
                }
            );

            this.outAndWireh[pin] =  this.view.addWire(
                {
                    x: wireDataStartX + 150 + 43 + xExtend,
                    y: wireDataStartY + 20 + (pin * wireDataShiftY)
                },
                andOutWireLen[pin].h,
                "horz"
            );

            this.outAndWirehv[pin] = this.view.addWire(
                {
                    x: wireDataStartX + 150 + 43 + xExtend + andOutWireLen[pin].h,
                    y: wireDataStartY + 20 + (pin * wireDataShiftY)
                },
                andOutWireLen[pin].v,
                "vert"
            );

            this.outAndWirehvh[pin] = this.view.addWire(
                {
                    x: wireDataStartX + 150 + 43 + xExtend + andOutWireLen[pin].h,
                    y: wireDataStartY + 20 + (pin * wireDataShiftY) + andOutWireLen[pin].v
                },
                andOutWireLen[pin].vh,
                "horz"
            );
        }

        const wireSelStartX = 450;
        const wireSelStartY = 30;
        const wireSelShiftX = 100;
        const sLenList = [
            {v:660, vh: wireSelShiftX + 16, h:30, nh: -50, nhv: 220, nhvh: 50 + wireSelShiftX + 16},
            {v: 660 - 20, vh:16, h: 30 + wireSelShiftX, nh: -50, nhv: 370, nhvh: 50 + 16}
        ]
        const joinPosAndLen = [
            {ry: 495, h: wireSelShiftX + 16, nry: 60, nh: wireSelShiftX + 16 + 50},
            {ry: 345, h: 16, nry: 40, nh: 16 + 50},
        ];
        for (let pin = 0; pin < this.totalSelectInput; pin++) {

            this.inpSelectWire[pin] = this.view.addWire(
                {
                    x: wireSelStartX + (pin * wireSelShiftX),
                    y: wireSelStartY,
                },
                sLenList[pin].v,
                "vert",
            );

            this.inpSelectJoinConn[pin] = this.view.addConnector(
                {
                    x: wireSelStartX + (pin * wireSelShiftX),
                    y: wireSelStartY  + joinPosAndLen[pin].ry,
                }
            );

            this.inpSelectJoinWire[pin] = this.view.addWire(
                {
                    x: wireSelStartX + (pin * wireSelShiftX),
                    y: wireSelStartY  + joinPosAndLen[pin].ry,
                },
                joinPosAndLen[pin].h,
                "horz",
            );

            this.inpSelectWirevh[pin] = this.view.addWire(
                {
                    x: wireSelStartX + (pin * wireSelShiftX),
                    y: wireSelStartY + sLenList[pin].v,
                },
                sLenList[pin].vh,
                "horz",
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
                sLenList[pin].nh,
                "horz",
            );

            this.inpSelectWirehvn1[pin] = this.view.addWire(
                {
                    x: wireSelStartX + (pin * wireSelShiftX) + sLenList[pin].nh,
                    y: wireSelStartY + 66,
                },
                30,
                "vert",
            );

            this.inpSelectConnNot[pin] = this.view.addConnector(
                {
                    x: wireSelStartX + (pin * wireSelShiftX),
                    y: wireSelStartY + 66,
                },
            );

            this.view.addNotGate(
                {
                    x: wireSelStartX + (pin * wireSelShiftX) + sLenList[pin].nh,
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
                    x: wireSelStartX + (pin * wireSelShiftX) + sLenList[pin].nh,
                    y: wireSelStartY + 66 + 30 + 15 + 38,
                },
                sLenList[pin].nhv,
                "vert",
            );

            this.inpSelectJoinConnNot[pin] = this.view.addConnector(
                {
                    x: wireSelStartX + (pin * wireSelShiftX) + sLenList[pin].nh,
                    y: wireSelStartY + 66 + 30 + 15 + 38 + joinPosAndLen[pin].nry,
                }
            );

            this.inpSelectJoinWireNot[pin] = this.view.addWire(
                {
                    x: wireSelStartX + (pin * wireSelShiftX) + sLenList[pin].nh,
                    y: wireSelStartY + 66 + 30 + 15 + 38 + joinPosAndLen[pin].nry,
                },
                joinPosAndLen[pin].nh,
                "horz",
            );

            this.inpSelectWirehvnh2[pin] = this.view.addWire(
                {
                    x: wireSelStartX + (pin * wireSelShiftX) + sLenList[pin].nh,
                    y: wireSelStartY + 66 + 30 + 15 + 38 + sLenList[pin].nhv,
                },
                sLenList[pin].nhvh,
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
                x: 800,
                y: 400,
            },
            {
                width: 80,
                height: 160,
            }
        );

        if (!this.hideConnAndSwitch)
        this.view.addText(
            {
                x: 875 + 100,
                y: 400,
            },
            "Q",
            {
                fontSize: 30,
            }
        );

        this.outWire = this.view.addWire(
            {
                x: 840,
                y: 400,
            },
            106 - 35,
            "horz",
        );

        if (!this.hideConnAndSwitch) {
            this.outConnector = this.view.addConnector(
                {
                    x: 803 + 106,
                    y: 400,
                }
            );

            this.outBitLabel = this.view.addText(
                {
                    x: 803 + 106 + 20,
                    y: 400 - 20,
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

        const outputBit = mux4To1(this.inpDataBit as Bit4, this.inpSelectBit as Bit2);
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
        const andInp = [
            // 1 -> invert, 0 -> dont invert
            [1, 1],
            [1, 0],
            [0, 1],
            [0, 0],
        ]
        for (let pin = 0; pin < this.totalDataInput; pin++) {
            const d = this.inpDataBit[pin];

            this.setSignal(
                d,
                this.inpDataWire[pin],
            );

            const s = this.inpSelectBit.map((selBit, indx) => andInp[pin][indx] === 1 ? inverter(selBit) : selBit);

            const andOut = andGateNInp([d, ...s]);
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
                this.inpSelectWirevh[pin],
            );

            this.setSignal(
                s,
                this.inpSelectJoinWire[pin],
                this.inpSelectJoinConn[pin],
            );

            const sNot = inverter(s);

            this.setSignal(
                sNot,
                this.inpSelectWirehvn2[pin],
                undefined,
                this.inpSelectWirehvnh2[pin],
            );

            this.setSignal(
                sNot,
                this.inpSelectJoinWireNot[pin],
                this.inpSelectJoinConnNot[pin],
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