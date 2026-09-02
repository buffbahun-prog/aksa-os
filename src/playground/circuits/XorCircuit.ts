import { andGate, inverter, orGate, xorGate } from "../../virtual-machine/C.P.U/gates";
import type { Bit } from "../../virtual-machine/types";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";

export class XorCircuit extends LevelledCircuit {

    private inpBit1: Bit = 0;
    private inpBit2: Bit = 0;

    // =========================================================
    // INPUT 1
    // =========================================================

    private inpWire1!: WireResult;
    private connectorWire1!: ConnectorResult;
    private inpWire1v!: WireResult;
    private inpWire1vh!: WireResult;

    // =========================================================
    // INPUT 2
    // =========================================================

    private inpWire2!: WireResult;
    private connectorWire2!: ConnectorResult;
    private inpWire2v!: WireResult;
    private inpWire2vh!: WireResult;

    // =========================================================
    // OR
    // =========================================================

    private orOutWire!: WireResult;

    // =========================================================
    // AND 1
    // =========================================================

    private and1OutWire!: WireResult;

    // =========================================================
    // NOT
    // =========================================================

    private notOutWire!: WireResult;
    private notOutWirev!: WireResult;
    private notOutWirevh!: WireResult;

    // =========================================================
    // AND 2
    // =========================================================

    private and2OutWire!: WireResult;
    private and2OutCon!: ConnectorResult;

    // =========================================================
    // LABELS
    // =========================================================

    private outputBitTextLabel!: TextResult;
    private input1BitTextLabel!: TextResult;
    private input2BitTextLabel!: TextResult;

    private xorOutWire!: WireResult;
    private xorOutCon!: ConnectorResult;

