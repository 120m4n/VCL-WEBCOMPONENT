import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * <vcl-rating> — Web Component Nativo de Calificación por Estrellas y Medias Estrellas
 * Sustituye a TRatingStart de VCL.JS (100% Zero JQuery, Gráficos SVG Vectoriales)
 */
export class VCLRating extends VCLControlElement {
    static get observedAttributes() {
        return ['max', 'value', 'size', 'readonly', 'disabled', 'color', 'allow-half'];
    }

    private _container: HTMLDivElement;
    private _starElements: { wrapper: HTMLDivElement; fill: HTMLDivElement }[] = [];
    private _hoverValue: number | null = null;

    constructor() {
        super();

        this._container = document.createElement('div');
        this._container.className = 'vcl-rating-container';
        this._container.setAttribute('role', 'radiogroup');
        this._container.setAttribute('tabindex', '0');

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                user-select: none;
                box-sizing: border-box;
                vertical-align: middle;
                margin: 4px 0;
                font-family: inherit;
            }

            :host([hidden]) { display: none !important; }

            .vcl-rating-container {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;
                outline: none;
                padding: 4px 0;
            }

            .star-wrapper {
                position: relative;
                display: inline-block;
                width: 26px;
                height: 26px;
                line-height: 1;
                transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                flex-shrink: 0;
            }

            .star-wrapper:hover {
                transform: scale(1.18);
            }

