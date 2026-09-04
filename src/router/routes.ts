import { HomePage } from "../pages/HomePage";
import { ArithmeticPage } from "../pages/playground/arithmetic/ArithmeticPage";
import { GatesPage } from "../pages/playground/gates/GatesPage";
import { SelectorsPage } from "../pages/playground/selectors/SelectorsPage";
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
];