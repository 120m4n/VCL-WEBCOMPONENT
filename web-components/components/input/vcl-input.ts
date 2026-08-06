import { VCLCoreElement } from '../../core/VCLCoreElement';

/**
 * <vcl-input> - Web Component Nativo de Entrada de Texto (Sustituye a TInput)
 */
export class VCLInput extends VCLCoreElement {
    private _inputElement: HTMLInputElement;

    static get observedAttributes() {
        return ['value', 'placeholder', 'disabled', 'button-click-on-enter'];
    }

    constructor() {
        super();
        this._inputElement = document.createElement('input');
        this._inputElement.type = 'text';

        const style = document.createElement('style');
        style.textContent = `
            :host { display: inline-block; margin: 4px; }
            input {
                padding: 8px 12px;
                font-size: 14px;
                border: 1px solid #cbd5e0;
                border-radius: 4px;
                outline: none;
                transition: border-color 0.15s ease-in-out;
            }
            input:focus {
                border-color: #3182ce;
                box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
            }
            input:disabled {
                background-color: #edf2f7;
                cursor: not-allowed;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._inputElement);

        this._inputElement.addEventListener('input', () => {
            this.setAttribute('value', this._inputElement.value);
            this.dispatchEvent(new CustomEvent('vcl-change', {
                detail: { value: this._inputElement.value },
                bubbles: true,
                composed: true
            }));
        });
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        if (name === 'value' && this._inputElement.value !== newValue) {
            this._inputElement.value = newValue || '';
        }
        this.render();
    }

    get value(): string { return this._inputElement.value; }
    set value(val: string) {
        this._inputElement.value = val;
        this.setAttribute('value', val);
    }

    protected render(): void {
        this._inputElement.placeholder = this.getAttribute('placeholder') || '';
        this._inputElement.disabled = this.hasAttribute('disabled');
    }
}

customElements.define('vcl-input', VCLInput);
