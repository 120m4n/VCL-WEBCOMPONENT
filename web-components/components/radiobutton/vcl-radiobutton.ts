import { VCLInputBaseElement } from '../../core/VCLInputBaseElement';

/**
 * <vcl-radiobutton> - Web Component Nativo de Botón de Opción / Radio Button (Sustituye a TRadioButton y TRadioButtonBase)
 */
export class VCLRadioButton extends VCLInputBaseElement {
    private _radioElement: HTMLInputElement;
    private _labelElement: HTMLSpanElement;

    static get observedAttributes() {
        return ['checked', 'text', 'name', 'value', 'disabled'];
    }

    constructor() {
        super();

        const wrapper = document.createElement('label');
        wrapper.className = 'vcl-radio-wrapper';

        this._radioElement = document.createElement('input');
        this._radioElement.type = 'radio';
        this._radioElement.className = 'vcl-radio-input';

        const customRadio = document.createElement('span');
        customRadio.className = 'vcl-radio-custom';

        this._labelElement = document.createElement('span');
        this._labelElement.className = 'vcl-radio-label';

        wrapper.appendChild(this._radioElement);
        wrapper.appendChild(customRadio);
        wrapper.appendChild(this._labelElement);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                margin: 6px;
                user-select: none;
            }
            .vcl-radio-wrapper {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                font-family: inherit;
                font-size: 14px;
                color: #2d3748;
            }
            .vcl-radio-input {
                position: absolute;
                opacity: 0;
                width: 0;
                height: 0;
            }
            .vcl-radio-custom {
                width: 18px;
                height: 18px;
                border: 2px solid #cbd5e0;
                border-radius: 50%;
                background-color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-sizing: border-box;
            }
            .vcl-radio-wrapper:hover .vcl-radio-custom {
                border-color: #3182ce;
            }
            .vcl-radio-input:focus-visible + .vcl-radio-custom {
                box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.3);
            }
            .vcl-radio-input:checked + .vcl-radio-custom {
                border-color: #3182ce;
                background-color: #ffffff;
            }
            .vcl-radio-input:checked + .vcl-radio-custom::after {
                content: '';
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #3182ce;
                animation: radioPop 0.15s ease-out;
            }
            @keyframes radioPop {
                0% { transform: scale(0); }
                100% { transform: scale(1); }
            }
            .vcl-radio-input:disabled + .vcl-radio-custom {
                background-color: #edf2f7;
                border-color: #e2e8f0;
                cursor: not-allowed;
            }
            .vcl-radio-wrapper:has(.vcl-radio-input:disabled) {
                cursor: not-allowed;
                opacity: 0.6;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(wrapper);

        // Listener de eventos nativo
        this._radioElement.addEventListener('change', () => {
            const isChecked = this._radioElement.checked;
            if (isChecked) this.setAttribute('checked', '');
            else this.removeAttribute('checked');

            this.dispatchEvent(new CustomEvent('vcl-change', {
                detail: {
                    checked: isChecked,
                    value: this.value || this.text,
                    name: this.name
                },
                bubbles: true,
                composed: true
            }));
        });
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;

        if (name === 'checked') {
            this._radioElement.checked = this.hasAttribute('checked');
        } else if (name === 'name') {
            this._radioElement.name = newValue || '';
        }
        this.render();
    }

    get checked(): boolean { return this._radioElement.checked; }
    set checked(val: boolean) {
        if (val) this.setAttribute('checked', '');
        else this.removeAttribute('checked');
        this._radioElement.checked = val;
    }

    get name(): string { return this.getAttribute('name') || ''; }
    set name(val: string) { this.setAttribute('name', val); }

    get text(): string { return this.getAttribute('text') || ''; }
    set text(val: string) { this.setAttribute('text', val); }

    protected render(): void {
        this._labelElement.textContent = this.text;
        this._radioElement.disabled = this.hasAttribute('disabled');
        if (this.name) this._radioElement.name = this.name;
    }
}

customElements.define('vcl-radiobutton', VCLRadioButton);
