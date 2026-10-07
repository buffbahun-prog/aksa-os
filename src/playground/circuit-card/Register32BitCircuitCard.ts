
import { Register32BitCircuit } from "../circuits/Register32BitCircuit";
import {
    CircuitCard,
    type CircuitCardConfig,
} from "../core/CircuitCard";


export class Register32BitCircuitCard
    extends CircuitCard<Register32BitCircuit> {


    constructor() {

        const circuit =
            new Register32BitCircuit();


        const config:
            CircuitCardConfig = {

            levels: [
                {
                    position: {
                        x: 2600,
                        y: -1000,
                    },

                    zoom: .26,
                },

                {
                    position: {
                        x: -100,
                        y: 0,
                    },

                    zoom: 1,
                },

                {
                    position: {
                        x: -100,
                        y: 0,
                    },

                    zoom: 1,
                },

                {
                    position: {
                        x: -100,
                        y: 0,
                    },

                    zoom: 1,
                },

                {
                    position: {
                        x: -100,
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