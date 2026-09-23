
import { Selector8Bit2to1Circuit } from "../circuits/Selector8Bit2to1";
import {
    CircuitCard,
    type CircuitCardConfig,
} from "../core/CircuitCard";


export class Selector8Bit2to1CircuitCard
    extends CircuitCard<Selector8Bit2to1Circuit> {


    constructor() {

        const circuit =
            new Selector8Bit2to1Circuit();


        const config:
            CircuitCardConfig = {

            levels: [

                {
                    position: {
                        x: -150,
                        y: -30,
                    },

                    zoom: .6,
                },


                {
                    position: {
                        x: -150,
                        y: -30,
                    },

                    zoom: .6,
                },

                {
                    position: {
                        x: -150,
                        y: -30,
                    },

                    zoom: .6,
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