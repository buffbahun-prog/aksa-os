import { CircuitSvg } from "./CircuitSvg";

export type LevelDirection =
    | "in"
    | "out";

export abstract class LevelledCircuit {

    protected readonly view: CircuitSvg;

    protected level = 0;

    protected readonly maxLevel: number;

    private isAnimating = false;

    constructor(
        maxLevel: number,
    ) {

        this.maxLevel =
            maxLevel;

        this.view =
            new CircuitSvg();
    }

    // =========================================================
    // PUBLIC
    // =========================================================

    get currentLevel(): number {
        return this.level;
    }

    public get getView(): CircuitSvg {
        return this.view;
    }

    get element(): SVGGElement {
        return this.view.element;
    }

    setLevel(
        level: number,
        animate = true,
    ): void {

        const newLevel =
            Math.min(
                this.maxLevel,
                Math.max(0, level),
            );

        if (
            newLevel === this.level ||
            this.isAnimating
        ) {
            return;
        }

        const direction: LevelDirection =
            newLevel > this.level
                ? "in"
                : "out";

        if (!animate) {

            this.level =
                newLevel;

            this.rebuild();

            return;
        }

        this.animateLevelChange(
            newLevel,
            direction,
        );
    }

    // =========================================================
    // REBUILD
    // =========================================================

    private rebuild(): void {

        this.view.clear();

        this.build();

        this.update();
    }

    // =========================================================
    // ANIMATION
    // =========================================================

    private animateLevelChange(
        newLevel: number,
        direction: LevelDirection,
    ): void {

        this.isAnimating = true;

        const group =
            this.view.element;

        const exitScale =
            direction === "in"
                ? 1.12
                : 0.88;

        const enterScale =
            direction === "in"
                ? 0.88
                : 1.12;

        // -----------------------------------------------------
        // EXIT CURRENT LEVEL
        // -----------------------------------------------------

        const exitAnimation =
            group.animate(
                [
                    {
                        transform:
                            "scale(1)",
                        opacity: 1,
                    },
                    {
                        transform:
                            `scale(${exitScale})`,
                        opacity: 0,
                    },
                ],
                {
                    duration: 160,
                    easing:
                        "cubic-bezier(0.4, 0, 1, 1)",
                    fill: "forwards",
                },
            );

        exitAnimation.onfinish =
            () => {

                // ---------------------------------------------
                // Switch level
                // ---------------------------------------------

                this.level =
                    newLevel;

                this.rebuild();

                // ---------------------------------------------
                // Prepare new level
                // ---------------------------------------------

                group.style.transformOrigin =
                    "center center";

                group.style.transform =
                    `scale(${enterScale})`;

                group.style.opacity =
                    "0";

                // ---------------------------------------------
                // ENTER NEW LEVEL
                // ---------------------------------------------

                const enterAnimation =
                    group.animate(
                        [
                            {
                                transform:
                                    `scale(${enterScale})`,
                                opacity: 0,
                            },
                            {
                                transform:
                                    "scale(1)",
                                opacity: 1,
                            },
                        ],
                        {
                            duration: 180,
                            easing:
                                "cubic-bezier(0, 0, 0.2, 1)",
                            fill: "forwards",
                        },
                    );

                enterAnimation.onfinish =
                    () => {

                        group.style.transform =
                            "";

                        group.style.opacity =
                            "1";

                        this.isAnimating =
                            false;
                    };
            };
    }

    // =========================================================
    // SUBCLASS RESPONSIBILITIES
    // =========================================================

    protected abstract build(): void;

    protected abstract update(): void;
}