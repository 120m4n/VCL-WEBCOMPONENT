import { VCLContainerElement } from '../../core/VCLContainerElement';
import { VCLToolButton } from './vcl-toolbutton';

/**
 * <vcl-toolbar> - Web Component Nativo de Barra de Herramientas (Sustituye a TToolBar)
 * Alberga y gestiona componentes <vcl-toolbutton>.
 */
export class VCLToolBar extends VCLContainerElement {
    private _toolbarContainer: HTMLDivElement;

    static get observedAttributes() {
        return [
            'flat',
            'show-captions',
            'list',
            'wrapable',
            'orientation',
            'disabled',
            'button-width',
            'button-height'
        ];
    }

    constructor() {
        super();
        this.setAttribute('role', 'toolbar');

        this._toolbarContainer = document.createElement('div');
        this._toolbarContainer.className = 'vcl-toolbar';

        const slot = document.createElement('slot');
        this._toolbarContainer.appendChild(slot);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                box-sizing: border-box;
                margin: 4px 0;
                container-type: inline-size;
                width: 100%;
            }

            :host([hidden]) {
                display: none !important;
            }

            .vcl-toolbar {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 4px;
                padding: 4px 6px;
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                box-sizing: border-box;
                transition: all 0.2s ease;
                max-width: 100%;
                overflow-x: auto;
                scrollbar-width: thin;
            }

            ::slotted(vcl-toolbutton) {
                flex-shrink: 0;
            }

            /* Flat layout */
            :host([flat]) .vcl-toolbar {
                background-color: transparent;
                border-color: transparent;
                box-shadow: none;
            }

            /* Wrapable layout */
            :host([wrapable]) .vcl-toolbar {
                flex-wrap: wrap;
                overflow-x: visible;
            }

            /* Vertical orientation */
            :host([orientation="vertical"]) .vcl-toolbar {
                flex-direction: column;
                align-items: stretch;
                width: fit-content;
                min-width: 42px;
                overflow-x: visible;
            }

            /* Hide captions when show-captions is not enabled */
            :host(:not([show-captions])) ::slotted(vcl-toolbutton) {
                --vcl-toolbutton-label-display: none;
            }

            /* List style layout: Icon + Text horizontal vs Stacked vertical */
            :host([show-captions]:not([list])) ::slotted(vcl-toolbutton) {
                --vcl-toolbutton-direction: column;
            }

            /* Global Disabled State */
            :host([disabled]) .vcl-toolbar {
                opacity: 0.6;
                pointer-events: none;
            }

            /* Container Query Adaptive Collapse to Icon-Only mode */
            @container (max-width: 720px) {
                ::slotted(vcl-toolbutton) {
                    --vcl-toolbutton-label-display: none;
                }
            }

            @container (max-width: 480px) {
                ::slotted(vcl-toolbutton[style="separator"]),
                ::slotted(vcl-toolbutton[button-style="separator"]) {
                    display: none !important;
                }
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._toolbarContainer);

        this.setupEventListeners(slot);
    }

    private setupEventListeners(slot: HTMLSlotElement): void {
        // Listen to change events from child buttons for radio grouping handling
        this.addEventListener('vcl-change', (e: Event) => {
            const customEv = e as CustomEvent;
            const targetButton = customEv.detail?.button as VCLToolButton;

            if (targetButton && targetButton.buttonStyle === 'check' && targetButton.down && targetButton.grouped) {
                const targetGroupId = targetButton.groupId;
                const buttons = this.getToolButtons();

                buttons.forEach(btn => {
                    if (btn !== targetButton && btn.buttonStyle === 'check' && btn.grouped) {
                        if (targetGroupId) {
                            if (btn.groupId === targetGroupId) {
                                btn.down = false;
                            }
                        } else if (!btn.groupId) {
                            btn.down = false;
                        }
                    }
                });
            }
        });

        // Keyboard arrow navigation between toolbuttons
        this.addEventListener('keydown', (e: KeyboardEvent) => {
            const buttons = this.getToolButtons().filter(b => !b.disabled && b.buttonStyle !== 'divider' && b.buttonStyle !== 'separator');
            if (buttons.length === 0) return;

            const activeElement = (this.shadowRoot?.activeElement || document.activeElement) as HTMLElement;
            let currentIndex = buttons.findIndex(b => b === activeElement || b.contains(activeElement));

            const isVertical = this.getAttribute('orientation') === 'vertical';
            const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
            const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

            if (e.key === nextKey) {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % buttons.length;
                buttons[nextIndex].focus();
            } else if (e.key === prevKey) {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length;
                buttons[prevIndex].focus();
            }
        });

        slot.addEventListener('slotchange', () => {
            this.syncChildButtons();
        });
    }

    /**
     * Retorna todos los VCLToolButton directos
     */
    public getToolButtons(): VCLToolButton[] {
        return Array.from(this.querySelectorAll('vcl-toolbutton'));
    }

    private syncChildButtons(): void {
        const buttons = this.getToolButtons();
        const bWidth = this.getAttribute('button-width');
        const bHeight = this.getAttribute('button-height');
        const isToolbarDisabled = this.hasAttribute('disabled');
        const isVertical = this.getAttribute('orientation') === 'vertical';

        buttons.forEach(btn => {
            if (bWidth && !btn.hasAttribute('width')) {
                btn.setAttribute('width', bWidth);
            }
            if (bHeight && !btn.hasAttribute('height')) {
                btn.setAttribute('height', bHeight);
            }
            if (isToolbarDisabled) {
                btn.setAttribute('toolbar-disabled', '');
            } else {
                btn.removeAttribute('toolbar-disabled');
            }
            if (isVertical) {
                btn.setAttribute('toolbar-orientation', 'vertical');
            } else {
                btn.removeAttribute('toolbar-orientation');
            }
        });
    }

    attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this.syncChildButtons();
            this.render();
        }
    }

    get disabled(): boolean {
        return this.hasAttribute('disabled');
    }

    set disabled(val: boolean) {
        if (val) this.setAttribute('disabled', '');
        else this.removeAttribute('disabled');
    }

    get flat(): boolean {
        return this.hasAttribute('flat');
    }

    set flat(val: boolean) {
        if (val) this.setAttribute('flat', '');
        else this.removeAttribute('flat');
    }

    get showCaptions(): boolean {
        return this.hasAttribute('show-captions');
    }

    set showCaptions(val: boolean) {
        if (val) this.setAttribute('show-captions', '');
        else this.removeAttribute('show-captions');
    }

    get list(): boolean {
        return this.hasAttribute('list');
    }

    set list(val: boolean) {
        if (val) this.setAttribute('list', '');
        else this.removeAttribute('list');
    }

    get wrapable(): boolean {
        return this.hasAttribute('wrapable');
    }

    set wrapable(val: boolean) {
        if (val) this.setAttribute('wrapable', '');
        else this.removeAttribute('wrapable');
    }

    get orientation(): string {
        return this.getAttribute('orientation') || 'horizontal';
    }

    set orientation(val: string) {
        this.setAttribute('orientation', val);
    }

    protected render(): void {}
}

customElements.define('vcl-toolbar', VCLToolBar);
