import type { Bit } from "../../virtual-machine/types";

export interface Position {
    x: number;
    y: number;
}

export type Orientation = "horz" | "vert";

export interface Size {
    width: number;
    height: number;
}

export interface GateResult {
    gateId: string;
}

export interface BoxResult {
    boxId: string;
}

export interface ConnectorResult {
    connectorId: string;
}

export interface WireResult {
    wireId: string;
}

export interface SwitchResult {
    switchId: string;
}

type GateType =
    | "and"
    | "or"
    | "xor"
    | "nand"
    | "nor"
    | "not";

export interface TextResult {
    textId: string;
}

export interface TextStyle {
    fontSize?: number;
    fontWeight?: string | number;
    anchor?: "start" | "middle" | "end";
    orientation?: "vert" | "hortz";
}

export interface BoxStyle {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    radius?: number;
}


export class CircuitSvg {

    private readonly group: SVGGElement;

    private gateCounter = 0;
    private boxCounter = 0;
    private wireCounter = 0;
    private connectorCounter = 0;
    private switchCounter = 0;

    // =========================================================
    // COLORS
    // =========================================================

    private readonly COLORS = {

    // =========================================================
    // SIGNALS
    // =========================================================

    bit0: "#64748B",
    bit1: "#22C55E",

    // =========================================================
    // GATES
    // =========================================================

    gateFill: "#202938",
    gateStroke: "#8B9BB4",

    // Optional stronger gate outline
    gateStrokeActive: "#A8B8D0",

    // =========================================================
    // SWITCH
    // =========================================================

    switchFill: "#1B2230",
    switchStroke: "#71809A",

};

    private textCounter = 0;

    // ============================================
    // Circuit Transform
    // ============================================

    private x = 0;
    private y = 0;

    // private width = 1;
    // private height = 1;

    private scaleX = 1;
    private scaleY = 1;

    constructor() {

        this.group =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g",
            );

