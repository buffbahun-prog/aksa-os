import { fullAdder } from "../../virtual-machine/C.P.U/adders";
import { orGate } from "../../virtual-machine/C.P.U/gates";
import type { Bit } from "../../virtual-machine/types";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";
import { HalfAdderCircuit } from "./HalfAdder";

export class FullAdderCircuit extends LevelledCircuit {

    private inpBit1: Bit = 0;
    private inpBit2: Bit = 0;
    private carryInBit: Bit = 0;

    private finalOut: [sum: Bit, carryOut: Bit] = [0, 0];

    // =========================================================
    // INPUT 1
    // =========================================================

    private inpBitLabel1!: TextResult;
    private inpWire1!: WireResult;

    private inpHalfAdder2Wirev!: WireResult;

    // =========================================================
    // INPUT 2
    // =========================================================

    private inpBitLabel2!: TextResult;
    private inpWire2!: WireResult;

    // =========================================================
    // CARRY IN INPUT
    // =========================================================

    private carryInBitLabel!: TextResult;
    private carryInWire!: WireResult;

    // =========================================================
    // SUM OUTPUT
    // =========================================================

    private outBitLabelSum!: TextResult;
    private outWireSum!: WireResult;
    private outConnectorSum!: ConnectorResult;

    // =========================================================
    // CARRY OUTPUT
    // =========================================================

    private outBitLabelCarry!: TextResult;
    private outWireCarry!: WireResult;
    private outConnectorCarry!: ConnectorResult;

    private hideConnAndSwitch: boolean;

    // =========================================================
    // HALF ADDER SUM
    // =========================================================
    private halfAdderSum!: HalfAdderCircuit;

    // =========================================================
    // HALF ADDER CARRY OUT
    // =========================================================
    private halfAdderCarryOut!: HalfAdderCircuit;

