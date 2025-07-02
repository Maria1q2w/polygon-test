export class PolygonComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        if (this.shadowRoot.children.length > 0) return;
        const sides = Number(this.getAttribute("sides")) || 3;
        const size = Number(this.getAttribute("size")) || 30;
        const points = this.generatePolygonPoints(sides, size);
        const color = this.randomColor();
        const svg = this.createSVG(points, size, color);

        this.shadowRoot.innerHTML = svg;
        this.draggable = true;
        this.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/html", this.shadowRoot.innerHTML);
        });
    }

    generatePolygonPoints(sides, size) {
        const points = [];
        for (let i = 0; i < sides; i++) {
            const angle = (2 * Math.PI * i) / sides;
            const radius = size * (0.5 + Math.random() * 0.5);
            const x = size + radius * Math.cos(angle);
            const y = size + radius * Math.sin(angle);
            points.push(`${x},${y}`);
        }
        return points;
    }

    randomColor() {
        return `hsl(${Math.random() * 360}, 60%, 70%)`;
    }

    createSVG(points, size, color) {
        return `
            <svg width="${size * 2}" height="${size * 2}" style="cursor: grab">
                <polygon 
                    points="${points.join(" ")}"
                    fill="${color}"
                    stroke="#333"
                    stroke-width="1"
                />
            </svg>`;
    }
}

customElements.define("x-polygon", PolygonComponent);