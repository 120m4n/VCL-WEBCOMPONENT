import { VCLControlElement } from './VCLControlElement';

/**
 * VCLTextBaseElement - Clase base para componentes orientados a texto y tipografía.
 * Sustituye a TTextBase de VCL.JS.
 */
export abstract class VCLTextBaseElement extends VCLControlElement {
    get text(): string { return this.getAttribute('text') || ''; }
    set text(val: string) { this.setAttribute('text', val); }

    get textColor(): string { return this.getAttribute('text-color') || ''; }
    set textColor(val: string) { this.setAttribute('text-color', val); }

    get textAlign(): string { return this.getAttribute('text-align') || 'left'; }
    set textAlign(val: string) { this.setAttribute('text-align', val); }

    protected applyTextStyle(targetElement: HTMLElement): void {
        targetElement.textContent = this.text;
        if (this.textColor) targetElement.style.color = this.textColor;
        if (this.textAlign) targetElement.style.textAlign = this.textAlign;
    }
}
