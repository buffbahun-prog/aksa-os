// src/router/Router.ts

import {
    type PageContext,
    type NavigationOptions,
    Page,
} from "./Page";

import type {
    Route,
    PageConstructor,
} from "./Route";


interface MatchedRoute {
    route: Route;
    params: Record<string, string>;
}


export class Router {

    private readonly outlet: HTMLElement;
    private readonly routes: Route[];
    private readonly notFoundPage: PageConstructor;

    private currentPage: Page | null = null;

    private navigating = false;


    constructor(options: {
        outlet: HTMLElement;
        routes: Route[];
        notFoundPage: PageConstructor;
    }) {

        this.outlet = options.outlet;
        this.routes = options.routes;
        this.notFoundPage = options.notFoundPage;

        window.addEventListener(
            "popstate",
            this.handlePopState,
        );
    }


    async start(): Promise<void> {

        await this.render(
            new URL(
                window.location.href,
            ),
        );
    }


    async navigate(
        path: string,
        options: NavigationOptions = {},
    ): Promise<void> {

        if (this.navigating) {
            return;
        }

        this.navigating = true;

        try {

            const url =
                new URL(
                    path,
                    window.location.origin,
                );


            if (options.replace) {

                history.replaceState(
                    options.state ?? null,
                    "",
                    url.pathname + url.search,
                );

            } else {

                history.pushState(
                    options.state ?? null,
                    "",
                    url.pathname + url.search,
                );
            }


            await this.render(url);

        } finally {

            this.navigating = false;
        }
    }


    back(): void {
        history.back();
    }


    forward(): void {
        history.forward();
    }


    private handlePopState = async (): Promise<void> => {

        await this.render(
            new URL(
                window.location.href,
            ),
        );
    };


    private async render(
        url: URL,
    ): Promise<void> {

        /*
         * Unmount previous page first.
         */

        this.currentPage?.unmount();

        this.currentPage = null;


        /*
         * Find route.
         */

        const matched =
            this.matchRoute(
                url.pathname,
            );


        /*
         * Select page.
         */

        const PageClass =
            matched?.route.page ??
            this.notFoundPage;


        /*
         * Create page context.
         */

        const context: PageContext = {
            router: this,
        };


        /*
         * Create page.
         */

        const page =
            new PageClass(
                context,
                matched?.params ?? {},
            );


        this.currentPage =
            page;


        /*
         * Mount DOM.
         */

        this.outlet.replaceChildren(
            page.root,
        );


        /*
         * Run page lifecycle.
         */

        page.mount();
    }


    private matchRoute(
        pathname: string,
    ): MatchedRoute | null {

        for (const route of this.routes) {

            const params =
                this.matchPath(
                    route.path,
                    pathname,
                );

            if (params) {

                return {
                    route,
                    params,
                };
            }
        }

        return null;
    }


    private matchPath(
        pattern: string,
        pathname: string,
    ): Record<string, string> | null {

        const patternParts =
            this.normalizePath(
                pattern,
            ).split("/");

        const pathParts =
            this.normalizePath(
                pathname,
            ).split("/");


        if (
            patternParts.length !==
            pathParts.length
        ) {
            return null;
        }


        const params:
            Record<string, string> = {};


        for (
            let i = 0;
            i < patternParts.length;
            i++
        ) {

            const patternPart =
                patternParts[i];

            const pathPart =
                pathParts[i];


            if (
                patternPart.startsWith(":")
            ) {

                params[
                    patternPart.slice(1)
                ] =
                    decodeURIComponent(
                        pathPart,
                    );

                continue;
            }


            if (
                patternPart !==
                pathPart
            ) {
                return null;
            }
        }


        return params;
    }


    private normalizePath(
        path: string,
    ): string {

        const normalized =
            path
                .replace(/^\/+/, "")
                .replace(/\/+$/, "");

        return normalized === ""
            ? "/"
            : `/${normalized}`;
    }
}