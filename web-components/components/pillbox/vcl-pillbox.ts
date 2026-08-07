import { VCLInputBaseElement } from '../../core/VCLInputBaseElement';

/**
 * <vcl-pillbox> — Web Component Nativo de Entrada de Píldoras / Tags (Chips Input)
 * Sustituye a TPillBox / TPillBoxItem de VCL.JS (100% Zero JQuery)
 */
export class VCLPillBox extends VCLInputBaseElement {
    static get observedAttributes() {
        return ['placeholder', 'disabled', 'max-tags', 'color', 'allow-duplicates', 'delimiter'];
    }

    private _container: HTMLDivElement;
    private _input: HTMLInputElement;
    private _tags: string[] = [];

    constructor() {
        super();

        this._container = document.createElement('div');
        this._container.className = 'vcl-pillbox-container';

        this._input = document.createElement('input');
        this._input.type = 'text';
        this._input.className = 'pill-input';
        this._input.setAttribute('autocomplete', 'off');
        this._input.setAttribute('spellcheck', 'false');

        this._container.appendChild(this._input);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                box-sizing: border-box;
                margin: 4px 0;
                font-family: inherit;
            }

            :host([hidden]) { display: none !important; }

            .vcl-pillbox-container {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 6px;
                padding: 6px 10px;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                background-color: #ffffff;
                min-height: 42px;
                box-sizing: border-box;
                cursor: text;
                transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
            }