        this.group.dataset.type =
            "circuit";
    }

    // =========================================================
    // PUBLIC SVG
    // =========================================================

    get element(): SVGGElement {
        return this.group;
    }

    // =========================================================
    // ID GENERATORS
    // =========================================================

    private createGateId(): string {
        return `gate-${this.gateCounter++}`;
    }

    private createBoxId(): string {
        return `box-${this.boxCounter++}`;
    }

    private createWireId(): string {
        return `wire-${this.wireCounter++}`;
    }

    private createConnectorId(): string {
        return `connector-${this.connectorCounter++}`;
    }

    private createSwitchId(): string {
        return `switch-${this.switchCounter++}`;
    }

    // =========================================================
    // SVG ELEMENT HELPER
    // =========================================================

    private createSvgElement<
        K extends keyof SVGElementTagNameMap
    >(
        tag: K,
    ): SVGElementTagNameMap[K] {

        return document.createElementNS(
            "http://www.w3.org/2000/svg",
            tag,
        );
    }

    // =========================================================
    // WIRE
    // =========================================================

    addWire(
        position: Position,
        length: number,
        orientation: Orientation,
        strokeWidth = 4,
        display = true,
    ): WireResult {

        const wireId =
            this.createWireId();

        const wire =
            this.createSvgElement("line");

        wire.id = wireId;

        wire.dataset.type = "wire";
        wire.dataset.bit = "0";

        if (!display) wire.setAttribute("display", "none");

        wire.setAttribute(
            "x1",
            String(position.x),
        );

        wire.setAttribute(
            "y1",
            String(position.y),
        );

        if (orientation === "horz") {

            wire.setAttribute(
                "x2",
                String(position.x + length),
            );

            wire.setAttribute(
                "y2",
                String(position.y),
            );

        } else {

            wire.setAttribute(
                "x2",
                String(position.x),
            );

            wire.setAttribute(
                "y2",
                String(position.y + length),
            );
        }

        wire.setAttribute(
            "stroke",
            this.COLORS.bit0,
        );

        wire.setAttribute(
            "stroke-width",
            `${strokeWidth}`,
        );

        wire.setAttribute(
            "stroke-linecap",
            "round",
        );

        this.group.appendChild(wire);

        return {
            wireId,
        };
    }

    private getElementById(
        id: string,
    ): Element | null {

        return this.group.querySelector(
            `#${CSS.escape(id)}`,
        );
    }

    setWireBit(
        wireId: string,
        bit: Bit,
    ): void {

        const wire =
            this.getElementById(
                wireId,
            );

        if (!(wire instanceof SVGLineElement)) {
            throw new Error(
                `Wire '${wireId}' does not exist.`,
            );
        }

        wire.dataset.bit =
            String(bit);

        wire.setAttribute(
            "stroke",
            this.getBitColor(bit),
        );
    }

    // =========================================================
    // CONNECTOR
    // =========================================================

    addConnector(
        position: Position,
        radius = 6,
        display = true,
    ): ConnectorResult {

        const connectorId =
            this.createConnectorId();

        const connector =
            this.createSvgElement("circle");

        connector.id = connectorId;

        if (!display) connector.setAttribute("display", "none");

        connector.dataset.type =
            "connector";

        connector.dataset.bit =
            "0";

        connector.setAttribute(
            "cx",
            String(position.x),
        );

        connector.setAttribute(
            "cy",
            String(position.y),
        );

        connector.setAttribute(
            "r",
            String(radius),
        );

        connector.setAttribute(
            "fill",
            this.COLORS.bit0,
        );

        this.group.appendChild(
            connector,
        );

        return {
            connectorId,
        };
    }

    setConnectorBit(
        connectorId: string,
        bit: Bit,
    ): void {

        const connector =
            this.getElementById(
                connectorId,
            );

        if (!(connector instanceof SVGCircleElement)) {
            throw new Error(
                `Connector '${connectorId}' does not exist.`,
            );
        }

        connector.dataset.bit =
            String(bit);

        connector.setAttribute(
            "fill",
            this.getBitColor(bit),
        );
    }

    // =========================================================
    // GATES
    // =========================================================

    addAndGate(
        position: Position,
        size: Size,
        display = true,
    ): GateResult {

        return this.addGate(
            "and",
            position,
            size,
            display,
        );
    }

    addOrGate(
        position: Position,
        size: Size,
        display = true,
    ): GateResult {

        return this.addGate(
            "or",
            position,
            size,
            display,
        );
    }

    addXorGate(
        position: Position,
        size: Size,
        display = true,
    ): GateResult {

        return this.addGate(
            "xor",
            position,
            size,
            display,
        );
    }

    addNandGate(
        position: Position,
        size: Size,
        display = true,
    ): GateResult {

        return this.addGate(
            "nand",
            position,
            size,
            display,
        );
    }

    addNorGate(
        position: Position,
        size: Size,
        display = true,
    ): GateResult {

        return this.addGate(
            "nor",
            position,
            size,
            display,
        );
    }

    addNotGate(
        position: Position,
        size: Size,
        display = true,
    ): GateResult {

        return this.addGate(
            "not",
            position,
            size,
            display,
        );
    }

    // =========================================================
    // GENERIC GATE CREATOR
    // =========================================================

    private addGate(
        type: GateType,
        position: Position,
        size: Size,
        display = true,
    ): GateResult {

        const gateId =
            this.createGateId();

        const group =
            this.createSvgElement("g");

        group.id = gateId;

        group.dataset.type =
            type;

        if (!display) group.setAttribute("display", "none");

        group.setAttribute(
            "transform",
            `translate(${position.x}, ${position.y})`,
        );

        switch (type) {

            case "and":
                this.drawAndGate(
                    group,
                    size,
                );
                break;

            case "or":
                this.drawOrGate(
                    group,
                    size,
                );
                break;

            case "xor":
                this.drawXorGate(
                    group,
                    size,
                );
                break;

            case "nand":
                this.drawNandGate(
                    group,
                    size,
                );
                break;

            case "nor":
                this.drawNorGate(
                    group,
                    size,
                );
                break;

            case "not":
                this.drawNotGate(
                    group,
                    size,
                );
                break;
        }

        this.group.appendChild(
            group,
        );

        return {
            gateId,
        };
    }

    // =========================================================
    // AND
    // =========================================================

    private drawAndGate(
        group: SVGGElement,
        size: Size,
    ): void {

        const w = size.width;
        const h = size.height;

        const path =
            this.createSvgElement("path");

        path.setAttribute(
            "d",
            `
                M ${-w / 2} ${-h / 2}
                H 0
                A ${w / 2} ${h / 2} 0 0 1 0 ${h / 2}
                H ${-w / 2}
                Z
            `,
        );

        this.styleGate(path);

        group.appendChild(path);
    }

    // =========================================================
    // OR
    // =========================================================

    private drawOrGate(
    group: SVGGElement,
    size: Size,
): void {

    const w = size.width;
    const h = size.height;

    /*
     * Reference OR gate:
     *
     * Original coordinates:
     *
     * left  = 132
     * right = 220
     * top   = 28
     * bottom = 172
     * center = (176, 100)
     *
     * Reference dimensions:
     *
     * width  = 88
     * height = 144
     */

    const sx =
        w / 88;

    const sy =
        h / 144;

    const x =
        (value: number) =>
            (value - 176) * sx;

    const y =
        (value: number) =>
            (value - 100) * sy;

    const path =
        this.createSvgElement("path");

    path.setAttribute(
        "d",
        `
            M ${x(132)} ${y(28)}

            C ${x(165)} ${y(28)},
              ${x(195)} ${y(42)},
              ${x(220)} ${y(100)}

            C ${x(195)} ${y(158)},
              ${x(165)} ${y(172)},
              ${x(132)} ${y(172)}

            C ${x(151)} ${y(145)},
              ${x(158)} ${y(125)},
              ${x(158)} ${y(100)}

            C ${x(158)} ${y(75)},
              ${x(151)} ${y(55)},
              ${x(132)} ${y(28)}

            Z
        `,
    );

    this.styleGate(path);

    group.appendChild(path);
}
    // =========================================================
    // XOR
    // =========================================================

    private drawXorGate(
    group: SVGGElement,
    size: Size,
): void {

    this.drawOrGate(
        group,
        size,
    );

    const w = size.width;
    const h = size.height;

    /*
     * Same reference coordinate system as drawOrGate().
     *
     * OR reference:
     *   center = (176, 100)
     *   width  = 88
     *   height = 144
     */

    const sx =
        w / 88;

    const sy =
        h / 144;

    const x =
        (value: number) =>
            (value - 176) * sx;

    const y =
        (value: number) =>
            (value - 100) * sy;

    const extra =
        this.createSvgElement("path");

    extra.setAttribute(
        "d",
        `
            M ${x(116)} ${y(27)}

            C ${x(136)} ${y(54)},
              ${x(136)} ${y(146)},
              ${x(116)} ${y(173)}
        `,
    );

    extra.setAttribute(
        "fill",
        "none",
    );

    extra.setAttribute(
        "stroke",
        this.COLORS.gateStroke,
    );

    extra.setAttribute(
        "stroke-width",
        "3",
    );

    extra.setAttribute(
        "stroke-linecap",
        "round",
    );

    group.appendChild(extra);
}

    // =========================================================
    // NAND
    // =========================================================

    private drawNandGate(
        group: SVGGElement,
        size: Size,
    ): void {

        this.drawAndGate(
            group,
            size,
        );

        this.drawInversionBubble(
            group,
            size.width / 2 + 10,
        );
    }

    // =========================================================
    // NOR
    // =========================================================

    private drawNorGate(
        group: SVGGElement,
        size: Size,
    ): void {

        this.drawOrGate(
            group,
            size,
        );

        this.drawInversionBubble(
            group,
            size.width / 2 + 10,
        );
    }

    // =========================================================
    // NOT
    // =========================================================

    private drawNotGate(
        group: SVGGElement,
        size: Size,
    ): void {

        const w = size.width;
        const h = size.height;

        const path =
            this.createSvgElement("path");

        path.setAttribute(
            "d",
            `
                M ${-w / 2} ${-h / 2}
                L ${-w / 2} ${h / 2}
                L ${w / 2} 0
                Z
            `,
        );

        this.styleGate(path);

        group.appendChild(path);

        this.drawInversionBubble(
            group,
            w / 2 + 10,
        );
    }

    // =========================================================
    // INVERSION BUBBLE
    // =========================================================

    private drawInversionBubble(
        group: SVGGElement,
        x: number,
    ): void {

        const bubble =
            this.createSvgElement("circle");

        bubble.setAttribute(
            "cx",
            String(x),
        );

        bubble.setAttribute(
            "cy",
            "0",
        );

        bubble.setAttribute(
            "r",
            "9",
        );

        bubble.setAttribute(
            "fill",
            this.COLORS.switchFill,
        );

        bubble.setAttribute(
            "stroke",
            this.COLORS.gateStroke,
        );

        bubble.setAttribute(
            "stroke-width",
            "3",
        );

        group.appendChild(
            bubble,
        );
    }

    // =========================================================
    // SWITCH
    // =========================================================

