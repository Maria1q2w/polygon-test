import { workSvg } from "./polygonManager";
import { state, workZone } from "./script";

export function updateTransform () {
    workSvg.style.transform = `translate(${state.originX}px, ${state.originY}px) scale(${state.scale})`;
    const gridRect = document.getElementById("gridRect");
    gridRect.setAttribute("x", 0);
    gridRect.setAttribute("y", 0);
    gridRect.setAttribute("width", 20000);
    gridRect.setAttribute("height", 20000);
}

export function updateScaleMarkers() {
    const xScale = document.getElementById("xScale");
    const yScale = document.getElementById("yScale");
    xScale.innerHTML = "";
    yScale.innerHTML = "";

    const step = 10 * state.scale;
    for (let i = 0; i < workZone.clientWidth / step; i++) {
        const div = document.createElement("div");
        div.style.width = `${10 * state.scale}px`;
        div.textContent = i * 10;
        xScale.appendChild(div);
    }

    for (let i = 0; i < workZone.clientHeight / step; i++) {
        const div = document.createElement("div");
        div.style.height = `${10 * state.scale}px`;
        div.textContent = i * 10;
        yScale.appendChild(div);
    }
}