    // =========================================================
    // OR GATE
    // =========================================================
    private inpOrWire!: WireResult;

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
                this.build1();
                break;
            case 2:
                this.build2();
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
            case 2:
                this.update2();
                break;
        }
        
    }

    private build0() {
        this.view.addBox(
            {
                x: 600,
                y: 250,
            },
            {
                width: 300,
                height: 300,
            }
        );

        if (!this.hideConnAndSwitch)
        this.carryInBitLabel = 
            this.view.addText(
                {
                    x: 330,
                    y: 120,
                },
                "",
                {fontSize: 30},
            );
        
        this.carryInWire =
            this.view.addWire(
                {
                    x: 300,
                    y: 140,
                },
                147,
                "horz",
            );

        this.view.addText(
                {
                    x: 475,
                    y: 143,
                },
                "CI",
                {fontSize: 30},
            );

        if (!this.hideConnAndSwitch)
        this.inpBitLabel1 = 
            this.view.addText(
                {
                    x: 330,
                    y: 230,
                },
                "",
                {fontSize: 30},
            );
        
        this.inpWire1 =
            this.view.addWire(
                {
                    x: 300,
                    y: 250,
                },
                147,
                "horz",
            );

        this.view.addText(
                {
                    x: 475,
                    y: 253,
                },
                "A",
                {fontSize: 30},
            );

        if (!this.hideConnAndSwitch)
        this.inpBitLabel2 = 
            this.view.addText(
                {
                    x: 330,
                    y: 340,
                },
                "",
                {fontSize: 30},
            );
        
        this.inpWire2 =
            this.view.addWire(
                {
                    x: 300,
                    y: 360,
                },
                147,
                "horz",
            );

        this.view.addText(
                {
                    x: 475,
                    y: 360,
                },
                "B",
                {fontSize: 30},
            );

        this.view.addText(
            {
                x: 605,
                y: 250,
            },
            "Full Adder",
            {
                fontSize: 40,
            }
        );

        this.view.addText(
            {
                x: 725,
                y: 173,
            },
            "S",
            {fontSize: 30},
        );

        this.outWireSum = this.view.addWire(
            {
                x: 751,
                y: 170,
            },
            147,
            "horz"
        );

        if (!this.hideConnAndSwitch)
        this.outConnectorSum = this.view.addConnector(
            {
                x: 898,
                y: 170,
            }
        );

        if (!this.hideConnAndSwitch)
        this.outBitLabelSum = this.view.addText(
            {
                x: 920,
                y: 150,
            },
            "",
            {
                fontSize: 30,
            }
        );

        this.view.addText(
            {
                x: 718,
                y: 320,
            },
            "CO",
            {fontSize: 30},
        );

        this.outWireCarry = this.view.addWire(
            {
                x: 751,
                y: 320,
            },
            147,
            "horz"
        );

        if (!this.hideConnAndSwitch)
        this.outConnectorCarry = this.view.addConnector(
            {
                x: 898,
                y: 320,
            }
        );

        if (!this.hideConnAndSwitch)
        this.outBitLabelCarry = this.view.addText(
            {
                x: 920,
                y: 298,
            },
            "",
            {
                fontSize: 30,
            },
        );

        if (!this.hideConnAndSwitch) {
            const switch1 = this.view.addSwitch(
                {
                    x: 300,
                    y: 250,
                },
                12,
                (bit) => {

                    this.inpBit1 =
                        bit;

                    this.update();
                },
            );

            const switch2 = this.view.addSwitch(
                {
                    x: 300,
                    y: 360,
                },
                12,
                (bit) => {

                    this.inpBit2 =
                        bit;

                    this.update();
                },
            );

            const switch3 = this.view.addSwitch(
                {
                    x: 300,
                    y: 140,
                },
                12,
                (bit) => {

                    this.carryInBit =
                        bit;

                    this.update();
                },
            );

            this.view.setSwitchBit(switch1.switchId, this.inpBit1);
            this.view.setSwitchBit(switch2.switchId, this.inpBit2);
            this.view.setSwitchBit(switch3.switchId, this.carryInBit);
        }
    }

    private build1() {
        if (!this.hideConnAndSwitch) {
            const switch1 = this.view.addSwitch(
                {
                    x: 150,
                    y: 120,
                },
                12,
                (bit) => {

                    this.carryInBit =
                        bit;

                    this.update();
                },
            );

            const switch2 = this.view.addSwitch(
                {
                    x: 150,
                    y: 220,
                },
                12,
                (bit) => {

                    this.inpBit1 =
                        bit;

                    this.update();
                },
            );

            const switch3 = this.view.addSwitch(
                {
                    x: 150,
                    y: 320,
                },
                12,
                (bit) => {

                    this.inpBit2 =
                        bit;

                    this.update();
                },
            );

            this.view.setSwitchBit(switch1.switchId, this.carryInBit);
            this.view.setSwitchBit(switch2.switchId, this.inpBit1);
            this.view.setSwitchBit(switch3.switchId, this.inpBit2);
        }

        if (!this.hideConnAndSwitch) {
            this.carryInBitLabel = this.view.addText(
                {
                    x: 180,
                    y: 95,
                },
                "",
                {fontSize: 30},
            );

            this.view.addText(
                {
                    x: 85,
                    y: 120,
                },
                "Carry In",
                {fontSize: 20},
            );

            this.inpBitLabel1 = this.view.addText(
                {
                    x: 180,
                    y: 195,
                },
                "",
                {fontSize: 30},
            );

            this.view.addText(
                {
                    x: 115,
                    y: 220,
                },
                "A",
                {fontSize: 20},
            );

            this.inpBitLabel2 = this.view.addText(
                {
                    x: 180,
                    y: 295,
                },
                "",
                {fontSize: 30},
            );

            this.view.addText(
                {
                    x: 115,
                    y: 320,
                },
                "B",
                {fontSize: 20},
            );
        }

        this.carryInWire = this.view.addWire(
            {
                x: 165,
                y: 120.25,
            },
            330,
            "horz",
            3
        );

        this.inpWire1 = this.view.addWire(
            {
                x: 165,
                y: 220,
            },
            20,
            "horz",
            3
        );

        this.inpWire2 = this.view.addWire(
            {
                x: 165,
                y: 319.8,
            },
            20,
            "horz",
            3
        );

        this.halfAdderCarryOut = new HalfAdderCircuit(true);
        this.halfAdderCarryOut.setLevel(0, false);

        this.view.element.appendChild(
            this.halfAdderCarryOut.element
        );

        this.halfAdderCarryOut.getView.resize(.665);
        this.halfAdderCarryOut.getView.moveBy(-15, 107);

        this.halfAdderSum = new HalfAdderCircuit(true);
        this.halfAdderSum.setLevel(0, false);

        this.view.element.appendChild(
            this.halfAdderSum.element
        );

        this.halfAdderSum.getView.resize(.665);
        this.halfAdderSum.getView.moveBy(290, 7.4);

        this.inpOrWire = this.view.addWire(
            {
                x: 584,
                y: 319.7,
            },
            300,
            "horz",
            3
        );

        this.view.addOrGate(
            {
                x: 900,
                y: 270,
            },
            {
                width: 120,
                height: 150,
            }
        );

        this.outWireSum = this.view.addWire(
            {
                x: 889.1,
                y: 120.2,
            },
            150,
            "horz",
            3
        );

        if (!this.hideConnAndSwitch) {
            this.outConnectorSum = this.view.addConnector(
                {
                    x: 1045,
                    y: 120,
                }
            );

            this.outBitLabelSum = this.view.addText(
                {
                    x: 1045,
                    y: 90,
                },
                "",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 1085,
                    y: 120,
                },
                "Sum",
                {fontSize: 20}
            );
        }

        
        this.outWireCarry = this.view.addWire(
            {
                x: 960,
                y: 270,
            },
            80,
            "horz",
        );

        if (!this.hideConnAndSwitch) {
            this.outConnectorCarry = this.view.addConnector(
                {
                    x: 1040,
                    y: 270,
                }
            );

            this.outBitLabelCarry = this.view.addText(
                {
                    x: 1040,
                    y: 240,
                },
                "",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 1110,
                    y: 270,
                },
                "Carry Out",
                {fontSize: 20}
            );
        }

    }

    private build2() {
        if (!this.hideConnAndSwitch) {
            const switch1 = this.view.addSwitch(
                {
                    x: 150,
                    y: 120,
                },
                12,
                (bit) => {

                    this.carryInBit =
                        bit;

                    this.update();
                },
            );

            const switch2 = this.view.addSwitch(
                {
                    x: 150,
                    y: 220,
                },
                12,
                (bit) => {

                    this.inpBit1 =
                        bit;

                    this.update();
                },
            );

            const switch3 = this.view.addSwitch(
                {
                    x: 150,
                    y: 285,
                },
                12,
                (bit) => {

                    this.inpBit2 =
                        bit;

                    this.update();
                },
            );

            this.view.setSwitchBit(switch1.switchId, this.carryInBit);
            this.view.setSwitchBit(switch2.switchId, this.inpBit1);
            this.view.setSwitchBit(switch3.switchId, this.inpBit2);
        }

        if (!this.hideConnAndSwitch) {
            this.carryInBitLabel = this.view.addText(
                {
                    x: 180,
                    y: 95,
                },
                "",
                {fontSize: 30},
            );

            this.view.addText(
                {
                    x: 85,
                    y: 120,
                },
                "Carry In",
                {fontSize: 20},
            );

            this.inpBitLabel1 = this.view.addText(
                {
                    x: 180,
                    y: 195,
                },
                "",
                {fontSize: 30},
            );

            this.view.addText(
                {
                    x: 115,
                    y: 220,
                },
                "A",
                {fontSize: 20},
            );

            this.inpBitLabel2 = this.view.addText(
                {
                    x: 180,
                    y: 265,
                },
                "",
                {fontSize: 30},
            );

            this.view.addText(
                {
                    x: 115,
                    y: 286,
                },
                "B",
                {fontSize: 20},
            );
        }

        this.carryInWire = this.view.addWire(
            {
                x: 165,
                y: 120,
            },
            365,
            "horz",
        );

        this.inpWire1 = this.view.addWire(
            {
                x: 165,
                y: 220,
            },
            20,
            "horz",
        );

        this.inpWire2 = this.view.addWire(
            {
                x: 165,
                y: 286.5,
            },
            20,
            "horz",
        );

        this.halfAdderCarryOut = new HalfAdderCircuit(true);
        this.halfAdderCarryOut.setLevel(1, false);

        this.view.element.appendChild(
            this.halfAdderCarryOut.element
        );

        this.halfAdderCarryOut.getView.resize(.665);
        this.halfAdderCarryOut.getView.moveBy(0, 140);

        this.inpHalfAdder2Wirev = this.view.addWire(
            {
                x: 531,
                y: 188,
            },
            64,
            "vert",
        );

        this.halfAdderSum = new HalfAdderCircuit(true);
        this.halfAdderSum.setLevel(1, false);

        this.view.element.appendChild(
            this.halfAdderSum.element
        );

        this.halfAdderSum.getView.resize(.665);
        this.halfAdderSum.getView.moveBy(355, 40.5);

        this.inpOrWire = this.view.addWire(
            {
                x: 530,
                y: 386,
            },
            330,
            "horz",
        );

        this.view.addOrGate(
            {
                x: 900,
                y: 340,
            },
            {
                width: 120,
                height: 150,
            }
        );

        this.outWireSum = this.view.addWire(
            {
                x: 886,
                y: 153.5,
            },
            150,
            "horz",
        );

        if (!this.hideConnAndSwitch) {
            this.outConnectorSum = this.view.addConnector(
                {
                    x: 1043,
                    y: 153,
                }
            );

            this.outBitLabelSum = this.view.addText(
                {
                    x: 1045,
                    y: 120,
                },
                "",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 1085,
                    y: 153,
                },
                "Sum",
                {fontSize: 20}
            );
        }

        
        this.outWireCarry = this.view.addWire(
            {
                x: 960,
                y: 340,
            },
            80,
            "horz",
        );

        if (!this.hideConnAndSwitch) {
            this.outConnectorCarry = this.view.addConnector(
                {
                    x: 1040,
                    y: 340,
                }
            );

            this.outBitLabelCarry = this.view.addText(
                {
                    x: 1040,
                    y: 310,
                },
                "",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 1110,
                    y: 340,
                },
                "Carry Out",
                {fontSize: 20}
            );
        }

    }

    private update0() {
        const a = this.inpBit1;
        const b = this.inpBit2;
        const ci = this.carryInBit;

        this.setSignal(
            a,
            this.inpWire1,
        );

        this.setSignal(
            b,
            this.inpWire2,
        );

        this.setSignal(
            ci,
            this.carryInWire,
        );

        const [sum, carryOut] = fullAdder(
            ci,
            a,
            b,
        );

        this.finalOut = [sum, carryOut];

        if (!this.hideConnAndSwitch) {
            this.view.setTextBitAnimated(this.inpBitLabel1.textId, a);
            this.view.setTextBitAnimated(this.inpBitLabel2.textId, b);
            this.view.setTextBitAnimated(this.carryInBitLabel.textId, ci);
        }

        this.setSignal(
            sum,
            this.outWireSum,
            this.hideConnAndSwitch ? undefined : this.outConnectorSum,
        );
        if (!this.hideConnAndSwitch)
            this.view.setTextBitAnimated(this.outBitLabelSum.textId, sum);

        this.setSignal(
            carryOut,
            this.outWireCarry,
            this.hideConnAndSwitch ? undefined : this.outConnectorCarry,
        );
        if (!this.hideConnAndSwitch)
            this.view.setTextBitAnimated(this.outBitLabelCarry.textId, carryOut);

    }

    private update1() {
        const ci = this.carryInBit;
        const a = this.inpBit1;
        const b = this.inpBit2;

        this.setSignal(
            ci,
            this.carryInWire,
        );

        if (!this.hideConnAndSwitch)
            this.view.setTextBitAnimated(
                this.carryInBitLabel.textId,
                ci,
            );

        this.setSignal(
            a,
            this.inpWire1,
        );

        if (!this.hideConnAndSwitch)
            this.view.setTextBitAnimated(
                this.inpBitLabel1.textId,
                a,
            );

        this.setSignal(
            b,
            this.inpWire2,
        );

        if (!this.hideConnAndSwitch)
            this.view.setTextBitAnimated(
                this.inpBitLabel2.textId,
                b,
            );

        const [sum1, carryOut1] = this.halfAdderCarryOut.setInputs(a, b);

        this.setSignal(
            carryOut1,
            this.inpOrWire,
        );

        const [sum2, carryOut2] = this.halfAdderSum.setInputs(ci, sum1);

        this.view.setWireBit(
            this.outWireSum.wireId,
            sum2,
        );

        if (!this.hideConnAndSwitch) {
            this.view.setConnectorBit(
                this.outConnectorSum.connectorId,
                sum2,
            );

            this.view.setTextBitAnimated(
                this.outBitLabelSum.textId,
                sum2,
            );
        }

        // -----------------------------------------------------
        // OR
        // -----------------------------------------------------

        const orOut =
            orGate(
                carryOut1,
                carryOut2,
            );

        this.view.setWireBit(
            this.outWireCarry.wireId,
            orOut,
        );

        if (!this.hideConnAndSwitch) {
            this.view.setConnectorBit(
                this.outConnectorCarry.connectorId,
                orOut,
            );

            this.view.setTextBitAnimated(
                this.outBitLabelCarry.textId,
                orOut,
            );
        }

        this.finalOut = [sum2, orOut];
    }

    private update2() {
        const ci = this.carryInBit;
        const a = this.inpBit1;
        const b = this.inpBit2;

        this.setSignal(
            ci,
            this.carryInWire,
        );

        if (!this.hideConnAndSwitch)
            this.view.setTextBitAnimated(
                this.carryInBitLabel.textId,
                ci,
            );

        this.setSignal(
            a,
            this.inpWire1,
        );

        if (!this.hideConnAndSwitch)
            this.view.setTextBitAnimated(
                this.inpBitLabel1.textId,
                a,
            );

        this.setSignal(
            b,
            this.inpWire2,
        );

        if (!this.hideConnAndSwitch)
            this.view.setTextBitAnimated(
                this.inpBitLabel2.textId,
                b,
            );

        const [sum1, carryOut1] = this.halfAdderCarryOut.setInputs(a, b);

        this.setSignal(
            carryOut1,
            this.inpOrWire,
        );

        if (this.inpHalfAdder2Wirev)
            this.setSignal(
                sum1,
                this.inpHalfAdder2Wirev,
            );

        const [sum2, carryOut2] = this.halfAdderSum.setInputs(ci, sum1);

        this.view.setWireBit(
            this.outWireSum.wireId,
            sum2,
        );

        if (!this.hideConnAndSwitch) {
            this.view.setConnectorBit(
                this.outConnectorSum.connectorId,
                sum2,
            );

            this.view.setTextBitAnimated(
                this.outBitLabelSum.textId,
                sum2,
            );
        }

        // -----------------------------------------------------
        // OR
        // -----------------------------------------------------

        const orOut =
            orGate(
                carryOut1,
                carryOut2,
            );

        this.view.setWireBit(
            this.outWireCarry.wireId,
            orOut,
        );

        if (!this.hideConnAndSwitch) {
            this.view.setConnectorBit(
                this.outConnectorCarry.connectorId,
                orOut,
            );

            this.view.setTextBitAnimated(
                this.outBitLabelCarry.textId,
                orOut,
            );
        }

        this.finalOut = [sum2, orOut];
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

    setInputs(carryIn: Bit, inp1: Bit, inp2: Bit): [sum: Bit, carryOut: Bit] {
        this.inpBit1 = inp1;
        this.inpBit2 = inp2;
        this.carryInBit = carryIn;
        this.update();
        return this.finalOut;
    }
}