import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * <vcl-toolbutton> - Web Component Nativo de Botón de Barra de Herramientas (Sustituye a TToolButton)
 * Soporta los estilos de Delphi: tbsButton, tbsCheck, tbsDivider, tbsSeparator, tbsDropDown.
 */
export class VCLToolButton extends VCLControlElement {
    private _buttonElement: HTMLDivElement;
    private _iconElement: HTMLSpanElement;
    private _labelElement: HTMLSpanElement;
    private _arrowElement: HTMLSpanElement;

    static get observedAttributes() {
        return [
            'style',
            'button-style',
            'caption',
            'text',
            'icon',
            'down',
            'checked',
            'grouped',
            'group-id',
            'disabled',
            'toolbar-disabled',
            'width',
            'height'
        ];
    }

    constructor() {
        super();
        this._buttonElement = document.createElement('div');
        this._buttonElement.className = 'vcl-toolbutton';

        this._iconElement = document.createElement('span');
        this._iconElement.className = 'vcl-toolbutton-icon';

        this._labelElement = document.createElement('span');
        this._labelElement.className = 'vcl-toolbutton-label';

        this._arrowElement = document.createElement('span');
        this._arrowElement.className = 'vcl-toolbutton-arrow';
        this._arrowElement.innerHTML = '&#9660;'; // Dropdown arrow symbol

        this._buttonElement.appendChild(this._iconElement);
        this._buttonElement.appendChild(this._labelElement);
        this._buttonElement.appendChild(this._arrowElement);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                user-select: none;
                vertical-align: middle;
                box-sizing: border-box;
                min-width: 26px;
                min-height: 26px;
                flex-shrink: 0;
            }

            :host([hidden]) {
                display: none !important;
            }

            :host([disabled]),
            :host([toolbar-disabled]) {
                pointer-events: none !important;
            }

            /* Main Button Styling - Distinct Visual Presence & Border */
            .vcl-toolbutton {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 4px 8px;
                min-width: 26px;
                min-height: 26px;
                border-radius: 5px;
                border: 1px solid #cbd5e0;
                background: #ffffff;
                color: #2d3748;
                font-family: inherit;
                font-size: 13px;
                font-weight: 500;
                line-height: 1.2;
                cursor: pointer;
                transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
                outline: none;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                flex-shrink: 0;
                white-space: nowrap;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
            }

            .vcl-toolbutton:hover {
                background: #ebf8ff;
                color: #2b6cb0;
                border-color: #3182ce;
                box-shadow: 0 2px 4px rgba(49, 130, 206, 0.12);
            }

            .vcl-toolbutton:active {
                background: #e2e8f0;
                border-color: #cbd5e0;
                transform: translateY(1px);
            }

