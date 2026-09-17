import { ALU8BitsCircuit } from "../circuits/ALUCircuit";

import {
    CircuitCard,
    type CircuitCardConfig,
} from "../core/CircuitCard";


export class ALU8BitsCircuitCard
    extends CircuitCard<ALU8BitsCircuit> {


    constructor() {

        const circuit =
            new ALU8BitsCircuit();


        const config:
            CircuitCardConfig = {

            levels: [

                {
                    position: {
                        x: -800,
                        y: -400,
                    },

                    zoom: .35,
                },


                {
                    position: {
                        x: -800,
                        y: -400,
                    },

                    zoom: .35,
                },


                {
                    position: {
                        x: -800,
                        y: -400,
                    },

                    zoom: .35,
                },

            ],

        };


        super(
            circuit,
            config,
            1200,
            1200,
        );
    }
}