import { NandCircuit } from "../circuits/NandCircuit";
import { CircuitCard, type CircuitCardConfig } from "../core/CircuitCard";

export class NandCircuitCard
    extends CircuitCard<NandCircuit> {

    constructor() {

        const circuit =
            new NandCircuit();


        const config:
            CircuitCardConfig = {

            levels: [
                {
                    position: {
                        x: 0,
                        y: 0,
                    },

                    zoom: 1,
                },
                {
                    position: {
                        x: 0,
                        y: 0,
                    },

                    zoom: 1,
                },
            ],

        };


        super(
            circuit,
            config,
            1200,
            500,
        );
    }
}