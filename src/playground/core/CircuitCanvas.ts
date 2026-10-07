import type { CircuitSvg } from "./CircuitSvg";

type Point = { x: number; y: number };
type Drag = {
    id: number;
    start: Point;
    anchor: Point;
    moved: boolean;
};
type Pinch = {
    ids: [number, number];
    distance: number;
    zoom: number;
    anchor: Point;
};

export class CircuitCanvas {
    private readonly svg: SVGSVGElement;
    private readonly listeners = new AbortController();
    private width: number;
    private height: number;
    private zoom = 1;
    private panX = 0;
    private panY = 0;
    private spacePressed = false;
    private hovered = false;
    private drag: Drag | null = null;
    private pinch: Pinch | null = null;
    private touchGesture = false;
    private suppressClickUntil = 0;

    constructor(width = 1200, height = 800) {
        this.assertDimension(width);
        this.assertDimension(height);
        this.width = width;
        this.height = height;
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        this.svg.setAttribute("width", "100%");
        this.svg.setAttribute("height", "100%");
        this.svg.setAttribute("tabindex", "0");
        this.svg.setAttribute("role", "group");
        this.svg.setAttribute("aria-label", "Circuit canvas. Drag empty space to move. Hold Space to drag anywhere. Control or Command plus scroll to zoom. On touchscreens, use two fingers to move or pinch to zoom.");
        this.svg.style.display = "block";
        // Keep native one-finger page scrolling. Two-finger TouchEvents are
        // canceled explicitly; touch-action:none would trap page scrolling.
        this.svg.style.touchAction = "auto";
        this.svg.style.userSelect = "none";
        this.updateViewBox();
        this.configureInteractions();
    }

