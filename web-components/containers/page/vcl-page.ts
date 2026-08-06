import { VCLCoreElement } from '../../core/VCLCoreElement';

/**
 * <vcl-page> - Contenedor Raíz Requerido para aplicaciones y componentes VCL.
 * Sirve como marco de layout principal y contenedor de contexto.
 */
export class VCLPage extends VCLCoreElement {
    static get observedAttributes() {
        return ['title', 'bg-color'];
    }

    constructor() {
        super();
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                min-height: 100vh;
                background-color: #f4f6f9;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                box-sizing: border-box;
            }
            .vcl-page-header {
                padding: 16px 24px;
                background: #ffffff;
                border-bottom: 1px solid #e1e4e8;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            .vcl-page-title {
                margin: 0;
                font-size: 20px;
                font-weight: 600;
                color: #1a202c;
            }
            .vcl-page-body {
                padding: 24px;
            }
        `;

        const header = document.createElement('header');
        header.className = 'vcl-page-header';
        const titleEl = document.createElement('h1');
        titleEl.className = 'vcl-page-title';
        titleEl.id = 'page-title';
        header.appendChild(titleEl);

        const body = document.createElement('main');
        body.className = 'vcl-page-body';
        const slot = document.createElement('slot');
        body.appendChild(slot);

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(header);
        this._shadowRoot.appendChild(body);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) this.render();
    }

    protected render(): void {
        const titleEl = this._shadowRoot.getElementById('page-title');
        if (titleEl) {
            titleEl.textContent = this.getAttribute('title') || 'VCL.JS Application Page';
        }
    }
}

customElements.define('vcl-page', VCLPage);
