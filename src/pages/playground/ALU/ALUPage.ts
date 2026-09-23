import { ALU1BitCircuitCard } from "../../../playground/circuit-card/ALU1BitCircuitCard";
import { ALU8BitsCircuitCard } from "../../../playground/circuit-card/ALUCircuitCard";
import { Page, type PageContext } from "../../../router/Page";

export class ALUPage extends Page {

    private readonly alu8BitsCard: ALU8BitsCircuitCard;
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


        this.alu8BitsCard = new ALU8BitsCircuitCard();
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
            case "alu-8-bit":
                card = this.alu8BitsCard.getTemplateClone();
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
                h1.textContent = "Interactive ALU Circuits";
                p.textContent = "Explore how an Arithmetic Logic Unit (ALU) performs arithmetic and logical operations. Experiment with AND, OR, XOR, PASS B, addition, subtraction, signed comparison (SLT), and unsigned comparison (SLTU). Change the input values and operation code to observe how the ALU produces its results.";
            }
            const gatesList = [
                {tmpl: this.alu1BitCard.getTemplateClone(), h2: "1-Bit-A.L.U."},
                {tmpl: this.alu8BitsCard.getTemplateClone(), h2: "A.L.U. 8 Bits"},
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