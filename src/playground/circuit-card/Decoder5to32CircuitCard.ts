import { Decoder5to32Circuit } from "../circuits/Decoder5to32";

import {
    CircuitCard,
    type CircuitCardConfig,
} from "../core/CircuitCard";


export class Decoder5to32CircuitCard
    extends CircuitCard<Decoder5to32Circuit> {


    constructor() {

        const circuit =
            new Decoder5to32Circuit();


        const config:
            CircuitCardConfig = {

            levels: [

                {
                    position: {
                        x: -2200,
                        y: -50,
                    },

                    zoom: .22,
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
            800,
        );
    }
}