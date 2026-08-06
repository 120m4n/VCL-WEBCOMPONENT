import { VCLContainerElement } from '../../core/VCLContainerElement';

/**
 * <vcl-panel> - Web Component Nativo de Panel (Sustituye a TPanel y TWell)
 */
export class VCLPanel extends VCLContainerElement {
    private _headerEl: HTMLDivElement;
    private _bodyEl: HTMLDivElement;

    static get observedAttributes() {
        return ['header-title', 'panel-style'];
    }

    constructor() {
        super();
        const container = document.createElement('div');
        container.className = 'vcl-panel';

        this._headerEl = document.createElement('div');
        this._headerEl.className = 'vcl-panel-header';

        this._bodyEl = document.createElement('div');
        this._bodyEl.className = 'vcl-panel-body';
        this._bodyEl.appendChild(this._slotElement);

        container.appendChild(this._headerEl);
        container.appendChild(this._bodyEl);

        const style = document.createElement('style');
        style.textContent = `
            :host { display: block; margin: 12px 0; }
            .vcl-panel {
                border-radius: 10px;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
                overflow: hidden;
                transition: box-shadow 0.2s ease;
            }
            .vcl-panel:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.08); }
            .vcl-panel-header {
                padding: 12px 18px;
                background: #f7fafc;
                border-bottom: 1px solid #edf2f7;
                font-weight: 600;
                font-size: 15px;
                color: #2d3748;
            }
            .vcl-panel-body { padding: 18px; }
            .vcl-panel-primary .vcl-panel-header { background: #ebf8ff; color: #2b6cb0; border-color: #bee3f8; }
            .vcl-panel-success .vcl-panel-header { background: #f0fff4; color: #2f855a; border-color: #c6f6d5; }
            .vcl-panel-warning .vcl-panel-header { background: #fffff0; color: #b7791f; border-color: #fefcbf; }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(container);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) this.render();
    }

    protected render(): void {
        const title = this.getAttribute('header-title');
        if (title) {
            this._headerEl.textContent = title;
            this._headerEl.style.display = 'block';
        } else {
            this._headerEl.style.display = 'none';
        }

        const container = this._shadowRoot.querySelector('.vcl-panel') as HTMLDivElement;
        if (container) {
            container.className = 'vcl-panel';
            const pStyle = this.getAttribute('panel-style');
            if (pStyle) container.classList.add(`vcl-panel-${pStyle}`);
        }
    }
}

customElements.define('vcl-panel', VCLPanel);
