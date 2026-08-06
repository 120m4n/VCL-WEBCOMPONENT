import { VCLContainerElement } from '../../core/VCLContainerElement';

/**
 * <vcl-tabpanel> - Web Component Nativo de Panel de Pestañas (Sustituye a TTabPanel)
 */
export class VCLTabPanel extends VCLContainerElement {
    private _headerNav: HTMLDivElement;
    private _contentDiv: HTMLDivElement;

    constructor() {
        super();
        const wrapper = document.createElement('div');
        wrapper.className = 'vcl-tabs-wrapper';

        this._headerNav = document.createElement('div');
        this._headerNav.className = 'vcl-tabs-header';

        this._contentDiv = document.createElement('div');
        this._contentDiv.className = 'vcl-tabs-content';
        const slot = document.createElement('slot');
        this._contentDiv.appendChild(slot);

        wrapper.appendChild(this._headerNav);
        wrapper.appendChild(this._contentDiv);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                margin: 8px 0;
            }
            .vcl-tabs-wrapper {
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                background: #ffffff;
                overflow: hidden;
            }
            .vcl-tabs-header {
                display: flex;
                background-color: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
                padding: 0 8px;
                gap: 4px;
                overflow-x: auto;
                scrollbar-width: thin;
            }
            .vcl-tab-btn {
                padding: 10px 16px;
                font-family: inherit;
                font-size: 14px;
                font-weight: 500;
                color: #718096;
                background: none;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                transition: all 0.15s ease;
                flex-shrink: 0;
                white-space: nowrap;
            }
            .vcl-tab-btn:hover { color: #3182ce; }
            .vcl-tab-btn.active {
                color: #3182ce;
                border-bottom-color: #3182ce;
                font-weight: 600;
            }
            .vcl-tabs-content {
                padding: 20px;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(wrapper);

        slot.addEventListener('slotchange', () => this.syncTabs());
    }

    public syncTabs() {
        this._headerNav.innerHTML = '';
        const sheets = Array.from(this.querySelectorAll('vcl-tabsheet'));

        // Si ninguna pestaña tiene el atributo 'active', activar la primera por defecto
        if (sheets.length > 0 && !sheets.some(s => s.hasAttribute('active'))) {
            sheets[0].setAttribute('active', '');
        }

        sheets.forEach((sheet, idx) => {
            const btn = document.createElement('button');
            const isActive = sheet.hasAttribute('active');
            btn.className = `vcl-tab-btn ${isActive ? 'active' : ''}`;
            btn.textContent = sheet.getAttribute('tab-title') || `Pestaña ${idx + 1}`;

            btn.addEventListener('click', () => {
                sheets.forEach(s => s.removeAttribute('active'));
                sheet.setAttribute('active', '');
                this.syncTabs();

                this.dispatchEvent(new CustomEvent('vcl-tab-change', {
                    detail: { index: idx, title: btn.textContent },
                    bubbles: true,
                    composed: true
                }));
            });

            this._headerNav.appendChild(btn);
        });
    }

    protected render(): void {}
}

/**
 * <vcl-tabsheet> - Hoja individual de contenido dentro de <vcl-tabpanel>
 */
export class VCLTabSheet extends HTMLElement {
    private _shadow: ShadowRoot;

    static get observedAttributes() {
        return ['tab-title', 'active'];
    }

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: none;
            }
            :host([active]) {
                display: block;
            }
        `;

        this._shadow.appendChild(style);
        this._shadow.appendChild(slot);
    }
}

customElements.define('vcl-tabpanel', VCLTabPanel);
customElements.define('vcl-tabsheet', VCLTabSheet);
