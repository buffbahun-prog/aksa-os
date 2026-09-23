import { HomePage } from "../pages/HomePage";
import { ALUPage } from "../pages/playground/ALU/ALUPage";
import { ArithmeticPage } from "../pages/playground/arithmetic/ArithmeticPage";
import { GatesPage } from "../pages/playground/gates/GatesPage";
import { SelectorsPage } from "../pages/playground/selectors/SelectorsPage";
import { ShifterPage } from "../pages/playground/shifter/ShifterPage";
import type { Route } from "./Route";

export const routes: Route[] = [

    {
        path: "/",
        page: HomePage,
    },

    {
        path: "/playground/gates",
        page: GatesPage,
    },
    {
        path: "/playground/arithmetic",
        page: ArithmeticPage,
    },
    {
        path: "/playground/selectors",
        page: SelectorsPage,
    },
    {
        path: "/playground/alu",
        page: ALUPage,
    },
    {
        path: "/playground/shifters",
        page: ShifterPage,
    },
];