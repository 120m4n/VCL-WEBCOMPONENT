import { VCLInputBaseElement } from '../../core/VCLInputBaseElement';

/**
 * <vcl-checkbox> - Web Component Nativo de Casilla de Verificación (Sustituye a TCheckBox y TCheckBoxBase)
 */
export class VCLCheckBox extends VCLInputBaseElement {
    private _checkboxElement: HTMLInputElement;
    private _labelElement: HTMLSpanElement;

    static get observedAttributes() {
        return ['checked', 'text', 'disabled'];
    }

    constructor() {
        super();

        const wrapper = document.createElement('label');
        wrapper.className = 'vcl-checkbox-wrapper';

        this._checkboxElement = document.createElement('input');
        this._checkboxElement.type = 'checkbox';
        this._checkboxElement.className = 'vcl-checkbox-input';

        const customBox = document.createElement('span');
        customBox.className = 'vcl-checkbox-custom';

        this._labelElement = document.createElement('span');
        this._labelElement.className = 'vcl-checkbox-label';

        wrapper.appendChild(this._checkboxElement);
        wrapper.appendChild(customBox);
        wrapper.appendChild(this._labelElement);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                margin: 6px;
                user-select: none;
            }
            .vcl-checkbox-wrapper {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                font-family: inherit;
                font-size: 14px;
                color: #2d3748;
            }
            .vcl-checkbox-input {
                position: absolute;
                opacity: 0;
                width: 0;
                height: 0;
            }
            .vcl-checkbox-custom {
                width: 18px;
                height: 18px;
                border: 2px solid #cbd5e0;
                border-radius: 4px;
                background-color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-sizing: border-box;
            }
            .vcl-checkbox-wrapper:hover .vcl-checkbox-custom {
                border-color: #3182ce;
            }
            .vcl-checkbox-input:focus-visible + .vcl-checkbox-custom {
                box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.3);
            }
            .vcl-checkbox-input:checked + .vcl-checkbox-custom {
                background-color: #3182ce;
                border-color: #3182ce;
            }
            .vcl-checkbox-input:checked + .vcl-checkbox-custom::after {
                content: '';
                width: 5px;
                height: 9px;
                border: solid #ffffff;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg) translate(-1px, -1px);
            }
            .vcl-checkbox-input:disabled + .vcl-checkbox-custom {
                background-color: #edf2f7;
                border-color: #e2e8f0;
                cursor: not-allowed;
            }
            .vcl-checkbox-wrapper:has(.vcl-checkbox-input:disabled) {
                cursor: not-allowed;
                opacity: 0.6;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(wrapper);

        // Eventos DOM Nativos
        this._checkboxElement.addEventListener('change', () => {
            const isChecked = this._checkboxElement.checked;
            if (isChecked) this.setAttribute('checked', '');
            else this.removeAttribute('checked');

            this.dispatchEvent(new CustomEvent('vcl-change', {
                detail: { checked: isChecked, value: this.text },
                bubbles: true,
                composed: true
            }));
        });
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;

        if (name === 'checked') {
            this._checkboxElement.checked = this.hasAttribute('checked');
        }
        this.render();
    }

    get checked(): boolean { return this._checkboxElement.checked; }
    set checked(val: boolean) {
        if (val) this.setAttribute('checked', '');
        else this.removeAttribute('checked');
        this._checkboxElement.checked = val;
    }

    get text(): string { return this.getAttribute('text') || ''; }
    set text(val: string) { this.setAttribute('text', val); }

    protected render(): void {
        this._labelElement.textContent = this.text;
        this._checkboxElement.disabled = this.hasAttribute('disabled');
    }
}

customElements.define('vcl-checkbox', VCLCheckBox);