    constructor() {

        super(1);

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
        this.inpWire1 =
            this.view.addWire(
                {
                    x: 300,
                    y: 200,
                },
                190,
                "horz",
            );

        this.inpWire2 =
            this.view.addWire(
                {
                    x: 300,
                    y: 300,
                },
                190,
                "horz",
            );

        this.input1BitTextLabel = 
            this.view.addText(
                {
                    x: 310,
                    y: 160,
                },
                "",
                {fontSize: 30},
            );

        this.input2BitTextLabel = 
            this.view.addText(
                {
                    x: 310,
                    y: 260,
                },
                "",
                {fontSize: 30},
            );

        this.xorOutWire = 
            this.view.addWire(
                {
                    x: 580,
                    y: 250,
                },
                190,
                "horz",
            );

        this.xorOutCon = 
            this.view.addConnector(
                {
                    x: 770,
                    y: 250,
                }
            );

        this.outputBitTextLabel = 
            this.view.addText(
                {
                    x: 790,
                    y: 220,
                },
                "",
                {fontSize: 30},
            );

        this.view.addXorGate(
            {
                x: 490,
                y: 250,
            },
            {
                width: 180,
                height: 230,
            }
        );

        const switch1 = 
            this.view.addSwitch(
            {
                x: 285,
                y: 200,
            },
            12,
            (bit) => {

                this.inpBit1 =
                    bit;

                this.update();
            },
            );

        const switch2 = 
            this.view.addSwitch(
            {
                x: 285,
                y: 300,
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

    private build1() {
        this.inpWire1 =
            this.view.addWire(
                {
                    x: 100,
                    y: 100,
                },
                190,
                "horz",
            );

        this.connectorWire1 =
            this.view.addConnector(
                {
                    x: 200,
                    y: 100,
                },
            );

        this.inpWire1v =
            this.view.addWire(
                {
                    x: 200,
                    y: 100,
                },
                180,
                "vert",
            );

        this.inpWire1vh =
            this.view.addWire(
                {
                    x: 200,
                    y: 280,
                },
                180,
                "horz",
            );

        // -----------------------------------------------------
        // INPUT 2
        // -----------------------------------------------------

        this.inpWire2 =
            this.view.addWire(
                {
                    x: 100,
                    y: 200,
                },
                190,
                "horz",
            );

        this.connectorWire2 =
            this.view.addConnector(
                {
                    x: 140,
                    y: 200,
                },
            );

        this.inpWire2v =
            this.view.addWire(
                {
                    x: 140,
                    y: 200,
                },
                150,
                "vert",
            );

        this.inpWire2vh =
            this.view.addWire(
                {
                    x: 140,
                    y: 350,
                },
                230,
                "horz",
            );

        // -----------------------------------------------------
        // OR
        // -----------------------------------------------------

        this.view.addOrGate(
            {
                x: 320,
                y: 150,
            },
            {
                width: 100,
                height: 150,
            },
        );

        this.orOutWire =
            this.view.addWire(
                {
                    x: 370,
                    y: 150,
                },
                420,
                "horz",
            );

        // -----------------------------------------------------
        // AND 1
        // -----------------------------------------------------

        this.view.addAndGate(
            {
                x: 400,
                y: 315,
            },
            {
                width: 100,
                height: 120,
            },
        );

        this.and1OutWire =
            this.view.addWire(
                {
                    x: 450,
                    y: 315,
                },
                120,
                "horz",
            );

        // -----------------------------------------------------
        // NOT
        // -----------------------------------------------------

        this.view.addNotGate(
            {
                x: 570,
                y: 315,
            },
            {
                width: 50,
                height: 50,
            },
        );

        this.notOutWire =
            this.view.addWire(
                {
                    x: 615,
                    y: 315,
                },
                100,
                "horz",
            );

        this.notOutWirev =
            this.view.addWire(
                {
                    x: 715,
                    y: 315,
                },
                -120,
                "vert",
            );

        this.notOutWirevh =
            this.view.addWire(
                {
                    x: 715,
                    y: 195,
                },
                55,
                "horz",
            );

        // -----------------------------------------------------
        // AND 2
        // -----------------------------------------------------

        this.view.addAndGate(
            {
                x: 820,
                y: 170,
            },
            {
                width: 100,
                height: 120,
            },
        );

        this.and2OutWire =
            this.view.addWire(
                {
                    x: 870,
                    y: 170,
                },
                100,
                "horz",
            );

        this.and2OutCon =
            this.view.addConnector(
                {
                    x: 970,
                    y: 170,
                },
            );

        // -----------------------------------------------------
        // OUTPUT LABEL
        // -----------------------------------------------------

        this.outputBitTextLabel =
            this.view.addText(
                {
                    x: 980,
                    y: 145,
                },
                "",
                {
                    fontSize: 30,
                },
            );

        // -----------------------------------------------------
        // INPUT 1 LABEL
        // -----------------------------------------------------

        this.input1BitTextLabel =
            this.view.addText(
                {
                    x: 100,
                    y: 65,
                },
                "",
                {
                    fontSize: 30,
                },
            );

        // -----------------------------------------------------
        // INPUT 2 LABEL
        // -----------------------------------------------------

        this.input2BitTextLabel =
            this.view.addText(
                {
                    x: 100,
                    y: 165,
                },
                "",
                {
                    fontSize: 30,
                },
            );

        // -----------------------------------------------------
        // SWITCH 1
        // -----------------------------------------------------

        const switch1 = this.view.addSwitch(
            {
                x: 85,
                y: 100,
            },
            12,
            (bit) => {

                this.inpBit1 =
                    bit;

                this.update();
            },
        );
        this.view.setSwitchBit(switch1.switchId, this.inpBit1);

        // -----------------------------------------------------
        // SWITCH 2
        // -----------------------------------------------------

        const switch2 = this.view.addSwitch(
            {
                x: 85,
                y: 200,
            },
            12,
            (bit) => {

                this.inpBit2 =
                    bit;

                this.update();
            },
        );
        this.view.setSwitchBit(switch2.switchId, this.inpBit2);
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

        const output = xorGate(
            a,
            b,
        );

        this.view.setTextBitAnimated(this.input1BitTextLabel.textId, a);
        this.view.setTextBitAnimated(this.input2BitTextLabel.textId, b);
        this.view.setTextBitAnimated(this.outputBitTextLabel.textId, output);

        this.setSignal(
            output,
            this.xorOutWire,
            this.xorOutCon,
        );

    }

    private update1() {
        const a = this.inpBit1;
        const b = this.inpBit2;

        this.setSignal(
            a,
            this.inpWire1,
            this.connectorWire1,
            this.inpWire1v,
            this.inpWire1vh,
        );

        this.view.setTextBitAnimated(
            this.input1BitTextLabel.textId,
            a,
        );

        // -----------------------------------------------------
        // INPUT 2
        // -----------------------------------------------------

        this.setSignal(
            b,
            this.inpWire2,
            this.connectorWire2,
            this.inpWire2v,
            this.inpWire2vh,
        );

        this.view.setTextBitAnimated(
            this.input2BitTextLabel.textId,
            b,
        );

        // -----------------------------------------------------
        // OR
        // -----------------------------------------------------

        const orOut =
            orGate(
                a,
                b,
            );

        this.view.setWireBit(
            this.orOutWire.wireId,
            orOut,
        );

        // -----------------------------------------------------
        // AND 1
        // -----------------------------------------------------

        const andOut =
            andGate(
                a,
                b,
            );

        this.view.setWireBit(
            this.and1OutWire.wireId,
            andOut,
        );

        // -----------------------------------------------------
        // NOT
        // -----------------------------------------------------

        const notOut =
            inverter(
                andOut,
            );

        this.view.setWireBit(
            this.notOutWire.wireId,
            notOut,
        );

        this.view.setWireBit(
            this.notOutWirev.wireId,
            notOut,
        );

        this.view.setWireBit(
            this.notOutWirevh.wireId,
            notOut,
        );

        // -----------------------------------------------------
        // FINAL AND
        // -----------------------------------------------------

        const output =
            andGate(
                orOut,
                notOut,
            );

        this.view.setWireBit(
            this.and2OutWire.wireId,
            output,
        );

        this.view.setConnectorBit(
            this.and2OutCon.connectorId,
            output,
        );

        this.view.setTextBitAnimated(
            this.outputBitTextLabel.textId,
            output,
        );
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
}