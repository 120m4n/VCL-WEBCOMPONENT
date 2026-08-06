import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * <vcl-breadcrumb> - Web Component Nativo de Ruta de Navegación Jerárquica (Sustituye a TBreadCrumb)
 */
export class VCLBreadcrumb extends VCLControlElement {
    constructor() {
        super();
        const nav = document.createElement('nav');
        nav.setAttribute('aria-label', 'breadcrumb');

        const slot = document.createElement('slot');
        nav.appendChild(slot);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                margin: 8px 0;
            }
            nav {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 6px;
                font-size: 14px;
                color: #718096;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(nav);
    }

    protected render(): void {}
}

/**
 * <vcl-breadcrumb-item> - Elemento individual de Breadcrumb
 */
export class VCLBreadcrumbItem extends HTMLElement {
    private _shadow: ShadowRoot;

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });

        const span = document.createElement('span');
        span.className = 'item-container';

        const link = document.createElement('a');
        link.className = 'item-link';
        const slot = document.createElement('slot');
        link.appendChild(slot);

        const separator = document.createElement('span');
        separator.className = 'item-separator';
        separator.textContent = '/';

        span.appendChild(link);
        span.appendChild(separator);

        const style = document.createElement('style');
        style.textContent = `
            .item-container {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                flex-shrink: 0;
                white-space: nowrap;
            }
            .item-link {
                color: #3182ce;
                text-decoration: none;
                transition: color 0.15s ease;
                cursor: pointer;
            }
            .item-link:hover {
                text-decoration: underline;
                color: #2b6cb0;
            }
            :host([active]) .item-link {
                color: #4a5568;
                font-weight: 600;
                pointer-events: none;
                text-decoration: none;
            }
            :host([active]) .item-separator {
                display: none;
            }
            .item-separator {
                color: #a0aec0;
                user-select: none;
            }
        `;

        this._shadow.appendChild(style);
        this._shadow.appendChild(span);

        link.addEventListener('click', (e) => {
            const href = this.getAttribute('href');
            if (href) {
                e.preventDefault();
                window.location.href = href;
            }
            this.dispatchEvent(new CustomEvent('vcl-click', {
                detail: { href: href || null, text: this.textContent },
                bubbles: true,
                composed: true
            }));
        });
    }

    connectedCallback() {
        const link = this._shadow.querySelector('.item-link') as HTMLAnchorElement;
        if (link && this.hasAttribute('href')) {
            link.href = this.getAttribute('href')!;
        }
    }
}

customElements.define('vcl-breadcrumb', VCLBreadcrumb);
customElements.define('vcl-breadcrumb-item', VCLBreadcrumbItem);
