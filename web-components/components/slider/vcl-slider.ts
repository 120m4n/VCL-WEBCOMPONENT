import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * <vcl-slider> — Web Component Nativo de Deslizador Numérico
 * Sustituye a TSlider / TSliderBase de VCL.JS (100% Zero JQuery, Pointer Events API)
 */
export class VCLSlider extends VCLControlElement {
    static get observedAttributes() {
        return ['min', 'max', 'value', 'step', 'orientation', 'show-tooltip', 'disabled', 'color'];
    }

    private _container: HTMLDivElement;
    private _track: HTMLDivElement;
    private _fill: HTMLDivElement;
    private _thumb: HTMLDivElement;
    private _tooltip: HTMLDivElement;

    constructor() {
        super();

        this._container = document.createElement('div');
        this._container.className = 'vcl-slider-container';

        this._track = document.createElement('div');
        this._track.className = 'slider-track';

        this._fill = document.createElement('div');
        this._fill.className = 'slider-fill';

        this._thumb = document.createElement('div');
        this._thumb.className = 'slider-thumb';
        this._thumb.setAttribute('tabindex', '0');
        this._thumb.setAttribute('role', 'slider');

        this._tooltip = document.createElement('div');
        this._tooltip.className = 'slider-tooltip';

        this._track.appendChild(this._fill);
        this._track.appendChild(this._thumb);
        this._thumb.appendChild(this._tooltip);
        this._container.appendChild(this._track);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                width: 100%;
                min-width: 140px;
                box-sizing: border-box;
                user-select: none;
                vertical-align: middle;
                margin: 8px 0;
            }

            :host([orientation="vertical"]) {
                width: 36px;
                min-width: unset;
                height: 180px;
                min-height: 120px;
            }

            :host([hidden]) { display: none !important; }

            .vcl-slider-container {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                padding: 12px 0;
                touch-action: none;
            }

            :host([orientation="vertical"]) .vcl-slider-container {
                flex-direction: column;
                justify-content: center;
                padding: 0 12px;
            }

            .slider-track {
                position: relative;
                width: 100%;
                height: 6px;
                background-color: #e2e8f0;
                border-radius: 4px;
                cursor: pointer;
            }

            :host([orientation="vertical"]) .slider-track {
                width: 6px;
                height: 100%;
            }

