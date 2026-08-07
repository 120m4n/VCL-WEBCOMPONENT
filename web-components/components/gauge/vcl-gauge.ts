import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * <vcl-gauge> — Web Component Nativo de Medidor Radial/Semicircular SVG
 * Sustituye a TGauge de VCL.JS (sin JQuery ni librerías de gráficos pesadas)
 */
export class VCLGauge extends VCLControlElement {
    static get observedAttributes() {
        return ['min', 'max', 'value', 'units', 'title', 'gauge-style', 'warning-threshold', 'critical-threshold', 'size'];
    }

    private _svg: SVGSVGElement;
    private _trackPath: SVGPathElement;
    private _progressPath: SVGPathElement;
    private _needleGroup: SVGGElement;
    private _valueText: SVGTextElement;
    private _unitText: SVGTextElement;
    private _titleText: SVGTextElement;

    constructor() {
        super();

        const svgNS = "http://www.w3.org/2000/svg";
        this._svg = document.createElementNS(svgNS, "svg");
        this._svg.setAttribute("viewBox", "0 0 200 160");
        this._svg.setAttribute("class", "gauge-svg");

        this._trackPath = document.createElementNS(svgNS, "path");
        this._trackPath.setAttribute("class", "gauge-track");

        this._progressPath = document.createElementNS(svgNS, "path");
        this._progressPath.setAttribute("class", "gauge-progress");

        this._needleGroup = document.createElementNS(svgNS, "g");
        this._needleGroup.setAttribute("class", "gauge-needle-group");

        const needle = document.createElementNS(svgNS, "polygon");
        needle.setAttribute("points", "97,100 103,100 100,25");
        needle.setAttribute("class", "gauge-needle");

        const pin = document.createElementNS(svgNS, "circle");
        pin.setAttribute("cx", "100");
        pin.setAttribute("cy", "100");
        pin.setAttribute("r", "8");
        pin.setAttribute("class", "gauge-pin");

        this._needleGroup.appendChild(needle);
        this._needleGroup.appendChild(pin);

        this._valueText = document.createElementNS(svgNS, "text");
        this._valueText.setAttribute("x", "100");
        this._valueText.setAttribute("y", "125");
        this._valueText.setAttribute("class", "gauge-val-text");

        this._unitText = document.createElementNS(svgNS, "text");
        this._unitText.setAttribute("x", "100");
        this._unitText.setAttribute("y", "142");
        this._unitText.setAttribute("class", "gauge-unit-text");

        this._titleText = document.createElementNS(svgNS, "text");
        this._titleText.setAttribute("x", "100");
        this._titleText.setAttribute("y", "156");
        this._titleText.setAttribute("class", "gauge-title-text");

        this._svg.appendChild(this._trackPath);
        this._svg.appendChild(this._progressPath);
        this._svg.appendChild(this._needleGroup);
        this._svg.appendChild(this._valueText);
        this._svg.appendChild(this._unitText);
        this._svg.appendChild(this._titleText);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 200px;
                height: 160px;
                box-sizing: border-box;
                font-family: inherit;
                user-select: none;
                vertical-align: middle;
            }

            :host([hidden]) { display: none !important; }

            .gauge-svg {
                width: 100%;
                height: 100%;
                overflow: visible;
            }

            .gauge-track {
                fill: none;
                stroke: #e2e8f0;
                stroke-width: 16;
                stroke-linecap: round;
            }

            .gauge-progress {
                fill: none;
                stroke: #3182ce;
                stroke-width: 16;
                stroke-linecap: round;
                transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease;
            }

            .gauge-progress.status-normal { stroke: #10b981; }
            .gauge-progress.status-warning { stroke: #f59e0b; }
            .gauge-progress.status-critical { stroke: #ef4444; }

            .gauge-needle-group {
                transform-origin: 100px 100px;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .gauge-needle {
                fill: #1e293b;
            }

            .gauge-pin {
                fill: #0f172a;
                stroke: #ffffff;
                stroke-width: 2;
            }

            .gauge-val-text {
                font-size: 22px;
                font-weight: 700;
                fill: #0f172a;
                text-anchor: middle;
                font-variant-numeric: tabular-nums;
            }

            .gauge-unit-text {
                font-size: 11px;
                font-weight: 600;
                fill: #64748b;
                text-anchor: middle;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .gauge-title-text {
                font-size: 10px;
                font-weight: 600;
                fill: #94a3b8;
                text-anchor: middle;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._svg);
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    public get min(): number {
        return parseFloat(this.getAttribute('min') || '0');
    }
    public set min(val: number) {
        this.setAttribute('min', val.toString());
    }

    public get max(): number {
        return parseFloat(this.getAttribute('max') || '100');
    }
    public set max(val: number) {
        this.setAttribute('max', val.toString());
    }

    public get value(): number {
        return parseFloat(this.getAttribute('value') || '0');
    }
    public set value(val: number) {
        this.setAttribute('value', val.toString());
    }

    public get warningThreshold(): number {
        return parseFloat(this.getAttribute('warning-threshold') || (this.min + 0.7 * (this.max - this.min)).toString());
    }

    public get criticalThreshold(): number {
        return parseFloat(this.getAttribute('critical-threshold') || (this.min + 0.88 * (this.max - this.min)).toString());
    }

    protected render(): void {
        const min = this.min;
        const max = this.max;
        const val = Math.min(Math.max(this.value, min), max);
        const range = max - min || 1;
        const percent = (val - min) / range;

        // Geometría del arco semicircular (de -135deg a +135deg = 270 grados totales)
        const startAngle = -135;
        const endAngle = 135;
        const totalAngle = endAngle - startAngle;

        const radius = 70;
        const cx = 100;
        const cy = 100;

        const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
            const startRad = (startA - 90) * Math.PI / 180;
            const endRad = (endA - 90) * Math.PI / 180;
            const x1 = x + r * Math.cos(startRad);
            const y1 = y + r * Math.sin(startRad);
            const x2 = x + r * Math.cos(endRad);
            const y2 = y + r * Math.sin(endRad);
            const largeArcFlag = endA - startA <= 180 ? "0" : "1";
            return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
        };

        const trackD = describeArc(cx, cy, radius, startAngle, endAngle);
        this._trackPath.setAttribute("d", trackD);

        const arcLength = (totalAngle / 360) * 2 * Math.PI * radius;
        this._progressPath.setAttribute("d", trackD);
        this._progressPath.style.strokeDasharray = `${arcLength}`;
        this._progressPath.style.strokeDashoffset = `${arcLength * (1 - percent)}`;

        // Determinar color por rango
        this._progressPath.className.baseVal = 'gauge-progress';
        if (val >= this.criticalThreshold) {
            this._progressPath.classList.add('status-critical');
        } else if (val >= this.warningThreshold) {
            this._progressPath.classList.add('status-warning');
        } else {
            this._progressPath.classList.add('status-normal');
        }

        // Rotación de aguja (-135 a +135 deg)
        const needleAngle = startAngle + percent * totalAngle;
        this._needleGroup.style.transform = `rotate(${needleAngle}deg)`;

        this._valueText.textContent = Number.isInteger(val) ? val.toString() : val.toFixed(1);
        this._unitText.textContent = this.getAttribute('units') || '%';
        this._titleText.textContent = this.getAttribute('title') || '';
    }
}

customElements.define('vcl-gauge', VCLGauge);
