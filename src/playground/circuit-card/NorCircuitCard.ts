import { NorCircuit } from "../circuits/NorCircuit";
import { CircuitCard, type CircuitCardConfig } from "../core/CircuitCard";

export class NorCircuitCard
    extends CircuitCard<NorCircuit> {

    constructor() {

        const circuit =
            new NorCircuit();


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