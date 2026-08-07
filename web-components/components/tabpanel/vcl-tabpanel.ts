import { VCLContainerElement } from '../../core/VCLContainerElement';

/**
 * <vcl-tabpanel> - Web Component Nativo de Panel de Pestañas (Fiel a TPageControl / TTabControl de Delphi)
 * 
 * Atributos soportados:
 * - tab-style: "delphi" (por defecto) | "classic" | "modern" | "card" | "pills"
 * - tab-position: "top" (por defecto) | "bottom"
 * - size: "small" | "medium" (por defecto) | "large"
 * - closable: boolean (muestra botón de cierre en todas las pestañas por defecto)
 */
export class VCLTabPanel extends VCLContainerElement {
    private _wrapper: HTMLDivElement;
    private _headerNav: HTMLDivElement;
    private _contentDiv: HTMLDivElement;
    private _mutationObserver: MutationObserver | null = null;
    public _isSyncing = false;

    static get observedAttributes() {
        return ['tab-style', 'tab-position', 'size', 'closable', 'width', 'height'];
    }

    constructor() {
        super();
        this._wrapper = document.createElement('div');
        this._wrapper.className = 'vcl-tabs-wrapper style-delphi position-top size-medium';

        this._headerNav = document.createElement('div');
        this._headerNav.className = 'vcl-tabs-header';
        this._headerNav.setAttribute('role', 'tablist');

        this._contentDiv = document.createElement('div');
        this._contentDiv.className = 'vcl-tabs-content';
        this._contentDiv.appendChild(this._slotElement);

        this._wrapper.appendChild(this._headerNav);
        this._wrapper.appendChild(this._contentDiv);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                margin: 8px 0;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }

            .vcl-tabs-wrapper {
                display: flex;
                flex-direction: column;
                width: 100%;
                box-sizing: border-box;
                background: transparent;
            }

            .vcl-tabs-wrapper.position-bottom {
                flex-direction: column-reverse;
            }

            /* ══════════════════════════════════════════════════════════
               BARRA DE PESTAÑAS (HEADER)
               Alineación en la base común sin separación ni huecos
               ══════════════════════════════════════════════════════════ */
            .vcl-tabs-header {
                display: flex;
                align-items: flex-end;
                background: transparent;
                padding: 0 4px;
                gap: 2px;
                overflow-x: auto;
                scrollbar-width: thin;
                user-select: none;
                box-sizing: border-box;
                position: relative;
                z-index: 2;
                margin-bottom: -1px; /* Superpone exactamente sobre la línea superior del contenido */
            }

            .vcl-tabs-wrapper.position-bottom .vcl-tabs-header {
                align-items: flex-start;
                margin-bottom: 0;
                margin-top: -1px; /* Superpone sobre la línea inferior del contenido */
                padding: 0 4px;
            }

