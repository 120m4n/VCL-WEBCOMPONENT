import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * <vcl-progressbar> — Web Component Nativo de Barra de Progreso
 * Sustituye a TProgressBar de Delphi 4 (comctrls.pas)
 */
export class VCLProgressBar extends VCLControlElement {

    static get observedAttributes() {
        return ['min', 'max', 'position', 'value', 'step', 'indeterminate',
                'orientation', 'show-label', 'bar-style', 'disabled'];
    }

    private _wrapper: HTMLDivElement;
    private _track: HTMLDivElement;
    private _fill: HTMLDivElement;
    private _label: HTMLSpanElement;

    constructor() {
        super();

        this._wrapper = document.createElement('div');
        this._wrapper.className = 'vcl-progressbar';

        this._track = document.createElement('div');
        this._track.className = 'pb-track';

        this._fill = document.createElement('div');
        this._fill.className = 'pb-fill';

        this._label = document.createElement('span');
        this._label.className = 'pb-label';

        this._track.appendChild(this._fill);
        this._wrapper.appendChild(this._track);
        this._wrapper.appendChild(this._label);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                box-sizing: border-box;
                width: 100%;
            }

            :host([orientation="vertical"]) {
                width: auto;
                height: 100%;
            }

            :host([hidden]) { display: none !important; }

            /* ── Wrapper ─────────────────────────────────────────────── */
            .vcl-progressbar {
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
                box-sizing: border-box;
                position: relative;
            }

            :host([orientation="vertical"]) .vcl-progressbar {
                flex-direction: column-reverse;
                align-items: center;
                width: auto;
                height: 100%;
            }

            /* ── Track ───────────────────────────────────────────────── */
            .pb-track {
                position: relative;
                flex: 1;
                height: 18px;
                background: #e2e8f0;
                border-radius: 999px;
                border: 1px solid rgba(0,0,0,0.1);
                overflow: hidden;
                box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
                min-width: 0;
            }

            :host([orientation="vertical"]) .pb-track {
                flex: 1;
                width: 18px;
                height: auto;
            }

            /* ── Fill ────────────────────────────────────────────────── */
            .pb-fill {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 0%;
                border-radius: 999px;
                transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                            height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
                box-shadow: 0 0 8px rgba(59,130,246,0.4);
            }

            :host([orientation="vertical"]) .pb-fill {
                width: 100%;
                height: 0%;
                bottom: 0;
                top: auto;
                background: linear-gradient(0deg, #3b82f6 0%, #60a5fa 100%);
            }

            /* Bar styles */
            :host([bar-style="success"]) .pb-fill {
                background: linear-gradient(90deg, #22c55e 0%, #4ade80 100%);
                box-shadow: 0 0 8px rgba(34,197,94,0.4);
            }
            :host([bar-style="warning"]) .pb-fill {
                background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
                box-shadow: 0 0 8px rgba(245,158,11,0.4);
            }
            :host([bar-style="danger"]) .pb-fill {
                background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
                box-shadow: 0 0 8px rgba(239,68,68,0.4);
            }

            /* ── Indeterminate ───────────────────────────────────────── */
            :host([indeterminate]) .pb-fill {
                width: 40% !important;
                animation: pb-indeterminate 1.4s ease-in-out infinite;
                background: linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%);
                box-shadow: none;
            }

            @keyframes pb-indeterminate {
                0%   { left: -50%; }
                100% { left: 110%; }
            }

            :host([indeterminate][orientation="vertical"]) .pb-fill {
                width: 100% !important;
                height: 40% !important;
                animation: pb-indeterminate-v 1.4s ease-in-out infinite;
                background: linear-gradient(0deg, transparent 0%, #3b82f6 50%, transparent 100%);
            }

            @keyframes pb-indeterminate-v {
                0%   { bottom: -50%; top: auto; }
                100% { bottom: 110%; top: auto; }
            }

            /* ── Label ───────────────────────────────────────────────── */
            .pb-label {
                display: none;
                font-size: 12px;
                font-weight: 600;
                font-family: inherit;
                color: #374151;
                min-width: 36px;
                text-align: right;
                white-space: nowrap;
            }

            :host([show-label]) .pb-label { display: block; }
            :host([indeterminate]) .pb-label { display: none; }

            /* ── Disabled ────────────────────────────────────────────── */
            :host([disabled]) .vcl-progressbar {
                opacity: 0.5;
                pointer-events: none;
            }

            /* ── Dark mode ───────────────────────────────────────────── */
            @media (prefers-color-scheme: dark) {
                .pb-track {
                    background: #1f2937;
                    border-color: rgba(255,255,255,0.08);
                }
                .pb-label { color: #d1d5db; }
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._wrapper);

        // ARIA
        this.setAttribute('role', 'progressbar');
    }

    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
        if (oldValue === newValue) return;
        this.render();
    }

    protected render(): void {
        const min = this.min;
        const max = this.max;
        const pos = this.position;
        const range = max - min || 1;
        const pct = Math.max(0, Math.min(100, ((pos - min) / range) * 100));

        const isVertical = this.getAttribute('orientation') === 'vertical';
        const isIndeterminate = this.hasAttribute('indeterminate');

        if (!isIndeterminate) {
            if (isVertical) {
                this._fill.style.height = `${pct}%`;
                this._fill.style.width = '';
            } else {
                this._fill.style.width = `${pct}%`;
                this._fill.style.height = '';
            }
        }

        this._label.textContent = `${Math.round(pct)}%`;

        // ARIA
        this.setAttribute('aria-valuenow', String(pos));
        this.setAttribute('aria-valuemin', String(min));
        this.setAttribute('aria-valuemax', String(max));
        if (isIndeterminate) {
            this.setAttribute('aria-busy', 'true');
            this.removeAttribute('aria-valuenow');
        } else {
            this.removeAttribute('aria-busy');
        }
    }

    // ── Public API ──────────────────────────────────────────────────────────
    /**
     * Incrementa `position` en `step` unidades.
     */
    stepIt(): void {
        this.position = Math.min(this.max, this.position + this.step);
    }

    /**
     * Reinicia la posición a `min`.
     */
    reset(): void {
        this.position = this.min;
    }

    // ── Property accessors ──────────────────────────────────────────────────
    get min(): number { return Number(this.getAttribute('min') ?? 0); }
    set min(v: number) { this.setAttribute('min', String(v)); }

    get max(): number { return Number(this.getAttribute('max') ?? 100); }
    set max(v: number) { this.setAttribute('max', String(v)); }

    get position(): number {
        return Number(this.getAttribute('position') ?? this.getAttribute('value') ?? 0);
    }
    set position(v: number) {
        this.setAttribute('position', String(v));
        this.setAttribute('value', String(v));
    }

    get step(): number { return Number(this.getAttribute('step') ?? 10); }
    set step(v: number) { this.setAttribute('step', String(v)); }

    get indeterminate(): boolean { return this.hasAttribute('indeterminate'); }
    set indeterminate(v: boolean) {
        if (v) this.setAttribute('indeterminate', '');
        else this.removeAttribute('indeterminate');
    }

    get barStyle(): string { return this.getAttribute('bar-style') || 'primary'; }
    set barStyle(v: string) { this.setAttribute('bar-style', v); }

    get orientation(): string { return this.getAttribute('orientation') || 'horizontal'; }
    set orientation(v: string) { this.setAttribute('orientation', v); }

    get showLabel(): boolean { return this.hasAttribute('show-label'); }
    set showLabel(v: boolean) {
        if (v) this.setAttribute('show-label', '');
        else this.removeAttribute('show-label');
    }
}

customElements.define('vcl-progressbar', VCLProgressBar);
