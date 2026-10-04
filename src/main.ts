import { NotFoundPage } from "./pages/NotFoundPage";
import { Router } from "./router/Router";
import { routes } from "./router/routes";
import { SiteNav } from "./shared-layout/SiteNav";
// import { Clock } from "./virtual-machine/C.P.U/clock";
// import { DFlipFlop } from "./virtual-machine/C.P.U/memory";

const outlet =
    document.getElementById(
        "app",
    );


if (!outlet) {
    throw new Error(
        "Missing #app element.",
    );
}


const router =
    new Router({
        outlet,
        routes,
        notFoundPage: NotFoundPage,
    });

const navElement =
    document.querySelector<HTMLElement>(".site-nav");

if (!navElement) {
    throw new Error("Site navigation not found");
}


// const siteNav =
    new SiteNav(
        navElement,
        router,
    );


await router.start();

// const clock = new Clock(1);
// const flipflop = new DFlipFlop(clock);