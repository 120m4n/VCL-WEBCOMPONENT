import { VCLControlElement } from '../../core/VCLControlElement';

export interface TagCloudItemData {
    text: string;
    weight: number;
    color?: string;
}

/**
 * <vcl-tagcloud> — Web Component Nativo de Nube de Etiquetas
 * Sustituye a TTagCloud / TTagCloudItem de VCL.JS
 */
export class VCLTagCloud extends VCLControlElement {
    static get observedAttributes() {
        return ['min-font-size', 'max-font-size'];
    }

    private _container: HTMLDivElement;
    private _items: TagCloudItemData[] = [];

    constructor() {
        super();

        this._container = document.createElement('div');
        this._container.className = 'vcl-tagcloud-container';

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                box-sizing: border-box;
                padding: 16px;
                background-color: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
            }

            :host([hidden]) { display: none !important; }

            .vcl-tagcloud-container {
                display: flex;
                flex-wrap: wrap;
                align-items: baseline;
                justify-content: center;
                gap: 12px 16px;
                user-select: none;
            }

            .cloud-tag {
                display: inline-block;
                cursor: pointer;
                color: #3182ce;
                font-weight: 600;
                transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.15s;
                text-decoration: none;
                line-height: 1;
            }

            .cloud-tag:hover {
                color: #2b6cb0;
                transform: scale(1.18);
            }

            .cloud-tag:active {
                transform: scale(0.95);
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._container);
    }

    connectedCallback() {
        super.connectedCallback();
        this._readChildNodes();
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) this.render();
    }

    public get items(): TagCloudItemData[] {
        return this._items;
    }
    public set items(val: TagCloudItemData[]) {
        this._items = val;
        this.render();
    }

    private _readChildNodes() {
        if (this._items.length === 0) {
            const childTags = this.querySelectorAll('vcl-tagcloud-item');
            if (childTags.length > 0) {
                this._items = Array.from(childTags).map(el => ({
                    text: el.textContent?.trim() || '',
                    weight: parseFloat(el.getAttribute('weight') || '1'),
                    color: el.getAttribute('color') || undefined
                }));
            }
        }
    }

    protected render(): void {
        this._container.innerHTML = '';
        if (this._items.length === 0) return;

        const minFont = parseFloat(this.getAttribute('min-font-size') || '12');
        const maxFont = parseFloat(this.getAttribute('max-font-size') || '36');

        let minWeight = Infinity;
        let maxWeight = -Infinity;

        this._items.forEach(it => {
            if (it.weight < minWeight) minWeight = it.weight;
            if (it.weight > maxWeight) maxWeight = it.weight;
        });

        const weightRange = maxWeight - minWeight || 1;

        this._items.forEach(item => {
            const tag = document.createElement('span');
            tag.className = 'cloud-tag';
            tag.textContent = item.text;

            const normalized = (item.weight - minWeight) / weightRange;
            const fontSize = minFont + normalized * (maxFont - minFont);
            tag.style.fontSize = `${fontSize}px`;

            if (item.color) {
                tag.style.color = item.color;
            }

            tag.onclick = (e) => {
                e.stopPropagation();
                this.dispatchEvent(new CustomEvent('vcl-select', {
                    detail: { item },
                    bubbles: true,
                    composed: true
                }));
            };

            this._container.appendChild(tag);
        });
    }
}

/**
 * <vcl-tagcloud-item> — Elemento declarativo de item de nube
 */
export class VCLTagCloudItem extends HTMLElement {
    static get observedAttributes() { return ['weight', 'color']; }
}

customElements.define('vcl-tagcloud', VCLTagCloud);
customElements.define('vcl-tagcloud-item', VCLTagCloudItem);
