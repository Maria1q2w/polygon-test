import './../components/polygonComponents';
import { handleBufferDrop, handleMouseDown, handleMouseMove, handleWorkDrop, handleZoom } from './eventHandlers.js';
import { createPolygon, polygonMap } from './polygonManager.js';
import './scriptLocalStorage.js';
import { updateTransform } from './transformations.js';
import { findFreePosition, getSVGCoords } from './utils.js';

const bufferZone = document.getElementById("bufferZone");
const workZone = document.getElementById("workZone");
const createBtn = document.getElementById("createBtn");


export const state = {
    scale: 1,
    originX: 0,
    originY: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
};

export { bufferZone, workZone, createBtn };

createBtn.addEventListener("click", generatePolygons);
bufferZone.addEventListener("dragover", e => e.preventDefault());
bufferZone.addEventListener("drop", handleBufferDrop);
workZone.addEventListener("dragover", e => e.preventDefault());
workZone.addEventListener("drop", handleWorkDrop);
workZone.addEventListener("mousedown", handleMouseDown);
window.addEventListener("mouseup", () => {
    state.dragging = false;
    workZone.style.cursor = "grab";
});
window.addEventListener("mousemove", handleMouseMove);
workZone.addEventListener("wheel", handleZoom);
updateTransform();

export function generatePolygons () {
    bufferZone.innerHTML = '';
    const count = 5 + Math.floor(Math.random() * 16);
    const bufferWidth = bufferZone.clientWidth;
    const bufferHeight = bufferZone.clientHeight;
    const placed = [];

    for (let i = 0; i < count; i++) {
        const sides = 3 + Math.floor(Math.random() * 7);
        let size = 20 + Math.floor(Math.random() * 41);
        const result = findFreePosition(size, bufferWidth, bufferHeight, placed);
        if (!result.success) continue;
        const el = createPolygon(sides, result.size);
        el.style.left = `${result.left}px`;
        el.style.top = `${result.top}px`;
        bufferZone.appendChild(el);
        placed.push({
            left: result.left,
            top: result.top,
            width: result.width,
            height: result.height,
        });
    }
}

export function createWorkWrapper (sides, size, shadowHTML, event) {
    const original = document.createElement("x-polygon");
    original.setAttribute("sides", sides);
    original.setAttribute("size", size);
    document.body.appendChild(original);

    requestAnimationFrame(() => {
        original.shadowRoot.innerHTML = shadowHTML;
        const svg = original.shadowRoot.querySelector("svg");
        const width = svg?.getAttribute("width") || size * 2;
        const height = svg?.getAttribute("height") || size * 2;
        original.remove();

        const { x, y } = getSVGCoords(event);
        const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        wrapper.setAttribute("x", x - width / 2);
        wrapper.setAttribute("y", y - height / 2);
        wrapper.setAttribute("width", width);
        wrapper.setAttribute("height", height);
        wrapper.setAttribute("draggable", true);
        wrapper.classList.add("draggable");

        const id = crypto.randomUUID();
        wrapper.dataset.id = id;
        polygonMap.set(id, wrapper);
        original.dataset.id = id;
        wrapper.appendChild(original);
        workSvg.appendChild(wrapper);

        wrapper.addEventListener("dragstart", (e) => {
            const currentWrapper = e.currentTarget;
            const polygon = currentWrapper.querySelector("x-polygon");
            currentWrapper.classList.add("dragging");
            
            e.dataTransfer.setData("text/html", polygon.shadowRoot?.innerHTML ||  "");
            e.dataTransfer.setData("text/from", "work");
            e.dataTransfer.setData("text/size", polygon.getAttribute("size"));
            e.dataTransfer.setData("text/sides", polygon.getAttribute("sides"));
            e.dataTransfer.setData("text/id", currentWrapper.dataset.id);
        });

        wrapper.addEventListener("dragend", () => {
            wrapper.classList.remove("dragging");
        });
    })
}