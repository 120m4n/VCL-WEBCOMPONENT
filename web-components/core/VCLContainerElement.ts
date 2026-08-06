import { VCLControlElement } from './VCLControlElement';

/**
 * VCLContainerElement - Clase base para componentes contenedores que albergan otros controles.
 * Sustituye a TContainer de VCL.JS.
 */
export abstract class VCLContainerElement extends VCLControlElement {
    protected _slotElement: HTMLSlotElement;

    constructor() {
        super();
        this._slotElement = document.createElement('slot');
        this.style.containerType = 'inline-size';
    }

    /**
     * Retorna todos los hijos asignados al slot principal del contenedor
     */
    public getChildComponents(): Element[] {
        return this._slotElement.assignedElements();
    }
}
