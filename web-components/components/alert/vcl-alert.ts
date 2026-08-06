import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * <vcl-alert> - Web Component Nativo de Alerta Semántica (Sustituye a TAlert)
 */
export class VCLAlert extends VCLControlElement {
    private _alertContainer: HTMLDivElement;

    static get observedAttributes() {
        return ['alert-style', 'closable', 'title'];
    }

    constructor() {
        super();
        this._alertContainer = document.createElement('div');
        this._alertContainer.className = 'vcl-alert-banner';

        const slot = document.createElement('slot');
        this._alertContainer.appendChild(slot);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                margin: 8px 0;
            }
            .vcl-alert-banner {
                padding: 12px 16px;
                border-radius: 8px;
                font-family: inherit;
                font-size: 14px;
                line-height: 1.5;
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 12px;
                border: 1px solid #e2e8f0;
                background-color: #f7fafc;
                color: #2d3748;
                transition: all 0.2s ease;
            }
            :host([alert-style="success"]) .vcl-alert-banner { background-color: #f0fff4; border-color: #c6f6d5; color: #22543d; }
            :host([alert-style="warning"]) .vcl-alert-banner { background-color: #fffaf0; border-color: #feebc8; color: #744210; }
            :host([alert-style="danger"]) .vcl-alert-banner { background-color: #fff5f5; border-color: #fed7d7; color: #742a2a; }
            :host([alert-style="info"]) .vcl-alert-banner { background-color: #ebf8ff; border-color: #bee3f8; color: #2b6cb0; }

            .vcl-alert-close {
                border: none;
                background: none;
                font-size: 18px;
                line-height: 1;
                cursor: pointer;
                opacity: 0.6;
                padding: 0;
                color: inherit;
            }
            .vcl-alert-close:hover { opacity: 1; }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._alertContainer);
    }

    attributeChangedCallback() { this.render(); }

    protected render(): void {
        const isClosable = this.hasAttribute('closable');
        let closeBtn = this._alertContainer.querySelector('.vcl-alert-close');

        if (isClosable && !closeBtn) {
            closeBtn = document.createElement('button');
            closeBtn.className = 'vcl-alert-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => {
                this.style.display = 'none';
                this.dispatchEvent(new CustomEvent('vcl-close', { bubbles: true, composed: true }));
            });
            this._alertContainer.appendChild(closeBtn);
        } else if (!isClosable && closeBtn) {
            closeBtn.remove();
        }
    }
}

customElements.define('vcl-alert', VCLAlert);
