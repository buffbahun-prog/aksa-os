// import { andGate } from "../../virtual-machine/C.P.U/gates";
// import type { Bit, Bit3, Bit8 } from "../../virtual-machine/types";
// import type { ConnectorResult, TextResult, WireResult } from "../core/CircuitSvg";
import { LevelledCircuit } from "../core/LevelledCircuit";

export class ALUCircuit extends LevelledCircuit {

    // private inputDataBits1: Bit8 = Array.from({length: 8}).fill(0) as Bit8;
    // private inputDataBits2: Bit8 = Array.from({length: 8}).fill(0) as Bit8;

    // private controlBits: Bit3 = Array.from({length: 3}).fill(0) as Bit3;

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
    }

    private update0() {

    }

    // =========================================================
    // SIGNAL HELPER
    // =========================================================

    // private setSignal(
    //     bit: Bit,
    //     wire: WireResult,
    //     connector?: ConnectorResult,
    //     ...additionalWires: WireResult[]
    // ): void {

    //     this.view.setWireBit(
    //         wire.wireId,
    //         bit,
    //     );

    //     if (connector) this.view.setConnectorBit(
    //         connector.connectorId,
    //         bit,
    //     );

    //     for (
    //         const additionalWire
    //         of additionalWires
    //     ) {

    //         this.view.setWireBit(
    //             additionalWire.wireId,
    //             bit,
    //         );
    //     }
    // }
}