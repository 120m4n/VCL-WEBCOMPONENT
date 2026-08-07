import { VCLInputBaseElement } from '../../core/VCLInputBaseElement';
import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * Función utilitaria para construir la grilla del calendario interactivo
 */
function createCalendarView(
    viewDate: Date,
    selectedDate: Date | null,
    onSelect: (date: Date) => void,
    onNavigate: (newViewDate: Date) => void
): HTMLElement {
    const container = document.createElement('div');
    container.className = 'cal-container';

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const header = document.createElement('div');
    header.className = 'cal-header';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'cal-nav-btn';
    prevBtn.innerHTML = '&#9664;';
    prevBtn.onclick = (e) => {
        e.stopPropagation();
        onNavigate(new Date(year, month - 1, 1));
    };

    const title = document.createElement('span');
    title.className = 'cal-title';
    title.textContent = `${monthNames[month]} ${year}`;

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'cal-nav-btn';
    nextBtn.innerHTML = '&#9654;';
    nextBtn.onclick = (e) => {
        e.stopPropagation();
        onNavigate(new Date(year, month + 1, 1));
    };

    header.appendChild(prevBtn);
    header.appendChild(title);
    header.appendChild(nextBtn);
    container.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'cal-grid';

    const daysHeader = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
    daysHeader.forEach(d => {
        const dh = document.createElement('div');
        dh.className = 'cal-day-header';
        dh.textContent = d;
        grid.appendChild(dh);
    });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Días del mes previo
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const cell = document.createElement('div');
        cell.className = 'cal-cell other-month';
        cell.textContent = (daysInPrevMonth - i).toString();
        grid.appendChild(cell);
    }

    const today = new Date();

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'cal-cell';
        cell.textContent = day.toString();

        if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === day) {
            cell.classList.add('today');
        }

        if (selectedDate && selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day) {
            cell.classList.add('selected');
        }

        cell.onclick = (e) => {
            e.stopPropagation();
            onSelect(new Date(year, month, day));
        };

        grid.appendChild(cell);
    }

    container.appendChild(grid);
    return container;
}

const CALENDAR_STYLES = `
    .date-popover {
        display: none;
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        padding: 12px;
        width: 250px;
        box-sizing: border-box;
        user-select: none;
    }

    .date-popover.open {
        display: block;
        animation: popoverFadeIn 0.15s cubic-bezier(0, 0, 0.2, 1);
    }

    @keyframes popoverFadeIn {
        from { opacity: 0; transform: translateY(-6px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .cal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .cal-nav-btn {
        background: none;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        cursor: pointer;
        padding: 4px 8px;
        font-size: 11px;
        color: #475569;
        transition: background 0.15s, color 0.15s;
    }

    .cal-nav-btn:hover {
        background: #f1f5f9;
        color: #0f172a;
    }

    .cal-title {
        font-size: 13px;
        font-weight: 600;
        color: #1e293b;
    }

    .cal-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
        text-align: center;
    }

    .cal-day-header {
        font-size: 11px;
        font-weight: 600;
        color: #94a3b8;
        padding: 4px 0;
    }

    .cal-cell {
        padding: 6px 0;
        font-size: 12px;
        border-radius: 6px;
        cursor: pointer;
        color: #334155;
        transition: all 0.12s;
    }

    .cal-cell:hover {
        background-color: #f1f5f9;
        color: #3182ce;
        font-weight: 600;
    }

    .cal-cell.other-month {
        color: #cbd5e1;
        cursor: default;
    }

    .cal-cell.selected {
        background-color: #3182ce !important;
        color: #ffffff !important;
        font-weight: 600;
    }

    .cal-cell.today {
        border: 1.5px solid #3182ce;
    }
`;

/**
 * <vcl-dateinput> — Web Component Nativo de Entrada de Fecha con Calendario
 * Sustituye a TDateInput / TDateInputBase de VCL.JS (sin JQuery DatePicker)
 */
export class VCLDateInput extends VCLInputBaseElement {
    static get observedAttributes() {
        return ['value', 'placeholder', 'disabled', 'readonly', 'label'];
    }

    private _wrapper: HTMLDivElement;
    private _input: HTMLInputElement;
    private _calButton: HTMLButtonElement;
    private _popover: HTMLDivElement;
    private _viewDate: Date = new Date();

