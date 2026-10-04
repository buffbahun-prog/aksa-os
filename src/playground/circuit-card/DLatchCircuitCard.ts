import { DLatchCircuit } from "../circuits/DLatchCircuit";

import {
    CircuitCard,
    type CircuitCardConfig,
} from "../core/CircuitCard";


export class DLatchCircuitCard
    extends CircuitCard<DLatchCircuit> {


    constructor() {

        const circuit =
            new DLatchCircuit();


        const config:
            CircuitCardConfig = {

            levels: [
                {
                    position: {
                        x: -150,
                        y: 0,
                    },

                    zoom: 1,
                },

                {
                    position: {
                        x: -150,
                        y: 0,
                    },

                    zoom: 1,
                },

            ],

        };


        super(
            circuit,
            config,
        );
    }
}