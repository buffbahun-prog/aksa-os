import {
    Page,
    type PageContext,
} from "../router/Page";


const homePageTmplId = "homePageTmpl";
const playgroundCardTmplId = "playgroundCardTmpl";

// const playgroundGridSelector = ".playground-grid";

interface PlaygroundSection {
    title: string;
    description: string;
    playgrounds: Playground[];
}

interface Playground {
    title: string;
    description: string;
    route: string;
    icon: string;
}

const sections: PlaygroundSection[] = [
    {
        title: "Hardware",
        description:
            "Build computers from logic gates to processors, memory and complete digital systems.",
        playgrounds: [

    {
        title: "Logic Gates",
        description:
            "Explore AND, OR, NOT, XOR and other fundamental logic gates.",
        route: "/playground/gates",
        icon: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M4 5h5.5a7 7 0 0 1 0 14H4V5Z" />
                <path d="M4 9H2" />
                <path d="M4 15H2" />
                <path d="M16 12h6" />
            </svg>
        `,
    },

    {
        title: "Arithmetic",
        description:
            "Experiment with adders, subtractors and arithmetic circuits.",
        route: "/playground/arithmetic",
        icon: `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
                <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="4"
                />
            </svg>
        `,
    },

    // {
    //     title: "Shifters & Rotators",
    //     description:
    //         "Visualize barrel shifters, rotations and shift operations.",
    //     route: "/playground/shifters",
    //     icon: `
    //         <svg
    //             viewBox="0 0 24 24"
    //             aria-hidden="true"
    //         >
    //             <path d="M5 8h10" />
    //             <path d="m12 5 3 3-3 3" />
    //             <path d="M19 16H9" />
    //             <path d="m12 13-3 3 3 3" />
    //         </svg>
    //     `,
    // },

    // {
    //     title: "ALU",
    //     description:
    //         "Build toward a complete arithmetic and logic unit.",
    //     route: "/playground/alu",
    //     icon: `
    //         <svg
    //             viewBox="0 0 24 24"
    //             aria-hidden="true"
    //         >
    //             <rect
    //                 x="4"
    //                 y="4"
    //                 width="16"
    //                 height="16"
    //                 rx="3"
    //             />
    //             <path d="M8 9h8" />
    //             <path d="M8 12h8" />
    //             <path d="M8 15h5" />
    //         </svg>
    //     `,
    // },

],
    },

//     {
//         title: "Operating System",
//         description:
//             "Build an operating system from first principles, from the kernel to user-space programs.",
//         playgrounds: [
//     {
//         title: "Kernel",
//         description:
//             "Explore processes, memory, interrupts and the core of an operating system.",
//         route: "/os/kernel",
//         icon: `
//             <svg
//                 viewBox="0 0 24 24"
//                 aria-hidden="true"
//             >
//                 <rect x="4" y="4" width="16" height="16" rx="3" />
//                 <path d="M8 8h8" />
//                 <path d="M8 12h8" />
//                 <path d="M8 16h5" />
//                 <path d="M2 9h2" />
//                 <path d="M2 15h2" />
//                 <path d="M20 9h2" />
//                 <path d="M20 15h2" />
//             </svg>
//         `,
//     },

//     {
//         title: "Memory",
//         description:
//             "Experiment with virtual memory, allocation, paging and address translation.",
//         route: "/os/memory",
//         icon: `
//             <svg
//                 viewBox="0 0 24 24"
//                 aria-hidden="true"
//             >
//                 <rect x="3" y="6" width="18" height="12" rx="2" />
//                 <path d="M7 9v6" />
//                 <path d="M10 9v6" />
//                 <path d="M14 9v6" />
//                 <path d="M17 9v6" />
//                 <path d="M6 3v3" />
//                 <path d="M10 3v3" />
//                 <path d="M14 3v3" />
//                 <path d="M18 3v3" />
//                 <path d="M6 18v3" />
//                 <path d="M10 18v3" />
//                 <path d="M14 18v3" />
//                 <path d="M18 18v3" />
//             </svg>
//         `,
//     },

//     {
//         title: "Storage",
//         description:
//             "Build filesystems, block storage and persistent data from the ground up.",
//         route: "/os/storage",
//         icon: `
//             <svg
//                 viewBox="0 0 24 24"
//                 aria-hidden="true"
//             >
//                 <rect x="4" y="4" width="16" height="16" rx="2" />
//                 <path d="M8 8h8" />
//                 <path d="M8 12h8" />
//                 <path d="M8 16h5" />
//             </svg>
//         `,
//     },

//     {
//         title: "Processes",
//         description:
//             "Understand process creation, scheduling, context switching and execution.",
//         route: "/os/processes",
//         icon: `
//             <svg
//                 viewBox="0 0 24 24"
//                 aria-hidden="true"
//             >
//                 <rect x="3" y="5" width="7" height="6" rx="1.5" />
//                 <rect x="14" y="13" width="7" height="6" rx="1.5" />
//                 <path d="M10 8h4a2 2 0 0 1 2 2v3" />
//                 <path d="m13 11 3 3 3-3" />
//             </svg>
//         `,
//     },
// ],
//     },
];


export class HomePage extends Page {

    constructor(
        context: PageContext,
        _params: Record<string, string>,
    ) {

        const template =
            document.getElementById(
                homePageTmplId,
            ) as HTMLTemplateElement | null;

        if (!template) {
            throw new Error(
                `Template #${homePageTmplId} not found`,
            );
        }

        const element =
            document.importNode(
                template.content,
                true,
            ).firstElementChild as HTMLElement | null;

        if (!element) {
            throw new Error(
                `HTML Element with template id #${homePageTmplId} not found`,
            );
        }

        super(
            element,
            context,
        );

        this.createSections();
    }


    protected onMount(): void {

        const cards =
            this.queryAll<HTMLButtonElement>(
                ".playground-card",
            );

        cards.forEach((card) => {

            this.listen(
                card,
                "click",
                () => {

                    const route =
                        card.dataset.route;

                    if (!route) {
                        return;
                    }

                    this.navigate(route);
                },
            );

        });
    }


    private createPlaygroundCards(
    grid: Element,
    playgrounds: Playground[],
): void {

    const template =
        document.getElementById(
            playgroundCardTmplId,
        ) as HTMLTemplateElement | null;

    if (!template) {
        throw new Error(
            `Template #${playgroundCardTmplId} not found`,
        );
    }

    for (const playground of playgrounds) {

        const card =
            document.importNode(
                template.content,
                true,
            );

        const button =
            card.firstElementChild as HTMLButtonElement;

        button.dataset.route =
            playground.route;

        const title =
            button.querySelector(
                ".playground-card__title",
            );

        if (title) {
            title.textContent =
                playground.title;
        }

        const description =
            button.querySelector(
                ".playground-card__description",
            );

        if (description) {
            description.textContent =
                playground.description;
        }

        const icon =
            button.querySelector(
                ".playground-card__icon",
            );

        if (icon) {
            icon.innerHTML =
                playground.icon;
        }

        grid.appendChild(card);
    }
}

    private createSections(): void {

    const container =
        this.query<HTMLElement>(
            ".playground-sections",
        );

    if (!container) {
        throw new Error(
            `Playground sections container not found`,
        );
    }

    const sectionTemplate =
        document.getElementById(
            "playgroundSectionTmpl",
        ) as HTMLTemplateElement | null;

    if (!sectionTemplate) {
        throw new Error(
            `Template #playgroundSectionTmpl not found`,
        );
    }

    for (const section of sections) {

        const sectionElement =
            document.importNode(
                sectionTemplate.content,
                true,
            );

        const sectionTitle =
            sectionElement.querySelector(
                ".playground-section__title",
            );

        if (sectionTitle) {
            sectionTitle.textContent =
                section.title;
        }

        const sectionDescription =
            sectionElement.querySelector(
                ".playground-section__description",
            );

        if (sectionDescription) {
            sectionDescription.textContent =
                section.description;
        }

        const grid =
            sectionElement.querySelector(
                ".playground-grid",
            );

        if (!grid) {
            throw new Error(
                `Playground grid not found`,
            );
        }

        this.createPlaygroundCards(
            grid,
            section.playgrounds,
        );

        container.appendChild(
            sectionElement,
        );
    }
}
}