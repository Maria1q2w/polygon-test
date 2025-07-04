import { createPolygon, removePolygonById } from "./polygonManager";
import { createWorkWrapper, state } from "./script";
import { updateScaleMarkers, updateTransform } from "./transformations";
import { clampOrigin, extractDataTransfer } from "./utils";

export function handleBufferDrop (e) {
    e.preventDefault();
    const { size, sides, shadowHTML } = extractDataTransfer(e);

    const cursorX = e.clientX;
    const cursorY = e.clientY;
    const bufferRect = bufferZone.getBoundingClientRect();
    const left = cursorX - bufferRect.left - size;
    const top = cursorY - bufferRect.top - size;
    const id = e.dataTransfer.getData("text/id");

    const el = createPolygon(sides, size);
    el.style.position = "absolute";
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    bufferZone.appendChild(el);

    requestAnimationFrame(() => el.shadowRoot.innerHTML = shadowHTML);
    if (e.dataTransfer.getData("text/from") === "work" && id) {
        removePolygonById(id);
    }
}

export function handleWorkDrop (e) {
    const { size, sides, shadowHTML } = extractDataTransfer(e);
    createWorkWrapper(sides, size, shadowHTML, e);
}

export function handleMouseDown (e) {
    if (e.target.closest("foreignObject") || e.target.closest("x-polygon")) return;
    state.dragging = true;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    workZone.style.cursor = "grabbing";
}

export function handleMouseMove (e) {
    if (!state.dragging) return;
    state.originX += e.clientX - state.lastX;
    state.originY += e.clientY - state.lastY;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    clampOrigin();
    updateTransform();
}

export function handleZoom (e) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = state.scale * delta;
    if (newScale < 0.5 || newScale > 2.5) return;
    state.scale = newScale;
    updateScaleMarkers();
    updateTransform();
}