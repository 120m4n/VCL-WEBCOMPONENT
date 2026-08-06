import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * <vcl-pagination> - Web Component Nativo de Paginación (Sustituye a TPagination)
 */
export class VCLPagination extends VCLControlElement {
    private _container: HTMLDivElement;

    static get observedAttributes() {
        return ['total-pages', 'current-page', 'disabled'];
    }

    constructor() {
        super();
        this._container = document.createElement('div');
        this._container.className = 'vcl-pagination-nav';

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                margin: 8px 0;
            }
            .vcl-pagination-nav {
                display: flex;
                align-items: center;
                gap: 4px;
                user-select: none;
            }
            .vcl-page-btn {
                padding: 6px 12px;
                font-size: 13px;
                font-family: inherit;
                font-weight: 500;
                border: 1px solid #cbd5e0;
                border-radius: 6px;
                background-color: #ffffff;
                color: #2d3748;
                cursor: pointer;
                transition: all 0.15s ease;
            }
            .vcl-page-btn:hover {
                background-color: #edf2f7;
                border-color: #cbd5e1;
            }
            .vcl-page-btn.active {
                background-color: #3182ce;
                border-color: #3182ce;
                color: #ffffff;
                font-weight: 700;
            }
            .vcl-page-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                background-color: #f7fafc;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._container);
    }

    attributeChangedCallback() { this.render(); }

    get totalPages(): number { return parseInt(this.getAttribute('total-pages') || '1', 10); }
    set totalPages(val: number) { this.setAttribute('total-pages', val.toString()); }

    get currentPage(): number { return parseInt(this.getAttribute('current-page') || '1', 10); }
    set currentPage(val: number) { this.setAttribute('current-page', val.toString()); }

    private setPage(page: number) {
        if (page < 1 || page > this.totalPages || this.hasAttribute('disabled')) return;
        this.currentPage = page;

        this.dispatchEvent(new CustomEvent('vcl-page-change', {
            detail: { page: page, totalPages: this.totalPages },
            bubbles: true,
            composed: true
        }));
    }

    protected render(): void {
        this._container.innerHTML = '';
        const total = this.totalPages;
        const current = this.currentPage;

        const prevBtn = document.createElement('button');
        prevBtn.className = 'vcl-page-btn';
        prevBtn.textContent = '« Ant';
        prevBtn.disabled = current <= 1 || this.hasAttribute('disabled');
        prevBtn.addEventListener('click', () => this.setPage(current - 1));
        this._container.appendChild(prevBtn);

        for (let i = 1; i <= total; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `vcl-page-btn ${i === current ? 'active' : ''}`;
            pageBtn.textContent = i.toString();
            pageBtn.disabled = this.hasAttribute('disabled');
            pageBtn.addEventListener('click', () => this.setPage(i));
            this._container.appendChild(pageBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'vcl-page-btn';
        nextBtn.textContent = 'Sig »';
        nextBtn.disabled = current >= total || this.hasAttribute('disabled');
        nextBtn.addEventListener('click', () => this.setPage(current + 1));
        this._container.appendChild(nextBtn);
    }
}

customElements.define('vcl-pagination', VCLPagination);