addSwitch(
    position: Position,
    radius = 24,
    onChange?: (bit: Bit) => void,
): SwitchResult {

    const switchId =
        this.createSwitchId();

    const group =
        this.createSvgElement("g");

    group.id = switchId;

    group.dataset.type = "switch";
    group.dataset.bit = "0";

    group.setAttribute(
        "transform",
        `translate(${position.x}, ${position.y})`,
    );

    group.style.cursor = "pointer";

    // ---------------------------------------------------------
    // Shadow
    // ---------------------------------------------------------

    const shadow =
        this.createSvgElement("circle");

    shadow.setAttribute("cx", "0");
    shadow.setAttribute("cy", "4");
    shadow.setAttribute("r", String(radius));

    shadow.setAttribute(
        "fill",
        "rgba(0, 0, 0, 0.35)",
    );

    shadow.dataset.role =
        "switch-shadow";

    group.appendChild(shadow);

    // ---------------------------------------------------------
    // Button body
    // ---------------------------------------------------------

    const body =
        this.createSvgElement("circle");

    body.setAttribute("cx", "0");
    body.setAttribute("cy", "0");
    body.setAttribute("r", String(radius));

    body.setAttribute(
        "fill",
        this.COLORS.switchFill,
    );

    body.setAttribute(
        "stroke",
        this.COLORS.switchStroke,
    );

    body.setAttribute(
        "stroke-width",
        "3",
    );

    body.dataset.role =
        "switch-body";

    group.appendChild(body);

    // ---------------------------------------------------------
    // Inner recessed area
    // ---------------------------------------------------------

    const inner =
        this.createSvgElement("circle");

    inner.setAttribute("cx", "0");
    inner.setAttribute("cy", "0");

    inner.setAttribute(
        "r",
        String(radius * 0.68),
    );

    inner.setAttribute(
        "fill",
        "transparent",
    );

    inner.setAttribute(
        "stroke",
        this.COLORS.switchStroke,
    );

    inner.setAttribute(
        "stroke-width",
        "2",
    );

    inner.setAttribute(
        "opacity",
        "0.65",
    );

    inner.dataset.role =
        "switch-inner";

    group.appendChild(inner);

    // ---------------------------------------------------------
    // Radio-style state indicator
    // ---------------------------------------------------------

    const dot =
        this.createSvgElement("circle");

    dot.setAttribute("cx", "0");
    dot.setAttribute("cy", "0");

    dot.setAttribute(
        "r",
        String(radius * 0.40),
    );

    dot.setAttribute(
        "fill",
        "transparent",
    );

    dot.dataset.role =
        "switch-dot";

    group.appendChild(dot);

    // ---------------------------------------------------------
    // Top highlight
    // ---------------------------------------------------------

    const highlight =
        this.createSvgElement("ellipse");

    highlight.setAttribute(
        "cx",
        String(-radius * 0.25),
    );

    highlight.setAttribute(
        "cy",
        String(-radius * 0.30),
    );

    highlight.setAttribute(
        "rx",
        String(radius * 0.25),
    );

    highlight.setAttribute(
        "ry",
        String(radius * 0.10),
    );

    highlight.setAttribute(
        "fill",
        "rgba(255, 255, 255, 0.12)",
    );

    highlight.dataset.role =
        "switch-highlight";

    group.appendChild(highlight);

    // ---------------------------------------------------------
    // Hover effect
    // ---------------------------------------------------------

    group.addEventListener(
        "mouseenter",
        () => {

            body.setAttribute(
                "stroke",
                this.COLORS.bit1,
            );

            body.setAttribute(
                "stroke-width",
                "4",
            );
        },
    );

    group.addEventListener(
        "mouseleave",
        () => {

            body.setAttribute(
                "stroke",
                this.COLORS.switchStroke,
            );

            body.setAttribute(
                "stroke-width",
                "3",
            );
        },
    );

    // ---------------------------------------------------------
    // Click listener — attached ONCE
    // ---------------------------------------------------------

    group.addEventListener(
        "click",
        () => {

            const currentBit: Bit =
                group.dataset.bit === "1"
                    ? 1
                    : 0;

            const newBit: Bit =
                currentBit === 0
                    ? 1
                    : 0;

            this.setSwitchBit(
                switchId,
                newBit,
            );

            onChange?.(newBit);
        },
    );

    // ---------------------------------------------------------
    // Add to SVG
    // ---------------------------------------------------------

    this.group.appendChild(group);

    return {
        switchId,
    };
}

    setSwitchBit(
    switchId: string,
    bit: Bit,
): void {

    const group =
        this.getElementById(
            switchId,
        );

    if (!(group instanceof SVGGElement)) {
        throw new Error(
            `Switch '${switchId}' does not exist.`,
        );
    }

    const dot =
        group.querySelector(
            '[data-role="switch-dot"]',
        );

    const shadow =
        group.querySelector(
            '[data-role="switch-shadow"]',
        );

    const inner =
        group.querySelector(
            '[data-role="switch-inner"]',
        );

    if (!(dot instanceof SVGCircleElement)) {
        throw new Error(
            `Switch '${switchId}' has no dot.`,
        );
    }

    group.dataset.bit =
        String(bit);

    if (bit === 1) {

        // ON

        dot.setAttribute(
            "fill",
            this.COLORS.bit1,
        );

        dot.setAttribute(
            "stroke",
            this.COLORS.bit1,
        );

        if (shadow instanceof SVGCircleElement) {
            shadow.setAttribute(
                "cy",
                "2",
            );
        }

        if (inner instanceof SVGCircleElement) {
            inner.setAttribute(
                "stroke",
                this.COLORS.bit1,
            );

            inner.setAttribute(
                "opacity",
                "0.9",
            );
        }

    } else {

        // OFF

        dot.setAttribute(
            "fill",
            "transparent",
        );

        dot.setAttribute(
            "stroke",
            "none",
        );

        if (shadow instanceof SVGCircleElement) {
            shadow.setAttribute(
                "cy",
                "4",
            );
        }

        if (inner instanceof SVGCircleElement) {
            inner.setAttribute(
                "stroke",
                this.COLORS.switchStroke,
            );

            inner.setAttribute(
                "opacity",
                "0.65",
            );
        }
    }
}

    // =========================================================
    // GATE STYLE
    // =========================================================

    private styleGate(
        element: SVGElement,
    ): void {

        element.setAttribute(
            "fill",
            this.COLORS.gateFill,
        );

        element.setAttribute(
            "stroke",
            this.COLORS.gateStroke,
        );

        element.setAttribute(
            "stroke-width",
            "3",
        );

        element.setAttribute(
            "stroke-linejoin",
            "round",
        );
    }

    addBox(
    position: Position,
    size: Size,
    style: BoxStyle = {},
    display = true,
): BoxResult {

    const boxId =
        this.createBoxId();

    const box =
        this.createSvgElement("rect");

    box.id = boxId;

    box.dataset.type =
        "box";

    if (!display) {
        box.setAttribute(
            "display",
            "none",
        );
    }

    box.setAttribute(
        "x",
        String(-size.width / 2),
    );

    box.setAttribute(
        "y",
        String(-size.height / 2),
    );

    box.setAttribute(
        "width",
        String(size.width),
    );

    box.setAttribute(
        "height",
        String(size.height),
    );

    box.setAttribute(
        "rx",
        String(style.radius ?? 8),
    );

    box.setAttribute(
        "fill",
        style.fill ?? this.COLORS.gateFill,
    );

    box.setAttribute(
        "stroke",
        style.stroke ?? this.COLORS.gateStroke,
    );

    box.setAttribute(
        "stroke-width",
        String(style.strokeWidth ?? 3),
    );

    box.setAttribute(
        "transform",
        `translate(${position.x}, ${position.y})`,
    );

    this.group.appendChild(
        box,
    );

    return {
        boxId,
    };
}

    // ========================================================
    // Text Label
    // ========================================================

    private createTextId(): string {
        return `text-${this.textCounter++}`;
    }

    addText(
    position: Position,
    text: string,
    style: TextStyle = {},
): TextResult {

    const textId =
        this.createTextId();

    const element =
        this.createSvgElement("text");

    element.id = textId;

    element.dataset.type =
        "text";

    element.textContent =
        text;

    element.setAttribute(
        "x",
        String(position.x),
    );

    element.setAttribute(
        "y",
        String(position.y),
    );

    element.setAttribute(
        "fill",
        this.COLORS.bit0,
    );

    element.setAttribute(
        "font-size",
        String(style.fontSize ?? 16),
    );

    element.setAttribute(
        "font-weight",
        String(style.fontWeight ?? 500),
    );

    element.setAttribute(
        "text-anchor",
        style.anchor ?? "middle",
    );

    element.setAttribute(
        "transform",
        style.orientation === "vert" ? `rotate(90, ${position.x}, ${position.y})` : ""
    );

    element.setAttribute(
        "dominant-baseline",
        "middle",
    );

    element.style.pointerEvents =
        "none";

    this.group.appendChild(
        element,
    );

    return {
        textId,
    };
}

