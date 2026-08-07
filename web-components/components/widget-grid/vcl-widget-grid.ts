import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * <vcl-widget-grid> — Web Component Nativo de Cuadrícula de Widgets para Dashboards
 * Sustituye a TWidgetGrid de VCL.JS (sin JQuery GridSter)
 */
export class VCLWidgetGrid extends VCLControlElement {
    static get observedAttributes() {
        return ['columns', 'gap'];
    }

    constructor() {
        super();
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 16px;
                width: 100%;
                box-sizing: border-box;
            }

            :host([columns="2"]) { grid-template-columns: repeat(2, 1fr); }
            :host([columns="3"]) { grid-template-columns: repeat(3, 1fr); }
            :host([columns="4"]) { grid-template-columns: repeat(4, 1fr); }

            @media (max-width: 768px) {
                :host {
                    grid-template-columns: 1fr !important;
                }
            }
        `;

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(style);
        shadow.appendChild(document.createElement('slot'));
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue && name === 'gap') {
            this.style.gap = newValue || '16px';
        }
    }

    protected render(): void {}
}

/**
 * <vcl-widget-panel> — Panel individual de widget con header colapsable y acciones
 * Sustituye a TWdgetPanel de VCL.JS
 */
export class VCLWidgetPanel extends VCLControlElement {
    static get observedAttributes() {
        return ['title', 'icon', 'collapsed', 'closable'];
    }

    private _wrapper: HTMLDivElement;
    private _header: HTMLDivElement;
    private _body: HTMLDivElement;
    private _collapseBtn: HTMLButtonElement;

    constructor() {
        super();

        this._wrapper = document.createElement('div');
        this._wrapper.className = 'vcl-widget-card';

        this._header = document.createElement('div');
        this._header.className = 'widget-header';

        this._body = document.createElement('div');
        this._body.className = 'widget-body';
        this._body.appendChild(document.createElement('slot'));

        this._collapseBtn = document.createElement('button');
        this._collapseBtn.type = 'button';
        this._collapseBtn.className = 'widget-action-btn';
        this._collapseBtn.innerHTML = '&#9650;';

        this._wrapper.appendChild(this._header);
        this._wrapper.appendChild(this._body);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                box-sizing: border-box;
            }

            :host([hidden]) { display: none !important; }

            .vcl-widget-card {
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 10px;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);
                overflow: hidden;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .vcl-widget-card:hover {
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.06);
            }

            .widget-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                border-bottom: 1px solid #f1f5f9;
                background-color: #fafafa;
                font-weight: 600;
                font-size: 14px;
                color: #1e293b;
            }

            .header-title-group {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .header-actions {
                display: flex;
                gap: 6px;
            }

            .widget-action-btn {
                background: transparent;
                border: none;
                cursor: pointer;
                color: #64748b;
                border-radius: 4px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                transition: all 0.15s;
            }

            .widget-action-btn:hover {
                background: #e2e8f0;
                color: #0f172a;
            }

            .widget-body {
                padding: 16px;
                transition: max-height 0.3s ease, opacity 0.2s ease;
            }

            :host([collapsed]) .widget-body {
                display: none;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._wrapper);

        this._initEvents();
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) this.render();
    }

    public toggleCollapse() {
        if (this.hasAttribute('collapsed')) {
            this.removeAttribute('collapsed');
            this.dispatchEvent(new CustomEvent('vcl-collapse', { detail: { collapsed: false }, bubbles: true, composed: true }));
        } else {
            this.setAttribute('collapsed', '');
            this.dispatchEvent(new CustomEvent('vcl-collapse', { detail: { collapsed: true }, bubbles: true, composed: true }));
        }
    }

    private _initEvents() {
        this._collapseBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggleCollapse();
        };
    }

    protected render(): void {
        this._header.innerHTML = '';

        const titleGroup = document.createElement('div');
        titleGroup.className = 'header-title-group';

        const icon = this.getAttribute('icon');
        if (icon) {
            const ico = document.createElement('span');
            ico.textContent = icon;
            titleGroup.appendChild(ico);
        }

        const titleTxt = document.createElement('span');
        titleTxt.textContent = this.getAttribute('title') || 'Widget';
        titleGroup.appendChild(titleTxt);

        const actions = document.createElement('div');
        actions.className = 'header-actions';

        this._collapseBtn.innerHTML = this.hasAttribute('collapsed') ? '&#9660;' : '&#9650;';
        actions.appendChild(this._collapseBtn);

        if (this.hasAttribute('closable')) {
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'widget-action-btn';
            closeBtn.innerHTML = '&times;';
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                this.remove();
                this.dispatchEvent(new CustomEvent('vcl-close', { bubbles: true, composed: true }));
            };
            actions.appendChild(closeBtn);
        }

        this._header.appendChild(titleGroup);
        this._header.appendChild(actions);
    }
}

customElements.define('vcl-widget-grid', VCLWidgetGrid);
customElements.define('vcl-widget-panel', VCLWidgetPanel);
