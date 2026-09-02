import type { CircuitSvg } from "./CircuitSvg";

export class CircuitCanvas {

    private readonly svg: SVGSVGElement;

    private width: number;
    private height: number;

    private zoom = 1;

    private panX = 0;
    private panY = 0;

    constructor(
        width = 1200,
        height = 800,
    ) {

        this.width = width;
        this.height = height;

        this.svg =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg",
            );

        this.svg.setAttribute(
            "xmlns",
            "http://www.w3.org/2000/svg",
        );

        this.svg.setAttribute(
            "width",
            "100%",
        );

        this.svg.setAttribute(
            "height",
            "100%",
        );

        this.updateViewBox();
    }

    private zoomAroundCenter(
    zoom: number,
): void {

    const newZoom =
        Math.max(
            0.25,
            Math.min(
                4,
                zoom,
            ),
        );

    // Current visible area
    const oldViewWidth =
        this.width / this.zoom;

    const oldViewHeight =
        this.height / this.zoom;

    // Current center
    const centerX =
        this.panX +
        oldViewWidth / 2;

    const centerY =
        this.panY +
        oldViewHeight / 2;

    // New visible area
    const newViewWidth =
        this.width / newZoom;

    const newViewHeight =
        this.height / newZoom;

    // Keep the same center
    this.panX =
        centerX -
        newViewWidth / 2;

    this.panY =
        centerY -
        newViewHeight / 2;

    this.zoom =
        newZoom;

    this.updateViewBox();
}

    setZoom(zoom: number): void {

        this.zoom =
            Math.max(
                0.25,
                Math.min(
                    4,
                    zoom,
                ),
            );

        this.updateViewBox();
    }

    zoomIn(): void {

    this.zoomAroundCenter(
        this.zoom * 1.2,
    );
}

zoomOut(): void {

    this.zoomAroundCenter(
        this.zoom / 1.2,
    );
}

    pan(
    dx: number,
    dy: number,
): void {

    this.panX +=
        dx / this.zoom;

    this.panY +=
        dy / this.zoom;

    this.updateViewBox();
}

    panLeft(): void {
    this.pan(-100, 0);
}

panRight(): void {
    this.pan(100, 0);
}

panUp(): void {
    this.pan(0, -100);
}

panDown(): void {
    this.pan(0, 100);
}

setPosition(
    x: number,
    y: number,
): void {

    this.panX = x;
    this.panY = y;

    this.updateViewBox();
}

    private updateViewBox(): void {

        const viewWidth =
            this.width / this.zoom;

        const viewHeight =
            this.height / this.zoom;

        this.svg.setAttribute(
            "viewBox",
            `${this.panX} ${this.panY} ${viewWidth} ${viewHeight}`,
        );
    }

    setWidth(width: number): void {
        this.width = width;

        this.svg.setAttribute(
            "viewBox",
            `0 0 ${this.width} ${this.height}`,
        );
    }

    setHeight(height: number): void {
        this.height = height;

        this.svg.setAttribute(
            "viewBox",
            `0 0 ${this.width} ${this.height}`,
        );
    }

    get element(): SVGSVGElement {
        return this.svg;
    }

    add(
        circuit: CircuitSvg,
    ): void {

        this.svg.appendChild(
            circuit.element,
        );
    }

    remove(
        circuit: CircuitSvg,
    ): void {

        circuit.element.remove();
    }

    clear(): void {
        this.svg.replaceChildren();
    }
}