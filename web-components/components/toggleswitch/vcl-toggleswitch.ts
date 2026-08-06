import { VCLInputBaseElement } from '../../core/VCLInputBaseElement';

/**
 * <vcl-toggleswitch> - Web Component Nativo de Interruptor Deslizante (Sustituye a TToggleSwitch)
 */
export class VCLToggleSwitch extends VCLInputBaseElement {
    private _inputElement: HTMLInputElement;
    private _labelElement: HTMLSpanElement;

    static get observedAttributes() {
        return ['checked', 'text', 'disabled', 'color-style'];
    }

    constructor() {
        super();
        const wrapper = document.createElement('label');
        wrapper.className = 'vcl-switch-wrapper';

        this._inputElement = document.createElement('input');
        this._inputElement.type = 'checkbox';
        this._inputElement.className = 'vcl-switch-input';

        const slider = document.createElement('span');
        slider.className = 'vcl-switch-slider';

        this._labelElement = document.createElement('span');
        this._labelElement.className = 'vcl-switch-label';

        wrapper.appendChild(this._inputElement);
        wrapper.appendChild(slider);
        wrapper.appendChild(this._labelElement);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                margin: 6px;
                user-select: none;
            }
            .vcl-switch-wrapper {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                font-family: inherit;
                font-size: 14px;
                color: #2d3748;
            }
            .vcl-switch-input {
                position: absolute;
                opacity: 0;
                width: 0;
                height: 0;
            }
            .vcl-switch-slider {
                position: relative;
                width: 44px;
                height: 24px;
                background-color: #cbd5e0;
                border-radius: 24px;
                transition: background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .vcl-switch-slider::before {
                content: '';
                position: absolute;
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: #ffffff;
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .vcl-switch-input:checked + .vcl-switch-slider {
                background-color: #3182ce;
            }
            :host([color-style="success"]) .vcl-switch-input:checked + .vcl-switch-slider { background-color: #38a169; }
            :host([color-style="danger"]) .vcl-switch-input:checked + .vcl-switch-slider { background-color: #e53e3e; }

            .vcl-switch-input:checked + .vcl-switch-slider::before {
                transform: translateX(20px);
            }
            .vcl-switch-input:disabled + .vcl-switch-slider {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(wrapper);

        this._inputElement.addEventListener('change', () => {
            const isChecked = this._inputElement.checked;
            if (isChecked) this.setAttribute('checked', '');
            else this.removeAttribute('checked');

            this.dispatchEvent(new CustomEvent('vcl-change', {
                detail: { checked: isChecked, value: this.text },
                bubbles: true,
                composed: true
            }));
        });
    }

    attributeChangedCallback() { this.render(); }

    get text(): string { return this.getAttribute('text') || ''; }
    set text(val: string) { this.setAttribute('text', val); }

    get checked(): boolean { return this._inputElement.checked; }
    set checked(val: boolean) {
        if (val) this.setAttribute('checked', '');
        else this.removeAttribute('checked');
        this._inputElement.checked = val;
    }

    protected render(): void {
        this._labelElement.textContent = this.getAttribute('text') || '';
        this._inputElement.checked = this.hasAttribute('checked');
        this._inputElement.disabled = this.hasAttribute('disabled');
    }
}

customElements.define('vcl-toggleswitch', VCLToggleSwitch);
