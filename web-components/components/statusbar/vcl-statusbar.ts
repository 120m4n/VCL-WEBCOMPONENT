import { VCLContainerElement } from '../../core/VCLContainerElement';
import { VCLControlElement } from '../../core/VCLControlElement';

// ─────────────────────────────────────────────────────────────────────────────
// VCLStatusPanel — <vcl-statuspanel>
// Sustituye a TStatusPanel de Delphi 4 (comctrls.pas)
// ─────────────────────────────────────────────────────────────────────────────
export class VCLStatusPanel extends VCLControlElement {

    static get observedAttributes() {
        return ['text', 'width', 'spring', 'alignment', 'bevel', 'icon'];
    }

    private _container: HTMLDivElement;
    private _iconEl: HTMLSpanElement;
    private _textEl: HTMLSpanElement;

    constructor() {
        super();

        this._container = document.createElement('div');
        this._container.className = 'vcl-statuspanel';

        this._iconEl = document.createElement('span');
        this._iconEl.className = 'panel-icon';

        this._textEl = document.createElement('span');
        this._textEl.className = 'panel-text';

        this._container.appendChild(this._iconEl);
        this._container.appendChild(this._textEl);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: flex;
                align-items: center;
                box-sizing: border-box;
                min-width: 0;
                overflow: hidden;
                flex-shrink: 0;
            }

            :host([spring]) {
                flex: 1 1 0;
                flex-shrink: 1;
            }

            :host([hidden]) {
                display: none !important;
            }

            .vcl-statuspanel {
                display: flex;
                align-items: center;
                gap: 5px;
                width: 100%;
                height: 100%;
                padding: 0 8px;
                box-sizing: border-box;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                user-select: none;
                cursor: default;
                transition: background 0.15s ease;
                border-right: 1px solid rgba(0,0,0,0.08);
            }

            :host(:last-child) .vcl-statuspanel {
                border-right: none;
            }

            /* Bevel styles — lowered (default) */
            :host(:not([bevel])) .vcl-statuspanel,
            :host([bevel="lowered"]) .vcl-statuspanel {
                box-shadow: inset 1px 1px 0 rgba(0,0,0,0.15), inset -1px -1px 0 rgba(255,255,255,0.7);
            }

            :host([bevel="raised"]) .vcl-statuspanel {
                box-shadow: inset -1px -1px 0 rgba(0,0,0,0.15), inset 1px 1px 0 rgba(255,255,255,0.7);
            }

            :host([bevel="none"]) .vcl-statuspanel {
                box-shadow: none;
            }

            /* Alignment */
            :host([alignment="center"]) .vcl-statuspanel { justify-content: center; }
            :host([alignment="right"])  .vcl-statuspanel { justify-content: flex-end; }
            :host([alignment="left"])   .vcl-statuspanel { justify-content: flex-start; }

            .vcl-statuspanel:hover {
                background: rgba(0,0,0,0.04);
            }

            .panel-icon {
                display: none;
                font-size: 13px;
                line-height: 1;
                flex-shrink: 0;
            }

            :host([icon]) .panel-icon {
                display: inline-block;
            }

            .panel-text {
                font-size: 12px;
                font-family: inherit;
                color: inherit;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._container);

        this._container.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('vcl-panel-click', {
                bubbles: true,
                composed: true,
                detail: { panel: this, text: this.text }
            }));
        });
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (oldValue === newValue) return;
        this.render();
    }

    protected render(): void {
        // Text
        this._textEl.textContent = this.getAttribute('text') || '';

        // Icon
        const icon = this.getAttribute('icon');
        this._iconEl.textContent = icon || '';

        // Width (applied to host via style)
        const w = this.getAttribute('width');
        if (w && !this.hasAttribute('spring')) {
            this.style.width = w;
            this.style.flexShrink = '0';
        } else if (!this.hasAttribute('spring')) {
            this.style.width = 'auto';
        }
    }

    // ── Property accessors ──────────────────────────────────────────────────
    get text(): string { return this.getAttribute('text') || ''; }
    set text(v: string) { this.setAttribute('text', v); }

    get bevel(): string { return this.getAttribute('bevel') || 'lowered'; }
    set bevel(v: string) { this.setAttribute('bevel', v); }

    get alignment(): string { return this.getAttribute('alignment') || 'left'; }
    set alignment(v: string) { this.setAttribute('alignment', v); }

    get spring(): boolean { return this.hasAttribute('spring'); }
    set spring(v: boolean) {
        if (v) this.setAttribute('spring', '');
        else this.removeAttribute('spring');
    }

    get icon(): string { return this.getAttribute('icon') || ''; }
    set icon(v: string) { this.setAttribute('icon', v); }
}

