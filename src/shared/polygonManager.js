export const polygonMap = new Map();
export const workSvg = document.getElementById("workSvg");

export function createPolygon(sides, size) {
    const el = document.createElement("x-polygon");
    el.setAttribute("sides", sides);
    el.setAttribute("size", size);
    el.style.position = "absolute";
    const id = crypto.randomUUID();
    el.dataset.id = id;
    polygonMap.set(id, el);
    return el;
}

export function removePolygonById(id) {
    const el = polygonMap.get(id);
    if (el && el.parentNode) {
        el.parentNode.removeChild(el);
    }
    polygonMap.delete(id);
}