setText(
    textId: string,
    value: string,
): void {

    const element =
        this.getElementById(
            textId,
        );

    if (!(element instanceof SVGTextElement)) {
        throw new Error(
            `Text '${textId}' does not exist.`,
        );
    }

    element.textContent =
        value;
}

setTextBit(
    textId: string,
    bit: Bit,
): void {

    const element =
        this.getElementById(
            textId,
        );

    if (!(element instanceof SVGTextElement)) {
        throw new Error(
            `Text '${textId}' does not exist.`,
        );
    }

    element.textContent =
        String(bit);

    element.setAttribute(
        "fill",
        this.getBitColor(bit),
    );
}

setTextBitAnimated(
    textId: string,
    bit: Bit,
): void {

    const element =
        this.getElementById(textId);

    if (!(element instanceof SVGTextElement)) {
        throw new Error(
            `Text '${textId}' does not exist.`,
        );
    }

    const oldValue =
        element.textContent ?? "";

    const newValue =
        String(bit);

    if (oldValue === newValue) {
        return;
    }

    // ---------------------------------------------------------
    // Old value
    // ---------------------------------------------------------

    const oldText =
        element.cloneNode(true) as SVGTextElement;

    oldText.textContent =
        oldValue;

    oldText.setAttribute(
        "fill",
        this.getBitColor(
            oldValue === "1" ? 1 : 0,
        ),
    );

    oldText.style.pointerEvents =
        "none";

    oldText.style.transform =
        "translateY(0px)";

    oldText.style.opacity =
        "1";

    // Put the old value above the original.
    this.group.appendChild(
        oldText,
    );

    // ---------------------------------------------------------
    // New value
    // ---------------------------------------------------------

    element.textContent =
        newValue;

    element.setAttribute(
        "fill",
        this.getBitColor(bit),
    );

    element.style.pointerEvents =
        "none";

    element.style.transform =
        "translateY(30px)";

    element.style.opacity =
        "0";

    // ---------------------------------------------------------
    // OLD → UP
    // ---------------------------------------------------------

    const oldAnimation =
        oldText.animate(
            [
                {
                    transform:
                        "translateY(0px)",
                    opacity: 1,
                },
                {
                    transform:
                        "translateY(-30px)",
                    opacity: 0,
                },
            ],
            {
                duration: 220,
                easing:
                    "cubic-bezier(0.4, 0, 1, 1)",
                fill: "forwards",
            },
        );

    // ---------------------------------------------------------
    // NEW → UP INTO POSITION
    // ---------------------------------------------------------

    const newAnimation =
        element.animate(
            [
                {
                    transform:
                        "translateY(30px)",
                    opacity: 0,
                },
                {
                    transform:
                        "translateY(0px)",
                    opacity: 1,
                },
            ],
            {
                duration: 220,
                easing:
                    "cubic-bezier(0, 0, 0.2, 1)",
                fill: "forwards",
            },
        );

    // ---------------------------------------------------------
    // Cleanup
    // ---------------------------------------------------------

    oldAnimation.onfinish =
        () => {
            oldText.remove();
        };

    newAnimation.onfinish =
        () => {

            element.style.transform =
                "";

            element.style.opacity =
                "1";
        };
}

    // ========================================================
    // Circuit Transform
    // ========================================================

    setPosition(
        x: number,
        y: number,
    ): void {

        this.x = x;
        this.y = y;

        this.updateTransform();
    }

    moveBy(
        dx: number,
        dy: number,
    ): void {

        this.x += dx;
        this.y += dy;

        this.updateTransform();
    }

    resize(
        scale: number,
    ): void {

        this.scaleX = scale;
        this.scaleY = scale;

        this.updateTransform();
    }

    private updateTransform(): void {
        this.group.setAttribute(
            "transform",
            `
                translate(${this.x} ${this.y})
                scale(${this.scaleX} ${this.scaleY})
            `,
        );
    }

    // =========================================================
    // UTILITY
    // =========================================================

    private getBitColor(
        bit: Bit,
    ): string {

        return bit === 1
            ? this.COLORS.bit1
            : this.COLORS.bit0;
    }

    clear(): void {
        this.group.replaceChildren();
    }
}