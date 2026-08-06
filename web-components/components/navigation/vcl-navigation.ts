import { VCLContainerElement } from '../../core/VCLContainerElement';

/**
 * <vcl-navbar> - Web Component Nativo de Barra Superior de Navegación (Sustituye a TNavBar)
 */
export class VCLNavBar extends VCLContainerElement {
    static get observedAttributes() {
        return ['brand-title', 'theme'];
    }

    constructor() {
        super();
        const header = document.createElement('header');
        header.className = 'vcl-navbar-container';

        const brand = document.createElement('div');
        brand.className = 'vcl-navbar-brand';

        const content = document.createElement('div');
        content.className = 'vcl-navbar-content';
        const slot = document.createElement('slot');
        content.appendChild(slot);

        header.appendChild(brand);
        header.appendChild(content);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                width: 100%;
            }
            .vcl-navbar-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 24px;
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                color: #ffffff;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .vcl-navbar-brand {
                font-size: 18px;
                font-weight: 700;
                color: #ffffff;
                letter-spacing: -0.5px;
            }
            .vcl-navbar-content {
                display: flex;
                align-items: center;
                gap: 16px;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(header);
    }

    attributeChangedCallback() { this.render(); }

    protected render(): void {
        const brandDiv = this._shadowRoot.querySelector('.vcl-navbar-brand');
        if (brandDiv) brandDiv.textContent = this.getAttribute('brand-title') || 'VCL.JS App';
    }
}

/**
 * <vcl-sidebar> - Web Component Nativo de Barra Lateral de Navegación (Sustituye a TSideBar)
 */
export class VCLSideBar extends VCLContainerElement {
    static get observedAttributes() {
        return ['collapsed'];
    }

    constructor() {
        super();
        const aside = document.createElement('aside');
        aside.className = 'vcl-sidebar-container';

        const slot = document.createElement('slot');
        aside.appendChild(slot);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                height: 100%;
            }
            .vcl-sidebar-container {
                width: 240px;
                height: 100%;
                background-color: #1e293b;
                color: #94a3b8;
                padding: 16px;
                box-sizing: border-border;
                transition: width 0.25s ease;
            }
            :host([collapsed]) .vcl-sidebar-container {
                width: 60px;
                padding: 16px 8px;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(aside);
    }

    protected render(): void {}
}

customElements.define('vcl-navbar', VCLNavBar);
customElements.define('vcl-sidebar', VCLSideBar);
