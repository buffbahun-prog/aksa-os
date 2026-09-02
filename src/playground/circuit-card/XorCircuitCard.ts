import { XorCircuit } from "../circuits/XorCircuit";
import { CircuitCard, type CircuitCardConfig } from "../core/CircuitCard";

export class XorCircuitCard
    extends CircuitCard<XorCircuit> {

    constructor() {

        const circuit =
            new XorCircuit();


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