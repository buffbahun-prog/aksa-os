import { NotFoundPage } from "./pages/NotFoundPage";
import { Router } from "./router/Router";
import { routes } from "./router/routes";
import { SiteNav } from "./shared-layout/SiteNav";

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