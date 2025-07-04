import { polygonMap, workSvg } from "./polygonManager.js";

document.getElementById("saveBtn").addEventListener("click", savePolygonsToStorage);
document.getElementById("resetBtn").addEventListener("click", resetStorage);
document.addEventListener("DOMContentLoaded", loadPolygonsFromStorage);

function savePolygonsToStorage() {
    const polygons = [];
    workSvg.querySelectorAll("foreignObject").forEach(wrapper => {
        const polygon = wrapper.querySelector("x-polygon");
        if (!polygon) return;
        const svg = polygon.shadowRoot.querySelector("svg");
        const polygonEl = svg.querySelector("polygon");

        polygons.push({
            sides: Number(polygon.getAttribute("sides")),
            size: Number(polygon.getAttribute("size")),
            x: Number(wrapper.getAttribute("x")),
            y: Number(wrapper.getAttribute("y")),
            width: Number(wrapper.getAttribute("width")),
            height: Number(wrapper.getAttribute("height")),
            color: polygonEl.getAttribute("fill"),
            points: polygonEl.getAttribute("points")
        });
    });
    localStorage.setItem("savedPolygons", JSON.stringify(polygons));
    alert("Сохранено!");
}


function resetStorage() {
    localStorage.removeItem("savedPolygons");
    alert("Сохранённые данные удалены!");
    workSvg.querySelectorAll("foreignObject").forEach(el => el.remove());
    polygonMap.clear();
}

function loadPolygonsFromStorage() {
    const saved = localStorage.getItem("savedPolygons");
    if (!saved) return;

    const polygons = JSON.parse(saved);
    polygons.forEach(p => {
        const wrapper = createPolygonWrapper(p);
        workSvg.appendChild(wrapper);
    });
}

function createPolygonWrapper ({ sides, size, x, y, width, height, color, points }) {
    const polygon = document.createElement("x-polygon");
    polygon.setAttribute("sides", sides);
    polygon.setAttribute("size", size);

    const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    wrapper.setAttribute("x", x);
    wrapper.setAttribute("y", y);
    wrapper.setAttribute("width", width);
    wrapper.setAttribute("height", height);
    wrapper.setAttribute("draggable", true);
    wrapper.classList.add("draggable");
    wrapper.dataset.id = polygon.dataset.id;
    polygonMap.set(polygon.dataset.id, wrapper);

    const id = crypto.randomUUID();
    polygon.dataset.id = id;
    wrapper.dataset.id = id;

    polygonMap.set(id, wrapper);

    requestAnimationFrame(() => {
        polygon.shadowRoot.innerHTML = `
            <svg width="${width}" height="${height}" style="cursor: grab">
                <polygon points="${points}" fill="${color}" stroke="#333" stroke-width="1" />
            </svg>`;
    });

    wrapper.appendChild(polygon);
    wrapper.addEventListener("dragstart", (e) => {
        wrapper.classList.add("dragging");
        const shadow = polygon.shadowRoot?.innerHTML || "";
        e.dataTransfer.setData("text/html", shadow);
        e.dataTransfer.setData("text/from", "work");
        e.dataTransfer.setData("text/size", size);
        e.dataTransfer.setData("text/sides", sides);
        e.dataTransfer.setData("text/id", wrapper.dataset.id);
    });
    wrapper.addEventListener("dragend", () => {
        wrapper.classList.remove("dragging");
    });
    return wrapper;
}
