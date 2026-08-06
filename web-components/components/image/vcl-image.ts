import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * <vcl-image> - Web Component Nativo de Imagen (Sustituye a TImage)
 */
export class VCLImage extends VCLControlElement {
    private _imgElement: HTMLImageElement;

    static get observedAttributes() {
        return ['src', 'alt', 'width', 'height', 'fit'];
    }

    constructor() {
        super();
        this._imgElement = document.createElement('img');

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                margin: 4px;
            }
            img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                object-fit: cover;
                transition: opacity 0.2s ease, transform 0.2s ease;
                display: block;
            }
            img:hover {
                transform: scale(1.01);
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._imgElement);

        this._imgElement.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('vcl-click', {
                detail: { src: this.src, alt: this.alt },
                bubbles: true,
                composed: true
            }));
        });
    }

    attributeChangedCallback() { this.render(); }

    get src(): string { return this.getAttribute('src') || ''; }
    set src(val: string) { this.setAttribute('src', val); }

    get alt(): string { return this.getAttribute('alt') || ''; }
    set alt(val: string) { this.setAttribute('alt', val); }

    protected render(): void {
        this._imgElement.src = this.src;
        this._imgElement.alt = this.alt;

        const fit = this.getAttribute('fit');
        if (fit) this._imgElement.style.objectFit = fit;

        const w = this.getAttribute('width');
        if (w) this._imgElement.style.width = w.endsWith('px') || w.endsWith('%') ? w : `${w}px`;

        const h = this.getAttribute('height');
        if (h) this._imgElement.style.height = h.endsWith('px') || h.endsWith('%') ? h : `${h}px`;
    }
}

customElements.define('vcl-image', VCLImage);
