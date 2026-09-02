import {
    Page,
    type PageContext,
} from "../router/Page";


export class NotFoundPage extends Page {

    constructor(
        context: PageContext,
        _params: Record<string, string>,
    ) {

        const element =
            document.createElement("main");

        element.className =
            "not-found-page";

        element.innerHTML = `
            <div class="not-found-page__content">

                <div class="not-found-page__code">
                    404
                </div>

                <h1>
                    Page not found
                </h1>

                <p>
                    The page you're looking for
                    doesn't exist or has been moved.
                </p>

                <button
                    class="not-found-page__home"
                    type="button"
                >
                    Go home
                </button>

            </div>
        `;

        super(
            element,
            context,
        );
    }


    protected onMount(): void {

        const homeButton =
            this.query<HTMLButtonElement>(
                ".not-found-page__home",
            );

        if (!homeButton) {
            return;
        }

        this.listen(
            homeButton,
            "click",
            () => {
                this.navigate("/");
            },
        );
    }
}