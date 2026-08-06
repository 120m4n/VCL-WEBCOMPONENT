import { VCLTextBaseElement } from '../../core/VCLTextBaseElement';

/**
 * <vcl-badge> - Web Component Nativo de Insignia/Badge (Sustituye a TBadge y TDBBadge)
 */
export class VCLBadge extends VCLTextBaseElement {
    private _badgeElement: HTMLSpanElement;

    static get observedAttributes() {
        return ['text', 'badge-style', 'text-color'];
    }

    constructor() {
        super();
        this._badgeElement = document.createElement('span');

        const style = document.createElement('style');
        style.textContent = `
            :host { display: inline-block; margin: 2px 4px; }
            .vcl-badge {
                display: inline-block;
                padding: 4px 10px;
                font-size: 11px;
                font-weight: 700;
                line-height: 1;
                color: #ffffff;
                text-align: center;
                white-space: nowrap;
                vertical-align: middle;
                border-radius: 50px;
                background-color: #718096;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: transform 0.15s ease, background-color 0.2s ease;
            }
            .vcl-badge:hover { transform: translateY(-1px); }
            .vcl-badge-success { background: linear-gradient(135deg, #48bb78, #38a169); }
            .vcl-badge-warning { background: linear-gradient(135deg, #ecc94b, #d69e2e); color: #1a202c; }
            .vcl-badge-important { background: linear-gradient(135deg, #f56565, #e53e3e); }
            .vcl-badge-info { background: linear-gradient(135deg, #4299e1, #3182ce); }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._badgeElement);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) this.render();
    }

    protected render(): void {
        this.applyTextStyle(this._badgeElement);
        this._badgeElement.className = 'vcl-badge';

        const bStyle = this.getAttribute('badge-style');
        if (bStyle) {
            this._badgeElement.classList.add(`vcl-badge-${bStyle}`);
        }
    }
}

customElements.define('vcl-badge', VCLBadge);
