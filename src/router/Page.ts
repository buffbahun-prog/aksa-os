export interface PageContext {
    router: PageRouter;
}

export interface PageRouter {
    navigate(
        path: string,
        options?: NavigationOptions,
    ): Promise<void>;

    back(): void;

    forward(): void;
}

export interface NavigationOptions {
    replace?: boolean;
    state?: unknown;
}

const siteNavSelector = ".site-nav";

export abstract class Page {

    /**
     * Root DOM element of this page.
     */
    protected readonly element: HTMLElement;

    /**
     * Application context available to the page.
     */
    protected readonly context: PageContext;

    /**
     * Automatically removes page-scoped event listeners,
     * fetches and other abortable operations.
     */
    private abortController: AbortController | null = null;

    /**
     * Prevents mounting the same page twice.
     */
    private mounted = false;


    constructor(
        element: HTMLElement,
        context: PageContext,
    ) {
        this.element = element;
        this.context = context;
    }


    // =========================================================
    // LIFECYCLE
    // =========================================================

    /**
     * Mount the page.
     *
     * This is called by the Router.
     */
    mount(): void {

        if (this.mounted) {
            return;
        }

        this.abortController =
            new AbortController();

        this.mounted = true;

        this.onMount();
    }


    /**
     * Unmount the page.
     *
     * This is called by the Router.
     */
    unmount(): void {

        if (!this.mounted) {
            return;
        }

        /*
         * Give the page a chance to stop active work
         * before listeners/signals are destroyed.
         */
        this.onBeforeUnmount();

        /*
         * Remove all page-scoped listeners.
         */
        this.abortController?.abort();

        this.abortController = null;

        /*
         * Final page cleanup.
         */
        this.onUnmount();
        this.showNav();

        this.mounted = false;
    }


    /**
     * Called after the page has been mounted.
     */
    protected abstract onMount(): void;


    /**
     * Called immediately before automatic cleanup.
     *
     * Useful for:
     *
     * - cancelAnimationFrame()
     * - clearInterval()
     * - stopping WebSocket connections
     * - stopping custom loops
     */
    protected onBeforeUnmount(): void {}


    /**
     * Called after page-scoped listeners have been removed.
     *
     * Useful for:
     *
     * - clearing references
     * - destroying child components
     * - releasing custom resources
     */
    protected onUnmount(): void {}


    // =========================================================
    // DOM
    // =========================================================

    /**
     * Root element of the page.
     */
    get root(): HTMLElement {
        return this.element;
    }

    protected hideNav(): void {
        const nav =
            document.querySelector<HTMLElement>(
                siteNavSelector,
            );

        nav?.classList.add("is-hidden");
    }


    protected showNav(): void {
        const nav =
            document.querySelector<HTMLElement>(
                siteNavSelector,
            );

        nav?.classList.remove("is-hidden");
    }


    /**
     * Query an element inside this page.
     */
    protected query<T extends Element>(
        selector: string,
    ): T | null {

        return this.element.querySelector<T>(
            selector,
        );
    }


    /**
     * Query all elements inside this page.
     */
    protected queryAll<T extends Element>(
        selector: string,
    ): NodeListOf<T> {

        return this.element.querySelectorAll<T>(
            selector,
        );
    }


    // =========================================================
    // PAGE STATE
    // =========================================================

    /**
     * Whether this page is currently mounted.
     */
    protected get isMounted(): boolean {
        return this.mounted;
    }


    // =========================================================
    // ABORT SIGNAL
    // =========================================================

    /**
     * Signal for page-scoped operations.
     */
    protected get signal(): AbortSignal {

        if (!this.abortController) {
            throw new Error(
                "Page is not mounted.",
            );
        }

        return this.abortController.signal;
    }


    // =========================================================
    // EVENT LISTENERS
    // =========================================================

    /**
     * Add an event listener that automatically disappears
     * when the page is unmounted.
     */
    protected listen<K extends keyof HTMLElementEventMap>(
        target: HTMLElement,
        type: K,
        listener: (
            this: HTMLElement,
            ev: HTMLElementEventMap[K],
        ) => unknown,
    ): void {

        target.addEventListener(
            type,
            listener,
            {
                signal: this.signal,
            },
        );
    }


    /**
     * Add a page-scoped event listener to window.
     */
    protected listenWindow<K extends keyof WindowEventMap>(
        type: K,
        listener: (
            this: Window,
            ev: WindowEventMap[K],
        ) => unknown,
    ): void {

        window.addEventListener(
            type,
            listener,
            {
                signal: this.signal,
            },
        );
    }


    /**
     * Add a page-scoped event listener to document.
     */
    protected listenDocument<K extends keyof DocumentEventMap>(
        type: K,
        listener: (
            this: Document,
            ev: DocumentEventMap[K],
        ) => unknown,
    ): void {

        document.addEventListener(
            type,
            listener,
            {
                signal: this.signal,
            },
        );
    }


    // =========================================================
    // NAVIGATION
    // =========================================================

    protected navigate(
        path: string,
        options?: NavigationOptions,
    ): Promise<void> {

        return this.context.router.navigate(
            path,
            options,
        );
    }


    protected back(): void {
        this.context.router.back();
    }


    protected forward(): void {
        this.context.router.forward();
    }

    protected get url(): URL {
        return new URL(window.location.href);
    }

    protected get path(): string {
        return window.location.pathname;
    }
}