            .vcl-pillbox-container:focus-within {
                border-color: #3182ce;
                box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.15);
            }

            .vcl-pillbox-container.invalid-shake {
                animation: shake 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
                border-color: #e53e3e;
                box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.15);
            }

            @keyframes shake {
                10%, 90% { transform: translate3d(-1px, 0, 0); }
                20%, 80% { transform: translate3d(2px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
                40%, 60% { transform: translate3d(3px, 0, 0); }
            }

            .pill-tag {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background-color: #f1f5f9;
                color: #1e293b;
                padding: 4px 10px;
                border-radius: 16px;
                font-size: 13px;
                font-weight: 500;
                user-select: none;
                animation: tagPop 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid #e2e8f0;
                box-sizing: border-box;
            }

            :host([color="primary"]) .pill-tag { background-color: #ebf8ff; color: #2b6cb0; border-color: #bee3f8; }
            :host([color="success"]) .pill-tag { background-color: #f0fff4; color: #276749; border-color: #c6f6d5; }
            :host([color="purple"]) .pill-tag { background-color: #faf5ff; color: #6b46c1; border-color: #e9d8fd; }

            @keyframes tagPop {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }

            .pill-close-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: transparent;
                border: none;
                cursor: pointer;
                color: inherit;
                opacity: 0.55;
                padding: 0;
                font-size: 13px;
                line-height: 1;
                transition: opacity 0.15s, background-color 0.15s;
            }

            .pill-close-btn:hover {
                opacity: 1;
                background-color: rgba(0,0,0,0.1);
            }

            .pill-input {
                flex: 1;
                border: none;
                outline: none;
                background: transparent;
                font-size: 13px;
                color: #1e293b;
                min-width: 100px;
                padding: 4px 0;
                font-family: inherit;
            }

            :host([disabled]) {
                opacity: 0.55;
                pointer-events: none;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._container);

        this._initEvents();
    }

    connectedCallback() {
        super.connectedCallback();
        this._readChildNodes();
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) this.render();
    }

    public get tags(): string[] {
        return [...this._tags];
    }
    public set tags(val: string[]) {
        this._tags = Array.isArray(val) ? [...val] : [];
        this.render();
    }

    public get maxTags(): number {
        const val = parseInt(this.getAttribute('max-tags') || '', 10);
        return isNaN(val) ? 9999 : val;
    }

    public get allowDuplicates(): boolean {
        return this.hasAttribute('allow-duplicates');
    }

    /**
     * Valida y agrega un nuevo tag con prevención de duplicados y límites
     */
    public addTag(tag: string): boolean {
        const clean = (tag || '').trim();

        // 1. Validación de texto vacío
        if (!clean) {
            return false;
        }

        // 2. Validación de duplicados (case-insensitive)
        if (!this.allowDuplicates) {
            const isDuplicate = this._tags.some(t => t.toLowerCase() === clean.toLowerCase());
            if (isDuplicate) {
                this._triggerValidationFeedback('El tag ya existe en la lista');
                return false;
            }
        }

        // 3. Validación de límite máximo de tags
        if (this._tags.length >= this.maxTags) {
            this._triggerValidationFeedback(`Límite máximo de ${this.maxTags} tags alcanzado`);
            return false;
        }

        // Tag válido -> Añadir a la colección
        this._tags.push(clean);
        this.render();

        this.dispatchEvent(new CustomEvent('vcl-add', {
            detail: { tag: clean, index: this._tags.length - 1 },
            bubbles: true,
            composed: true
        }));

        this.dispatchEvent(new CustomEvent('vcl-change', {
            detail: { tags: this.tags },
            bubbles: true,
            composed: true
        }));

        return true;
    }

    /**
     * Elimina un tag por su índice
     */
    public removeTag(index: number): boolean {
        if (index >= 0 && index < this._tags.length) {
            const removed = this._tags.splice(index, 1)[0];
            this.render();

            this.dispatchEvent(new CustomEvent('vcl-remove', {
                detail: { tag: removed, index },
                bubbles: true,
                composed: true
            }));

            this.dispatchEvent(new CustomEvent('vcl-change', {
                detail: { tags: this.tags },
                bubbles: true,
                composed: true
            }));

            return true;
        }
        return false;
    }

    /**
     * Feedback visual instantáneo cuando una validación falla
     */
    private _triggerValidationFeedback(reason: string) {
        this._container.classList.remove('invalid-shake');
        // Forzar reflow para reiniciar animación
        void this._container.offsetWidth;
        this._container.classList.add('invalid-shake');

        this.dispatchEvent(new CustomEvent('vcl-validate', {
            detail: { valid: false, reason },
            bubbles: true,
            composed: true
        }));

        setTimeout(() => {
            this._container.classList.remove('invalid-shake');
        }, 500);
    }

    private _readChildNodes() {
        if (this._tags.length === 0) {
            const items = this.querySelectorAll('vcl-pillbox-item');
            if (items.length > 0) {
                this._tags = Array.from(items)
                    .map(i => i.textContent?.trim() || '')
                    .filter(Boolean);
            }
        }
    }

    private _initEvents() {
        this._container.addEventListener('click', () => {
            if (!this.hasAttribute('disabled')) {
                this._input.focus();
            }
        });

        // Soporte para Tab, Enter, Coma y Punto y coma
        this._input.addEventListener('keydown', (e: KeyboardEvent) => {
            const text = this._input.value.trim();

            if (e.key === 'Tab') {
                // Si hay texto escrito en el input, Tab valida y añade el tag en vez de perder el foco
                if (text.length > 0) {
                    e.preventDefault();
                    if (this.addTag(text)) {
                        this._input.value = '';
                    }
                }
                // Si el input está vacío, Tab permite la navegación natural al siguiente elemento
            } else if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
                e.preventDefault();
                if (this.addTag(text)) {
                    this._input.value = '';
                }
            } else if (e.key === 'Backspace' && this._input.value === '' && this._tags.length > 0) {
                this.removeTag(this._tags.length - 1);
            }
        });

        // Al perder el foco (blur), si quedó texto pendiente, validarlo y agregarlo automáticamente
        this._input.addEventListener('blur', () => {
            const text = this._input.value.trim();
            if (text.length > 0) {
                if (this.addTag(text)) {
                    this._input.value = '';
                }
            }
        });

        // Soporte para pegar múltiples tags separados por coma o saltos de línea
        this._input.addEventListener('paste', (e: ClipboardEvent) => {
            const pasted = e.clipboardData?.getData('text');
            if (pasted && (pasted.includes(',') || pasted.includes(';') || pasted.includes('\n'))) {
                e.preventDefault();
                const parts = pasted.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
                parts.forEach(p => this.addTag(p));
                this._input.value = '';
            }
        });
    }

    protected render(): void {
        const placeholderText = this.getAttribute('placeholder') || 'Escriba y presione Enter o Tab...';
        this._input.placeholder = this._tags.length === 0 ? placeholderText : '';
        this._input.disabled = this.hasAttribute('disabled');

        // Limpiar solo los chips previos sin desmontar el input
        const chips = this._container.querySelectorAll('.pill-tag');
        chips.forEach(c => c.remove());

        this._tags.forEach((tag, idx) => {
            const chip = document.createElement('span');
            chip.className = 'pill-tag';
            chip.textContent = tag;

            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'pill-close-btn';
            closeBtn.setAttribute('aria-label', `Eliminar ${tag}`);
            closeBtn.innerHTML = '&times;';
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                this.removeTag(idx);
            };

            chip.appendChild(closeBtn);
            this._container.insertBefore(chip, this._input);
        });
    }
}

/**
 * <vcl-pillbox-item> — Elemento declarativo de píldora
 */
export class VCLPillBoxItem extends HTMLElement {
    static get observedAttributes() { return ['value']; }
}

customElements.define('vcl-pillbox', VCLPillBox);
customElements.define('vcl-pillbox-item', VCLPillBoxItem);
