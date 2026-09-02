import type { Router } from "../router/Router";


export class SiteNav {

    private readonly element: HTMLElement;
    private readonly router: Router;


    constructor(
        element: HTMLElement,
        router: Router,
    ) {
        this.element = element;
        this.router = router;

        this.bindEvents();
    }


    private bindEvents(): void {

        const brand =
            this.element.querySelector<HTMLButtonElement>(
                ".site-nav__brand",
            );

        if (!brand) {
            return;
        }

        brand.addEventListener(
            "click",
            this.handleBrandClick,
        );
    }


    private handleBrandClick = (): void => {
        this.router.navigate("/");
    };


    destroy(): void {

        const brand =
            this.element.querySelector<HTMLButtonElement>(
                ".site-nav__brand",
            );

        brand?.removeEventListener(
            "click",
            this.handleBrandClick,
        );
    }
}