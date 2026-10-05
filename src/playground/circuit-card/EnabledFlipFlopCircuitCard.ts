
import { EnabledFlipFlopCircuit } from "../circuits/EnabledFlipFlop";
import {
    CircuitCard,
    type CircuitCardConfig,
} from "../core/CircuitCard";


export class EnabledFlipFlopCircuitCard
    extends CircuitCard<EnabledFlipFlopCircuit> {


    constructor() {

        const circuit =
            new EnabledFlipFlopCircuit();


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
        );
    }
}