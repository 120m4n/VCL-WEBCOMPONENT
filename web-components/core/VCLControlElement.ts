import { VCLCoreElement } from './VCLCoreElement';

/**
 * VCLControlElement - Clase base para componentes visuales con dimensiones, posición y estilos.
 * Sustituye a TControl de VCL.JS.
 */
export abstract class VCLControlElement extends VCLCoreElement {
    static get observedControlAttributes() {
        return ['width', 'height', 'visible', 'disabled', 'margin', 'padding'];
    }

    get width(): string { return this.getAttribute('width') || ''; }
    set width(val: string) { this.setAttribute('width', val); }

    get height(): string { return this.getAttribute('height') || ''; }
    set height(val: string) { this.setAttribute('height', val); }

    get visible(): boolean { return !this.hasAttribute('hidden'); }
    set visible(val: boolean) {
        if (val) this.removeAttribute('hidden');
        else this.setAttribute('hidden', '');
    }

    get disabled(): boolean { return this.hasAttribute('disabled'); }
    set disabled(val: boolean) {
        if (val) this.setAttribute('disabled', '');
        else this.removeAttribute('disabled');
    }

    protected applyBaseControlStyles(targetElement: HTMLElement): void {
        if (this.width) targetElement.style.width = this.width;
        if (this.height) targetElement.style.height = this.height;
        if (this.hasAttribute('margin')) targetElement.style.margin = this.getAttribute('margin') || '';
        if (this.hasAttribute('padding')) targetElement.style.padding = this.getAttribute('padding') || '';
    }
}
