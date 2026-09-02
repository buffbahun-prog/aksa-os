import { HomePage } from "../pages/HomePage";
import { ArithmeticPage } from "../pages/playground/arithmetic/ArithmeticPage";
import { GatesPage } from "../pages/playground/gates/GatesPage";
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
];