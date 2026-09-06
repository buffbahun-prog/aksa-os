import { Selector4to1Circuit } from "../circuits/Selector4to1";

import {
    CircuitCard,
    type CircuitCardConfig,
} from "../core/CircuitCard";


export class Selector4to1CircuitCard
    extends CircuitCard<Selector4to1Circuit> {


    constructor() {

        const circuit =
            new Selector4to1Circuit();


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
                        y: -30,
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