    constructor() {
        super();

        this._wrapper = document.createElement('div');
        this._wrapper.className = 'vcl-dateinput-wrapper';

        this._input = document.createElement('input');
        this._input.type = 'text';
        this._input.className = 'date-text-input';

        this._calButton = document.createElement('button');
        this._calButton.type = 'button';
        this._calButton.className = 'date-cal-trigger';
        this._calButton.setAttribute('aria-label', 'Abrir calendario');
        this._calButton.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/>
            </svg>
        `;

        this._popover = document.createElement('div');
        this._popover.className = 'date-popover';

        this._wrapper.appendChild(this._input);
        this._wrapper.appendChild(this._calButton);
        this._wrapper.appendChild(this._popover);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                position: relative;
                box-sizing: border-box;
                font-family: inherit;
                vertical-align: middle;
                margin: 4px 0;
            }

            :host([hidden]) { display: none !important; }

            .vcl-dateinput-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                background-color: #ffffff;
                transition: border-color 0.2s, box-shadow 0.2s;
                box-sizing: border-box;
            }

            .vcl-dateinput-wrapper:focus-within {
                border-color: #3182ce;
                box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.15);
            }

            .date-text-input {
                flex: 1;
                border: none;
                outline: none;
                padding: 8px 12px;
                font-size: 14px;
                color: #1e293b;
                background: transparent;
                min-width: 120px;
                font-family: inherit;
            }

            .date-cal-trigger {
                border: none;
                background: transparent;
                padding: 8px 10px;
                cursor: pointer;
                color: #64748b;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.15s;
            }

            .date-cal-trigger:hover {
                color: #3182ce;
            }

            ${CALENDAR_STYLES}

            :host([disabled]) {
                opacity: 0.55;
                pointer-events: none;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._wrapper);

        this._initEvents();
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    public get value(): string {
        return this.getAttribute('value') || '';
    }
    public set value(val: string) {
        this.setAttribute('value', val);
        this._input.value = val;
    }

    public get dateValue(): Date | null {
        const val = this.value;
        if (!val) return null;
        const d = new Date(val + 'T00:00:00');
        return isNaN(d.getTime()) ? null : d;
    }

    public set dateValue(d: Date | null) {
        if (!d) {
            this.value = '';
        } else {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            this.value = `${yyyy}-${mm}-${dd}`;
        }
    }

    private _initEvents() {
        const toggle = (e: Event) => {
            if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return;
            e.stopPropagation();
            this._togglePopover();
        };

        this._calButton.addEventListener('click', toggle);
        this._input.addEventListener('click', toggle);

        this._input.addEventListener('change', () => {
            this.value = this._input.value;
            this.dispatchEvent(new CustomEvent('vcl-change', {
                detail: { value: this.value, date: this.dateValue },
                bubbles: true,
                composed: true
            }));
        });

        this._input.addEventListener('input', () => {
            this.dispatchEvent(new CustomEvent('vcl-input', {
                detail: { value: this._input.value },
                bubbles: true,
                composed: true
            }));
        });

        document.addEventListener('click', (e) => {
            if (!this.contains(e.target as Node) && !this._shadowRoot.contains(e.target as Node)) {
                this._closePopover();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this._popover.classList.contains('open')) {
                this._closePopover();
            }
        });
    }

    private _togglePopover() {
        if (this._popover.classList.contains('open')) {
            this._closePopover();
        } else {
            const current = this.dateValue;
            this._viewDate = current ? new Date(current) : new Date();
            this._renderPopoverContent();
            this._popover.classList.add('open');
        }
    }

    private _closePopover() {
        this._popover.classList.remove('open');
    }

    private _renderPopoverContent() {
        this._popover.innerHTML = '';
        const cal = createCalendarView(
            this._viewDate,
            this.dateValue,
            (selectedDate) => {
                this.dateValue = selectedDate;
                this._closePopover();
                this.dispatchEvent(new CustomEvent('vcl-change', {
                    detail: { value: this.value, date: this.dateValue },
                    bubbles: true,
                    composed: true
                }));
            },
            (newViewDate) => {
                this._viewDate = newViewDate;
                this._renderPopoverContent();
            }
        );
        this._popover.appendChild(cal);
    }

    protected render(): void {
        this._input.value = this.value;
        this._input.placeholder = this.getAttribute('placeholder') || 'YYYY-MM-DD';
        this._input.disabled = this.hasAttribute('disabled');
        this._input.readOnly = this.hasAttribute('readonly');
    }
}

/**
 * <vcl-datebutton> — Web Component Nativo de Botón Selector de Fecha
 * Sustituye a TDateButton de VCL.JS (con Popover Nativo)
 */
export class VCLDateButton extends VCLControlElement {
    static get observedAttributes() {
        return ['text', 'value', 'button-style', 'disabled'];
    }

    private _wrapper: HTMLDivElement;
    private _btn: HTMLButtonElement;
    private _popover: HTMLDivElement;
    private _viewDate: Date = new Date();

    constructor() {
        super();

        this._wrapper = document.createElement('div');
        this._wrapper.className = 'vcl-datebutton-wrapper';

        this._btn = document.createElement('button');
        this._btn.type = 'button';
        this._btn.className = 'vcl-datebutton-btn';

        this._popover = document.createElement('div');
        this._popover.className = 'date-popover';

        this._wrapper.appendChild(this._btn);
        this._wrapper.appendChild(this._popover);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                position: relative;
                margin: 4px;
                box-sizing: border-box;
                vertical-align: middle;
            }

            :host([hidden]) { display: none !important; }

            .vcl-datebutton-wrapper {
                position: relative;
                display: inline-block;
            }

            .vcl-datebutton-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                background-color: #3182ce;
                color: #ffffff;
                border: 1px solid #2b6cb0;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                user-select: none;
                transition: background-color 0.15s ease, transform 0.1s ease;
                box-sizing: border-box;
                font-family: inherit;
            }

            .vcl-datebutton-btn:hover {
                background-color: #2b6cb0;
            }

            .vcl-datebutton-btn:active {
                transform: translateY(1px);
            }

            .btn-icon {
                display: flex;
                align-items: center;
            }

            ${CALENDAR_STYLES}

            :host([disabled]) {
                opacity: 0.55;
                pointer-events: none;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._wrapper);

        this._initEvents();
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    public get value(): string {
        return this.getAttribute('value') || '';
    }
    public set value(val: string) {
        this.setAttribute('value', val);
        this.render();
    }

    public get dateValue(): Date | null {
        const val = this.value;
        if (!val) return null;
        const d = new Date(val + 'T00:00:00');
        return isNaN(d.getTime()) ? null : d;
    }

    public set dateValue(d: Date | null) {
        if (!d) {
            this.value = '';
        } else {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            this.value = `${yyyy}-${mm}-${dd}`;
        }
    }

    private _initEvents() {
        this._btn.addEventListener('click', (e) => {
            if (this.hasAttribute('disabled')) return;
            e.stopPropagation();
            this._togglePopover();
        });

        document.addEventListener('click', (e) => {
            if (!this.contains(e.target as Node) && !this._shadowRoot.contains(e.target as Node)) {
                this._closePopover();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this._popover.classList.contains('open')) {
                this._closePopover();
            }
        });
    }

    private _togglePopover() {
        if (this._popover.classList.contains('open')) {
            this._closePopover();
        } else {
            const current = this.dateValue;
            this._viewDate = current ? new Date(current) : new Date();
            this._renderPopoverContent();
            this._popover.classList.add('open');
        }
    }

    private _closePopover() {
        this._popover.classList.remove('open');
    }

    private _renderPopoverContent() {
        this._popover.innerHTML = '';
        const cal = createCalendarView(
            this._viewDate,
            this.dateValue,
            (selectedDate) => {
                this.dateValue = selectedDate;
                this._closePopover();
                this.dispatchEvent(new CustomEvent('vcl-change', {
                    detail: { value: this.value, date: this.dateValue },
                    bubbles: true,
                    composed: true
                }));
            },
            (newViewDate) => {
                this._viewDate = newViewDate;
                this._renderPopoverContent();
            }
        );
        this._popover.appendChild(cal);
    }

    protected render(): void {
        const val = this.value;
        const text = this.getAttribute('text') || 'Seleccionar Fecha';

        this._btn.innerHTML = `
            <span class="btn-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/>
                </svg>
            </span>
            <span>${val ? val : text}</span>
        `;

        this._btn.disabled = this.hasAttribute('disabled');
    }
}

/**
 * <vcl-timeinput> — Web Component Nativo de Entrada de Hora
 * Sustituye a TInputTime / TTimeInputBase de VCL.JS
 */
export class VCLTimeInput extends VCLInputBaseElement {
    static get observedAttributes() {
        return ['value', 'format', 'disabled', 'readonly'];
    }

    private _input: HTMLInputElement;

    constructor() {
        super();
        this._input = document.createElement('input');
        this._input.type = 'time';
        this._input.className = 'vcl-time-input';

        const style = document.createElement('style');
        style.textContent = `
            :host { display: inline-block; margin: 4px 0; vertical-align: middle; }
            .vcl-time-input {
                padding: 8px 12px;
                font-size: 14px;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                outline: none;
                color: #1e293b;
                background-color: #ffffff;
                font-family: inherit;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            .vcl-time-input:focus {
                border-color: #3182ce;
                box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.15);
            }
            :host([disabled]) .vcl-time-input {
                opacity: 0.55;
                pointer-events: none;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._input);

        this._input.addEventListener('change', () => {
            this.setAttribute('value', this._input.value);
            this.dispatchEvent(new CustomEvent('vcl-change', {
                detail: { value: this._input.value },
                bubbles: true,
                composed: true
            }));
        });
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) this.render();
    }

    protected render(): void {
        this._input.value = this.getAttribute('value') || '';
        this._input.disabled = this.hasAttribute('disabled');
        this._input.readOnly = this.hasAttribute('readonly');
    }
}

customElements.define('vcl-dateinput', VCLDateInput);
customElements.define('vcl-datebutton', VCLDateButton);
customElements.define('vcl-timeinput', VCLTimeInput);
