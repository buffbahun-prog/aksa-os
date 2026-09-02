import { AndCircuitCard } from "../../../playground/circuit-card/AndCircuitCard";
import { NandCircuitCard } from "../../../playground/circuit-card/NandCircuitCard";
import { NorCircuitCard } from "../../../playground/circuit-card/NorCircuitCard";
import { NotCircuitCard } from "../../../playground/circuit-card/NotCircuitCard";
import { OrCircuitCard } from "../../../playground/circuit-card/OrCircuitCard";
import { XorCircuitCard } from "../../../playground/circuit-card/XorCircuitCard";
import { Page, type PageContext } from "../../../router/Page";

export class GatesPage extends Page {

    private readonly andCard: AndCircuitCard;
    private readonly orCard: OrCircuitCard;
    private readonly notCard: NotCircuitCard;
    private readonly nandCard: NandCircuitCard;
    private readonly norCard: NorCircuitCard;
    private readonly xorCard: XorCircuitCard;


    constructor(
        context: PageContext,
        _params: Record<string, string>,
    ) {

        const template =
            document.getElementById(
                "gates-page-template",
            ) as HTMLTemplateElement | null;


        if (!template) {
            throw new Error(
                "Missing #gates-page-template",
            );
        }


        const element =
            document.importNode(
                template.content,
                true,
            ).firstElementChild;


        if (!(element instanceof HTMLElement)) {
            throw new Error(
                "Gates page template must have an HTMLElement root.",
            );
        }


        super(
            element,
            context,
        );


        this.andCard = new AndCircuitCard();
        this.orCard = new OrCircuitCard();
        this.notCard = new NotCircuitCard();
        this.nandCard = new NandCircuitCard();
        this.norCard = new NorCircuitCard();
        this.xorCard = new XorCircuitCard();
    }


    protected onMount(): void {

        const container =
            this.query<HTMLElement>(
                ".gates-container",
            );


        if (!container) {
            throw new Error(
                "Missing .gates-container",
            );
        }

        const showCircuit = this.url.searchParams.get("circuit") ?? "";

        let card: DocumentFragment | null = null;

        switch (showCircuit) {
            case "and":
                card = this.andCard.getTemplateClone();
                break;
            case "or":
                card = this.orCard.getTemplateClone();
                break;
            case "not":
                card = this.notCard.getTemplateClone();
                break;
            case "xor":
                card = this.xorCard.getTemplateClone();
                break;
            case "nand":
                card = this.nandCard.getTemplateClone();
                break;
            case "nor":
                card = this.norCard.getTemplateClone();
                break;
        }

        if (showCircuit) {
            this.hideNav();
        }

        if (card) {
            container.appendChild(card);
            const header = this.query("header");
            header?.remove();
        } else {
            const h1 = this.query("h1");
            const p = this.query("p");
            if (h1 && p) {
                h1.textContent = "Interactive Logic Gates";
                p.textContent = "Explore how logic gates are constructed.";
            }
            const gatesList = [
                {tmpl: this.andCard.getTemplateClone(), h2: "AND Gate"},
                {tmpl: this.orCard.getTemplateClone(),h2: "OR Gate"},
                {tmpl: this.notCard.getTemplateClone(),h2: "NOT Gate"},
                {tmpl: this.xorCard.getTemplateClone(),h2: "XOR Gate"},
                {tmpl: this.nandCard.getTemplateClone(),h2: "NAND Gate"},
                {tmpl: this.norCard.getTemplateClone(),h2: "NOR Gate"},
            ];
            gatesList.forEach(gl => {
                if (!gl.tmpl) return;
                const div = document.createElement("div");
                div.style.width = "100%";
                div.style.maxWidth = "800px";

                const h2 = document.createElement("h2");
                h2.textContent = gl.h2;
                h2.style.width = "100%";
                h2.style.marginTop = "10px";
                h2.style.fontSize = "26px";
                h2.style.textAlign = "start";

                div.appendChild(h2);
                div.appendChild(gl.tmpl);

                container.appendChild(div);
            })
        }


        this.setupEvents();
    }


    protected onUnmount(): void {

        /*
         * Destroy custom components here.
         */
        // this.xorCard.destroy?.();
    }


    private setupEvents(): void {

        const button =
            this.query<HTMLButtonElement>(
                ".some-button",
            );


        if (!button) {
            return;
        }


        this.listen(
            button,
            "click",
            () => {
                console.log("clicked");
            },
        );
    }
}