import { VCLContainerElement } from '../../core/VCLContainerElement';

// ─────────────────────────────────────────────────────────────────────────────
// VCLListColumn — <vcl-listcolumn>
// Definición de columna para VCLListView (modo report)
// ─────────────────────────────────────────────────────────────────────────────
export class VCLListColumn extends HTMLElement {
    static get observedAttributes() {
        return ['caption', 'width', 'sortable', 'alignment'];
    }

    get caption(): string { return this.getAttribute('caption') || ''; }
    set caption(v: string) { this.setAttribute('caption', v); }

    get colWidth(): string { return this.getAttribute('width') || 'auto'; }
    set colWidth(v: string) { this.setAttribute('width', v); }

    get sortable(): boolean { return this.hasAttribute('sortable'); }
    get alignment(): string { return this.getAttribute('alignment') || 'left'; }
}

customElements.define('vcl-listcolumn', VCLListColumn);


// ─────────────────────────────────────────────────────────────────────────────
// VCLListView — <vcl-listview>
// Sustituye a TListView de Delphi 4 (comctrls.pas)
// ─────────────────────────────────────────────────────────────────────────────
export class VCLListView extends VCLContainerElement {

    static get observedAttributes() {
        return ['view-style', 'sortable', 'multi-select', 'checkboxes', 'disabled'];
    }

    private _wrapper: HTMLDivElement;
    private _toolbar: HTMLDivElement;
    private _tableWrapper: HTMLDivElement;
    private _table: HTMLTableElement;
    private _thead: HTMLTableSectionElement;
    private _tbody: HTMLTableSectionElement;
    private _iconGrid: HTMLDivElement;
    private _columnSlot: HTMLSlotElement;
    private _rowSlot: HTMLSlotElement;

    /** Currently sorted column index, -1 = none */
    private _sortColIndex: number = -1;
    private _sortAsc: boolean = true;
    private _selectedItems: Set<HTMLElement> = new Set();

    constructor() {
        super();
        this.setAttribute('role', 'grid');

        this._wrapper = document.createElement('div');
        this._wrapper.className = 'vcl-listview';

        // ── View-style switcher toolbar ──────────────────────────────────
        this._toolbar = document.createElement('div');
        this._toolbar.className = 'lv-toolbar';
        this._toolbar.innerHTML = `
            <span class="lv-title">ListView</span>
            <div class="lv-view-btns">
                <button class="lv-vbtn active" data-view="report"   title="Report (Tabla)"      aria-label="Vista reporte">⊞</button>
                <button class="lv-vbtn"        data-view="list"     title="Lista"               aria-label="Vista lista">☰</button>
                <button class="lv-vbtn"        data-view="icon"     title="Iconos grandes"      aria-label="Vista iconos">⊠</button>
                <button class="lv-vbtn"        data-view="small-icon" title="Iconos pequeños"   aria-label="Vista iconos pequeños">⊟</button>
            </div>
        `;

        // ── Table (report view) ──────────────────────────────────────────
        this._tableWrapper = document.createElement('div');
        this._tableWrapper.className = 'lv-table-wrapper';

        this._table = document.createElement('table');
        this._table.className = 'lv-table';

        this._thead = document.createElement('thead');
        this._tbody = document.createElement('tbody');
        this._table.appendChild(this._thead);
        this._table.appendChild(this._tbody);
        this._tableWrapper.appendChild(this._table);

        // ── Icon/List grid ───────────────────────────────────────────────
        this._iconGrid = document.createElement('div');
        this._iconGrid.className = 'lv-icon-grid';

        // ── Hidden slots for declarative columns + rows ──────────────────
        this._columnSlot = document.createElement('slot');
        this._columnSlot.name = 'columns';
        this._columnSlot.style.display = 'none';

        this._rowSlot = document.createElement('slot');
        this._rowSlot.name = 'rows';
        this._rowSlot.style.display = 'none';

        this._wrapper.appendChild(this._toolbar);
        this._wrapper.appendChild(this._tableWrapper);
        this._wrapper.appendChild(this._iconGrid);
        this._wrapper.appendChild(this._columnSlot);
        this._wrapper.appendChild(this._rowSlot);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                box-sizing: border-box;
                width: 100%;
            }

            :host([hidden]) { display: none !important; }

            /* ── Wrapper ─────────────────────────────────────────────── */
            .vcl-listview {
                display: flex;
                flex-direction: column;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                overflow: hidden;
                background: #fff;
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                font-size: 13px;
                box-shadow: 0 1px 4px rgba(0,0,0,0.06);
            }

            :host([disabled]) .vcl-listview {
                opacity: 0.55;
                pointer-events: none;
            }

