import { Selector2to1Circuit } from "../circuits/Selector2to1";

import {
    CircuitCard,
    type CircuitCardConfig,
} from "../core/CircuitCard";


export class Selector2to1CircuitCard
    extends CircuitCard<Selector2to1Circuit> {


    constructor() {

        const circuit =
            new Selector2to1Circuit();


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
            600,
        );

        // temp
        this.setLevel(1);
    }
}