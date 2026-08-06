import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * <vcl-icon> - Web Component Nativo de Iconos (Sustituye a TIcon)
 */
export class VCLIcon extends VCLControlElement {
    private _iconContainer: HTMLSpanElement;

    static get observedAttributes() {
        return ['name', 'size', 'color'];
    }

    private static SVG_MAP: Record<string, string> = {
        'check': '<path d="M20 6L9 17l-5-5"/>',
        'star': '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
        'user': '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        'search': '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
        'settings': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>'
    };

    constructor() {
        super();
        this._iconContainer = document.createElement('span');
        this._iconContainer.className = 'vcl-icon-wrapper';

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin: 4px;
            }
            .vcl-icon-wrapper {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
            }
            svg {
                width: 20px;
                height: 20px;
                stroke: currentColor;
                stroke-width: 2;
                stroke-linecap: round;
                stroke-linejoin: round;
                fill: none;
                transition: transform 0.15s ease, color 0.15s ease;
            }
            :host([size="small"]) svg { width: 16px; height: 16px; }
            :host([size="large"]) svg { width: 28px; height: 28px; }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._iconContainer);

        this._iconContainer.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('vcl-click', {
                detail: { name: this.name },
                bubbles: true,
                composed: true
            }));
        });
    }

    attributeChangedCallback() { this.render(); }

    get name(): string { return this.getAttribute('name') || 'check'; }
    set name(val: string) { this.setAttribute('name', val); }

    protected render(): void {
        const iconName = this.name.toLowerCase();
        const pathData = VCLIcon.SVG_MAP[iconName] || VCLIcon.SVG_MAP['check'];
        const color = this.getAttribute('color') || 'currentColor';

        this._iconContainer.style.color = color;
        this._iconContainer.innerHTML = `<svg viewBox="0 0 24 24">${pathData}</svg>`;
    }
}

customElements.define('vcl-icon', VCLIcon);
