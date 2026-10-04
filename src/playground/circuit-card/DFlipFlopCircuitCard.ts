
import { DFlipFlopCircuit } from "../circuits/DFlipFlopCircuit";
import {
    CircuitCard,
    type CircuitCardConfig,
} from "../core/CircuitCard";


export class DFlipFlopCircuitCard
    extends CircuitCard<DFlipFlopCircuit> {


    constructor() {

        const circuit =
            new DFlipFlopCircuit();


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

            ],

        };


        super(
            circuit,
            config,
        );
    }
}