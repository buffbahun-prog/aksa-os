import { andGate } from "../../virtual-machine/C.P.U/gates";
import type { Bit } from "../../virtual-machine/types";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";

export class AndCircuit extends LevelledCircuit {

    private inpBit1: Bit = 0;
    private inpBit2: Bit = 0;

    // =========================================================
    // INPUT 1
    // =========================================================

    private inpWire1!: WireResult;

    // =========================================================
    // INPUT 2
    // =========================================================

    private inpWire2!: WireResult;

    // =========================================================
    // AND
    // =========================================================

    private andOutWire!: WireResult;
    private andOutCon!: ConnectorResult;

    // =========================================================
    // LABELS
    // =========================================================

    private outputBitTextLabel!: TextResult;
    private input1BitTextLabel!: TextResult;
    private input2BitTextLabel!: TextResult;

    constructor() {
        super(0);

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

        this.andOutWire = 
            this.view.addWire(
                {
                    x: 580,
                    y: 250,
                },
                240,
                "horz",
            );

        this.andOutCon = 
            this.view.addConnector(
                {
                    x: 820,
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

        this.view.addAndGate(
            {
                x: 550,
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

        const output = andGate(
            a,
            b,
        );

        this.view.setTextBitAnimated(this.input1BitTextLabel.textId, a);
        this.view.setTextBitAnimated(this.input2BitTextLabel.textId, b);
        this.view.setTextBitAnimated(this.outputBitTextLabel.textId, output);

        this.setSignal(
            output,
            this.andOutWire,
            this.andOutCon,
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