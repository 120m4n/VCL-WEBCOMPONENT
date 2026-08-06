import { VCLCoreElement } from '../../core/VCLCoreElement';

/**
 * <vcl-button> - Web Component Nativo de Botón (Sustituye a TButton)
 */
export class VCLButton extends VCLCoreElement {
    private _buttonElement: HTMLButtonElement;

    static get observedAttributes() {
        return ['text', 'button-style', 'button-size', 'disabled'];
    }

    constructor() {
        super();
        this._buttonElement = document.createElement('button');

        const style = document.createElement('style');
        style.textContent = `
            :host { display: inline-block; margin: 4px; flex-shrink: 0; }
            button {
                display: inline-block;
                padding: 8px 16px;
                font-size: 14px;
                font-weight: 500;
                line-height: 1.42857143;
                text-align: center;
                white-space: nowrap;
                vertical-align: middle;
                cursor: pointer;
                border: 1px solid transparent;
                border-radius: 4px;
                user-select: none;
                background-color: #e2e8f0;
                color: #2d3748;
                transition: all 0.15s ease-in-out;
                flex-shrink: 0;
                box-sizing: border-box;
            }
            button:hover { background-color: #cbd5e0; }
            button:disabled { opacity: 0.6; cursor: not-allowed; }
            .btn-primary { color: #fff; background-color: #3182ce; border-color: #2b6cb0; }
            .btn-primary:hover { background-color: #2b6cb0; }
            .btn-success { color: #fff; background-color: #38a169; border-color: #2f855a; }
            .btn-success:hover { background-color: #2f855a; }
            .btn-danger { color: #fff; background-color: #e53e3e; border-color: #c53030; }
            .btn-danger:hover { background-color: #c53030; }
            .btn-lg { padding: 12px 24px; font-size: 16px; border-radius: 6px; }
            .btn-sm { padding: 4px 8px; font-size: 12px; border-radius: 3px; }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._buttonElement);

        // Disparo de CustomEvent nativo
        this._buttonElement.addEventListener('click', (e) => {
            if (this.hasAttribute('disabled')) {
                e.stopImmediatePropagation();
                return;
            }
            this.dispatchEvent(new CustomEvent('vcl-click', {
                detail: { nativeEvent: e },
                bubbles: true,
                composed: true
            }));
        });
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) this.render();
    }

    protected render(): void {
        this._buttonElement.textContent = this.getAttribute('text') || 'Botón';
        this._buttonElement.className = '';

        const bStyle = this.getAttribute('button-style');
        if (bStyle) this._buttonElement.classList.add(`btn-${bStyle}`);

        const bSize = this.getAttribute('button-size');
        if (bSize) this._buttonElement.classList.add(`btn-${bSize}`);

        this._buttonElement.disabled = this.hasAttribute('disabled');
    }
}

customElements.define('vcl-button', VCLButton);
