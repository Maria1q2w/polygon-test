import { state } from "./script";

export function extractDataTransfer (e) {
    return {
        size: parseInt(e.dataTransfer.getData("text/size")) || 30,
        sides: parseInt(e.dataTransfer.getData("text/sides")) || 3,
        shadowHTML: e.dataTransfer.getData("text/html")
    }
}

export function findFreePosition (size, bufferWidth, bufferHeight, placed, minSize = 10) {
    while(size >= minSize) {
        const width = size * 2;
        const height = size * 2;
        for (let tries = 0; tries < 100; tries++) {
            const left = Math.floor(Math.random() * (bufferWidth - width));
            const top = Math.floor(Math.random() * (bufferHeight - height));
            const overlap = placed.some(item =>
                left < item.left + item.width && left + width > item.left &&
                top < item.top + item.height && top + height > item.top);
            if (!overlap) return { success: true, left, top, width, height, size };
        }
        size -= 2;
    }
    return { success: false };
}

export function clampOrigin() {
    const svgWidth = workSvg.width.baseVal.value;
    const svgHeight = workSvg.height.baseVal.value;
    const minPanX = Math.min(0, workZone.clientWidth - svgWidth * state.scale - 500);
    const maxPanX = 500;
    const minPanY = Math.min(0, workZone.clientHeight - svgHeight * state.scale - 500);
    const maxPanY = 500;
    state.originX = Math.min(maxPanX, Math.max(minPanX, state.originX));
    state.originY = Math.min(maxPanY, Math.max(minPanY, state.originY));
}

export function getSVGCoords(evt) {
    const pt = workSvg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const svgP = pt.matrixTransform(workSvg.getScreenCTM().inverse());
    return { x: svgP.x, y: svgP.y };
}