    private configureInteractions(): void {
        const signal = this.listeners.signal;
        const captured = { signal, capture: true };
        this.svg.addEventListener("wheel", this.onWheel, { signal, passive: false });
        this.svg.addEventListener("pointerdown", this.onPointerDown, captured);
        this.svg.addEventListener("pointermove", this.onPointerMove, captured);
        this.svg.addEventListener("pointerup", this.onPointerEnd, captured);
        this.svg.addEventListener("pointercancel", this.onPointerEnd, captured);
        this.svg.addEventListener("lostpointercapture", this.onPointerEnd, captured);
        this.svg.addEventListener("pointerenter", () => { this.hovered = true; }, { signal });
        this.svg.addEventListener("pointerleave", () => {
            this.hovered = false;
            if (!this.drag) this.spacePressed = false;
            this.updateCursor();
        }, { signal });
        this.svg.addEventListener("click", event => {
            if (performance.now() < this.suppressClickUntil) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        }, captured);
        const touchOptions = { signal, capture: true, passive: false };
        this.svg.addEventListener("touchstart", this.onTouchStart, touchOptions);
        this.svg.addEventListener("touchmove", this.onTouchMove, touchOptions);
        this.svg.addEventListener("touchend", this.onTouchEnd, touchOptions);
        this.svg.addEventListener("touchcancel", this.onTouchEnd, touchOptions);
        window.addEventListener("keydown", this.onKeyDown, { signal });
        window.addEventListener("keyup", this.onKeyUp, { signal });
        window.addEventListener("blur", this.resetInteraction, { signal });
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) this.resetInteraction();
        }, { signal });
    }

    private readonly onWheel = (event: WheelEvent): void => {
        if (!(event.ctrlKey || event.metaKey) || !event.cancelable) return;
        event.preventDefault();
        event.stopPropagation();
        const anchor = this.toSvg(event.clientX, event.clientY);
        if (!anchor) return;
        // Normalize line/page wheel units, then bound unusually large deltas.
        const unit = event.deltaMode === 1 ? 16
            : event.deltaMode === 2 ? this.svg.getBoundingClientRect().height : 1;
        const delta = Math.max(-300, Math.min(300, event.deltaY * unit));
        this.zoom = this.clampZoom(this.zoom * Math.exp(-delta * 0.002));
        this.updateViewBox();
        this.anchorAt(anchor, event.clientX, event.clientY);
    };

    private readonly onPointerDown = (event: PointerEvent): void => {
        // Touch uses cooperative TouchEvents below, never mouse-style capture.
        if (event.pointerType === "touch" || event.button !== 0 || this.drag) return;
        this.suppressClickUntil = 0;
        const target = event.target;
        const background = target === this.svg ||
            (target instanceof Element && !!target.closest("[data-canvas-background]"));
        if (!background && !this.spacePressed) return;
        const anchor = this.toSvg(event.clientX, event.clientY);
        if (!anchor) return;
        event.preventDefault();
        event.stopPropagation();
        this.svg.focus({ preventScroll: true });
        this.drag = {
            id: event.pointerId,
            start: { x: event.clientX, y: event.clientY },
            anchor,
            moved: false,
        };
        this.svg.setPointerCapture(event.pointerId);
        this.updateCursor();
    };

    private readonly onPointerMove = (event: PointerEvent): void => {
        const drag = this.drag;
        if (!drag || drag.id !== event.pointerId) return;
        if (!(event.buttons & 1)) { this.endDrag(); return; }
        event.preventDefault();
        event.stopPropagation();
        if (!drag.moved && Math.hypot(event.clientX - drag.start.x, event.clientY - drag.start.y) < 3) return;
        drag.moved = true;
        this.anchorAt(drag.anchor, event.clientX, event.clientY);
    };

    private readonly onPointerEnd = (event: PointerEvent): void => {
        if (this.drag?.id !== event.pointerId) return;
        event.stopPropagation();
        this.endDrag();
    };

    private endDrag(): void {
        const drag = this.drag;
        this.drag = null;
        if (drag) {
            // A navigation gesture must not trigger a component click.
            this.suppressClickUntil = performance.now() + 500;
            if (this.svg.hasPointerCapture(drag.id)) this.svg.releasePointerCapture(drag.id);
        }
        this.updateCursor();
    }

    private ownTouches(event: TouchEvent): Touch[] {
        return Array.from(event.touches).filter(touch =>
            touch.target instanceof Node && this.svg.contains(touch.target));
    }

    private startPinch(touches: Touch[]): void {
        const [a, b] = touches;
        if (!a || !b) { this.pinch = null; return; }
        const anchor = this.toSvg((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);
        if (!anchor) return;
        this.pinch = {
            ids: [a.identifier, b.identifier],
            distance: Math.max(1, Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)),
            zoom: this.zoom,
            anchor,
        };
    }

    private readonly onTouchStart = (event: TouchEvent): void => {
        const touches = this.ownTouches(event);
        if (touches.length === 1 && !this.touchGesture) this.suppressClickUntil = 0;
        if (touches.length < 2 && !this.touchGesture) return;
        // Once native page scrolling has begun, browsers may send events that
        // cannot be canceled. Lift both fingers and start a fresh gesture.
        if (!event.cancelable) return;
        event.preventDefault();
        event.stopPropagation();
        this.touchGesture = true;
        if (!this.pinch) this.startPinch(touches);
    };

    private readonly onTouchMove = (event: TouchEvent): void => {
        if (!this.touchGesture || !event.cancelable) return;
        event.preventDefault();
        event.stopPropagation();
        const touches = this.ownTouches(event);
        const pinch = this.pinch;
        if (!pinch) { this.startPinch(touches); return; }
        const a = touches.find(t => t.identifier === pinch.ids[0]);
        const b = touches.find(t => t.identifier === pinch.ids[1]);
        if (!a || !b) { this.startPinch(touches); return; }
        const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        this.zoom = this.clampZoom(pinch.zoom * distance / pinch.distance);
        this.updateViewBox();
        this.anchorAt(pinch.anchor, (a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);
    };

    private readonly onTouchEnd = (event: TouchEvent): void => {
        if (!this.touchGesture) return;
        if (event.cancelable) event.preventDefault();
        event.stopPropagation();
        this.suppressClickUntil = performance.now() + 700;
        const touches = this.ownTouches(event);
        // Rebase after a finger is lifted/replaced to avoid camera jumps.
        this.pinch = null;
        if (touches.length >= 2) this.startPinch(touches);
        if (touches.length === 0) this.touchGesture = false;
    };

    private readonly onKeyDown = (event: KeyboardEvent): void => {
        if (event.code !== "Space" || event.ctrlKey || event.metaKey || event.altKey) return;
        const target = event.target;
        if (target instanceof Element && target.closest(
            "input, textarea, select, button, a[href], [contenteditable]:not([contenteditable='false']), [role='textbox'], [role='button']",
        )) return;
        if (!this.hovered && document.activeElement !== this.svg && !this.drag) return;
        event.preventDefault();
        this.spacePressed = true;
        this.updateCursor();
    };

    private readonly onKeyUp = (event: KeyboardEvent): void => {
        if (event.code !== "Space") return;
        this.spacePressed = false;
        this.updateCursor();
    };

    private readonly resetInteraction = (): void => {
        this.spacePressed = false;
        this.hovered = false;
        this.endDrag();
        this.pinch = null;
        this.touchGesture = false;
    };

    private updateCursor(): void {
        const cursor = this.drag ? "grabbing" : this.spacePressed ? "grab" : "";
        this.svg.style.cursor = cursor;
        if (cursor) this.svg.dataset.canvasNavigation = cursor;
        else delete this.svg.dataset.canvasNavigation;
    }

    private toSvg(clientX: number, clientY: number): Point | null {
        const matrix = this.svg.getScreenCTM();
        if (!matrix) return null;
        const point = this.svg.createSVGPoint();
        point.x = clientX;
        point.y = clientY;
        try {
            const result = point.matrixTransform(matrix.inverse());
            return Number.isFinite(result.x) && Number.isFinite(result.y) ? result : null;
        } catch { return null; }
    }

    private anchorAt(anchor: Point, clientX: number, clientY: number): void {
        const point = this.toSvg(clientX, clientY);
        if (!point) return;
        this.panX += anchor.x - point.x;
        this.panY += anchor.y - point.y;
        this.updateViewBox();
    }

    private clampZoom(zoom: number): number {
    return Number.isFinite(zoom)
        ? Math.max(0.01, Math.min(30, zoom))
        : this.zoom;
}

    private zoomAroundCenter(zoom: number): void {
        const next = this.clampZoom(zoom);
        this.panX += this.width / this.zoom / 2 - this.width / next / 2;
        this.panY += this.height / this.zoom / 2 - this.height / next / 2;
        this.zoom = next;
        this.updateViewBox();
    }

    // Preserve the original preset API: setZoom leaves the origin unchanged.
    setZoom(zoom: number): void { this.zoom = this.clampZoom(zoom); this.updateViewBox(); }
    zoomIn(): void { this.zoomAroundCenter(this.zoom * 1.2); }
    zoomOut(): void { this.zoomAroundCenter(this.zoom / 1.2); }
    pan(dx: number, dy: number): void {
        if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
        this.panX += dx / this.zoom;
        this.panY += dy / this.zoom;
        this.updateViewBox();
    }
    panLeft(): void { this.pan(-100, 0); }
    panRight(): void { this.pan(100, 0); }
    panUp(): void { this.pan(0, -100); }
    panDown(): void { this.pan(0, 100); }
    setPosition(x: number, y: number): void {
        if (!Number.isFinite(x) || !Number.isFinite(y)) return;
        this.panX = x;
        this.panY = y;
        this.updateViewBox();
    }
    private updateViewBox(): void {
        this.svg.setAttribute("viewBox", `${this.panX} ${this.panY} ${this.width / this.zoom} ${this.height / this.zoom}`);
    }
    private assertDimension(value: number): void {
        if (!Number.isFinite(value) || value <= 0) throw new RangeError("Canvas dimensions must be positive, finite numbers.");
    }
    setWidth(width: number): void { this.assertDimension(width); this.width = width; this.updateViewBox(); }
    setHeight(height: number): void { this.assertDimension(height); this.height = height; this.updateViewBox(); }
    get element(): SVGSVGElement { return this.svg; }
    add(circuit: CircuitSvg): void { this.svg.appendChild(circuit.element); }
    remove(circuit: CircuitSvg): void { circuit.element.remove(); }
    clear(): void { this.svg.replaceChildren(); }

    /** Call when the owning card is permanently removed. Safe to call twice. */
    destroy(): void {
        this.resetInteraction();
        this.listeners.abort();
    }
}
