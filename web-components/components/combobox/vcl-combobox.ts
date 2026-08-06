import { VCLInputBaseElement } from '../../core/VCLInputBaseElement';

/**
 * <vcl-combobox> - Web Component Nativo de Cuadro Combinado / Dropdown (Sustituye a TCombobox)
 */
export class VCLCombobox extends VCLInputBaseElement {
    private _selectElement: HTMLSelectElement;

    static get observedAttributes() {
        return ['value', 'placeholder', 'disabled'];
    }

    constructor() {
        super();
        this._selectElement = document.createElement('select');

        const slot = document.createElement('slot');

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                margin: 6px;
            }
            select {
                padding: 8px 12px;
                font-family: inherit;
                font-size: 14px;
                color: #2d3748;
                background-color: #ffffff;
                border: 1px solid #cbd5e0;
                border-radius: 6px;
                outline: none;
                cursor: pointer;
                transition: border-color 0.15s ease, box-shadow 0.15s ease;
                min-width: 160px;
            }
            select:focus {
                border-color: #3182ce;
                box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
            }
            select:disabled {
                background-color: #edf2f7;
                border-color: #e2e8f0;
                cursor: not-allowed;
                opacity: 0.7;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._selectElement);
        this._shadowRoot.appendChild(slot);

        // Copiar hijos <option> del slot al select nativo
        slot.addEventListener('slotchange', () => this.syncOptions());

        this._selectElement.addEventListener('change', () => {
            const selectedOpt = this._selectElement.options[this._selectElement.selectedIndex];
            const val = this._selectElement.value;
            this.setAttribute('value', val);

            this.dispatchEvent(new CustomEvent('vcl-change', {
                detail: { value: val, text: selectedOpt ? selectedOpt.text : '' },
                bubbles: true,
                composed: true
            }));
        });
    }

    private syncOptions() {
        this._selectElement.innerHTML = '';
        const options = this.querySelectorAll('option');
        options.forEach(opt => {
            const newOpt = document.createElement('option');
            newOpt.value = opt.value;
            newOpt.textContent = opt.textContent;
            newOpt.selected = opt.hasAttribute('selected');
            this._selectElement.appendChild(newOpt);
        });

        const valAttr = this.getAttribute('value');
        if (valAttr !== null) this._selectElement.value = valAttr;
    }

    attributeChangedCallback() { this.render(); }

    get value(): string { return this._selectElement.value; }
    set value(val: string) {
        this._selectElement.value = val;
        this.setAttribute('value', val);
    }

    protected render(): void {
        this._selectElement.disabled = this.hasAttribute('disabled');
    }
}

customElements.define('vcl-combobox', VCLCombobox);