            /* ── Toolbar ─────────────────────────────────────────────── */
            .lv-toolbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 6px 10px;
                background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
                border-bottom: 1px solid #e5e7eb;
                flex-shrink: 0;
            }

            .lv-title {
                font-size: 11px;
                font-weight: 600;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                display: none;
            }

            .lv-view-btns {
                display: flex;
                gap: 2px;
                margin-left: auto;
            }

            .lv-vbtn {
                background: transparent;
                border: 1px solid transparent;
                border-radius: 4px;
                padding: 3px 7px;
                font-size: 14px;
                cursor: pointer;
                color: #6b7280;
                transition: all 0.15s ease;
                line-height: 1;
            }

            .lv-vbtn:hover { background: #e5e7eb; color: #374151; }
            .lv-vbtn.active {
                background: #3b82f6;
                color: #fff;
                border-color: #2563eb;
            }

            /* ── Table wrapper ───────────────────────────────────────── */
            .lv-table-wrapper {
                overflow: auto;
                flex: 1;
            }

            .lv-table {
                width: 100%;
                border-collapse: collapse;
                table-layout: fixed;
            }

            /* ── Header row ──────────────────────────────────────────── */
            .lv-table thead tr {
                background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
                position: sticky;
                top: 0;
                z-index: 1;
            }

            .lv-table th {
                padding: 7px 10px;
                text-align: left;
                font-size: 11.5px;
                font-weight: 600;
                color: #374151;
                border-bottom: 2px solid #e5e7eb;
                border-right: 1px solid #f3f4f6;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                position: relative;
                user-select: none;
            }

            .lv-table th:last-child { border-right: none; }

            .lv-table th.sortable { cursor: pointer; }
            .lv-table th.sortable:hover { background: rgba(59,130,246,0.06); }

            .th-inner {
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .sort-icon {
                font-size: 10px;
                color: #9ca3af;
                flex-shrink: 0;
            }

            th.sort-asc  .sort-icon::after { content: '▲'; color: #3b82f6; }
            th.sort-desc .sort-icon::after { content: '▼'; color: #3b82f6; }
            th:not(.sort-asc):not(.sort-desc) .sort-icon::after { content: '⇅'; }

            /* ── Data rows ───────────────────────────────────────────── */
            .lv-table tbody tr {
                transition: background 0.1s ease;
                border-bottom: 1px solid #f3f4f6;
            }

            .lv-table tbody tr:last-child { border-bottom: none; }

            .lv-table tbody tr:hover { background: rgba(59,130,246,0.05); }

            .lv-table tbody tr.selected {
                background: rgba(59,130,246,0.12);
            }

            .lv-table tbody tr.selected td { color: #1d4ed8; }

            .lv-table td {
                padding: 6px 10px;
                color: #374151;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                vertical-align: middle;
                font-size: 13px;
            }

            .lv-table td:last-child { border-right: none; }

            /* Checkbox column */
            .lv-table .col-check {
                width: 32px;
                text-align: center;
                padding: 6px 4px;
            }

            .lv-table .col-check input[type="checkbox"] {
                accent-color: #3b82f6;
                width: 14px;
                height: 14px;
                cursor: pointer;
            }

            /* ── Empty state ─────────────────────────────────────────── */
            .lv-empty {
                padding: 32px 16px;
                text-align: center;
                color: #9ca3af;
                font-size: 13px;
            }

            /* ── Icon / Small-icon / List grid ───────────────────────── */
            .lv-icon-grid {
                display: none;
                flex-wrap: wrap;
                gap: 8px;
                padding: 12px;
                overflow: auto;
                flex: 1;
                align-content: flex-start;
            }

            :host([view-style="icon"]) .lv-table-wrapper    { display: none; }
            :host([view-style="icon"]) .lv-icon-grid        { display: flex; }

            :host([view-style="small-icon"]) .lv-table-wrapper { display: none; }
            :host([view-style="small-icon"]) .lv-icon-grid     { display: flex; --icon-size: 32px; --icon-font: 18px; }

            :host([view-style="list"]) .lv-table-wrapper    { display: none; }
            :host([view-style="list"]) .lv-icon-grid        {
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                --icon-size: 20px;
                --icon-font: 14px;
            }

            .lv-icon-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                padding: 8px;
                border-radius: 6px;
                cursor: default;
                user-select: none;
                transition: background 0.12s ease;
                width: var(--item-w, 80px);
            }

            :host([view-style="list"]) .lv-icon-item {
                flex-direction: row;
                width: 100%;
                gap: 8px;
            }

            .lv-icon-item:hover { background: rgba(59,130,246,0.08); }
            .lv-icon-item.selected { background: rgba(59,130,246,0.15); }

            .lv-icon-item .item-icon {
                font-size: var(--icon-font, 28px);
                width: var(--icon-size, 48px);
                height: var(--icon-size, 48px);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                background: #f3f4f6;
                border-radius: 8px;
            }

            :host([view-style="list"]) .lv-icon-item .item-icon {
                border-radius: 4px;
            }

            .lv-icon-item .item-label {
                font-size: 12px;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
                white-space: nowrap;
                color: #374151;
            }

            :host([view-style="list"]) .lv-icon-item .item-label {
                text-align: left;
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
            }

            /* ── Dark mode ───────────────────────────────────────────── */
            @media (prefers-color-scheme: dark) {
                .vcl-listview { background: #111827; border-color: #374151; }
                .lv-toolbar { background: linear-gradient(180deg,#1f2937 0%,#111827 100%); border-bottom-color: #374151; }
                .lv-table thead tr { background: linear-gradient(180deg,#1f2937 0%,#111827 100%); }
                .lv-table th { color: #d1d5db; border-bottom-color: #374151; border-right-color: #1f2937; }
                .lv-table tbody tr { border-bottom-color: #1f2937; }
                .lv-table tbody tr:hover { background: rgba(59,130,246,0.08); }
                .lv-table td { color: #e5e7eb; }
                .lv-icon-item .item-icon { background: #1f2937; }
                .lv-icon-item .item-label { color: #e5e7eb; }
                .lv-empty { color: #6b7280; }
                .lv-vbtn { color: #9ca3af; }
                .lv-vbtn:hover { background: #374151; color: #e5e7eb; }
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._wrapper);

        this._setupEvents();
    }

    private _setupEvents(): void {
        // View style switcher
        this._toolbar.querySelectorAll('.lv-vbtn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = (btn as HTMLElement).dataset['view'] || 'report';
                this.viewStyle = view;
            });
        });

        // Column definitions from slot
        this._columnSlot.addEventListener('slotchange', () => this._buildTable());
        this._rowSlot.addEventListener('slotchange', () => this._buildTable());
    }

    /** Builds the table from slotted <vcl-listcolumn> and row data */
    private _buildTable(): void {
        const columns = this._columnSlot.assignedElements()
            .filter(el => el.tagName.toLowerCase() === 'vcl-listcolumn') as VCLListColumn[];

        // Build thead
        this._thead.innerHTML = '';
        const hr = document.createElement('tr');

        if (this.hasAttribute('checkboxes')) {
            const th = document.createElement('th');
            th.className = 'col-check';
            const checkAll = document.createElement('input');
            checkAll.type = 'checkbox';
            checkAll.title = 'Seleccionar todo';
            checkAll.addEventListener('change', () => {
                this._tbody.querySelectorAll<HTMLInputElement>('.col-check input').forEach(cb => {
                    cb.checked = checkAll.checked;
                    const row = cb.closest('tr') as HTMLTableRowElement | null;
                    row?.classList.toggle('selected', checkAll.checked);
                });
            });
            th.appendChild(checkAll);
            hr.appendChild(th);
        }

        columns.forEach((col, i) => {
            const th = document.createElement('th');
            th.style.width = col.colWidth;
            th.style.textAlign = col.alignment;
            if (col.sortable || this.hasAttribute('sortable')) {
                th.classList.add('sortable');
                th.addEventListener('click', () => this._sortByColumn(i, columns, th));
            }
            const inner = document.createElement('div');
            inner.className = 'th-inner';
            inner.textContent = col.caption;
            if (col.sortable || this.hasAttribute('sortable')) {
                const si = document.createElement('span');
                si.className = 'sort-icon';
                inner.appendChild(si);
            }
            th.appendChild(inner);
            hr.appendChild(th);
        });
        this._thead.appendChild(hr);

        // No predefined row template — rows injected via JS API or slot items
        if (this._tbody.rows.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyTd = document.createElement('td');
            emptyTd.colSpan = columns.length + (this.hasAttribute('checkboxes') ? 1 : 0);
            emptyTd.className = 'lv-empty';
            emptyTd.textContent = 'Sin datos';
            emptyRow.appendChild(emptyTd);
            this._tbody.appendChild(emptyRow);
        }
    }

    private _sortByColumn(colIndex: number, columns: VCLListColumn[], th: HTMLTableCellElement): void {
        const checkboxOffset = this.hasAttribute('checkboxes') ? 1 : 0;
        const dataColIndex = colIndex + checkboxOffset;

        if (this._sortColIndex === colIndex) {
            this._sortAsc = !this._sortAsc;
        } else {
            this._sortColIndex = colIndex;
            this._sortAsc = true;
        }

        // Update header classes
        this._thead.querySelectorAll('th').forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
        th.classList.add(this._sortAsc ? 'sort-asc' : 'sort-desc');

        // Sort rows
        const rows = Array.from(this._tbody.rows);
        rows.sort((a, b) => {
            const aText = a.cells[dataColIndex]?.textContent || '';
            const bText = b.cells[dataColIndex]?.textContent || '';
            const aNum = parseFloat(aText);
            const bNum = parseFloat(bText);
            const numericSort = !isNaN(aNum) && !isNaN(bNum);
            const cmp = numericSort ? aNum - bNum : aText.localeCompare(bText);
            return this._sortAsc ? cmp : -cmp;
        });
        rows.forEach(r => this._tbody.appendChild(r));

        this.dispatchEvent(new CustomEvent('vcl-sort', {
            bubbles: true, composed: true,
            detail: { columnIndex: colIndex, column: columns[colIndex], ascending: this._sortAsc }
        }));
    }

    /**
     * Agrega una fila de datos al ListView (modo report).
     * @param cells Array de valores de celda
     * @param icon Emoji/icono para vista icono/lista
     */
    public addItem(cells: string[], icon: string = '📄'): HTMLTableRowElement {
        // Remove empty state row
        const emptyRow = this._tbody.querySelector('.lv-empty');
        if (emptyRow) emptyRow.closest('tr')?.remove();

        const checkboxOffset = this.hasAttribute('checkboxes') ? 1 : 0;
        const row = document.createElement('tr');
        row.setAttribute('role', 'row');

        if (this.hasAttribute('checkboxes')) {
            const td = document.createElement('td');
            td.className = 'col-check';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.addEventListener('change', () => {
                row.classList.toggle('selected', cb.checked);
            });
            td.appendChild(cb);
            row.appendChild(td);
        }

        cells.forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            row.appendChild(td);
        });

        // Row click selection
        row.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).tagName === 'INPUT') return;
            if (!this.hasAttribute('multi-select')) {
                this._tbody.querySelectorAll('tr.selected').forEach(r => r.classList.remove('selected'));
            }
            row.classList.toggle('selected');
        });

        this._tbody.appendChild(row);

        // Also add to icon grid
        const iconItem = document.createElement('div');
        iconItem.className = 'lv-icon-item';
        iconItem.innerHTML = `
            <div class="item-icon">${icon}</div>
            <div class="item-label">${cells[0] || ''}</div>
        `;
        iconItem.addEventListener('click', () => {
            if (!this.hasAttribute('multi-select')) {
                this._iconGrid.querySelectorAll('.lv-icon-item.selected').forEach(i => i.classList.remove('selected'));
            }
            iconItem.classList.toggle('selected');
        });
        this._iconGrid.appendChild(iconItem);

        return row;
    }

    /**
     * Elimina todas las filas de datos.
     */
    public clear(): void {
        this._tbody.innerHTML = '';
        this._iconGrid.innerHTML = '';
    }

    /**
     * Retorna las filas actualmente seleccionadas.
     */
    public getSelectedRows(): HTMLTableRowElement[] {
        return Array.from(this._tbody.querySelectorAll<HTMLTableRowElement>('tr.selected'));
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (oldValue === newValue) return;
        if (name === 'view-style') this._updateViewButtons();
        this.render();
    }

    private _updateViewButtons(): void {
        const vs = this.viewStyle;
        this._toolbar.querySelectorAll('.lv-vbtn').forEach(btn => {
            const b = btn as HTMLElement;
            b.classList.toggle('active', b.dataset['view'] === vs);
        });
    }

    protected render(): void {
        this._buildTable();
        this._updateViewButtons();
    }

    // ── Property accessors ──────────────────────────────────────────────────
    get viewStyle(): string { return this.getAttribute('view-style') || 'report'; }
    set viewStyle(v: string) { this.setAttribute('view-style', v); }

    get sortable(): boolean { return this.hasAttribute('sortable'); }
    set sortable(v: boolean) {
        if (v) this.setAttribute('sortable', '');
        else this.removeAttribute('sortable');
    }

    get multiSelect(): boolean { return this.hasAttribute('multi-select'); }
    set multiSelect(v: boolean) {
        if (v) this.setAttribute('multi-select', '');
        else this.removeAttribute('multi-select');
    }

    get checkboxes(): boolean { return this.hasAttribute('checkboxes'); }
    set checkboxes(v: boolean) {
        if (v) this.setAttribute('checkboxes', '');
        else this.removeAttribute('checkboxes');
    }
}

customElements.define('vcl-listview', VCLListView);
