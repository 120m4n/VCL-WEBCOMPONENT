import { VCLContainerElement } from '../../core/VCLContainerElement';

/**
 * <vcl-row> - Web Component Nativo de Fila Grid Responsive (Sustituye a TBootstrapRow / TBootstrapRowFluid)
 */
export class VCLRow extends VCLContainerElement {
    constructor() {
        super();
        const div = document.createElement('div');
        div.className = 'vcl-row-container';
        const slot = document.createElement('slot');
        div.appendChild(slot);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                width: 100%;
                margin: 6px 0;
            }
            .vcl-row-container {
                display: flex;
                flex-wrap: wrap;
                margin-left: -8px;
                margin-right: -8px;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(div);
    }

    protected render(): void {}
}

/**
 * <vcl-col> - Web Component Nativo de Columna Grid (Sustituye a TBootstrapSpan)
 */
export class VCLCol extends HTMLElement {
    private _shadow: ShadowRoot;

    static get observedAttributes() {
        return ['span', 'sm', 'md', 'lg'];
    }

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                box-sizing: border-box;
                padding-left: 8px;
                padding-right: 8px;
                flex: 0 0 100%;
                max-width: 100%;
            }
            :host([span="1"]) { flex: 0 0 8.333%; max-width: 8.333%; }
            :host([span="2"]) { flex: 0 0 16.666%; max-width: 16.666%; }
            :host([span="3"]) { flex: 0 0 25%; max-width: 25%; }
            :host([span="4"]) { flex: 0 0 33.333%; max-width: 33.333%; }
            :host([span="5"]) { flex: 0 0 41.666%; max-width: 41.666%; }
            :host([span="6"]) { flex: 0 0 50%; max-width: 50%; }
            :host([span="7"]) { flex: 0 0 58.333%; max-width: 58.333%; }
            :host([span="8"]) { flex: 0 0 66.666%; max-width: 66.666%; }
            :host([span="9"]) { flex: 0 0 75%; max-width: 75%; }
            :host([span="10"]) { flex: 0 0 83.333%; max-width: 83.333%; }
            :host([span="11"]) { flex: 0 0 91.666%; max-width: 91.666%; }
            :host([span="12"]) { flex: 0 0 100%; max-width: 100%; }
        `;

        this._shadow.appendChild(style);
        this._shadow.appendChild(slot);
    }
}

customElements.define('vcl-row', VCLRow);
customElements.define('vcl-col', VCLCol);
