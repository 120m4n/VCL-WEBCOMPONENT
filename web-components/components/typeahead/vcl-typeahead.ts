import { VCLInputBaseElement } from '../../core/VCLInputBaseElement';

/**
 * <vcl-typeahead> - Web Component Nativo de Entrada Autocompletada (Sustituye a TInputTypeaHead)
 */
export class VCLTypeAhead extends VCLInputBaseElement {
    private _inputElement: HTMLInputElement;
    private _dropdownElement: HTMLDivElement;

    static get observedAttributes() {
        return ['value', 'placeholder', 'disabled'];
    }

    constructor() {
        super();
        const container = document.createElement('div');
        container.className = 'vcl-typeahead-container';

        this._inputElement = document.createElement('input');
        this._inputElement.type = 'text';
        this._inputElement.className = 'vcl-typeahead-input';

        this._dropdownElement = document.createElement('div');
        this._dropdownElement.className = 'vcl-typeahead-dropdown';

        const slot = document.createElement('slot');

        container.appendChild(this._inputElement);
        container.appendChild(this._dropdownElement);
        container.appendChild(slot);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                margin: 6px;
                position: relative;
            }
            .vcl-typeahead-container {
                position: relative;
                width: 100%;
            }
            .vcl-typeahead-input {
                width: 100%;
                padding: 8px 12px;
                font-family: inherit;
                font-size: 14px;
                color: #2d3748;
                background-color: #ffffff;
                border: 1px solid #cbd5e0;
                border-radius: 6px;
                outline: none;
                box-sizing: border-box;
                transition: border-color 0.15s ease, box-shadow 0.15s ease;
            }
            .vcl-typeahead-input:focus {
                border-color: #3182ce;
                box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
            }
            .vcl-typeahead-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #ffffff;
                border: 1px solid #cbd5e0;
                border-radius: 6px;
                margin-top: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                max-height: 160px;
                overflow-y: auto;
                display: none;
                z-index: 100;
            }
            .vcl-typeahead-dropdown.active {
                display: block;
            }
            .vcl-typeahead-item {
                padding: 8px 12px;
                font-size: 14px;
                color: #2d3748;
                cursor: pointer;
                transition: background 0.15s ease;
            }
            .vcl-typeahead-item:hover {
                background-color: #edf2f7;
                color: #3182ce;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(container);

        slot.addEventListener('slotchange', () => this.filterSuggestions());

        this._inputElement.addEventListener('input', () => {
            this.setAttribute('value', this._inputElement.value);
            this.filterSuggestions();
            this.emitChangeEvent(this._inputElement.value);
        });

        document.addEventListener('click', (e) => {
            if (!this.contains(e.target as Node)) {
                this._dropdownElement.classList.remove('active');
            }
        });
    }

    private filterSuggestions() {
        const query = this._inputElement.value.toLowerCase().trim();
        this._dropdownElement.innerHTML = '';

        if (!query) {
            this._dropdownElement.classList.remove('active');
            return;
        }

        const options = Array.from(this.querySelectorAll('option'));
        const matches = options.filter(opt => opt.textContent?.toLowerCase().includes(query));

        if (matches.length === 0) {
            this._dropdownElement.classList.remove('active');
            return;
        }

        matches.forEach(opt => {
            const item = document.createElement('div');
            item.className = 'vcl-typeahead-item';
            item.textContent = opt.textContent;
            item.addEventListener('click', () => {
                const val = opt.value || opt.textContent || '';
                this._inputElement.value = val;
                this.setAttribute('value', val);
                this._dropdownElement.classList.remove('active');

                this.dispatchEvent(new CustomEvent('vcl-select', {
                    detail: { value: val },
                    bubbles: true,
                    composed: true
                }));
            });
            this._dropdownElement.appendChild(item);
        });

        this._dropdownElement.classList.add('active');
    }

    attributeChangedCallback() { this.render(); }

    protected render(): void {
        this._inputElement.placeholder = this.getAttribute('placeholder') || 'Escriba para buscar...';
        this._inputElement.disabled = this.hasAttribute('disabled');
    }
}

customElements.define('vcl-typeahead', VCLTypeAhead);
