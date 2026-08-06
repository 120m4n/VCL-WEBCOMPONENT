import { VCLControlElement } from './VCLControlElement';

/**
 * VCLPopupBaseElement - Clase base para componentes con diálogos y menús desplegables.
 * Sustituye a TPopupmenuComponent de VCL.JS.
 */
export abstract class VCLPopupBaseElement extends VCLControlElement {
    protected _isOpen: boolean = false;

    get isOpen(): boolean { return this._isOpen; }

    public openPopup(): void {
        this._isOpen = true;
        this.setAttribute('open', '');
        this.dispatchEvent(new CustomEvent('vcl-popup-open', { bubbles: true, composed: true }));
    }

    public closePopup(): void {
        this._isOpen = false;
        this.removeAttribute('open');
        this.dispatchEvent(new CustomEvent('vcl-popup-close', { bubbles: true, composed: true }));
    }

    public togglePopup(): void {
        if (this._isOpen) this.closePopup();
        else this.openPopup();
    }
}