            /* ══════════════════════════════════════════════════════════
               BOTÓN DE PESTAÑA BASE
               ══════════════════════════════════════════════════════════ */
            .vcl-tab-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                font-family: inherit;
                font-size: 13px;
                line-height: 1;
                cursor: pointer;
                outline: none;
                transition: background 0.12s ease, color 0.12s ease;
                flex-shrink: 0;
                white-space: nowrap;
                position: relative;
                box-sizing: border-box;
                margin: 0;
                margin-bottom: -1px;
            }

            .vcl-tab-btn:focus-visible {
                box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.5);
                z-index: 6;
            }

            /* ══════════════════════════════════════════════════════════
               ESTILO DELPHI / CLASSIC VCL (FIDELIDAD TOTAL A TPageControl)
               ══════════════════════════════════════════════════════════ */
            .vcl-tabs-wrapper.style-delphi .vcl-tab-btn,
            .vcl-tabs-wrapper.style-classic .vcl-tab-btn {
                height: 27px;
                padding: 0 12px;
                color: #475569;
                background: #e2e8f0;
                border: 1px solid #94a3b8;
                border-bottom: 1px solid #94a3b8;
                border-radius: 4px 4px 0 0;
                font-weight: 500;
                z-index: 1;
            }

            .vcl-tabs-wrapper.style-delphi .vcl-tab-btn:hover:not(.disabled):not(.active),
            .vcl-tabs-wrapper.style-classic .vcl-tab-btn:hover:not(.disabled):not(.active) {
                background: #f1f5f9;
                color: #0f172a;
                border-color: #64748b;
            }

            /* Pestaña Activa en Delphi: 3px más alta por arriba, fondo blanco continuo, borde inferior blanco que corta la línea del cuerpo */
            .vcl-tabs-wrapper.style-delphi .vcl-tab-btn.active,
            .vcl-tabs-wrapper.style-classic .vcl-tab-btn.active {
                height: 31px;
                padding: 0 14px;
                background: #ffffff;
                color: #0f172a;
                font-weight: 600;
                border: 1px solid #94a3b8;
                border-bottom: 1px solid #ffffff; /* Fusión perfecta e indivisible con el cuerpo */
                border-radius: 4px 4px 0 0;
                z-index: 5;
            }

            /* Posición Inferior (Delphi tpBottom) */
            .vcl-tabs-wrapper.style-delphi.position-bottom .vcl-tab-btn,
            .vcl-tabs-wrapper.style-classic.position-bottom .vcl-tab-btn {
                margin-bottom: 0;
                margin-top: -1px;
                border-radius: 0 0 4px 4px;
            }
            .vcl-tabs-wrapper.style-delphi.position-bottom .vcl-tab-btn.active,
            .vcl-tabs-wrapper.style-classic.position-bottom .vcl-tab-btn.active {
                height: 31px;
                border-top: 1px solid #ffffff;
                border-bottom: 1px solid #94a3b8;
                border-radius: 0 0 4px 4px;
            }

            /* ══════════════════════════════════════════════════════════
               CUERPO DE CONTENIDO (CONTENT BODY)
               ══════════════════════════════════════════════════════════ */
            .vcl-tabs-content {
                background: #ffffff;
                border: 1px solid #94a3b8;
                border-radius: 0 4px 4px 4px;
                padding: 16px 20px;
                box-sizing: border-box;
                position: relative;
                z-index: 1;
            }

            .vcl-tabs-wrapper.position-bottom .vcl-tabs-content {
                border-radius: 4px 4px 4px 0;
            }

            /* ══════════════════════════════════════════════════════════
               PESTAÑA DESHABILITADA
               ══════════════════════════════════════════════════════════ */
            .vcl-tab-btn.disabled {
                opacity: 0.5;
                cursor: not-allowed;
                background: #cbd5e1 !important;
                color: #64748b !important;
                border-color: #94a3b8 !important;
            }

            /* ══════════════════════════════════════════════════════════
               ICONOS Y BADGES
               ══════════════════════════════════════════════════════════ */
            .vcl-tab-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                line-height: 1;
            }

            .vcl-tab-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 1px 6px;
                font-size: 10.5px;
                font-weight: 700;
                border-radius: 9999px;
                line-height: 1.2;
                background: #cbd5e1;
                color: #334155;
            }

            .vcl-tab-badge.primary { background: #3182ce; color: #ffffff; }
            .vcl-tab-badge.success { background: #38a169; color: #ffffff; }
            .vcl-tab-badge.warning { background: #dd6b20; color: #ffffff; }
            .vcl-tab-badge.danger  { background: #e53e3e; color: #ffffff; }
            .vcl-tab-badge.info    { background: #00b5d8; color: #ffffff; }

            /* ══════════════════════════════════════════════════════════
               BOTÓN DE CIERRE (CLOSE)
               ══════════════════════════════════════════════════════════ */
            .vcl-tab-close-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                margin-left: 4px;
                border-radius: 50%;
                border: none;
                background: transparent;
                color: #94a3b8;
                font-size: 13px;
                font-weight: bold;
                line-height: 1;
                cursor: pointer;
                padding: 0;
                transition: all 0.15s ease;
            }

            .vcl-tab-close-btn:hover {
                background: #fee2e2;
                color: #dc2626;
            }

            /* ══════════════════════════════════════════════════════════
               OTRAS VARIANTES (MODERN, CARD, PILLS)
               ══════════════════════════════════════════════════════════ */
            .vcl-tabs-wrapper.style-modern .vcl-tab-btn {
                height: 32px;
                padding: 0 14px;
                border: 1px solid transparent;
                border-bottom: 2px solid transparent;
                background: transparent;
                color: #64748b;
                border-radius: 6px 6px 0 0;
            }
            .vcl-tabs-wrapper.style-modern .vcl-tab-btn:hover:not(.disabled):not(.active) {
                background: #f1f5f9;
                color: #0f172a;
            }
            .vcl-tabs-wrapper.style-modern .vcl-tab-btn.active {
                height: 35px;
                background: #ffffff;
                color: #2563eb;
                font-weight: 600;
                border: 1px solid #e2e8f0;
                border-top: 3px solid #2563eb;
                border-bottom: 1px solid #ffffff;
                z-index: 5;
            }
            .vcl-tabs-wrapper.style-modern .vcl-tabs-content {
                border: 1px solid #e2e8f0;
                border-radius: 0 8px 8px 8px;
            }

            /* ── Card ── */
            .vcl-tabs-wrapper.style-card .vcl-tab-btn {
                height: 30px;
                padding: 0 14px;
                background: #e2e8f0;
                border: 1px solid #cbd5e1;
                border-bottom: 1px solid #cbd5e1;
                border-radius: 6px 6px 0 0;
                color: #334155;
            }
            .vcl-tabs-wrapper.style-card .vcl-tab-btn.active {
                height: 34px;
                background: #ffffff;
                border-color: #94a3b8;
                border-bottom-color: #ffffff;
                color: #0f172a;
                font-weight: 600;
                z-index: 5;
            }
            .vcl-tabs-wrapper.style-card .vcl-tabs-content {
                border: 1px solid #94a3b8;
                border-radius: 0 6px 6px 6px;
            }

            /* ── Pills ── */
            .vcl-tabs-wrapper.style-pills .vcl-tabs-header {
                margin-bottom: 8px;
                gap: 6px;
            }
            .vcl-tabs-wrapper.style-pills .vcl-tab-btn {
                height: 32px;
                border-radius: 9999px;
                border: 1px solid #e2e8f0;
                background: #f1f5f9;
                padding: 0 16px;
                color: #475569;
                margin-bottom: 0;
            }
            .vcl-tabs-wrapper.style-pills .vcl-tab-btn.active {
                background: #2563eb;
                color: #ffffff;
                border-color: #2563eb;
            }
            .vcl-tabs-wrapper.style-pills .vcl-tab-btn.active .vcl-tab-badge {
                background: rgba(255, 255, 255, 0.25);
                color: #ffffff;
            }
            .vcl-tabs-wrapper.style-pills .vcl-tabs-content {
                border: 1px solid #e2e8f0;
                border-radius: 8px;
            }

            /* ══════════════════════════════════════════════════════════
               TAMAÑOS (SIZE)
               ══════════════════════════════════════════════════════════ */
            .vcl-tabs-wrapper.size-small .vcl-tab-btn {
                height: 23px;
                padding: 0 9px;
                font-size: 12px;
            }
            .vcl-tabs-wrapper.size-small.style-delphi .vcl-tab-btn.active {
                height: 26px;
                padding: 0 11px;
            }
            .vcl-tabs-wrapper.size-small .vcl-tabs-content {
                padding: 12px 14px;
            }

            .vcl-tabs-wrapper.size-large .vcl-tab-btn {
                height: 33px;
                padding: 0 18px;
                font-size: 15px;
            }
            .vcl-tabs-wrapper.size-large.style-delphi .vcl-tab-btn.active {
                height: 38px;
                padding: 0 20px;
            }
            .vcl-tabs-wrapper.size-large .vcl-tabs-content {
                padding: 22px 26px;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._wrapper);

        this._slotElement.addEventListener('slotchange', () => this.syncTabs());
    }

    connectedCallback() {
        this.updateAppearance();
        this.syncTabs();

        // Observar cambios dinámicos en los hijos <vcl-tabsheet> (atributos y elementos)
        this._mutationObserver = new MutationObserver(() => {
            if (!this._isSyncing) {
                this.syncTabs();
            }
        });

        this._mutationObserver.observe(this, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['tab-title', 'active', 'icon', 'badge', 'badge-style', 'disabled', 'closable']
        });
    }

    disconnectedCallback() {
        if (this._mutationObserver) {
            this._mutationObserver.disconnect();
            this._mutationObserver = null;
        }
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this.updateAppearance();
            this.render();
        }
    }

    private updateAppearance(): void {
        const styleVariant = (this.getAttribute('tab-style') || 'delphi').toLowerCase();
        const position = (this.getAttribute('tab-position') || 'top').toLowerCase();
        const size = (this.getAttribute('size') || 'medium').toLowerCase();

        this._wrapper.className = `vcl-tabs-wrapper style-${styleVariant} position-${position} size-${size}`;
    }

    /**
     * Sincroniza los botones de cabecera con los <vcl-tabsheet> contenidos
     */
    public syncTabs(): void {
        this._isSyncing = true;
        this._headerNav.innerHTML = '';
        const sheets = this.tabs;

        if (sheets.length === 0) {
            this._isSyncing = false;
            return;
        }

        // Buscar qué pestañas tienen active
        const activeIndices: number[] = [];
        sheets.forEach((s, idx) => {
            if (s.hasAttribute('active')) {
                activeIndices.push(idx);
            }
        });

        // Asegurar que exactamente UNA pestaña esté activa (evitar bugs de selección múltiple / re-entrancia)
        let activeIdx = 0;
        if (activeIndices.length === 1) {
            activeIdx = activeIndices[0];
        } else if (activeIndices.length > 1) {
            // Dejar activa la primera seleccionada y desmarcar las demás
            activeIdx = activeIndices[0];
            for (let i = 1; i < activeIndices.length; i++) {
                sheets[activeIndices[i]].removeAttribute('active');
            }
        } else {
            // Ninguna pestaña activa: activar la primera no deshabilitada
            const firstEnabled = sheets.findIndex(s => !s.hasAttribute('disabled'));
            activeIdx = firstEnabled !== -1 ? firstEnabled : 0;
            sheets[activeIdx].setAttribute('active', '');
        }

        sheets.forEach((sheet, idx) => {
            const btn = document.createElement('button');
            const isActive = idx === activeIdx;
            const isDisabled = sheet.hasAttribute('disabled');
            const isClosable = sheet.hasAttribute('closable') || this.hasAttribute('closable');

            btn.className = `vcl-tab-btn ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`;
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            btn.setAttribute('tabindex', isActive ? '0' : '-1');
            if (isDisabled) btn.setAttribute('aria-disabled', 'true');

            const tabId = `vcl-tab-btn-${idx}`;
            const panelId = `vcl-tab-panel-${idx}`;
            btn.id = tabId;
            btn.setAttribute('aria-controls', panelId);
            sheet.id = panelId;
            sheet.setAttribute('aria-labelledby', tabId);

            // Icono opcional
            const iconAttr = sheet.getAttribute('icon');
            if (iconAttr) {
                const iconSpan = document.createElement('span');
                iconSpan.className = 'vcl-tab-icon';
                iconSpan.textContent = iconAttr;
                btn.appendChild(iconSpan);
            }

            // Título de la pestaña
            const titleSpan = document.createElement('span');
            titleSpan.className = 'vcl-tab-title';
            titleSpan.textContent = sheet.getAttribute('tab-title') || `TabSheet${idx + 1}`;
            btn.appendChild(titleSpan);

            // Badge / Contador opcional
            const badgeAttr = sheet.getAttribute('badge');
            if (badgeAttr) {
                const badgeSpan = document.createElement('span');
                const badgeStyle = sheet.getAttribute('badge-style') || 'primary';
                badgeSpan.className = `vcl-tab-badge ${badgeStyle}`;
                badgeSpan.textContent = badgeAttr;
                btn.appendChild(badgeSpan);
            }

            // Botón de cierre opcional
            if (isClosable && !isDisabled) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'vcl-tab-close-btn';
                closeBtn.innerHTML = '&times;';
                closeBtn.title = 'Cerrar pestaña';
                closeBtn.setAttribute('aria-label', `Cerrar ${titleSpan.textContent}`);

                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const closeEvt = new CustomEvent('vcl-tab-close', {
                        detail: { index: idx, title: titleSpan.textContent, tabSheet: sheet },
                        bubbles: true,
                        composed: true,
                        cancelable: true
                    });
                    const allowed = this.dispatchEvent(closeEvt);
                    if (allowed) {
                        this.removeTab(sheet);
                    }
                });

                btn.appendChild(closeBtn);
            }

            // Evento Click
            btn.addEventListener('click', () => {
                if (isDisabled) return;
                this.selectTab(idx);
            });

            // Accesibilidad de teclado (Flechas Izquierda / Derecha / Home / End)
            btn.addEventListener('keydown', (e: KeyboardEvent) => {
                this.handleKeydown(e, idx);
            });

            this._headerNav.appendChild(btn);
        });

        this._isSyncing = false;
    }

    private handleKeydown(e: KeyboardEvent, currentIndex: number): void {
        const sheets = this.tabs;
        const total = sheets.length;
        if (total === 0) return;

        let targetIndex = -1;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            for (let i = 1; i < total; i++) {
                const next = (currentIndex + i) % total;
                if (!sheets[next].hasAttribute('disabled')) {
                    targetIndex = next;
                    break;
                }
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            for (let i = 1; i < total; i++) {
                const prev = (currentIndex - i + total) % total;
                if (!sheets[prev].hasAttribute('disabled')) {
                    targetIndex = prev;
                    break;
                }
            }
        } else if (e.key === 'Home') {
            e.preventDefault();
            targetIndex = sheets.findIndex(s => !s.hasAttribute('disabled'));
        } else if (e.key === 'End') {
            e.preventDefault();
            for (let i = total - 1; i >= 0; i--) {
                if (!sheets[i].hasAttribute('disabled')) {
                    targetIndex = i;
                    break;
                }
            }
        }

        if (targetIndex !== -1 && targetIndex !== currentIndex) {
            this.selectTab(targetIndex);
            const buttons = this._headerNav.querySelectorAll<HTMLButtonElement>('.vcl-tab-btn');
            if (buttons[targetIndex]) {
                buttons[targetIndex].focus();
            }
        }
    }

    // ── API Programática ──

    public get tabs(): VCLTabSheet[] {
        return Array.from(this.querySelectorAll('vcl-tabsheet'));
    }

    public get count(): number {
        return this.tabs.length;
    }

    public get activeIndex(): number {
        return this.tabs.findIndex(s => s.hasAttribute('active'));
    }

    public set activeIndex(index: number) {
        this.selectTab(index);
    }

    public get activeSheet(): VCLTabSheet | null {
        return this.tabs.find(s => s.hasAttribute('active')) || null;
    }

    public set activeSheet(sheet: VCLTabSheet | null) {
        if (sheet) {
            const idx = this.tabs.indexOf(sheet);
            if (idx !== -1) this.selectTab(idx);
        }
    }

    public selectTab(indexOrSheet: number | VCLTabSheet): void {
        const sheets = this.tabs;
        const targetIndex = typeof indexOrSheet === 'number' ? indexOrSheet : sheets.indexOf(indexOrSheet);

        if (targetIndex < 0 || targetIndex >= sheets.length) return;

        const targetSheet = sheets[targetIndex];
        if (targetSheet.hasAttribute('disabled')) return;

        const previousIndex = this.activeIndex;
        const previousSheet = this.activeSheet;

        if (previousIndex === targetIndex && targetSheet.hasAttribute('active')) return;

        this._isSyncing = true;

        sheets.forEach((s, idx) => {
            if (idx === targetIndex) {
                s.setAttribute('active', '');
            } else {
                s.removeAttribute('active');
            }
        });

        this._isSyncing = false;
        this.syncTabs();

        this.dispatchEvent(new CustomEvent('vcl-tab-change', {
            detail: {
                index: targetIndex,
                previousIndex: previousIndex,
                title: targetSheet.getAttribute('tab-title') || `TabSheet${targetIndex + 1}`,
                tabSheet: targetSheet,
                previousSheet: previousSheet
            },
            bubbles: true,
            composed: true
        }));
    }

    public nextTab(): void {
        const current = this.activeIndex;
        const total = this.tabs.length;
        if (total <= 1) return;
        for (let i = 1; i <= total; i++) {
            const next = (current + i) % total;
            if (!this.tabs[next].hasAttribute('disabled')) {
                this.selectTab(next);
                break;
            }
        }
    }

    public previousTab(): void {
        const current = this.activeIndex;
        const total = this.tabs.length;
        if (total <= 1) return;
        for (let i = 1; i <= total; i++) {
            const prev = (current - i + total) % total;
            if (!this.tabs[prev].hasAttribute('disabled')) {
                this.selectTab(prev);
                break;
            }
        }
    }

    public addTab(title: string, content?: string | HTMLElement, options?: { icon?: string; badge?: string; badgeStyle?: string; active?: boolean; closable?: boolean }): VCLTabSheet {
        this._isSyncing = true;
        const newSheet = document.createElement('vcl-tabsheet') as VCLTabSheet;
        newSheet.setAttribute('tab-title', title);

        if (options?.icon) newSheet.setAttribute('icon', options.icon);
        if (options?.badge) newSheet.setAttribute('badge', options.badge);
        if (options?.badgeStyle) newSheet.setAttribute('badge-style', options.badgeStyle);
        if (options?.closable) newSheet.setAttribute('closable', '');

        if (content) {
            if (typeof content === 'string') {
                newSheet.innerHTML = content;
            } else {
                newSheet.appendChild(content);
            }
        }

        this.appendChild(newSheet);
        this._isSyncing = false;

        if (options?.active || this.tabs.length === 1) {
            this.selectTab(newSheet);
        } else {
            this.syncTabs();
        }

        return newSheet;
    }

    public removeTab(indexOrSheet: number | VCLTabSheet): boolean {
        const sheets = this.tabs;
        const targetIndex = typeof indexOrSheet === 'number' ? indexOrSheet : sheets.indexOf(indexOrSheet);

        if (targetIndex < 0 || targetIndex >= sheets.length) return false;

        const targetSheet = sheets[targetIndex];
        const wasActive = targetSheet.hasAttribute('active');

        this._isSyncing = true;
        targetSheet.remove();
        this._isSyncing = false;

        // Si se eliminó la pestaña activa, activar una adyacente
        if (wasActive) {
            const remaining = this.tabs;
            if (remaining.length > 0) {
                const nextActiveIdx = Math.min(targetIndex, remaining.length - 1);
                this.selectTab(nextActiveIdx);
            }
        } else {
            this.syncTabs();
        }

        return true;
    }

    protected render(): void {
        this.updateAppearance();
    }
}

/**
 * <vcl-tabsheet> - Hoja individual de contenido dentro de <vcl-tabpanel> (Sustituye a TTabSheet de Delphi)
 */
export class VCLTabSheet extends HTMLElement {
    private _shadow: ShadowRoot;

    static get observedAttributes() {
        return ['tab-title', 'active', 'icon', 'badge', 'badge-style', 'disabled', 'closable'];
    }

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: none;
                width: 100%;
                box-sizing: border-box;
                animation: vcl-tab-fade-in 0.12s ease-out;
            }
            :host([active]) {
                display: block;
            }
            @keyframes vcl-tab-fade-in {
                from { opacity: 0.85; }
                to { opacity: 1; }
            }
        `;

        this._shadow.appendChild(style);
        this._shadow.appendChild(slot);
    }

    attributeChangedCallback() {
        const parent = this.closest('vcl-tabpanel') as VCLTabPanel | null;
        if (parent && !parent._isSyncing) {
            parent.syncTabs();
        }
    }
}

customElements.define('vcl-tabpanel', VCLTabPanel);
customElements.define('vcl-tabsheet', VCLTabSheet);
