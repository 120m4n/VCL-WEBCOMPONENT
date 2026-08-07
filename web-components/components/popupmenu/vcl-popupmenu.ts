import { VCLPopupBaseElement } from '../../core/VCLPopupBaseElement';

export interface MenuItemData {
    id: string;
    text: string;
    icon?: string;
    shortcut?: string;
    disabled?: boolean;
    separator?: boolean;
    children?: MenuItemData[];
}

/**
 * <vcl-popup-menu> — Web Component Nativo de Menú Contextual y Menú Emergente
 * Sustituye a TPopup / TMenuItem / TMenuItemCollection de VCL.JS (100% Zero JQuery)
 */
export class VCLPopupMenu extends VCLPopupBaseElement {
    static get observedAttributes() {
        return ['trigger', 'target', 'open'];
    }

    private _menuPanel: HTMLDivElement;
    private _items: MenuItemData[] = [];
    private _targetElement: HTMLElement | null = null;
    private _openedAt: number = 0;

    constructor() {
        super();

        this._menuPanel = document.createElement('div');
        this._menuPanel.className = 'vcl-menu-panel';

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: none;
                position: fixed;
                z-index: 99999;
                user-select: none;
                font-family: inherit;
            }

            :host([open]) {
                display: block;
                animation: menuPop 0.15s cubic-bezier(0, 0, 0.2, 1);
            }

            @keyframes menuPop {
                from { opacity: 0; transform: scale(0.95) translateY(-4px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }

            .vcl-menu-panel {
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                min-width: 190px;
                padding: 6px 0;
                box-sizing: border-box;
            }

            .menu-item-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 14px;
                font-size: 13px;
                color: #334155;
                cursor: pointer;
                transition: background-color 0.12s, color 0.12s;
                position: relative;
                gap: 16px;
            }

            .menu-item-row:hover {
                background-color: #f1f5f9;
                color: #0f172a;
            }

            .item-left {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .item-icon {
                font-size: 14px;
                width: 18px;
                text-align: center;
                color: #64748b;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .item-text {
                font-weight: 500;
            }

            .item-shortcut {
                font-size: 11px;
                color: #94a3b8;
                font-family: 'JetBrains Mono', monospace;
                background: #f8fafc;
                padding: 2px 5px;
                border-radius: 4px;
                border: 1px solid #f1f5f9;
            }

            .menu-separator {
                height: 1px;
                background-color: #f1f5f9;
                margin: 4px 0;
            }

            .menu-item-row.disabled {
                opacity: 0.45;
                pointer-events: none;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._menuPanel);

        this._initGlobalListeners();
    }

    connectedCallback() {
        super.connectedCallback();
        this._bindTarget();
        this._readChildNodes();
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            if (name === 'target') this._bindTarget();
            this.render();
        }
    }

    public get items(): MenuItemData[] {
        return this._items;
    }
    public set items(val: MenuItemData[]) {
        this._items = val;
        this.render();
    }

    public showAt(x: number, y: number) {
        if (this._items.length === 0) {
            this._readChildNodes();
        }
        this.render();

        this.style.left = `${Math.max(x, 10)}px`;
        this.style.top = `${Math.max(y, 10)}px`;
        this.setAttribute('open', '');
        this._openedAt = Date.now();

        this.dispatchEvent(new CustomEvent('vcl-open', { bubbles: true, composed: true }));
    }

    public close() {
        if (this.hasAttribute('open')) {
            this.removeAttribute('open');
            this.dispatchEvent(new CustomEvent('vcl-close', { bubbles: true, composed: true }));
        }
    }

    private _bindTarget() {
        const selector = this.getAttribute('target');
        if (selector) {
            this._targetElement = document.querySelector(selector);
            if (this._targetElement) {
                const trigger = this.getAttribute('trigger') || 'contextmenu';
                if (trigger === 'contextmenu') {
                    this._targetElement.addEventListener('contextmenu', (e: MouseEvent) => {
                        e.preventDefault();
                        this.showAt(e.clientX, e.clientY);
                    });
                } else if (trigger === 'click') {
                    this._targetElement.addEventListener('click', (e: MouseEvent) => {
                        e.stopPropagation();
                        const rect = this._targetElement!.getBoundingClientRect();
                        this.showAt(rect.left, rect.bottom + 4);
                    });
                }
            }
        }
    }

    private _initGlobalListeners() {
        // Cierre inteligente al hacer clic fuera
        document.addEventListener('pointerdown', (e: PointerEvent) => {
            if (!this.hasAttribute('open')) return;
            // Prevenir cierre en el mismo milisegundo de la apertura
            if (Date.now() - this._openedAt < 80) return;

            const path = e.composedPath();
            if (path.includes(this)) return;

            this.close();
        });

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape' && this.hasAttribute('open')) {
                this.close();
            }
        });
    }

    private _readChildNodes() {
        const childItems = this.querySelectorAll('vcl-menu-item');
        if (childItems.length > 0) {
            this._items = Array.from(childItems).map(el => ({
                id: el.getAttribute('id') || el.textContent?.trim() || '',
                text: el.getAttribute('text') || el.textContent?.trim() || '',
                icon: el.getAttribute('icon') || undefined,
                shortcut: el.getAttribute('shortcut') || undefined,
                disabled: el.hasAttribute('disabled'),
                separator: el.hasAttribute('separator')
            }));
        }
    }

    protected render(): void {
        this._menuPanel.innerHTML = '';
        this._items.forEach(item => {
            if (item.separator) {
                const sep = document.createElement('div');
                sep.className = 'menu-separator';
                this._menuPanel.appendChild(sep);
                return;
            }

            const row = document.createElement('div');
            row.className = `menu-item-row ${item.disabled ? 'disabled' : ''}`;

            const left = document.createElement('div');
            left.className = 'item-left';

            if (item.icon) {
                const ico = document.createElement('span');
                ico.className = 'item-icon';
                ico.textContent = item.icon;
                left.appendChild(ico);
            }

            const txt = document.createElement('span');
            txt.className = 'item-text';
            txt.textContent = item.text;
            left.appendChild(txt);
            row.appendChild(left);

            if (item.shortcut) {
                const sc = document.createElement('span');
                sc.className = 'item-shortcut';
                sc.textContent = item.shortcut;
                row.appendChild(sc);
            }

            row.addEventListener('click', (e: MouseEvent) => {
                e.stopPropagation();
                if (item.disabled) return;
                this.close();
                this.dispatchEvent(new CustomEvent('vcl-select', {
                    detail: { item },
                    bubbles: true,
                    composed: true
                }));
            });

            this._menuPanel.appendChild(row);
        });
    }
}

/**
 * <vcl-menu-item> — Elemento declarativo de opción de menú
 */
export class VCLMenuItem extends HTMLElement {
    static get observedAttributes() {
        return ['text', 'icon', 'shortcut', 'disabled', 'separator'];
    }
}

customElements.define('vcl-popup-menu', VCLPopupMenu);
customElements.define('vcl-menu-item', VCLMenuItem);
