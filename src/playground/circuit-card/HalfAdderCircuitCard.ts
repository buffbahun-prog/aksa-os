import { HalfAdderCircuit } from "../circuits/HalfAdder";
import { CircuitCard, type CircuitCardConfig } from "../core/CircuitCard";

export class HalfAdderCircuitCard
    extends CircuitCard<HalfAdderCircuit> {

    constructor() {

        const circuit =
            new HalfAdderCircuit();


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