            .vcl-toolbutton:focus-visible {
                box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.4);
            }

            /* Flat Toolbar mode override */
            :host-context(vcl-toolbar[flat]) .vcl-toolbutton {
                background: transparent;
                border-color: transparent;
                box-shadow: none;
            }

            :host-context(vcl-toolbar[flat]) .vcl-toolbutton:hover {
                background-color: rgba(49, 130, 206, 0.1);
                color: #2b6cb0;
                border-color: rgba(49, 130, 206, 0.25);
            }

            /* Basic empty button style override */
            :host([basic]) .vcl-toolbutton,
            :host-context(vcl-toolbar[basic]) .vcl-toolbutton {
                border-color: #cbd5e0;
                background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
            }

            /* Icon & Label */
            .vcl-toolbutton-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 15px;
                flex-shrink: 0;
            }

            .vcl-toolbutton-icon:empty {
                display: none;
            }

            .vcl-toolbutton-label {
                white-space: nowrap;
                display: var(--vcl-toolbutton-label-display, inline);
            }

            .vcl-toolbutton-label:empty {
                display: none;
            }

            .vcl-toolbutton-arrow {
                display: none;
                font-size: 9px;
                opacity: 0.7;
                margin-left: 2px;
            }

            /* DropDown Style */
            :host([style="dropdown"]) .vcl-toolbutton-arrow,
            :host([button-style="dropdown"]) .vcl-toolbutton-arrow {
                display: inline-block;
            }

            /* Down / Checked State (tbsCheck) - Critical legibility fix */
            :host([down]) .vcl-toolbutton,
            :host([checked]) .vcl-toolbutton {
                background: #3182ce !important;
                color: #ffffff !important;
                border-color: #2b6cb0 !important;
                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
            }

            :host([down]) .vcl-toolbutton:hover,
            :host([checked]) .vcl-toolbutton:hover {
                background: #2b6cb0 !important;
                color: #ffffff !important;
            }

            /* Disabled State */
            :host([disabled]) .vcl-toolbutton,
            :host([toolbar-disabled]) .vcl-toolbutton {
                opacity: 0.5;
                cursor: not-allowed;
                pointer-events: none !important;
                background-color: transparent;
                border-color: transparent;
                color: #a0aec0;
            }
            /* tbsDivider Style */
            :host([is-divider]),
            :host([style="divider" i]),
            :host([style="tbsdivider" i]),
            :host([button-style="divider" i]),
            :host([button-style="tbsdivider" i]) {
                pointer-events: none !important;
                padding: 0 4px !important;
                margin: 0 !important;
                border: none !important;
                background: transparent !important;
                box-shadow: none !important;
            }

            :host([is-divider]) .vcl-toolbutton,
            :host([style="divider" i]) .vcl-toolbutton,
            :host([style="tbsdivider" i]) .vcl-toolbutton,
            :host([button-style="divider" i]) .vcl-toolbutton,
            :host([button-style="tbsdivider" i]) .vcl-toolbutton {
                padding: 0 !important;
                margin: 0 !important;
                min-width: 1px !important;
                width: 1px !important;
                height: 22px !important;
                background-color: #cbd5e0 !important;
                background-image: none !important;
                border: none !important;
                border-radius: 0 !important;
                box-shadow: none !important;
                cursor: default !important;
                pointer-events: none !important;
            }

            :host([is-divider]) .vcl-toolbutton-icon,
            :host([is-divider]) .vcl-toolbutton-label,
            :host([is-divider]) .vcl-toolbutton-arrow,
            :host([style="divider" i]) .vcl-toolbutton-icon,
            :host([style="divider" i]) .vcl-toolbutton-label,
            :host([style="divider" i]) .vcl-toolbutton-arrow {
                display: none !important;
            }

            /* tbsSeparator Style - ABSOLUTELY NO BORDER, NO BACKGROUND FILL, GAP ONLY */
            :host([is-separator]),
            :host([style="separator" i]),
            :host([style="tbsseparator" i]),
            :host([button-style="separator" i]),
            :host([button-style="tbsseparator" i]) {
                pointer-events: none !important;
                padding: 0 !important;
                margin: 0 !important;
                width: 8px !important;
                min-width: 8px !important;
                max-width: 8px !important;
                height: 100% !important;
                border: none !important;
                border-color: transparent !important;
                background: transparent !important;
                background-color: transparent !important;
                box-shadow: none !important;
                outline: none !important;
            }

            :host([is-separator]) .vcl-toolbutton,
            :host([style="separator" i]) .vcl-toolbutton,
            :host([style="tbsseparator" i]) .vcl-toolbutton,
            :host([button-style="separator" i]) .vcl-toolbutton,
            :host([button-style="tbsseparator" i]) .vcl-toolbutton {
                padding: 0 !important;
                margin: 0 !important;
                width: 8px !important;
                min-width: 8px !important;
                max-width: 8px !important;
                border: none !important;
                border-color: transparent !important;
                background: transparent !important;
                background-color: transparent !important;
                background-image: none !important;
                box-shadow: none !important;
                cursor: default !important;
                pointer-events: none !important;
                outline: none !important;
            }

            :host([is-separator]) .vcl-toolbutton-icon,
            :host([is-separator]) .vcl-toolbutton-label,
            :host([is-separator]) .vcl-toolbutton-arrow,
            :host([style="separator" i]) .vcl-toolbutton-icon,
            :host([style="separator" i]) .vcl-toolbutton-label,
            :host([style="separator" i]) .vcl-toolbutton-arrow {
                display: none !important;
            }

            /* Orientation overrides when inside vertical toolbar */
            :host([toolbar-orientation="vertical"]),
            :host-context(vcl-toolbar[orientation="vertical"]) {
                width: 100% !important;
            }

            /* In Vertical Toolbar, Divider MUST be a HORIZONTAL LINE across the width */
            :host([toolbar-orientation="vertical"][is-divider]),
            :host([toolbar-orientation="vertical"][style="divider" i]),
            :host([toolbar-orientation="vertical"][style="tbsdivider" i]),
            :host([toolbar-orientation="vertical"][button-style="divider" i]),
            :host([toolbar-orientation="vertical"][button-style="tbsdivider" i]),
            :host-context(vcl-toolbar[orientation="vertical"])[is-divider],
            :host-context(vcl-toolbar[orientation="vertical"])[style="divider" i],
            :host-context(vcl-toolbar[orientation="vertical"])[style="tbsdivider" i],
            :host-context(vcl-toolbar[orientation="vertical"])[button-style="divider" i],
            :host-context(vcl-toolbar[orientation="vertical"])[button-style="tbsdivider" i] {
                width: 100% !important;
                height: 9px !important;
                padding: 4px 0 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            :host([toolbar-orientation="vertical"][is-divider]) .vcl-toolbutton,
            :host([toolbar-orientation="vertical"][style="divider" i]) .vcl-toolbutton,
            :host([toolbar-orientation="vertical"][style="tbsdivider" i]) .vcl-toolbutton,
            :host([toolbar-orientation="vertical"][button-style="divider" i]) .vcl-toolbutton,
            :host([toolbar-orientation="vertical"][button-style="tbsdivider" i]) .vcl-toolbutton,
            :host-context(vcl-toolbar[orientation="vertical"])[is-divider] .vcl-toolbutton,
            :host-context(vcl-toolbar[orientation="vertical"])[style="divider" i] .vcl-toolbutton,
            :host-context(vcl-toolbar[orientation="vertical"])[style="tbsdivider" i] .vcl-toolbutton,
            :host-context(vcl-toolbar[orientation="vertical"])[button-style="divider" i] .vcl-toolbutton,
            :host-context(vcl-toolbar[orientation="vertical"])[button-style="tbsdivider" i] .vcl-toolbutton {
                width: 100% !important;
                min-width: 100% !important;
                max-width: 100% !important;
                height: 1px !important;
                min-height: 1px !important;
                max-height: 1px !important;
                background-color: #cbd5e0 !important;
                border: none !important;
            }

            /* In Vertical Toolbar, Separator is a horizontal gap across the width */
            :host([toolbar-orientation="vertical"][is-separator]),
            :host([toolbar-orientation="vertical"][style="separator" i]),
            :host([toolbar-orientation="vertical"][style="tbsseparator" i]),
            :host([toolbar-orientation="vertical"][button-style="separator" i]),
            :host([toolbar-orientation="vertical"][button-style="tbsseparator" i]),
            :host-context(vcl-toolbar[orientation="vertical"])[is-separator],
            :host-context(vcl-toolbar[orientation="vertical"])[style="separator" i],
            :host-context(vcl-toolbar[orientation="vertical"])[style="tbsseparator" i],
            :host-context(vcl-toolbar[orientation="vertical"])[button-style="separator" i],
            :host-context(vcl-toolbar[orientation="vertical"])[button-style="tbsseparator" i] {
                width: 100% !important;
                height: 8px !important;
                min-height: 8px !important;
                max-height: 8px !important;
            }

            :host([toolbar-orientation="vertical"][is-separator]) .vcl-toolbutton,
            :host([toolbar-orientation="vertical"][style="separator" i]) .vcl-toolbutton,
            :host([toolbar-orientation="vertical"][style="tbsseparator" i]) .vcl-toolbutton,
            :host([toolbar-orientation="vertical"][button-style="separator" i]) .vcl-toolbutton,
            :host([toolbar-orientation="vertical"][button-style="tbsseparator" i]) .vcl-toolbutton,
            :host-context(vcl-toolbar[orientation="vertical"])[is-separator] .vcl-toolbutton,
            :host-context(vcl-toolbar[orientation="vertical"])[style="separator" i] .vcl-toolbutton,
            :host-context(vcl-toolbar[orientation="vertical"])[style="tbsseparator" i] .vcl-toolbutton,
            :host-context(vcl-toolbar[orientation="vertical"])[button-style="separator" i] .vcl-toolbutton,
            :host-context(vcl-toolbar[orientation="vertical"])[button-style="tbsseparator" i] .vcl-toolbutton {
                width: 100% !important;
                height: 8px !important;
                min-height: 8px !important;
                max-height: 8px !important;
                border: none !important;
                background: transparent !important;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._buttonElement);

        this.setupEvents();
    }

    private setupEvents(): void {
        this.addEventListener('click', (e: MouseEvent) => {
            if (this.disabled) {
                e.stopImmediatePropagation();
                return;
            }

            const buttonStyle = this.buttonStyle;
            if (buttonStyle === 'divider' || buttonStyle === 'separator') {
                e.stopImmediatePropagation();
                return;
            }

            if (buttonStyle === 'check') {
                const isGrouped = this.grouped;
                if (isGrouped) {
                    if (!this.down) {
                        this.down = true;
                        this.dispatchChangeEvent();
                    }
                } else {
                    this.down = !this.down;
                    this.dispatchChangeEvent();
                }
            }

            this.dispatchEvent(new CustomEvent('vcl-click', {
                detail: {
                    nativeEvent: e,
                    button: this,
                    style: buttonStyle,
                    down: this.down
                },
                bubbles: true,
                composed: true
            }));
        });

        this._buttonElement.setAttribute('tabindex', '0');
        this._buttonElement.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    private dispatchChangeEvent(): void {
        this.dispatchEvent(new CustomEvent('vcl-change', {
            detail: {
                button: this,
                down: this.down,
                style: this.buttonStyle,
                groupId: this.groupId
            },
            bubbles: true,
            composed: true
        }));
    }

    attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    get buttonStyle(): string {
        const styleAttr = (this.getAttribute('style') || this.getAttribute('button-style') || 'button').toLowerCase();
        if (styleAttr === 'tbscheck' || styleAttr === 'check') return 'check';
        if (styleAttr === 'tbsdivider' || styleAttr === 'divider') return 'divider';
        if (styleAttr === 'tbsseparator' || styleAttr === 'separator') return 'separator';
        if (styleAttr === 'tbsdropdown' || styleAttr === 'dropdown') return 'dropdown';
        return 'button';
    }

    set buttonStyle(val: string) {
        this.setAttribute('button-style', val);
    }

    get caption(): string {
        return this.getAttribute('caption') || this.getAttribute('text') || '';
    }

    set caption(val: string) {
        this.setAttribute('caption', val);
    }

    get icon(): string {
        return this.getAttribute('icon') || '';
    }

    set icon(val: string) {
        this.setAttribute('icon', val);
    }

    get down(): boolean {
        return this.hasAttribute('down') || this.hasAttribute('checked');
    }

    set down(val: boolean) {
        if (val) {
            this.setAttribute('down', '');
        } else {
            this.removeAttribute('down');
            this.removeAttribute('checked');
        }
    }

    get grouped(): boolean {
        return this.hasAttribute('grouped');
    }

    set grouped(val: boolean) {
        if (val) this.setAttribute('grouped', '');
        else this.removeAttribute('grouped');
    }

    get groupId(): string {
        return this.getAttribute('group-id') || '';
    }

    set groupId(val: string) {
        this.setAttribute('group-id', val);
    }

    get disabled(): boolean {
        return this.hasAttribute('disabled') || this.hasAttribute('toolbar-disabled');
    }

    set disabled(val: boolean) {
        if (val) this.setAttribute('disabled', '');
        else this.removeAttribute('disabled');
    }

    protected render(): void {
        const bStyle = this.buttonStyle;

        if (bStyle === 'separator') {
            this.setAttribute('is-separator', '');
            this.removeAttribute('is-divider');
            this.setAttribute('role', 'separator');
            this.removeAttribute('tabindex');
            this._buttonElement.removeAttribute('tabindex');
        } else if (bStyle === 'divider') {
            this.setAttribute('is-divider', '');
            this.removeAttribute('is-separator');
            this.setAttribute('role', 'separator');
            this.removeAttribute('tabindex');
            this._buttonElement.removeAttribute('tabindex');
        } else {
            this.removeAttribute('is-separator');
            this.removeAttribute('is-divider');
            if (bStyle === 'check') {
                this.setAttribute('role', this.grouped ? 'radio' : 'checkbox');
                this.setAttribute('aria-checked', this.down ? 'true' : 'false');
                this._buttonElement.setAttribute('tabindex', this.disabled ? '-1' : '0');
            } else {
                this.setAttribute('role', 'button');
                this._buttonElement.setAttribute('tabindex', this.disabled ? '-1' : '0');
            }
        }

        const iconVal = this.icon;
        if (iconVal) {
            if (iconVal.startsWith('http') || iconVal.startsWith('/') || iconVal.endsWith('.png') || iconVal.endsWith('.svg')) {
                this._iconElement.innerHTML = `<img src="${iconVal}" style="width:16px;height:16px;" alt="" />`;
            } else {
                this._iconElement.className = `vcl-toolbutton-icon ${iconVal}`;
                this._iconElement.textContent = iconVal.length <= 2 ? iconVal : '';
            }
        } else {
            this._iconElement.innerHTML = '';
            this._iconElement.className = 'vcl-toolbutton-icon';
        }

        const cap = this.caption;
        this._labelElement.textContent = cap;

        const customWidth = this.getAttribute('width');
        if (customWidth) {
            this.style.width = customWidth.endsWith('px') || customWidth.endsWith('%') ? customWidth : `${customWidth}px`;
        }

        const customHeight = this.getAttribute('height');
        if (customHeight) {
            this.style.height = customHeight.endsWith('px') || customHeight.endsWith('%') ? customHeight : `${customHeight}px`;
        }
    }
}

customElements.define('vcl-toolbutton', VCLToolButton);
