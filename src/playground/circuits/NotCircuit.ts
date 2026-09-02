import { inverter } from "../../virtual-machine/C.P.U/gates";
import type { Bit } from "../../virtual-machine/types";
import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";

export class NotCircuit extends LevelledCircuit {

    private inpBit1: Bit = 0;

    private inpWire1!: WireResult;

    private notOutWire!: WireResult;
    private notOutCon!: ConnectorResult;


    private input1BitTextLabel!: TextResult;
    private outputBitTextLabel!: TextResult;
    
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

    private build0() {
        this.inpWire1 =
            this.view.addWire(
                {
                    x: 250,
                    y: 250,
                },
                195,
                "horz",
            );
        
        this.input1BitTextLabel = this.view.addText(
                {
                    x: 260,
                    y: 220,
                },
                "",
                {fontSize: 30},
            );

        this.outputBitTextLabel = this.view.addText(
                {
                    x: 840,
                    y: 220,
                },
                "",
                {fontSize: 30},
            );

        this.view.addNotGate(
                {
                    x: 540,
                    y: 250,
                },
                {
                    width: 180,
                    height: 230,
                }
            );

        this.notOutWire = 
            this.view.addWire(
                {
                    x: 650,
                    y: 250,
                },
                190,
                "horz",
            );

        this.notOutCon = this.view.addConnector(
            {
                x: 840,
                y: 250,
            },
        );

        const switch1 = this.view.addSwitch(
            {
                x: 235,
                y: 250,
            },
            12,
            (bit) => {

                this.inpBit1 =
                    bit;

                this.update();
            },
            );

        this.view.setSwitchBit(switch1.switchId, this.inpBit1);
    }

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

    private update0() {
        const a =
            this.inpBit1;

        this.setSignal(
                a,
                this.inpWire1,
            );
        
        const output = inverter(
                a,
            );

        this.view.setTextBitAnimated(this.input1BitTextLabel.textId, a);
        this.view.setTextBitAnimated(this.outputBitTextLabel.textId, output);

        this.setSignal(
                output,
                this.notOutWire,
                this.notOutCon,
        );
    }

    protected update(): void {
        switch (this.level) {
            case 0:
                this.update0();
                break;
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
}