            .star-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                fill: #cbd5e1;
                pointer-events: none;
            }

            .star-fill {
                position: absolute;
                top: 0;
                left: 0;
                width: 0%;
                height: 100%;
                overflow: hidden;
                pointer-events: none;
                transition: width 0.1s ease;
            }

            .star-fg {
                position: absolute;
                top: 0;
                left: 0;
                width: 26px;
                height: 26px;
                fill: #f59e0b;
            }

            /* Variantes de color */
            :host([color="danger"]) .star-fg { fill: #ef4444; }
            :host([color="success"]) .star-fg { fill: #10b981; }
            :host([color="primary"]) .star-fg { fill: #3b82f6; }
            :host([color="purple"]) .star-fg { fill: #8b5cf6; }

            /* Tamaños configurables */
            :host([size="sm"]) .star-wrapper, :host([size="sm"]) .star-fg { width: 18px; height: 18px; }
            :host([size="lg"]) .star-wrapper, :host([size="lg"]) .star-fg { width: 34px; height: 34px; }
            :host([size="xl"]) .star-wrapper, :host([size="xl"]) .star-fg { width: 44px; height: 44px; }

            :host([readonly]), :host([disabled]) {
                cursor: default;
                pointer-events: none;
            }

            :host([disabled]) {
                opacity: 0.5;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._container);

        this._initEvents();
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

    public get max(): number {
        const val = parseInt(this.getAttribute('max') || '5', 10);
        return isNaN(val) || val <= 0 ? 5 : val;
    }
    public set max(val: number) {
        this.setAttribute('max', val.toString());
    }

    public get value(): number {
        const val = parseFloat(this.getAttribute('value') || '0');
        return isNaN(val) ? 0 : Math.min(Math.max(val, 0), this.max);
    }
    public set value(val: number) {
        const clamped = Math.min(Math.max(val, 0), this.max);
        this.setAttribute('value', clamped.toString());
    }

    public get readonly(): boolean {
        return this.hasAttribute('readonly');
    }
    public set readonly(val: boolean) {
        if (val) this.setAttribute('readonly', '');
        else this.removeAttribute('readonly');
    }

    public get disabled(): boolean {
        return this.hasAttribute('disabled');
    }
    public set disabled(val: boolean) {
        if (val) this.setAttribute('disabled', '');
        else this.removeAttribute('disabled');
    }

    public get allowHalf(): boolean {
        return this.hasAttribute('allow-half');
    }
    public set allowHalf(val: boolean) {
        if (val) this.setAttribute('allow-half', '');
        else this.removeAttribute('allow-half');
    }

    private _initEvents() {
        this._container.addEventListener('pointerleave', () => {
            if (this.readonly || this.disabled) return;
            this._hoverValue = null;
            this._updateStarFills(this.value);
        });

        this._container.addEventListener('keydown', (e: KeyboardEvent) => {
            if (this.readonly || this.disabled) return;
            const step = this.allowHalf ? 0.5 : 1;
            let newVal = this.value;

            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                newVal = Math.min(this.value + step, this.max);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                newVal = Math.max(this.value - step, 0);
            } else if (e.key === 'Home') {
                newVal = 0;
            } else if (e.key === 'End') {
                newVal = this.max;
            } else {
                return;
            }

            e.preventDefault();
            this.value = newVal;
            this._emitChange();
        });
    }

    private _emitChange() {
        this.dispatchEvent(new CustomEvent('vcl-change', {
            detail: { value: this.value },
            bubbles: true,
            composed: true
        }));
    }

    private _buildStars() {
        this._container.innerHTML = '';
        this._starElements = [];
        const count = this.max;

        const starPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

        for (let i = 1; i <= count; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'star-wrapper';
            wrapper.setAttribute('role', 'radio');
            wrapper.setAttribute('aria-label', `${i} estrellas`);

            // Estrella fondo gris
            const svgBg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgBg.setAttribute("class", "star-bg");
            svgBg.setAttribute("viewBox", "0 0 24 24");
            const pathBg = document.createElementNS("http://www.w3.org/2000/svg", "path");
            pathBg.setAttribute("d", starPath);
            svgBg.appendChild(pathBg);

            // Contenedor de relleno con recorte porcentual
            const fillDiv = document.createElement('div');
            fillDiv.className = 'star-fill';

            // Estrella dorada de primer plano
            const svgFg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgFg.setAttribute("class", "star-fg");
            svgFg.setAttribute("viewBox", "0 0 24 24");
            const pathFg = document.createElementNS("http://www.w3.org/2000/svg", "path");
            pathFg.setAttribute("d", starPath);
            svgFg.appendChild(pathFg);

            fillDiv.appendChild(svgFg);
            wrapper.appendChild(svgBg);
            wrapper.appendChild(fillDiv);

            // Listeners de puntero sin reconstruir DOM
            wrapper.addEventListener('pointermove', (e: PointerEvent) => {
                if (this.readonly || this.disabled) return;
                const rect = wrapper.getBoundingClientRect();
                const isLeftHalf = (e.clientX - rect.left) < rect.width / 2;
                const hover = this.allowHalf && isLeftHalf ? i - 0.5 : i;

                if (this._hoverValue !== hover) {
                    this._hoverValue = hover;
                    this._updateStarFills(hover);
                    this.dispatchEvent(new CustomEvent('vcl-hover', {
                        detail: { hoverValue: hover },
                        bubbles: true,
                        composed: true
                    }));
                }
            });

            wrapper.addEventListener('click', (e: MouseEvent) => {
                if (this.readonly || this.disabled) return;
                const rect = wrapper.getBoundingClientRect();
                const isLeftHalf = (e.clientX - rect.left) < rect.width / 2;
                this.value = this.allowHalf && isLeftHalf ? i - 0.5 : i;
                this._hoverValue = null;
                this._updateStarFills(this.value);
                this._emitChange();
            });

            this._container.appendChild(wrapper);
            this._starElements.push({ wrapper, fill: fillDiv });
        }
    }

    private _updateStarFills(activeVal: number) {
        this._starElements.forEach((star, index) => {
            const starIndex = index + 1;
            if (activeVal >= starIndex) {
                star.fill.style.width = '100%';
            } else if (activeVal >= starIndex - 0.5) {
                star.fill.style.width = '50%';
            } else {
                star.fill.style.width = '0%';
            }
        });
    }

    protected render(): void {
        if (this._starElements.length !== this.max) {
            this._buildStars();
        }
        this._updateStarFills(this._hoverValue !== null ? this._hoverValue : this.value);
    }
}

customElements.define('vcl-rating', VCLRating);
