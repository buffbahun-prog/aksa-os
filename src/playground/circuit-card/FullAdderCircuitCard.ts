import { FullAdderCircuit } from "../circuits/FullAdder";
import { CircuitCard, type CircuitCardConfig } from "../core/CircuitCard";

export class FullAdderCircuitCard
    extends CircuitCard<FullAdderCircuit> {

    constructor() {

        const circuit =
            new FullAdderCircuit();


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