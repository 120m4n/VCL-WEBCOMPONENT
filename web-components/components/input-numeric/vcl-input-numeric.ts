import { VCLInputBaseElement } from '../../core/VCLInputBaseElement';

/**
 * <vcl-input-numeric> - Web Component Nativo de Entrada Numérica (Sustituye a TInputNumeric)
 */
export class VCLInputNumeric extends VCLInputBaseElement {
    private _inputElement: HTMLInputElement;
    private _upBtn: HTMLButtonElement;
    private _downBtn: HTMLButtonElement;

    static get observedAttributes() {
        return ['value', 'min', 'max', 'step', 'precision', 'placeholder', 'disabled', 'readonly'];
    }

    constructor() {
        super();
        const container = document.createElement('div');
        container.className = 'vcl-numeric-container';

        this._inputElement = document.createElement('input');
        this._inputElement.type = 'number';
        this._inputElement.className = 'vcl-numeric-input';
        this._inputElement.step = 'any';

        const controls = document.createElement('div');
        controls.className = 'vcl-numeric-controls';

        this._upBtn = document.createElement('button');
        this._upBtn.type = 'button';
        this._upBtn.className = 'vcl-numeric-btn up';
        this._upBtn.textContent = '▲';

        this._downBtn = document.createElement('button');
        this._downBtn.type = 'button';
        this._downBtn.className = 'vcl-numeric-btn down';
        this._downBtn.textContent = '▼';

        controls.appendChild(this._upBtn);
        controls.appendChild(this._downBtn);

        container.appendChild(this._inputElement);
        container.appendChild(controls);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                margin: 6px;
            }
            .vcl-numeric-container {
                display: inline-flex;
                align-items: center;
                border: 1px solid #cbd5e0;
                border-radius: 6px;
                background-color: #ffffff;
                overflow: hidden;
                transition: border-color 0.15s ease, box-shadow 0.15s ease;
            }
            .vcl-numeric-container:focus-within {
                border-color: #3182ce;
                box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
            }
            .vcl-numeric-input {
                border: none;
                outline: none;
                padding: 8px 12px;
                font-family: inherit;
                font-size: 14px;
                color: #2d3748;
                width: 120px;
                text-align: right;
                -moz-appearance: textfield;
            }
            .vcl-numeric-input::-webkit-outer-spin-button,
            .vcl-numeric-input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            .vcl-numeric-controls {
                display: flex;
                flex-direction: column;
                border-left: 1px solid #e2e8f0;
                background: #f7fafc;
            }
            .vcl-numeric-btn {
                border: none;
                background: none;
                font-size: 8px;
                padding: 3px 8px;
                cursor: pointer;
                color: #4a5568;
                transition: background 0.15s ease;
            }
            .vcl-numeric-btn:hover { background-color: #edf2f7; color: #2b6cb0; }
            .vcl-numeric-btn:active { background-color: #e2e8f0; }
            .vcl-numeric-btn.down { border-top: 1px solid #e2e8f0; }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(container);

        // Listeners de entrada, cambio y pegado
        this._inputElement.addEventListener('input', () => this.handleValueChange());
        this._inputElement.addEventListener('change', () => this.handleValueChange());
        this._upBtn.addEventListener('click', () => this.stepUp());
        this._downBtn.addEventListener('click', () => this.stepDown());
    }

    private stepUp() {
        if (this.hasAttribute('disabled')) return;
        const step = parseFloat(this.getAttribute('step') || '1');
        this.numericValue = this.numericValue + step;
        this.handleValueChange();
    }

    private stepDown() {
        if (this.hasAttribute('disabled')) return;
        const step = parseFloat(this.getAttribute('step') || '1');
        this.numericValue = this.numericValue - step;
        this.handleValueChange();
    }

    private handleValueChange() {
        const rawStr = this._inputElement.value;
        if (rawStr === '' || rawStr === null) return;

        let val = parseFloat(rawStr);
        if (isNaN(val)) return;

        const min = this.hasAttribute('min') ? parseFloat(this.getAttribute('min')!) : -Infinity;
        const max = this.hasAttribute('max') ? parseFloat(this.getAttribute('max')!) : Infinity;

        if (val < min) val = min;
        if (val > max) val = max;

        const precision = this.hasAttribute('precision') ? parseInt(this.getAttribute('precision')!, 10) : null;
        if (precision !== null && !isNaN(precision)) {
            val = parseFloat(val.toFixed(precision));
        }

        this.setAttribute('value', val.toString());

        this.dispatchEvent(new CustomEvent('vcl-change', {
            detail: { value: val, rawValue: rawStr },
            bubbles: true,
            composed: true
        }));
    }

    attributeChangedCallback() { this.render(); }

    get numericValue(): number { return parseFloat(this._inputElement.value) || 0; }
    set numericValue(val: number) {
        this._inputElement.value = val.toString();
        this.setAttribute('value', val.toString());
    }

    protected render(): void {
        const valAttr = this.getAttribute('value');
        if (valAttr !== null && this._inputElement.value !== valAttr) {
            this._inputElement.value = valAttr;
        }
        this._inputElement.placeholder = this.getAttribute('placeholder') || '0';
        this._inputElement.disabled = this.hasAttribute('disabled');
        this._inputElement.readOnly = this.hasAttribute('readonly');

        if (this.hasAttribute('min')) this._inputElement.min = this.getAttribute('min')!;
        if (this.hasAttribute('max')) this._inputElement.max = this.getAttribute('max')!;
        this._inputElement.step = this.getAttribute('step') || 'any';
    }
}

customElements.define('vcl-input-numeric', VCLInputNumeric);
