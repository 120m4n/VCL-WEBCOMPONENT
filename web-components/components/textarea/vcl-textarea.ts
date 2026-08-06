import { VCLInputBaseElement } from '../../core/VCLInputBaseElement';

/**
 * <vcl-textarea> - Web Component Nativo de Área de Texto / Textarea (Sustituye a TTextArea)
 */
export class VCLTextArea extends VCLInputBaseElement {
    private _textareaElement: HTMLTextAreaElement;

    static get observedAttributes() {
        return ['value', 'placeholder', 'rows', 'cols', 'readonly', 'disabled', 'wrap'];
    }

    constructor() {
        super();
        this._textareaElement = document.createElement('textarea');

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                margin: 6px;
                width: 100%;
                max-width: 100%;
            }
            textarea {
                width: 100%;
                min-height: 80px;
                padding: 10px 14px;
                font-family: inherit;
                font-size: 14px;
                line-height: 1.5;
                color: #2d3748;
                background-color: #ffffff;
                border: 1px solid #cbd5e0;
                border-radius: 6px;
                outline: none;
                resize: vertical;
                box-sizing: border-box;
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            }
            textarea:focus {
                border-color: #3182ce;
                box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
            }
            textarea:disabled {
                background-color: #edf2f7;
                border-color: #e2e8f0;
                cursor: not-allowed;
                opacity: 0.7;
            }
            textarea[readonly] {
                background-color: #f7fafc;
                border-color: #e2e8f0;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._textareaElement);

        // Eventos DOM Nativos
        this._textareaElement.addEventListener('input', () => {
            this.setAttribute('value', this._textareaElement.value);
            this.emitChangeEvent(this._textareaElement.value);
        });
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;

        if (name === 'value' && this._textareaElement.value !== newValue) {
            this._textareaElement.value = newValue || '';
        }
        this.render();
    }

    get value(): string { return this._textareaElement.value; }
    set value(val: string) {
        this._textareaElement.value = val;
        this.setAttribute('value', val);
    }

    get rows(): number { return parseInt(this.getAttribute('rows') || '3', 10); }
    set rows(val: number) { this.setAttribute('rows', val.toString()); }

    protected render(): void {
        this._textareaElement.placeholder = this.getAttribute('placeholder') || '';
        this._textareaElement.rows = this.rows;

        if (this.hasAttribute('cols')) {
            this._textareaElement.cols = parseInt(this.getAttribute('cols')!, 10);
        }

        this._textareaElement.disabled = this.hasAttribute('disabled');
        this._textareaElement.readOnly = this.hasAttribute('readonly');
    }
}

customElements.define('vcl-textarea', VCLTextArea);
