import { VCLTextBaseElement } from '../../core/VCLTextBaseElement';

/**
 * <vcl-text> - Web Component Nativo de Texto Semántico / Tipografía (Sustituye a TText)
 */
export class VCLText extends VCLTextBaseElement {
    private _containerElement: HTMLElement;

    static get observedAttributes() {
        return ['text', 'text-style', 'href', 'text-color', 'text-align'];
    }

    constructor() {
        super();
        this._containerElement = document.createElement('p');

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                margin: 4px 0;
            }
            .vcl-text-content {
                margin: 0;
                font-family: inherit;
                line-height: 1.5;
                transition: color 0.15s ease;
            }
            .vcl-text-content.h1 { font-size: 2.25rem; font-weight: 700; }
            .vcl-text-content.h2 { font-size: 1.875rem; font-weight: 700; }
            .vcl-text-content.h3 { font-size: 1.5rem; font-weight: 600; }
            .vcl-text-content.h4 { font-size: 1.25rem; font-weight: 600; }
            .vcl-text-content.h5 { font-size: 1.125rem; font-weight: 600; }
            .vcl-text-content.h6 { font-size: 1rem; font-weight: 600; }
            .vcl-text-content.lead { font-size: 1.25rem; font-weight: 300; color: #4a5568; }
            .vcl-text-content.small { font-size: 0.875rem; color: #718096; }
            .vcl-text-content.strong { font-weight: 700; }
            .vcl-text-link {
                color: #3182ce;
                text-decoration: none;
                cursor: pointer;
            }
            .vcl-text-link:hover {
                text-decoration: underline;
                color: #2b6cb0;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._containerElement);

        this._containerElement.addEventListener('click', (e) => {
            const href = this.getAttribute('href');
            if (href) {
                e.preventDefault();
                window.location.href = href;
            }
            this.dispatchEvent(new CustomEvent('vcl-click', {
                detail: { text: this.text, href: href || null },
                bubbles: true,
                composed: true
            }));
        });
    }

    attributeChangedCallback() {
        this.render();
    }

    get href(): string { return this.getAttribute('href') || ''; }
    set href(val: string) { this.setAttribute('href', val); }

    get textStyle(): string { return (this.getAttribute('text-style') || 'p').toLowerCase(); }
    set textStyle(val: string) { this.setAttribute('text-style', val); }

    protected render(): void {
        const styleVariant = this.textStyle;
        const href = this.href;

        // Recrear elemento semántico adecuado (h1-h6, p, strong, a)
        let tagName = 'p';
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'small'].includes(styleVariant)) {
            tagName = styleVariant;
        } else if (href) {
            tagName = 'a';
        }

        const newEl = document.createElement(tagName);
        newEl.className = `vcl-text-content ${styleVariant} ${href ? 'vcl-text-link' : ''}`;
        newEl.textContent = this.text;

        if (href && newEl instanceof HTMLAnchorElement) {
            newEl.href = href;
        }

        if (this.textColor) newEl.style.color = this.textColor;
        if (this.textAlign) newEl.style.textAlign = this.textAlign;

        this._shadowRoot.replaceChild(newEl, this._containerElement);
        this._containerElement = newEl;
    }
}

customElements.define('vcl-text', VCLText);
