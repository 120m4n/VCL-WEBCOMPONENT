import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * <vcl-rangeslider> — Web Component Nativo de Deslizador de Rango Doble (Min-Max)
 * Sustituye a TRangeSlider de VCL.JS (100% Zero JQuery, Pointer Events API)
 */
export class VCLRangeSlider extends VCLControlElement {
    static get observedAttributes() {
        return ['min', 'max', 'start-value', 'end-value', 'step', 'show-tooltip', 'disabled', 'color'];
    }

    private _container: HTMLDivElement;
    private _track: HTMLDivElement;
    private _rangeFill: HTMLDivElement;
    private _thumbStart: HTMLDivElement;
    private _thumbEnd: HTMLDivElement;
    private _tooltipStart: HTMLDivElement;
    private _tooltipEnd: HTMLDivElement;
    private _activeThumb: 'start' | 'end' | null = null;

    constructor() {
        super();

        this._container = document.createElement('div');
        this._container.className = 'vcl-rangeslider-container';

        this._track = document.createElement('div');
        this._track.className = 'range-track';

        this._rangeFill = document.createElement('div');
        this._rangeFill.className = 'range-fill';

        this._thumbStart = document.createElement('div');
        this._thumbStart.className = 'range-thumb thumb-start';
        this._thumbStart.setAttribute('tabindex', '0');
        this._thumbStart.setAttribute('role', 'slider');
        this._thumbStart.setAttribute('aria-label', 'Rango Mínimo');

        this._tooltipStart = document.createElement('div');
        this._tooltipStart.className = 'range-tooltip';
        this._thumbStart.appendChild(this._tooltipStart);

        this._thumbEnd = document.createElement('div');
        this._thumbEnd.className = 'range-thumb thumb-end';
        this._thumbEnd.setAttribute('tabindex', '0');
        this._thumbEnd.setAttribute('role', 'slider');
        this._thumbEnd.setAttribute('aria-label', 'Rango Máximo');

        this._tooltipEnd = document.createElement('div');
        this._tooltipEnd.className = 'range-tooltip';
        this._thumbEnd.appendChild(this._tooltipEnd);

        this._track.appendChild(this._rangeFill);
        this._track.appendChild(this._thumbStart);
        this._track.appendChild(this._thumbEnd);
        this._container.appendChild(this._track);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                width: 100%;
                min-width: 160px;
                box-sizing: border-box;
                user-select: none;
                vertical-align: middle;
                margin: 8px 0;
            }

            :host([hidden]) { display: none !important; }

            .vcl-rangeslider-container {
                position: relative;
                width: 100%;
                padding: 12px 0;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                touch-action: none;
            }

            .range-track {
                position: relative;
                width: 100%;
                height: 6px;
                background-color: #e2e8f0;
                border-radius: 4px;
                cursor: pointer;
            }

