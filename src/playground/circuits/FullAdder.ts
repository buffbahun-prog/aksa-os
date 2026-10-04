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

    // private inpHalfAdder2Wirev!: WireResult;

    // =========================================================
    // INPUT 2
    // =========================================================

    private inpBitLabel2!: TextResult;
    private inpWire2!: WireResult;
    private inpWire2v!: WireResult;
    private inpWire2h!: WireResult;

    private intermediateSumOutWireh!: WireResult;
    private intermediateSumOutWirehv!: WireResult;
    private intermediateSumOutWirehvh!: WireResult;

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
    private inpOrWireC!: WireResult;
    private inpOrWireCv!: WireResult;
    private inpOrWireCvh!: WireResult;

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
                y: 155,
            },
            147,
            "horz"
        );

        if (!this.hideConnAndSwitch)
        this.outConnectorSum = this.view.addConnector(
            {
                x: 898,
                y: 155,
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
                y: 305,
            },
            147,
            "horz"
        );

        if (!this.hideConnAndSwitch)
        this.outConnectorCarry = this.view.addConnector(
            {
                x: 898,
                y: 305,
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
        const level = this.level;

        const wireWidth = 2.8;
        if (!this.hideConnAndSwitch) {
            const switch1 = this.view.addSwitch(
                {
                    x: 285,
                    y: 140,
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
                    x: 285,
                    y: 250,
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
                    x: 285,
                    y: 360,
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
                    x: 180 + 120,
                    y: 95 + 20,
                },
                "",
                {fontSize: 30},
            );

            this.view.addText(
                {
                    x: 85 + 120,
                    y: 120 + 20,
                },
                "Carry In",
                {fontSize: 20},
            );

            this.inpBitLabel1 = this.view.addText(
                {
                    x: 180 + 120,
                    y: 195 + 30,
                },
                "",
                {fontSize: 30},
            );

            this.view.addText(
                {
                    x: 115 + 120,
                    y: 220 + 30,
                },
                "A",
                {fontSize: 20},
            );

            this.inpBitLabel2 = this.view.addText(
                {
                    x: 180 + 120,
                    y: 295 + 40,
                },
                "",
                {fontSize: 30},
            );

            this.view.addText(
                {
                    x: 115 + 120,
                    y: 320 + 40,
                },
                "B",
                {fontSize: 20},
            );
        }

        this.carryInWire = this.view.addWire(
            {
                x: 300,
                y: 140,
            },
            242,
            "horz",
            wireWidth
        );

        this.inpWire1 = this.view.addWire(
            {
                x: 300,
                y: 250,
            },
            78,
            "horz",
            wireWidth
        );

        this.inpWire2 = this.view.addWire(
            {
                x: 300,
                y: 360,
            },
            47,
            "horz",
            wireWidth
        );

        this.inpWire2v = this.view.addWire(
            {
                x: 300 + 47,
                y: 360,
            },
            -80,
            "vert",
            wireWidth
        );

        this.inpWire2h = this.view.addWire(
            {
                x: 300 + 47,
                y: 360 - 80,
            },
            31,
            "horz",
            wireWidth
        );

        this.halfAdderCarryOut = new HalfAdderCircuit(true);
        this.halfAdderCarryOut.setLevel(level - 1, false);

        this.view.element.appendChild(
            this.halfAdderCarryOut.element
        );

        this.halfAdderCarryOut.getView.resize(.3);
        this.halfAdderCarryOut.getView.moveBy(374 - 100, 214);

        this.intermediateSumOutWireh = this.view.addWire(
            {
                x: 568 - 100,
                y: 265,
            },
            45,
            "horz",
            wireWidth,
        );

        this.intermediateSumOutWirehv = this.view.addWire(
            {
                x: 568 + 45 - 100,
                y: 265,
            },
            -95,
            "vert",
            wireWidth,
        );

        this.intermediateSumOutWirehvh = this.view.addWire(
            {
                x: 568 + 45 - 100,
                y: 265 - 95,
            },
            30,
            "horz",
            wireWidth,
        );

        this.halfAdderSum = new HalfAdderCircuit(true);
        this.halfAdderSum.setLevel(level - 1, false);

        this.view.element.appendChild(
            this.halfAdderSum.element
        );

        this.halfAdderSum.getView.resize(.3);
        this.halfAdderSum.getView.moveBy(539 - 100, 104);

        this.inpOrWire = this.view.addWire(
            {
                x: 468,
                y: 325,
            },
            240,
            "horz",
            wireWidth
        );

        this.inpOrWireC = this.view.addWire(
            {
                x: 633,
                y: 215,
            },
            45,
            "horz",
            wireWidth
        );

        this.inpOrWireCv = this.view.addWire(
            {
                x: 633 + 45,
                y: 215,
            },
            70,
            "vert",
            wireWidth
        );

        this.inpOrWireCvh = this.view.addWire(
            {
                x: 633 + 45,
                y: 215 + 70,
            },
            30,
            "horz",
            wireWidth
        );

        this.view.addOrGate(
            {
                x: 730,
                y: 305,
            },
            {
                width: 60,
                height: 60,
            }
        );

        this.outWireSum = this.view.addWire(
            {
                x: 751 - 118,
                y: 155,
            },
            147 + 118,
            "horz",
            wireWidth
        );

        if (!this.hideConnAndSwitch) {
            this.outConnectorSum = this.view.addConnector(
                {
                    x: 751 + 147,
                    y: 155,
                },
            );

            this.outBitLabelSum = this.view.addText(
                {
                    x: 1045 - 150,
                    y: 120,
                },
                "",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 1085 - 140,
                    y: 155,
                },
                "Sum",
                {fontSize: 20}
            );
        }

        
        this.outWireCarry = this.view.addWire(
            {
                x: 751 + 10,
                y: 305,
            },
            147 - 10,
            "horz",
            wireWidth
        );

        if (!this.hideConnAndSwitch) {
            this.outConnectorCarry = this.view.addConnector(
                {
                    x: 751 + 147,
                    y: 305,
                }
            );

            this.outBitLabelCarry = this.view.addText(
                {
                    x: 1040 - 150,
                    y: 270,
                },
                "",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 1110 - 140,
                    y: 305,
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
            undefined,
            this.inpWire2v,
            this.inpWire2h,
        );

        if (!this.hideConnAndSwitch)
            this.view.setTextBitAnimated(
                this.inpBitLabel2.textId,
                b,
            );

        const [sum1, carryOut1] = this.halfAdderCarryOut.setInputs(a, b);

        this.setSignal(
            sum1,
            this.intermediateSumOutWireh,
            undefined,
            this.intermediateSumOutWirehv,
            this.intermediateSumOutWirehvh,
        );

        this.setSignal(
            carryOut1,
            this.inpOrWire,
        );

        const [sum2, carryOut2] = this.halfAdderSum.setInputs(ci, sum1);

        this.setSignal(
            carryOut2,
            this.inpOrWireC,
            undefined,
            this.inpOrWireCv,
            this.inpOrWireCvh,
        );

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