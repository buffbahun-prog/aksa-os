import { ALU1BitCircuitCard } from "../../../playground/circuit-card/ALU1BitCircuitCard";
// import { ALUCircuitCard } from "../../../playground/circuit-card/ALUCircuitCard";
import { Page, type PageContext } from "../../../router/Page";

export class ALUPage extends Page {

    // private readonly aluCard: ALUCircuitCard;
    private readonly alu1BitCard: ALU1BitCircuitCard;


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


        // this.aluCard = new ALUCircuitCard();
        this.alu1BitCard = new ALU1BitCircuitCard();
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
            // for embeded in ifram content
            case "alu-1-bit":
                card = this.alu1BitCard.getTemplateClone();
                break;
            // case "alu":
            //     card = this.aluCard.getTemplateClone();
            //     break;
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
                h1.textContent = "Interactive Arithmetic Circuits";
                p.textContent = "Explore how arithmetics are constructed and performed with combinations of Logic Gates.";
            }
            const gatesList = [
                {tmpl: this.alu1BitCard.getTemplateClone(), h2: "1-Bit-A.L.U."},
                // {tmpl: this.aluCard.getTemplateClone(), h2: "A.L.U."},
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