import { ALU1BitCircuit } from "../circuits/ALU1BitCircuit";

import {
    CircuitCard,
    type CircuitCardConfig,
} from "../core/CircuitCard";


export class ALU1BitCircuitCard
    extends CircuitCard<ALU1BitCircuit> {


    constructor() {

        const circuit =
            new ALU1BitCircuit();


        const config:
            CircuitCardConfig = {

            levels: [

                {
                    position: {
                        x: -150,
                        y: 0,
                    },

                    zoom: .8,
                },


                {
                    position: {
                        x: 0,
                        y: 50,
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