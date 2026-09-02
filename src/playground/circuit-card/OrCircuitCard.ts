import { OrCircuit } from "../circuits/OrCircuit";
import { CircuitCard, type CircuitCardConfig } from "../core/CircuitCard";

export class OrCircuitCard
    extends CircuitCard<OrCircuit> {

    constructor() {

        const circuit =
            new OrCircuit();


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