import { VCLPopupBaseElement } from '../../core/VCLPopupBaseElement';

export type VCLModalResult = 'mrNone' | 'mrOk' | 'mrCancel' | 'mrYes' | 'mrNo' | string;

/**
 * <vcl-modal> - Web Component Nativo de Diálogo Modal con comportamiento de Formulario Modal Delphi 10.3 (0% JQuery)
 */
export class VCLModal extends VCLPopupBaseElement {
    private _backdropElement: HTMLDivElement;
    private _titleElement: HTMLHeadingElement;
    private _footerElement: HTMLDivElement;
    private _okBtn: HTMLButtonElement;
    private _cancelBtn: HTMLButtonElement;
    private _currentResolver: ((value: VCLModalResult) => void) | null = null;
    private _modalResult: VCLModalResult = 'mrNone';

    static get observedAttributes() {
        return ['header-title', 'open', 'size', 'close-on-outside-click', 'show-footer', 'ok-text', 'cancel-text'];
    }

    constructor() {
        super();

        this._backdropElement = document.createElement('div');
        this._backdropElement.className = 'vcl-modal-backdrop';

        const dialog = document.createElement('div');
        dialog.className = 'vcl-modal-dialog';

        // Header
        const header = document.createElement('div');
        header.className = 'vcl-modal-header';

        this._titleElement = document.createElement('h3');
        this._titleElement.className = 'vcl-modal-title';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'vcl-modal-close';
        closeBtn.innerHTML = '&times;';

        header.appendChild(this._titleElement);
        header.appendChild(closeBtn);

        // Body
        const body = document.createElement('div');
        body.className = 'vcl-modal-body';
        const slot = document.createElement('slot');
        body.appendChild(slot);

        // Footer Delphi 10.3 con Botones Aceptar (mrOk) / Cancelar (mrCancel)
        this._footerElement = document.createElement('div');
        this._footerElement.className = 'vcl-modal-footer';

        const footerSlot = document.createElement('slot');
        footerSlot.name = 'footer';

        this._cancelBtn = document.createElement('button');
        this._cancelBtn.className = 'vcl-btn vcl-btn-cancel';
        this._cancelBtn.textContent = 'Cancelar';

        this._okBtn = document.createElement('button');
        this._okBtn.className = 'vcl-btn vcl-btn-ok';
        this._okBtn.textContent = 'Aceptar';

        this._footerElement.appendChild(footerSlot);
        this._footerElement.appendChild(this._cancelBtn);
        this._footerElement.appendChild(this._okBtn);

        dialog.appendChild(header);
        dialog.appendChild(body);
        dialog.appendChild(this._footerElement);
        this._backdropElement.appendChild(dialog);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
            }
            .vcl-modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(15, 23, 42, 0.6);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.25s ease, visibility 0.25s ease;
            }
            :host([open]) .vcl-modal-backdrop {
                opacity: 1;
                visibility: visible;
            }
            .vcl-modal-dialog {
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                width: 90%;
                max-width: 500px;
                transform: scale(0.95);
                transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
            }
            :host([open]) .vcl-modal-dialog {
                transform: scale(1);
            }
            :host([size="large"]) .vcl-modal-dialog { max-width: 800px; }
            :host([size="small"]) .vcl-modal-dialog { max-width: 350px; }

            .vcl-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #e2e8f0;
                background-color: #f8fafc;
            }
            .vcl-modal-title {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: #1a202c;
            }
            .vcl-modal-close {
                border: none;
                background: none;
                font-size: 20px;
                color: #a0aec0;
                cursor: pointer;
                padding: 0 4px;
                line-height: 1;
                transition: color 0.15s ease;
            }
            .vcl-modal-close:hover { color: #e53e3e; }
            .vcl-modal-body {
                padding: 20px;
            }
            .vcl-modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 14px 20px;
                border-top: 1px solid #e2e8f0;
                background-color: #f8fafc;
            }
            :host([show-footer="false"]) .vcl-modal-footer {
                display: none;
            }

            .vcl-btn {
                padding: 8px 16px;
                font-size: 13px;
                font-weight: 600;
                border-radius: 6px;
                cursor: pointer;
                border: 1px solid transparent;
                transition: all 0.15s ease;
            }
            .vcl-btn-ok {
                background-color: #38a169;
                color: #ffffff;
            }
            .vcl-btn-ok:hover { background-color: #2f855a; }
            .vcl-btn-cancel {
                background-color: #edf2f7;
                color: #4a5568;
                border-color: #cbd5e0;
            }
            .vcl-btn-cancel:hover { background-color: #e2e8f0; }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._backdropElement);

        // Listeners de cierre y botones modal
        closeBtn.addEventListener('click', () => this.closeModal('mrCancel'));
        this._okBtn.addEventListener('click', () => this.closeModal('mrOk'));
        this._cancelBtn.addEventListener('click', () => this.closeModal('mrCancel'));

        // REGLA DELPHI 10.3: Por defecto NO se cierra al hacer clic fuera a menos que close-on-outside-click sea true
        this._backdropElement.addEventListener('click', (e) => {
            if (e.target === this._backdropElement) {
                if (this.closeOnOutsideClick) {
                    this.closeModal('mrCancel');
                } else {
                    // Animación visual de sacudida leve para indicar que el modal es bloqueante (Delphi Modal Form)
                    const dialog = this._backdropElement.querySelector('.vcl-modal-dialog') as HTMLElement;
                    if (dialog) {
                        dialog.style.transform = 'scale(1.02)';
                        setTimeout(() => { dialog.style.transform = 'scale(1)'; }, 100);
                    }
                }
            }
        });
    }

    /**
     * Muestra el modal de forma síncrona/promesa devolviendo el ModalResult (mrOk / mrCancel) al estilo ShowModal de Delphi
     */
    public showModal(): Promise<VCLModalResult> {
        this.openPopup();
        this._modalResult = 'mrNone';
        return new Promise<VCLModalResult>((resolve) => {
            this._currentResolver = resolve;
        });
    }

    /**
     * Cierra el modal estableciendo el resultado de Formulario Modal Delphi
     */
    public closeModal(result: VCLModalResult = 'mrCancel') {
        this._modalResult = result;
        this.closePopup();

        this.dispatchEvent(new CustomEvent('vcl-modal-result', {
            detail: { modalResult: result },
            bubbles: true,
            composed: true
        }));

        if (this._currentResolver) {
            this._currentResolver(result);
            this._currentResolver = null;
        }
    }

    attributeChangedCallback() { this.render(); }

    get closeOnOutsideClick(): boolean { return this.hasAttribute('close-on-outside-click'); }
    set closeOnOutsideClick(val: boolean) {
        if (val) this.setAttribute('close-on-outside-click', '');
        else this.removeAttribute('close-on-outside-click');
    }

    get modalResult(): VCLModalResult { return this._modalResult; }

    get headerTitle(): string { return this.getAttribute('header-title') || ''; }
    set headerTitle(val: string) { this.setAttribute('header-title', val); }

    protected render(): void {
        this._titleElement.textContent = this.headerTitle;
        this._okBtn.textContent = this.getAttribute('ok-text') || 'Aceptar';
        this._cancelBtn.textContent = this.getAttribute('cancel-text') || 'Cancelar';
    }
}

customElements.define('vcl-modal', VCLModal);
