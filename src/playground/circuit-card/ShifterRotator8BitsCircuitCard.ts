
import { ShifterRotator8BitsCircuit } from "../circuits/ShifterRotator8Bits";
import {
    CircuitCard,
    type CircuitCardConfig,
} from "../core/CircuitCard";


export class ShifterRotator8BitsCircuitCard
    extends CircuitCard<ShifterRotator8BitsCircuit> {


    constructor() {

        const circuit =
            new ShifterRotator8BitsCircuit();


        const config:
            CircuitCardConfig = {

            levels: [

                {
                    position: {
                        x: -150,
                        y: 100,
                    },

                    zoom: .26,
                },

                {
                    position: {
                        x: -150,
                        y: 100,
                    },

                    zoom: .26,
                },

                {
                    position: {
                        x: -150,
                        y: 100,
                    },

                    zoom: .26,
                },
            ],

        };


        super(
            circuit,
            config,
            1200,
            1000,
        );
    }
}