import { VCLContainerElement } from '../../core/VCLContainerElement';

/**
 * <vcl-well> - Web Component Nativo de Panel Contenedor Remarcado / Callout Box (Sustituye a TWell)
 */
export class VCLWell extends VCLContainerElement {
    private _wellContainer: HTMLDivElement;

    static get observedAttributes() {
        return ['color', 'size', 'well-style'];
    }

    constructor() {
        super();
        this._wellContainer = document.createElement('div');
        this._wellContainer.className = 'vcl-well-container';

        const slot = document.createElement('slot');
        this._wellContainer.appendChild(slot);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                margin: 12px 0;
            }
            .vcl-well-container {
                min-height: 20px;
                padding: 19px;
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 10px;
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.04);
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            :host([size="small"]) .vcl-well-container { padding: 10px 14px; border-radius: 6px; }
            :host([size="large"]) .vcl-well-container { padding: 28px; border-radius: 14px; }

            :host([well-style="primary"]) .vcl-well-container { background-color: #ebf8ff; border-color: #bee3f8; }
            :host([well-style="success"]) .vcl-well-container { background-color: #f0fff4; border-color: #c6f6d5; }
            :host([well-style="warning"]) .vcl-well-container { background-color: #fffaf0; border-color: #feebc8; }
            :host([well-style="danger"]) .vcl-well-container { background-color: #fff5f5; border-color: #fed7d7; }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._wellContainer);
    }

    attributeChangedCallback() { this.render(); }

    get color(): string { return this.getAttribute('color') || ''; }
    set color(val: string) { this.setAttribute('color', val); }

    protected render(): void {
        if (this.color) {
            this._wellContainer.style.backgroundColor = this.color;
        }
    }
}

customElements.define('vcl-well', VCLWell);
