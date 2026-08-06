import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * <vcl-listbox> - Web Component Nativo de Cuadro de Lista (Sustituye a TListbox)
 */
export class VCLListBox extends VCLControlElement {
    private _listContainer: HTMLUListElement;

    static get observedAttributes() {
        return ['selected-value', 'disabled'];
    }

    constructor() {
        super();
        this._listContainer = document.createElement('ul');
        this._listContainer.className = 'vcl-listbox-ul';

        const slot = document.createElement('slot');

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                margin: 6px;
                width: 220px;
            }
            .vcl-listbox-ul {
                list-style: none;
                margin: 0;
                padding: 4px;
                background-color: #ffffff;
                border: 1px solid #cbd5e0;
                border-radius: 8px;
                max-height: 180px;
                overflow-y: auto;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            ::slotted(li) {
                padding: 8px 12px;
                font-family: inherit;
                font-size: 14px;
                color: #2d3748;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.15s ease;
            }
            ::slotted(li:hover) {
                background-color: #edf2f7;
            }
            ::slotted(li[selected]) {
                background-color: #3182ce !important;
                color: #ffffff !important;
                font-weight: 600;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._listContainer);
        this._shadowRoot.appendChild(slot);

        slot.addEventListener('slotchange', () => this.initItems());
    }

    private initItems() {
        const items = this.querySelectorAll('li');
        items.forEach((item) => {
            item.addEventListener('click', () => {
                if (this.hasAttribute('disabled')) return;
                items.forEach(i => i.removeAttribute('selected'));
                item.setAttribute('selected', '');

                const val = item.getAttribute('value') || item.textContent || '';
                this.setAttribute('selected-value', val);

                this.dispatchEvent(new CustomEvent('vcl-selection-change', {
                    detail: { value: val, text: item.textContent },
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }

    attributeChangedCallback() { this.render(); }

    protected render(): void {
        if (this.hasAttribute('disabled')) {
            this._listContainer.style.opacity = '0.6';
            this._listContainer.style.pointerEvents = 'none';
        } else {
            this._listContainer.style.opacity = '1';
            this._listContainer.style.pointerEvents = 'auto';
        }
    }
}

customElements.define('vcl-listbox', VCLListBox);
