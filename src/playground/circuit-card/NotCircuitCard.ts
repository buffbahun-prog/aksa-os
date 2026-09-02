import { NotCircuit } from "../circuits/NotCircuit";
import { CircuitCard, type CircuitCardConfig } from "../core/CircuitCard";

export class NotCircuitCard
    extends CircuitCard<NotCircuit> {

    constructor() {

        const circuit =
            new NotCircuit();


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