customElements.define('vcl-statuspanel', VCLStatusPanel);


// ─────────────────────────────────────────────────────────────────────────────
// VCLStatusBar — <vcl-statusbar>
// Sustituye a TStatusBar de Delphi 4 (comctrls.pas)
// ─────────────────────────────────────────────────────────────────────────────
export class VCLStatusBar extends VCLContainerElement {

    static get observedAttributes() {
        return ['simple-text', 'simple-panel', 'size-grip'];
    }

    private _bar: HTMLDivElement;
    private _simpleText: HTMLSpanElement;
    private _sizeGrip: HTMLDivElement;
    private _slotInner: HTMLSlotElement;

    constructor() {
        super();
        this.setAttribute('role', 'status');

        this._bar = document.createElement('div');
        this._bar.className = 'vcl-statusbar';

        // Simple text layer
        this._simpleText = document.createElement('span');
        this._simpleText.className = 'simple-text';

        // Panels slot
        this._slotInner = document.createElement('slot');

        // Size grip
        this._sizeGrip = document.createElement('div');
        this._sizeGrip.className = 'size-grip';
        this._sizeGrip.setAttribute('aria-hidden', 'true');
        // Classic Win32 resize grip SVG dots
        this._sizeGrip.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="10" cy="10" r="1.2" fill="currentColor" opacity="0.5"/>
                <circle cx="6"  cy="10" r="1.2" fill="currentColor" opacity="0.35"/>
                <circle cx="10" cy="6"  r="1.2" fill="currentColor" opacity="0.35"/>
                <circle cx="2"  cy="10" r="1.2" fill="currentColor" opacity="0.2"/>
                <circle cx="6"  cy="6"  r="1.2" fill="currentColor" opacity="0.2"/>
                <circle cx="10" cy="2"  r="1.2" fill="currentColor" opacity="0.2"/>
            </svg>`;

        this._bar.appendChild(this._simpleText);
        this._bar.appendChild(this._slotInner);
        this._bar.appendChild(this._sizeGrip);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                box-sizing: border-box;
                width: 100%;
            }

            :host([hidden]) {
                display: none !important;
            }

            .vcl-statusbar {
                display: flex;
                flex-direction: row;
                align-items: stretch;
                height: 24px;
                background: linear-gradient(180deg, #e8ecf0 0%, #dde1e7 100%);
                border-top: 1px solid #b0b8c4;
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.55);
                font-size: 12px;
                font-family: inherit;
                color: #374151;
                box-sizing: border-box;
                position: relative;
                overflow: hidden;
                user-select: none;
            }

            /* Simple text mode */
            .simple-text {
                display: none;
                align-items: center;
                padding: 0 8px;
                font-size: 12px;
                color: inherit;
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            :host([simple-panel]) .simple-text {
                display: flex;
            }

            :host([simple-panel]) ::slotted(vcl-statuspanel) {
                display: none;
            }

            /* Slot panels */
            ::slotted(vcl-statuspanel) {
                height: 100%;
            }

            /* Size grip */
            .size-grip {
                display: none;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 100%;
                flex-shrink: 0;
                cursor: se-resize;
                color: #6b7280;
                margin-left: auto;
            }

            :host([size-grip]) .size-grip {
                display: flex;
            }

            /* Dark mode */
            @media (prefers-color-scheme: dark) {
                .vcl-statusbar {
                    background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
                    border-top-color: #374151;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
                    color: #d1d5db;
                }
                .size-grip { color: #6b7280; }
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._bar);
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (oldValue === newValue) return;
        this.render();
    }

    protected render(): void {
        // Simple text content
        this._simpleText.textContent = this.getAttribute('simple-text') || '';
    }

    // ── Property accessors ──────────────────────────────────────────────────
    get simpleText(): string { return this.getAttribute('simple-text') || ''; }
    set simpleText(v: string) { this.setAttribute('simple-text', v); }

    get simplePanel(): boolean { return this.hasAttribute('simple-panel'); }
    set simplePanel(v: boolean) {
        if (v) this.setAttribute('simple-panel', '');
        else this.removeAttribute('simple-panel');
    }

    get sizeGrip(): boolean { return this.hasAttribute('size-grip'); }
    set sizeGrip(v: boolean) {
        if (v) this.setAttribute('size-grip', '');
        else this.removeAttribute('size-grip');
    }
}

customElements.define('vcl-statusbar', VCLStatusBar);
