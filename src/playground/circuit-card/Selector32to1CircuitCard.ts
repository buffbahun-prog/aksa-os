import { Selector32to1Circuit } from "../circuits/Selector32to1Circuit";

import {
    CircuitCard,
    type CircuitCardConfig,
} from "../core/CircuitCard";


export class Selector32to1CircuitCard
    extends CircuitCard<Selector32to1Circuit> {


    constructor() {

        const circuit =
            new Selector32to1Circuit();


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
            800,
        );
    }
}