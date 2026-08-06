/**
 * VCLCoreElement - Clase base para todos los Web Components nativos VCL.JS.
 * Sustituye a TComponent de JQuery por HTMLElement nativo de HTML5.
 */
export abstract class VCLCoreElement extends HTMLElement {
    protected _shadowRoot: ShadowRoot;

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.verifyPageParent();
        this.render();
    }

    disconnectedCallback() {
        // Limpieza de event listeners o recursos
    }

    /**
     * Valida que el componente esté montado dentro de un contenedor <vcl-page>
     */
    protected verifyPageParent(): void {
        const pageParent = this.closest('vcl-page');
        if (!pageParent && this.tagName.toLowerCase() !== 'vcl-page') {
            console.warn(`[VCL Warning]: El componente <${this.tagName.toLowerCase()}> requiere un contenedor <vcl-page> como ancestro.`);
        }
    }

    /**
     * Método de renderizado abstracto a implementar por las subclases
     */
    protected abstract render(): void;
}
