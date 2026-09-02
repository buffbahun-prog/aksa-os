import { halfAdder } from "../../virtual-machine/C.P.U/adders";
import { andGate, xorGate } from "../../virtual-machine/C.P.U/gates";
import type { Bit } from "../../virtual-machine/types";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";

export class HalfAdderCircuit extends LevelledCircuit {

    private inpBit1: Bit = 0;
    private inpBit2: Bit = 0;

    private finalOut: [sum: Bit, carryOut: Bit] = [0, 0];

    // =========================================================
    // INPUT 1
    // =========================================================

    private inpBitLabel1!: TextResult;
    private inpWire1!: WireResult;

    private inpConn1!: ConnectorResult;
    private inpWire1v!: WireResult;
    private inpWire1vh!: WireResult;

    // =========================================================
    // INPUT 2
    // =========================================================

    private inpBitLabel2!: TextResult;
    private inpWire2!: WireResult;

    private inpConn2!: ConnectorResult;
    private inpWire2v!: WireResult;
    private inpWire2vh!: WireResult;

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
                y: 250,
            },
            {
                width: 300,
                height: 300,
            }
        );

        if (!this.hideConnAndSwitch)
        this.inpBitLabel1 = 
            this.view.addText(
                {
                    x: 330,
                    y: 140,
                },
                "",
                {fontSize: 30},
            );
        
        this.inpWire1 =
            this.view.addWire(
                {
                    x: 300,
                    y: 170,
                },
                147,
                "horz",
            );

        this.view.addText(
                {
                    x: 475,
                    y: 173,
                },
                "A",
                {fontSize: 30},
            );

        if (!this.hideConnAndSwitch)
        this.inpBitLabel2 = 
            this.view.addText(
                {
                    x: 330,
                    y: 295,
                },
                "",
                {fontSize: 30},
            );
        
        this.inpWire2 =
            this.view.addWire(
                {
                    x: 300,
                    y: 320,
                },
                147,
                "horz",
            );

        this.view.addText(
                {
                    x: 475,
                    y: 320,
                },
                "B",
                {fontSize: 30},
            );

        this.view.addText(
            {
                x: 605,
                y: 250,
            },
            "Half Adder",
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
                    y: 170,
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
                    y: 320,
                },
                12,
                (bit) => {

                    this.inpBit2 =
                        bit;

                    this.update();
                },
            );

            this.view.setSwitchBit(switch1.switchId, this.inpBit1);
            this.view.setSwitchBit(switch2.switchId, this.inpBit2);
        }
    }

    private build1() {
        if (!this.hideConnAndSwitch) {
            const switch1 = this.view.addSwitch(
                {
                    x: 250,
                    y: 120,
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
                    x: 250,
                    y: 220,
                },
                12,
                (bit) => {

                    this.inpBit2 =
                        bit;

                    this.update();
                },
            );

            this.view.setSwitchBit(switch1.switchId, this.inpBit1);
            this.view.setSwitchBit(switch2.switchId, this.inpBit2);
        }

        if (!this.hideConnAndSwitch) {
            this.inpBitLabel1 = this.view.addText(
                {
                    x: 280,
                    y: 95,
                },
                "",
                {fontSize: 30},
            );

            this.view.addText(
                {
                    x: 215,
                    y: 120,
                },
                "A",
                {fontSize: 20},
            );

            this.inpBitLabel2 = this.view.addText(
                {
                    x: 280,
                    y: 195,
                },
                "",
                {fontSize: 30},
            );

            this.view.addText(
                {
                    x: 215,
                    y: 220,
                },
                "B",
                {fontSize: 20},
            );
        }

        this.inpWire1 = this.view.addWire(
            {
                x: 265,
                y: 120,
            },
            250,
            "horz",
        );

        this.inpConn1 = this.view.addConnector(
            {
                x: 400,
                y: 120,
            }
        );

        this.inpWire1v = this.view.addWire(
            {
                x: 400,
                y: 120,
            },
            200,
            "vert",
        );

        this.inpWire1vh = this.view.addWire(
            {
                x: 400,
                y: 320,
            },
            115,
            "horz",
        );

        this.view.addXorGate(
            {
                x: 570,
                y: 170,
            },
            {
                width: 150,
                height: 150,
            }
        );

        this.outWireSum = this.view.addWire(
            {
                x: 645,
                y: 170,
            },
            150,
            "horz",
        );

        if (!this.hideConnAndSwitch) {
            this.outConnectorSum = this.view.addConnector(
                {
                    x: 795,
                    y: 170,
                }
            );

            this.outBitLabelSum = this.view.addText(
                {
                    x: 800,
                    y: 140,
                },
                "",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 850,
                    y: 170,
                },
                "Sum",
                {fontSize: 20}
            );
        }

        this.inpWire2 = this.view.addWire(
            {
                x: 265,
                y: 220,
            },
            250,
            "horz",
        );

        this.inpConn2 = this.view.addConnector(
            {
                x: 330,
                y: 220,
            }
        );

        this.inpWire2v = this.view.addWire(
            {
                x: 330,
                y: 220,
            },
            200,
            "vert",
        );

        this.inpWire2vh = this.view.addWire(
            {
                x: 330,
                y: 420,
            },
            185,
            "horz",
        );

        this.view.addAndGate(
            {
                x: 570,
                y: 370,
            },
            {
                width: 150,
                height: 150,
            }
        );

        this.outWireCarry = this.view.addWire(
            {
                x: 645,
                y: 370,
            },
            150,
            "horz",
        );

        if (!this.hideConnAndSwitch) {
            this.outConnectorCarry = this.view.addConnector(
                {
                    x: 795,
                    y: 370,
                }
            );

            this.outBitLabelCarry = this.view.addText(
                {
                    x: 800,
                    y: 340,
                },
                "",
                {fontSize: 30}
            );

            this.view.addText(
                {
                    x: 880,
                    y: 370,
                },
                "Carry Out",
                {fontSize: 20}
            );
        }

    }

    private update0() {
        const a = this.inpBit1;
        const b = this.inpBit2;

        this.setSignal(
            a,
            this.inpWire1,
        );

        this.setSignal(
            b,
            this.inpWire2,
        );

        const [sum, carryOut] = halfAdder(
            a,
            b,
        );

        this.finalOut = [sum, carryOut];

        if (!this.hideConnAndSwitch) {
            this.view.setTextBitAnimated(this.inpBitLabel1.textId, a);
            this.view.setTextBitAnimated(this.inpBitLabel2.textId, b);
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
        const a = this.inpBit1;
        const b = this.inpBit2;

        this.setSignal(
            a,
            this.inpWire1,
            this.inpConn1,
            this.inpWire1v,
            this.inpWire1vh,
        );

        if (!this.hideConnAndSwitch)
            this.view.setTextBitAnimated(
                this.inpBitLabel1.textId,
                a,
            );

        // -----------------------------------------------------
        // INPUT 2
        // -----------------------------------------------------

        this.setSignal(
            b,
            this.inpWire2,
            this.inpConn2,
            this.inpWire2v,
            this.inpWire2vh,
        );

        if (!this.hideConnAndSwitch)
            this.view.setTextBitAnimated(
                this.inpBitLabel2.textId,
                b,
            );

        // -----------------------------------------------------
        // XOR
        // -----------------------------------------------------

        const xorOut =
            xorGate(
                a,
                b,
            );

        this.view.setWireBit(
            this.outWireSum.wireId,
            xorOut,
        );

        if (!this.hideConnAndSwitch) {
            this.view.setConnectorBit(
                this.outConnectorSum.connectorId,
                xorOut,
            );

            this.view.setTextBitAnimated(
                this.outBitLabelSum.textId,
                xorOut,
            );
        }

        // -----------------------------------------------------
        // AND
        // -----------------------------------------------------

        const andOut =
            andGate(
                a,
                b,
            );

        this.view.setWireBit(
            this.outWireCarry.wireId,
            andOut,
        );

        if (!this.hideConnAndSwitch) {
            this.view.setConnectorBit(
                this.outConnectorCarry.connectorId,
                andOut,
            );

            this.view.setTextBitAnimated(
                this.outBitLabelCarry.textId,
                andOut,
            );
        }

        this.finalOut = [xorOut, andOut];
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

    setInputs(inp1: Bit, inp2: Bit): [sum: Bit, carryOut: Bit] {
        this.inpBit1 = inp1;
        this.inpBit2 = inp2;
        this.update();
        return this.finalOut;
    }
}