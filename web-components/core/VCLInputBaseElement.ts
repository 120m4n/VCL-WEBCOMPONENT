import { VCLControlElement } from './VCLControlElement';

/**
 * VCLInputBaseElement - Clase base para componentes de entrada de datos y edición.
 * Sustituye a TInputBase y TEditorBase de VCL.JS.
 */
export abstract class VCLInputBaseElement extends VCLControlElement {
    get value(): string { return this.getAttribute('value') || ''; }
    set value(val: string) { this.setAttribute('value', val); }

    get placeholder(): string { return this.getAttribute('placeholder') || ''; }
    set placeholder(val: string) { this.setAttribute('placeholder', val); }

    get readonly(): boolean { return this.hasAttribute('readonly'); }
    set readonly(val: boolean) {
        if (val) this.setAttribute('readonly', '');
        else this.removeAttribute('readonly');
    }

    protected emitChangeEvent(newValue: string): void {
        this.dispatchEvent(new CustomEvent('vcl-change', {
            detail: { value: newValue },
            bubbles: true,
            composed: true
        }));
    }
}
