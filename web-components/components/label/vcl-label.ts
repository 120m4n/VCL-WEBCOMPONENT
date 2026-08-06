import { VCLCoreElement } from '../../core/VCLCoreElement';

/**
 * <vcl-label> - Web Component Nativo de Etiqueta (Sustituye a TLabel)
 */
export class VCLLabel extends VCLCoreElement {
    private _labelElement: HTMLSpanElement;

    static get observedAttributes() {
        return ['text', 'label-style', 'text-color'];
    }

    constructor() {
        super();
        this._labelElement = document.createElement('span');

        const style = document.createElement('style');
        style.textContent = `
            :host { display: inline-block; margin: 4px; }
            .vcl-label {
                display: inline-block;
                padding: 4px 8px;
                font-size: 12px;
                font-weight: 600;
                line-height: 1;
                color: #ffffff;
                text-align: center;
                white-space: nowrap;
                vertical-align: baseline;
                border-radius: 4px;
                background-color: #6c757d;
            }
            .vcl-label-success { background-color: #28a745; }
            .vcl-label-warning { background-color: #ffc107; color: #212529; }
            .vcl-label-important { background-color: #dc3545; }
            .vcl-label-info { background-color: #17a2b8; }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._labelElement);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) this.render();
    }

    get text(): string { return this.getAttribute('text') || ''; }
    set text(val: string) { this.setAttribute('text', val); }

    protected render(): void {
        this._labelElement.textContent = this.text;
        this._labelElement.className = 'vcl-label';
        
        const lStyle = this.getAttribute('label-style');
        if (lStyle) {
            this._labelElement.classList.add(`vcl-label-${lStyle}`);
        }

        const textColor = this.getAttribute('text-color');
        if (textColor) {
            this._labelElement.style.color = textColor;
        }
    }
}

customElements.define('vcl-label', VCLLabel);
