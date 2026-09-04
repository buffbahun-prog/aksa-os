import { Adder8BitsCircuit } from "../circuits/Adder8BitsCircuit";

import {
    CircuitCard,
    type CircuitCardConfig,
} from "../core/CircuitCard";


export class Adder8BitsCircuitCard
    extends CircuitCard<Adder8BitsCircuit> {


    constructor() {

        const circuit =
            new Adder8BitsCircuit();


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