            .slider-fill {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                background: linear-gradient(90deg, #3182ce 0%, #2b6cb0 100%);
                border-radius: 4px;
                pointer-events: none;
                width: 0%;
            }

            :host([color="success"]) .slider-fill { background: linear-gradient(90deg, #38a169 0%, #2f855a 100%); }
            :host([color="danger"]) .slider-fill { background: linear-gradient(90deg, #e53e3e 0%, #c53030 100%); }
            :host([color="warning"]) .slider-fill { background: linear-gradient(90deg, #d69e2e 0%, #b7791f 100%); }
            :host([color="purple"]) .slider-fill { background: linear-gradient(90deg, #805ad5 0%, #6b46c1 100%); }

            :host([orientation="vertical"]) .slider-fill {
                width: 100%;
                bottom: 0;
                top: unset;
                height: 0%;
                background: linear-gradient(0deg, #3182ce 0%, #2b6cb0 100%);
            }

            .slider-thumb {
                position: absolute;
                top: 50%;
                left: 0%;
                width: 20px;
                height: 20px;
                background-color: #ffffff;
                border: 2.5px solid #3182ce;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                cursor: grab;
                outline: none;
                z-index: 2;
                touch-action: none;
                transition: border-color 0.2s, box-shadow 0.2s;
                box-sizing: border-box;
            }

            .slider-thumb:hover, .slider-thumb:focus-visible {
                box-shadow: 0 0 0 5px rgba(49, 130, 206, 0.25);
                z-index: 3;
            }

            .slider-thumb:active, .slider-thumb.active {
                cursor: grabbing;
                box-shadow: 0 0 0 6px rgba(49, 130, 206, 0.35);
                z-index: 4;
            }

            :host([orientation="vertical"]) .slider-thumb {
                left: 50%;
                bottom: 0%;
                top: unset;
                transform: translate(-50%, 50%);
            }

            .slider-tooltip {
                position: absolute;
                bottom: calc(100% + 8px);
                left: 50%;
                transform: translateX(-50%);
                background: #1e293b;
                color: #ffffff;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                white-space: nowrap;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.15s ease;
                box-shadow: 0 4px 6px rgba(0,0,0,0.15);
            }

            .slider-tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-width: 4px;
                border-style: solid;
                border-color: #1e293b transparent transparent transparent;
            }

            :host([show-tooltip]) .slider-thumb:hover .slider-tooltip,
            :host([show-tooltip]) .slider-thumb:focus .slider-tooltip,
            :host([show-tooltip]) .slider-thumb.active .slider-tooltip,
            :host([show-tooltip].dragging) .slider-tooltip {
                opacity: 1;
            }

            :host([disabled]) {
                opacity: 0.55;
                pointer-events: none;
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

    public get min(): number {
        const raw = parseFloat(this.getAttribute('min') || '');
        return isNaN(raw) ? 0 : raw;
    }
    public set min(val: number) {
        this.setAttribute('min', val.toString());
    }

    public get max(): number {
        const raw = parseFloat(this.getAttribute('max') || '');
        return isNaN(raw) ? 100 : raw;
    }
    public set max(val: number) {
        this.setAttribute('max', val.toString());
    }

    public get value(): number {
        const raw = parseFloat(this.getAttribute('value') || '');
        const val = isNaN(raw) ? this.min : raw;
        return Math.min(Math.max(val, this.min), this.max);
    }
    public set value(val: number) {
        const clamped = Math.min(Math.max(val, this.min), this.max);
        this.setAttribute('value', clamped.toString());
    }

    public get step(): number {
        const raw = parseFloat(this.getAttribute('step') || '');
        return isNaN(raw) || raw <= 0 ? 1 : raw;
    }
    public set step(val: number) {
        this.setAttribute('step', val.toString());
    }

    public get disabled(): boolean {
        return this.hasAttribute('disabled');
    }
    public set disabled(val: boolean) {
        if (val) this.setAttribute('disabled', '');
        else this.removeAttribute('disabled');
    }

    private _initEvents() {
        this._thumb.addEventListener('pointerdown', (e: PointerEvent) => {
            if (this.disabled) return;
            e.stopPropagation();
            e.preventDefault();
            this._thumb.setPointerCapture(e.pointerId);
            this._thumb.classList.add('active');
            this.classList.add('dragging');

            const onPointerMove = (ev: PointerEvent) => {
                this._updateFromClientPos(ev.clientX, ev.clientY);
                this.dispatchEvent(new CustomEvent('vcl-input', {
                    detail: { value: this.value },
                    bubbles: true,
                    composed: true
                }));
            };

            const onPointerUp = (ev: PointerEvent) => {
                this._thumb.releasePointerCapture(ev.pointerId);
                this._thumb.classList.remove('active');
                this.classList.remove('dragging');
                this._thumb.removeEventListener('pointermove', onPointerMove);
                this._thumb.removeEventListener('pointerup', onPointerUp);
                this._thumb.removeEventListener('pointercancel', onPointerUp);

                this.dispatchEvent(new CustomEvent('vcl-change', {
                    detail: { value: this.value },
                    bubbles: true,
                    composed: true
                }));
            };

            this._thumb.addEventListener('pointermove', onPointerMove);
            this._thumb.addEventListener('pointerup', onPointerUp);
            this._thumb.addEventListener('pointercancel', onPointerUp);
        });

        this._track.addEventListener('pointerdown', (e: PointerEvent) => {
            if (this.disabled || e.target === this._thumb) return;
            this._updateFromClientPos(e.clientX, e.clientY);
            this.dispatchEvent(new CustomEvent('vcl-change', {
                detail: { value: this.value },
                bubbles: true,
                composed: true
            }));
        });

        this._thumb.addEventListener('keydown', (e: KeyboardEvent) => {
            if (this.disabled) return;
            let step = this.step;
            let current = this.value;

            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                current += step;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                current -= step;
            } else if (e.key === 'PageUp') {
                current += step * 5;
            } else if (e.key === 'PageDown') {
                current -= step * 5;
            } else if (e.key === 'Home') {
                current = this.min;
            } else if (e.key === 'End') {
                current = this.max;
            } else {
                return;
            }

            e.preventDefault();
            this.value = current;
            this.dispatchEvent(new CustomEvent('vcl-input', {
                detail: { value: this.value },
                bubbles: true,
                composed: true
            }));
            this.dispatchEvent(new CustomEvent('vcl-change', {
                detail: { value: this.value },
                bubbles: true,
                composed: true
            }));
        });
    }

    private _updateFromClientPos(clientX: number, clientY: number) {
        const rect = this._track.getBoundingClientRect();
        const isVertical = this.getAttribute('orientation') === 'vertical';

        let percent = 0;
        if (isVertical) {
            if (rect.height <= 0) return;
            percent = (rect.bottom - clientY) / rect.height;
        } else {
            if (rect.width <= 0) return;
            percent = (clientX - rect.left) / rect.width;
        }

        percent = Math.min(Math.max(percent, 0), 1);
        let rawVal = this.min + percent * (this.max - this.min);
        const step = this.step;
        if (step > 0) {
            rawVal = Math.round((rawVal - this.min) / step) * step + this.min;
        }

        this.value = parseFloat(rawVal.toFixed(4));
    }

    protected render(): void {
        const min = this.min;
        const max = this.max;
        const val = this.value;
        const range = max - min || 1;
        const percent = Math.min(Math.max(((val - min) / range) * 100, 0), 100);
        const isVertical = this.getAttribute('orientation') === 'vertical';

        if (isVertical) {
            this._fill.style.height = `${percent}%`;
            this._fill.style.width = '100%';
            this._thumb.style.bottom = `${percent}%`;
            this._thumb.style.left = '50%';
        } else {
            this._fill.style.width = `${percent}%`;
            this._fill.style.height = '100%';
            this._thumb.style.left = `${percent}%`;
            this._thumb.style.top = '50%';
        }

        this._tooltip.textContent = val.toString();
        this._thumb.setAttribute('aria-valuemin', min.toString());
        this._thumb.setAttribute('aria-valuemax', max.toString());
        this._thumb.setAttribute('aria-valuenow', val.toString());
    }
}

customElements.define('vcl-slider', VCLSlider);
