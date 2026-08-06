import { VCLContainerElement } from '../../core/VCLContainerElement';

/**
 * <vcl-accordion> - Web Component Nativo de Acordeón (Sustituye a TAccordion)
 */
export class VCLAccordion extends VCLContainerElement {
    constructor() {
        super();
        const container = document.createElement('div');
        container.className = 'vcl-accordion-wrapper';

        const slot = document.createElement('slot');
        container.appendChild(slot);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                margin: 8px 0;
            }
            .vcl-accordion-wrapper {
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                overflow: hidden;
                background-color: #ffffff;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(container);
    }

    protected render(): void {}
}

/**
 * <vcl-accordion-group> - Grupo/Sección individual de Acordeón
 */
export class VCLAccordionGroup extends HTMLElement {
    private _shadow: ShadowRoot;
    private _headerBtn: HTMLButtonElement;
    private _contentDiv: HTMLDivElement;

    static get observedAttributes() {
        return ['header-title', 'open'];
    }

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });

        const groupContainer = document.createElement('div');
        groupContainer.className = 'vcl-accordion-group';

        this._headerBtn = document.createElement('button');
        this._headerBtn.className = 'vcl-accordion-header';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'vcl-accordion-title';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'vcl-accordion-icon';
        iconSpan.textContent = '▼';

        this._headerBtn.appendChild(titleSpan);
        this._headerBtn.appendChild(iconSpan);

        this._contentDiv = document.createElement('div');
        this._contentDiv.className = 'vcl-accordion-content';

        const slot = document.createElement('slot');
        this._contentDiv.appendChild(slot);

        groupContainer.appendChild(this._headerBtn);
        groupContainer.appendChild(this._contentDiv);

        const style = document.createElement('style');
        style.textContent = `
            .vcl-accordion-group {
                border-bottom: 1px solid #e2e8f0;
            }
            .vcl-accordion-group:last-child {
                border-bottom: none;
            }
            .vcl-accordion-header {
                width: 100%;
                padding: 14px 18px;
                background: #f8fafc;
                border: none;
                text-align: left;
                font-family: inherit;
                font-size: 14px;
                font-weight: 600;
                color: #2d3748;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background 0.15s ease;
            }
            .vcl-accordion-header:hover { background-color: #edf2f7; }
            .vcl-accordion-icon {
                font-size: 10px;
                transition: transform 0.25s ease;
                color: #718096;
            }
            :host([open]) .vcl-accordion-icon {
                transform: rotate(180deg);
            }
            .vcl-accordion-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease;
                padding: 0 18px;
                background-color: #ffffff;
            }
            :host([open]) .vcl-accordion-content {
                max-height: 500px;
                padding: 16px 18px;
            }
        `;

        this._shadow.appendChild(style);
        this._shadow.appendChild(groupContainer);

        this._headerBtn.addEventListener('click', () => {
            if (this.hasAttribute('open')) {
                this.removeAttribute('open');
            } else {
                this.setAttribute('open', '');
            }
            this.dispatchEvent(new CustomEvent('vcl-toggle', {
                detail: { open: this.hasAttribute('open'), title: this.headerTitle },
                bubbles: true,
                composed: true
            }));
        });
    }

    attributeChangedCallback() { this.render(); }

    get headerTitle(): string { return this.getAttribute('header-title') || ''; }
    set headerTitle(val: string) { this.setAttribute('header-title', val); }

    private render() {
        const titleSpan = this._shadow.querySelector('.vcl-accordion-title');
        if (titleSpan) titleSpan.textContent = this.headerTitle;
    }
}

customElements.define('vcl-accordion', VCLAccordion);
customElements.define('vcl-accordion-group', VCLAccordionGroup);
