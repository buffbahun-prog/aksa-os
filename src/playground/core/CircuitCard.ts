import { CircuitCanvas } from "../core/CircuitCanvas";
import type { CircuitSvg } from "./CircuitSvg";
export const circuitCardTmplId = "circuitCardTmpl";
export const circuitCardSvgCont = ".circuit-card__viewport";
export const stepBtnTmpl = ".stepTmpl";
export const stepperBtnCont = ".inspection-stepper";
export const stepperArrowPrev = ".arrow-prev";
export const stepperArrowNext = ".arrow-next";
export const zoomInBtn = ".zoom-in";
export const zoomOutBtn = ".zoom-out";
export const panLeftBtn = ".pan-left";
export const panRightBtn = ".pan-right";
export const panUpBtn = ".pan-up";
export const panDownBtn = ".pan-down";
export interface CircuitLevel {
    position: {
        x: number;
        y: number;
    };
    zoom: number;
}
export interface CircuitCardConfig {
    levels: CircuitLevel[];
    initialLevel?: number;
}
export interface CircuitCardCircuit {
    currentLevel: number;
    setLevel(level: number): void;
    getView: CircuitSvg;
}
export abstract class CircuitCard<
    T extends CircuitCardCircuit
> {
    protected readonly canvas: CircuitCanvas;
    protected readonly circuit: T;
    protected readonly levels: CircuitLevel[];
    protected currentLevel: number;
    protected templateClone:
        DocumentFragment | null = null;
    // =========================================================
    // Stepper
    // =========================================================
    private readonly listeners = new AbortController();
    private stepperElement: HTMLElement | null = null;
    private gestureHint: HTMLParagraphElement | null = null;
    private stepButtons: HTMLButtonElement[] = [];
    private prevButton: Element | null = null;
    private nextButton: Element | null = null;
    // =========================================================
    // Camera
    // =========================================================
    private zoomInButton: Element | null = null;
    private zoomOutButton: Element | null = null;
    private panLeftButton: Element | null = null;
    private panRightButton: Element | null = null;
    private panUpButton: Element | null = null;
    private panDownButton: Element | null = null;
    protected constructor(
        circuit: T,
        config: CircuitCardConfig,
        width = 1200,
        height = 800,
    ) {
        this.circuit = circuit;
        this.levels = config.levels;
        this.currentLevel =
            config.initialLevel ??
            circuit.currentLevel ??
            0;
        // -----------------------------------------------------
        // Canvas
        // -----------------------------------------------------
        this.canvas =
            new CircuitCanvas(
                width,
                height,
            );
        this.canvas.add(
            circuit.getView,
        );
        // -----------------------------------------------------
        // Template
        // -----------------------------------------------------
        this.loadTemplate();
        this.configureTemplate();
        // -----------------------------------------------------
        // Controls
        // -----------------------------------------------------
        this.configureStepper();
        this.configureCamera();
        // -----------------------------------------------------
        // Initial state
        // -----------------------------------------------------
        const initialConfig = this.levels[this.currentLevel];

        if (initialConfig) {
            this.canvas.setZoom(initialConfig.zoom);
            this.canvas.setPosition(
                initialConfig.position.x,
                initialConfig.position.y,
            )
        }
        this.applyLevel(
            this.currentLevel,
        );
        this.syncStepper();
    }
    // =========================================================
    // Template
    // =========================================================
    private loadTemplate(): void {
        const template =
            document.getElementById(
                circuitCardTmplId,
            ) as HTMLTemplateElement | null;
        if (!template) {
            console.error(
                `Can't find circuit card template: #${circuitCardTmplId}`,
            );
            return;
        }
        this.templateClone =
            document.importNode(
                template.content,
                true,
            );
    }
    private configureTemplate(): void {
        if (!this.templateClone) {
            return;
        }
        const svgContainer =
            this.templateClone.querySelector(
                circuitCardSvgCont,
            );
        if (!svgContainer) {
            console.error(
                `Can't find SVG container: ${circuitCardSvgCont}`,
            );
            return;
        }
        svgContainer.appendChild(
            this.canvas.element,
        );
        // Outside the SVG viewport, so it cannot cover circuit controls.
        this.gestureHint = document.createElement("p");
        this.gestureHint.className = "circuit-card__gesture-hint";
        this.gestureHint.textContent = "Drag empty space to move · Space + drag anywhere · Ctrl/⌘ + scroll to zoom · Touch: two fingers to move or pinch to zoom";
        svgContainer.insertAdjacentElement("afterend", this.gestureHint);
    }
    // =========================================================
    // Stepper
    // =========================================================
    private configureStepper(): void {
        if (!this.templateClone) {
            return;
        }
        const stepTemplate =
            this.templateClone.querySelector(
                stepBtnTmpl,
            ) as HTMLTemplateElement | null;
        if (!stepTemplate) {
            console.error(
                `Can't find step button template: ${stepBtnTmpl}`,
            );
            return;
        }
        const stepperContainer =
            this.templateClone.querySelector(
                stepperBtnCont,
            );
        if (!stepperContainer) {
            console.error(
                `Can't find stepper container: ${stepperBtnCont}`,
            );
            return;
        }
        // -----------------------------------------------------
        // Create level buttons
        // -----------------------------------------------------
        this.stepperElement = stepperContainer as HTMLElement;
        this.stepButtons = [];
        this.levels.forEach(
            (_, level) => {
                const fragment =
                    document.importNode(
                        stepTemplate.content,
                        true,
                    );
                const button =
                    fragment.firstElementChild as HTMLButtonElement | null;
                if (!button) {
                    console.error(
                        "Step template has no root element.",
                    );
                    return;
                }
                button.dataset.level =
                    String(level);
                stepperContainer.appendChild(
                    button,
                );
                this.stepButtons.push(
                    button,
                );
            },
        );
        // -----------------------------------------------------
        // Level button events
        // -----------------------------------------------------
        this.stepButtons.forEach(
            button => {
                button.addEventListener(
                    "click",
                    () => {
                        const level =
                            Number(
                                button.dataset.level,
                            );
                        this.setLevel(
                            level,
                        );
                    },
                    { signal: this.listeners.signal },
                );
            },
        );
        // -----------------------------------------------------
        // Navigation buttons
        // -----------------------------------------------------
        this.prevButton =
            this.templateClone.querySelector(
                stepperArrowPrev,
            );
        this.nextButton =
            this.templateClone.querySelector(
                stepperArrowNext,
            );
        this.prevButton?.addEventListener(
            "click",
            () => {
                this.setLevel(
                    this.currentLevel - 1,
                );
            },
            { signal: this.listeners.signal },
        );
        this.nextButton?.addEventListener(
            "click",
            () => {
                this.setLevel(
                    this.currentLevel + 1,
                );
            },
            { signal: this.listeners.signal },
        );
    }
    // =========================================================
    // Camera
    // =========================================================
    private configureCamera(): void {
        if (!this.templateClone) {
            return;
        }
        this.zoomInButton =
            this.templateClone.querySelector(
                zoomInBtn,
            );
        this.zoomOutButton =
            this.templateClone.querySelector(
                zoomOutBtn,
            );
        this.panLeftButton =
            this.templateClone.querySelector(
                panLeftBtn,
            );
        this.panRightButton =
            this.templateClone.querySelector(
                panRightBtn,
            );
        this.panUpButton =
            this.templateClone.querySelector(
                panUpBtn,
            );
        this.panDownButton =
            this.templateClone.querySelector(
                panDownBtn,
            );
        // -----------------------------------------------------
        // Zoom
        // -----------------------------------------------------
        this.zoomInButton?.addEventListener(
            "click",
            () => {
                this.canvas.zoomIn();
            },
            { signal: this.listeners.signal },
        );
        this.zoomOutButton?.addEventListener(
            "click",
            () => {
                this.canvas.zoomOut();
            },
            { signal: this.listeners.signal },
        );
        // -----------------------------------------------------
        // Pan
        // -----------------------------------------------------
        this.panLeftButton?.addEventListener(
            "click",
            () => {
                this.canvas.panLeft();
            },
            { signal: this.listeners.signal },
        );
        this.panRightButton?.addEventListener(
            "click",
            () => {
                this.canvas.panRight();
            },
            { signal: this.listeners.signal },
        );
        this.panUpButton?.addEventListener(
            "click",
            () => {
                this.canvas.panUp();
            },
            { signal: this.listeners.signal },
        );
        this.panDownButton?.addEventListener(
            "click",
            () => {
                this.canvas.panDown();
            },
            { signal: this.listeners.signal },
        );
    }
    // =========================================================
    // Level
    // =========================================================
    protected setLevel(
        level: number,
    ): void {
        const maxLevel =
            this.levels.length - 1;
        const nextLevel =
            Math.max(
                0,
                Math.min(
                    maxLevel,
                    level,
                ),
            );
        if (
            nextLevel ===
            this.currentLevel
        ) {
            return;
        }
        this.currentLevel =
            nextLevel;
        this.applyLevel(
            this.currentLevel,
        );
        this.syncStepper();
    }
    private applyLevel(
        level: number,
    ): void {
        const levelConfig =
            this.levels[level];
        if (!levelConfig) {
            return;
        }
        // -----------------------------------------------------
        // Circuit
        // -----------------------------------------------------
        this.circuit.setLevel(
            level,
        );
        // -----------------------------------------------------
        // Camera
        // -----------------------------------------------------
        // this.canvas.setZoom(
        //     levelConfig.zoom,
        // );
        // this.canvas.setPosition(
        //     levelConfig.position.x,
        //     levelConfig.position.y,
        // );
    }
    // =========================================================
    // Stepper state
    // =========================================================
    private syncStepper(): void {
        this.stepButtons.forEach(
            (button, level) => {
                button.classList.toggle(
                    "active",
                    level === this.currentLevel,
                );
                button.classList.toggle(
                    "visited",
                    level < this.currentLevel,
                );
            },
        );
        // -----------------------------------------------------
        // Previous
        // -----------------------------------------------------
        if (
            this.prevButton instanceof
            HTMLButtonElement
        ) {
            this.prevButton.disabled =
                this.currentLevel <= 0;
        }
        // -----------------------------------------------------
        // Next
        // -----------------------------------------------------
        if (
            this.nextButton instanceof
            HTMLButtonElement
        ) {
            this.nextButton.disabled =
                this.currentLevel >=
                this.levels.length - 1;
        }
        // -----------------------------------------------------
        // Progress
        // -----------------------------------------------------
        // A DocumentFragment is empty after it is mounted: retain this node.
        const stepper = this.stepperElement;
        if (!stepper) {
            return;
        }
        const maxLevel =
            this.levels.length - 1;
        const progress =
            maxLevel === 0
                ? 0
                : (
                    this.currentLevel /
                    maxLevel
                ) * 100;
        (
            stepper as HTMLElement
        ).style.setProperty(
            "--progress",
            `${progress}%`,
        );
    }
    // =========================================================
    // Public
    // =========================================================
    getTemplateClone():
        DocumentFragment | null {
        return this.templateClone;
    }
    getCanvas(): CircuitCanvas {
        return this.canvas;
    }
    getLevel(): number {
        return this.currentLevel;
    }
    /** Call before permanently removing this card from the page. */
    destroy(): void {
        this.listeners.abort();
        this.canvas.destroy();
        this.gestureHint?.remove();
    }

}