            .range-fill {
                position: absolute;
                top: 0;
                height: 100%;
                background: linear-gradient(90deg, #3182ce 0%, #2b6cb0 100%);
                border-radius: 4px;
                pointer-events: none;
            }

            :host([color="success"]) .range-fill { background: linear-gradient(90deg, #38a169 0%, #2f855a 100%); }
            :host([color="danger"]) .range-fill { background: linear-gradient(90deg, #e53e3e 0%, #c53030 100%); }
            :host([color="purple"]) .range-fill { background: linear-gradient(90deg, #805ad5 0%, #6b46c1 100%); }

            .range-thumb {
                position: absolute;
                top: 50%;
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

            :host([color="success"]) .range-thumb { border-color: #38a169; }
            :host([color="danger"]) .range-thumb { border-color: #e53e3e; }
            :host([color="purple"]) .range-thumb { border-color: #805ad5; }

            .range-thumb:hover, .range-thumb:focus-visible {
                box-shadow: 0 0 0 5px rgba(49, 130, 206, 0.25);
                z-index: 3;
            }

            .range-thumb:active, .range-thumb.active {
                cursor: grabbing;
                box-shadow: 0 0 0 6px rgba(49, 130, 206, 0.35);
                z-index: 4;
            }

            .range-tooltip {
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
                font-family: inherit;
            }

            .range-tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-width: 4px;
                border-style: solid;
                border-color: #1e293b transparent transparent transparent;
            }

            :host([show-tooltip]) .range-thumb:hover .range-tooltip,
            :host([show-tooltip]) .range-thumb:focus .range-tooltip,
            :host([show-tooltip]) .range-thumb.active .range-tooltip,
            :host([show-tooltip].dragging) .range-tooltip {
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

    public get startValue(): number {
        const raw = parseFloat(this.getAttribute('start-value') || '');
        const val = isNaN(raw) ? this.min : raw;
        const endRaw = parseFloat(this.getAttribute('end-value') || '');
        const maxLimit = isNaN(endRaw) ? this.max : endRaw;
        return Math.max(this.min, Math.min(val, maxLimit));
    }
    public set startValue(val: number) {
        const endRaw = parseFloat(this.getAttribute('end-value') || '');
        const maxLimit = isNaN(endRaw) ? this.max : endRaw;
        const clamped = Math.max(this.min, Math.min(val, maxLimit));
        this.setAttribute('start-value', clamped.toString());
    }

    public get endValue(): number {
        const raw = parseFloat(this.getAttribute('end-value') || '');
        const val = isNaN(raw) ? this.max : raw;
        const startRaw = parseFloat(this.getAttribute('start-value') || '');
        const minLimit = isNaN(startRaw) ? this.min : startRaw;
        return Math.min(this.max, Math.max(val, minLimit));
    }
    public set endValue(val: number) {
        const startRaw = parseFloat(this.getAttribute('start-value') || '');
        const minLimit = isNaN(startRaw) ? this.min : startRaw;
        const clamped = Math.min(this.max, Math.max(val, minLimit));
        this.setAttribute('end-value', clamped.toString());
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
        const bindThumbPointer = (thumb: 'start' | 'end', el: HTMLDivElement) => {
            el.addEventListener('pointerdown', (e: PointerEvent) => {
                if (this.disabled) return;
                e.stopPropagation();
                e.preventDefault();
                el.setPointerCapture(e.pointerId);
                this._activeThumb = thumb;
                el.classList.add('active');
                this.classList.add('dragging');

                const onPointerMove = (ev: PointerEvent) => {
                    if (this._activeThumb !== thumb) return;
                    this._updateFromClientX(ev.clientX, thumb);
                    this.dispatchEvent(new CustomEvent('vcl-input', {
                        detail: { start: this.startValue, end: this.endValue },
                        bubbles: true,
                        composed: true
                    }));
                };

                const onPointerUp = (ev: PointerEvent) => {
                    el.releasePointerCapture(ev.pointerId);
                    el.classList.remove('active');
                    this.classList.remove('dragging');
                    this._activeThumb = null;
                    el.removeEventListener('pointermove', onPointerMove);
                    el.removeEventListener('pointerup', onPointerUp);
                    el.removeEventListener('pointercancel', onPointerUp);

                    this.dispatchEvent(new CustomEvent('vcl-change', {
                        detail: { start: this.startValue, end: this.endValue },
                        bubbles: true,
                        composed: true
                    }));
                };

                el.addEventListener('pointermove', onPointerMove);
                el.addEventListener('pointerup', onPointerUp);
                el.addEventListener('pointercancel', onPointerUp);
            });

            el.addEventListener('keydown', (e: KeyboardEvent) => {
                if (this.disabled) return;
                const step = this.step;
                let current = thumb === 'start' ? this.startValue : this.endValue;

                if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                    current += step;
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                    current -= step;
                } else if (e.key === 'PageUp') {
                    current += step * 5;
                } else if (e.key === 'PageDown') {
                    current -= step * 5;
                } else if (e.key === 'Home') {
                    current = thumb === 'start' ? this.min : this.startValue;
                } else if (e.key === 'End') {
                    current = thumb === 'start' ? this.endValue : this.max;
                } else {
                    return;
                }

                e.preventDefault();
                if (thumb === 'start') {
                    this.startValue = current;
                } else {
                    this.endValue = current;
                }

                this.dispatchEvent(new CustomEvent('vcl-input', {
                    detail: { start: this.startValue, end: this.endValue },
                    bubbles: true,
                    composed: true
                }));
                this.dispatchEvent(new CustomEvent('vcl-change', {
                    detail: { start: this.startValue, end: this.endValue },
                    bubbles: true,
                    composed: true
                }));
            });
        };

        bindThumbPointer('start', this._thumbStart);
        bindThumbPointer('end', this._thumbEnd);

        this._track.addEventListener('pointerdown', (e: PointerEvent) => {
            if (this.disabled || e.target === this._thumbStart || e.target === this._thumbEnd) return;
            const rect = this._track.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const val = this.min + percent * (this.max - this.min);

            const distStart = Math.abs(val - this.startValue);
            const distEnd = Math.abs(val - this.endValue);
            const thumbToMove = distStart < distEnd ? 'start' : 'end';

            this._updateFromClientX(e.clientX, thumbToMove);
            this.dispatchEvent(new CustomEvent('vcl-change', {
                detail: { start: this.startValue, end: this.endValue },
                bubbles: true,
                composed: true
            }));
        });
    }

    private _updateFromClientX(clientX: number, thumb: 'start' | 'end') {
        const rect = this._track.getBoundingClientRect();
        if (rect.width <= 0) return;

        let percent = (clientX - rect.left) / rect.width;
        percent = Math.min(Math.max(percent, 0), 1);

        let rawVal = this.min + percent * (this.max - this.min);
        const step = this.step;
        if (step > 0) {
            rawVal = Math.round((rawVal - this.min) / step) * step + this.min;
        }
        rawVal = parseFloat(rawVal.toFixed(4));

        if (thumb === 'start') {
            this.startValue = rawVal;
        } else {
            this.endValue = rawVal;
        }
    }

    protected render(): void {
        const min = this.min;
        const max = this.max;
        const range = max - min || 1;

        const sVal = this.startValue;
        const eVal = this.endValue;

        const startPct = Math.min(Math.max(((sVal - min) / range) * 100, 0), 100);
        const endPct = Math.min(Math.max(((eVal - min) / range) * 100, 0), 100);

        this._rangeFill.style.left = `${startPct}%`;
        this._rangeFill.style.width = `${Math.max(endPct - startPct, 0)}%`;

        this._thumbStart.style.left = `${startPct}%`;
        this._thumbEnd.style.left = `${endPct}%`;

        this._tooltipStart.textContent = sVal.toString();
        this._tooltipEnd.textContent = eVal.toString();

        this._thumbStart.setAttribute('aria-valuemin', min.toString());
        this._thumbStart.setAttribute('aria-valuemax', eVal.toString());
        this._thumbStart.setAttribute('aria-valuenow', sVal.toString());

        this._thumbEnd.setAttribute('aria-valuemin', sVal.toString());
        this._thumbEnd.setAttribute('aria-valuemax', max.toString());
        this._thumbEnd.setAttribute('aria-valuenow', eVal.toString());
    }
}

customElements.define('vcl-rangeslider', VCLRangeSlider);
