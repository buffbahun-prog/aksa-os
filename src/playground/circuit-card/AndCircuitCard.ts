import { AndCircuit } from "../circuits/AndCircuit";
import { CircuitCard, type CircuitCardConfig } from "../core/CircuitCard";

export class AndCircuitCard
    extends CircuitCard<AndCircuit> {

    constructor() {

        const circuit =
            new AndCircuit();


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