import { ALUCircuit } from "../circuits/ALUCircuit";

import {
    CircuitCard,
    type CircuitCardConfig,
} from "../core/CircuitCard";


export class ALUCircuitCard
    extends CircuitCard<ALUCircuit> {


    constructor() {

        const circuit =
            new ALUCircuit();


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
                        x: -500,
                        y: -45,
                    },

                    zoom: 0.55,
                },


                {
                    position: {
                        x: -550,
                        y: -45,
                    },

                    zoom: 0.55,
                },

                {
                    position: {
                        x: -550,
                        y: -45,
                    },

                    zoom: 0.55,
                },

            ],

        };


        super(
            circuit,
            config,
        );
    }
}