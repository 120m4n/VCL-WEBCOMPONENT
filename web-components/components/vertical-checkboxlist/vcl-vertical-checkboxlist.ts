import { VCLControlElement } from '../../core/VCLControlElement';

export interface CheckBoxListItem {
    id: string;
    label: string;
    checked?: boolean;
    disabled?: boolean;
}

/**
 * <vcl-vertical-checkboxlist> — Web Component Nativo de Lista Vertical de Checkboxes
 * Sustituye a TVerticalCheckBoxList / TVerticalCheckBoxItem de VCL.JS
 */
export class VCLVerticalCheckBoxList extends VCLControlElement {
    static get observedAttributes() {
        return ['searchable', 'placeholder', 'disabled'];
    }

    private _container: HTMLDivElement;
    private _searchInput: HTMLInputElement | null = null;
    private _listContainer: HTMLDivElement;
    private _items: CheckBoxListItem[] = [];

    constructor() {
        super();

        this._container = document.createElement('div');
        this._container.className = 'vcl-vcheckbox-container';

        this._listContainer = document.createElement('div');
        this._listContainer.className = 'vcl-vcheckbox-list';

        this._container.appendChild(this._listContainer);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                box-sizing: border-box;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                background-color: #ffffff;
                padding: 12px;
                max-height: 280px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .vcl-vcheckbox-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                gap: 8px;
            }

            .search-box {
                padding: 6px 10px;
                font-size: 13px;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                outline: none;
                transition: border-color 0.15s;
            }

            .search-box:focus {
                border-color: #3182ce;
                box-shadow: 0 0 0 2px rgba(49,130,206,0.15);
            }

            .vcl-vcheckbox-list {
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 6px;
                padding-right: 4px;
            }

            .checkbox-row {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 4px 6px;
                border-radius: 4px;
                cursor: pointer;
                user-select: none;
                transition: background-color 0.15s;
            }

            .checkbox-row:hover {
                background-color: #f8fafc;
            }

            .checkbox-row input[type="checkbox"] {
                cursor: pointer;
                accent-color: #3182ce;
                width: 15px;
                height: 15px;
            }

            .checkbox-label {
                font-size: 13px;
                color: #334155;
            }

            :host([disabled]) {
                opacity: 0.55;
                pointer-events: none;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._container);
    }

    connectedCallback() {
        super.connectedCallback();
        this._readChildNodes();
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) this.render();
    }

    public get items(): CheckBoxListItem[] {
        return this._items;
    }
    public set items(val: CheckBoxListItem[]) {
        this._items = val;
        this.render();
    }

    public get selectedValues(): string[] {
        return this._items.filter(i => i.checked).map(i => i.id);
    }

    private _readChildNodes() {
        if (this._items.length === 0) {
            const childItems = this.querySelectorAll('vcl-vertical-checkbox');
            if (childItems.length > 0) {
                this._items = Array.from(childItems).map((el, idx) => ({
                    id: el.getAttribute('value') || `item-${idx}`,
                    label: el.textContent?.trim() || `Opción ${idx + 1}`,
                    checked: el.hasAttribute('checked'),
                    disabled: el.hasAttribute('disabled')
                }));
            }
        }
    }

    protected render(): void {
        this._container.innerHTML = '';

        if (this.hasAttribute('searchable')) {
            this._searchInput = document.createElement('input');
            this._searchInput.type = 'text';
            this._searchInput.className = 'search-box';
            this._searchInput.placeholder = this.getAttribute('placeholder') || 'Buscar en la lista...';
            this._searchInput.oninput = () => {
                const term = this._searchInput!.value.toLowerCase();
                this._renderList(term);
            };
            this._container.appendChild(this._searchInput);
        }

        this._listContainer = document.createElement('div');
        this._listContainer.className = 'vcl-vcheckbox-list';
        this._container.appendChild(this._listContainer);

        this._renderList('');
    }

    private _renderList(searchTerm: string) {
        this._listContainer.innerHTML = '';
        const filtered = this._items.filter(i => i.label.toLowerCase().includes(searchTerm));

        filtered.forEach(item => {
            const row = document.createElement('label');
            row.className = 'checkbox-row';

            const chk = document.createElement('input');
            chk.type = 'checkbox';
            chk.checked = !!item.checked;
            chk.disabled = !!item.disabled;

            chk.onchange = () => {
                item.checked = chk.checked;
                this.dispatchEvent(new CustomEvent('vcl-change', {
                    detail: { selectedValues: this.selectedValues, item },
                    bubbles: true,
                    composed: true
                }));
            };

            const span = document.createElement('span');
            span.className = 'checkbox-label';
            span.textContent = item.label;

            row.appendChild(chk);
            row.appendChild(span);
            this._listContainer.appendChild(row);
        });
    }
}

/**
 * <vcl-vertical-checkbox> — Sub-elemento declarativo para <vcl-vertical-checkboxlist>
 */
export class VCLVerticalCheckBox extends HTMLElement {
    static get observedAttributes() {
        return ['value', 'checked', 'disabled'];
    }
}

customElements.define('vcl-vertical-checkboxlist', VCLVerticalCheckBoxList);
customElements.define('vcl-vertical-checkbox', VCLVerticalCheckBox);
