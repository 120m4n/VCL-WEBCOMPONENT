import { VCLContainerElement } from '../../core/VCLContainerElement';
import { VCLControlElement } from '../../core/VCLControlElement';

// ─────────────────────────────────────────────────────────────────────────────
// VCLTreeNode — <vcl-treenode>
// Sustituye a TTreeNode de Delphi 4 (comctrls.pas)
// ─────────────────────────────────────────────────────────────────────────────
export class VCLTreeNode extends VCLControlElement {

    static get observedAttributes() {
        return ['text', 'caption', 'expanded', 'selected', 'icon',
                'expanded-icon', 'checkboxes', 'checked', 'disabled'];
    }

    private _nodeEl: HTMLDivElement;
    private _rowEl: HTMLDivElement;
    private _toggleEl: HTMLSpanElement;
    private _checkEl: HTMLInputElement;
    private _iconEl: HTMLSpanElement;
    private _labelEl: HTMLSpanElement;
    private _childrenEl: HTMLDivElement;
    private _childSlot: HTMLSlotElement;

    constructor() {
        super();
        this.setAttribute('role', 'treeitem');

        this._nodeEl = document.createElement('div');
        this._nodeEl.className = 'vcl-treenode';

        this._rowEl = document.createElement('div');
        this._rowEl.className = 'node-row';
        this._rowEl.setAttribute('tabindex', '0');

        this._toggleEl = document.createElement('span');
        this._toggleEl.className = 'node-toggle';

        this._checkEl = document.createElement('input');
        this._checkEl.type = 'checkbox';
        this._checkEl.className = 'node-checkbox';
        this._checkEl.setAttribute('tabindex', '-1');

        this._iconEl = document.createElement('span');
        this._iconEl.className = 'node-icon';

        this._labelEl = document.createElement('span');
        this._labelEl.className = 'node-label';

        this._rowEl.appendChild(this._toggleEl);
        this._rowEl.appendChild(this._checkEl);
        this._rowEl.appendChild(this._iconEl);
        this._rowEl.appendChild(this._labelEl);

        this._childrenEl = document.createElement('div');
        this._childrenEl.className = 'node-children';

        this._childSlot = document.createElement('slot');
        this._childrenEl.appendChild(this._childSlot);

        this._nodeEl.appendChild(this._rowEl);
        this._nodeEl.appendChild(this._childrenEl);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                box-sizing: border-box;
            }

            :host([hidden]) { display: none !important; }

            /* ── Node wrapper ───────────────────────────────────────── */
            .vcl-treenode {
                display: block;
                font-family: inherit;
                font-size: 13px;
                color: #1f2937;
            }

            /* ── Row ─────────────────────────────────────────────────── */
            .node-row {
                display: flex;
                align-items: center;
                gap: 3px;
                padding: 3px 4px;
                border-radius: 5px;
                cursor: default;
                user-select: none;
                outline: none;
                transition: background 0.12s ease, box-shadow 0.12s ease;
                min-height: 24px;
                position: relative;
            }

            .node-row:hover {
                background: rgba(59, 130, 246, 0.07);
            }

            .node-row:focus-visible {
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
            }

            :host([selected]) > .vcl-treenode > .node-row {
                background: rgba(59, 130, 246, 0.15);
                color: #1d4ed8;
                font-weight: 500;
            }

            :host([disabled]) > .vcl-treenode > .node-row {
                opacity: 0.45;
                pointer-events: none;
            }

            /* ── Toggle arrow ────────────────────────────────────────── */
            .node-toggle {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                flex-shrink: 0;
                border-radius: 3px;
                font-size: 10px;
                color: #6b7280;
                transition: transform 0.18s ease, color 0.12s ease;
            }

            .node-toggle::before {
                content: '';
                display: block;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 4px 0 4px 6px;
                border-color: transparent transparent transparent #9ca3af;
            }

            /* Hide toggle when no children */
            :host(.no-children) .node-toggle { visibility: hidden; }

            :host([expanded]) > .vcl-treenode > .node-row > .node-toggle {
                transform: rotate(90deg);
            }

            .node-toggle:hover { color: #3b82f6; }

            /* ── Checkbox ────────────────────────────────────────────── */
            .node-checkbox {
                display: none;
                accent-color: #3b82f6;
                width: 14px;
                height: 14px;
                flex-shrink: 0;
                cursor: pointer;
            }

            :host([checkboxes]) .node-checkbox { display: block; }

            /* ── Icon ────────────────────────────────────────────────── */
            .node-icon {
                display: none;
                font-size: 14px;
                line-height: 1;
                flex-shrink: 0;
            }

            :host([icon]) .node-icon,
            :host([expanded-icon]) .node-icon { display: inline-block; }

            /* ── Label ───────────────────────────────────────────────── */
            .node-label {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            /* ── Children container ──────────────────────────────────── */
            .node-children {
                display: none;
                padding-left: 20px;
                border-left: 1px dashed #d1d5db;
                margin-left: 11px;
            }

            :host([expanded]) > .vcl-treenode > .node-children {
                display: block;
            }

            /* ── Dark mode ───────────────────────────────────────────── */
            @media (prefers-color-scheme: dark) {
                .vcl-treenode { color: #e5e7eb; }

                .node-row:hover { background: rgba(59,130,246,0.1); }

                :host([selected]) > .vcl-treenode > .node-row {
                    background: rgba(59,130,246,0.2);
                    color: #93c5fd;
                }

                .node-children { border-left-color: #374151; }
                .node-toggle::before { border-left-color: #6b7280; }
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._nodeEl);

        this._setupEvents();
    }

    connectedCallback(): void {
        super.connectedCallback();
        if (this.closest('vcl-treeview')?.hasAttribute('checkboxes')) {
            this.setAttribute('checkboxes', '');
        }
        this.render();
    }

    private _isCascading: boolean = false;

    private _propagateCheckCascade(isChecked: boolean): void {
        if (this._isCascading) return;
        this._isCascading = true;

        try {
            // 1. Cascade Down to all descendants
            const descendants = Array.from(this.querySelectorAll('vcl-treenode')) as VCLTreeNode[];
            for (const child of descendants) {
                child._isCascading = true;
                if (isChecked) {
                    child.setAttribute('checked', '');
                } else {
                    child.removeAttribute('checked');
                }
                child.render();
                child._isCascading = false;
            }

            // 2. Cascade Up to ancestors
            this._updateParentCheckCascade();
        } finally {
            this._isCascading = false;
        }
    }

    private _updateParentCheckCascade(): void {
        const parentNode = this.parentElement?.closest('vcl-treenode') as VCLTreeNode | null;
        if (!parentNode || parentNode._isCascading) return;

        const siblings = Array.from(parentNode.querySelectorAll(':scope > vcl-treenode')) as VCLTreeNode[];
        const allChecked = siblings.length > 0 && siblings.every(s => s.hasAttribute('checked'));

        parentNode._isCascading = true;
        if (allChecked) {
            parentNode.setAttribute('checked', '');
        } else {
            parentNode.removeAttribute('checked');
        }
        parentNode.render();
        parentNode._isCascading = false;

        // Recursively update higher ancestors
        parentNode._updateParentCheckCascade();
    }

    private _setupEvents(): void {
        // Toggle expand on arrow click
        this._toggleEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this._toggleExpand();
        });

        // Select on row click
        this._rowEl.addEventListener('click', () => {
            this._selectNode();
        });

        // Checkbox click & change
        this._checkEl.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        this._checkEl.addEventListener('change', (e) => {
            e.stopPropagation();
            const isChecked = this._checkEl.checked;
            if (isChecked) {
                this.setAttribute('checked', '');
            } else {
                this.removeAttribute('checked');
            }
            this._propagateCheckCascade(isChecked);
            this.dispatchEvent(new CustomEvent('vcl-tree-check', {
                bubbles: true, composed: true, detail: { node: this, checked: isChecked }
            }));
        });

        // Keyboard navigation — delegated up to VCLTreeView
        this._rowEl.addEventListener('keydown', (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    if (!this.expanded) this._toggleExpand();
                    else this._focusFirstChild();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (this.expanded) this._toggleExpand();
                    else this._focusParentNode();
                    break;
                case 'Space':
                    e.preventDefault();
                    if (this.hasAttribute('checkboxes') || this.closest('vcl-treeview')?.hasAttribute('checkboxes')) {
                        this.checked = !this.checked;
                    } else {
                        this._selectNode();
                    }
                    break;
                case 'Enter':
                    e.preventDefault();
                    this._selectNode();
                    break;
                case 'ArrowDown':
                case 'ArrowUp':
                    e.preventDefault();
                    // Bubble up — handled by VCLTreeView
                    this.dispatchEvent(new CustomEvent('vcl-tree-keynav', {
                        bubbles: true, composed: true,
                        detail: { key: e.key, node: this }
                    }));
                    break;
            }
        });

        // Track when children slot changes
        this._childSlot.addEventListener('slotchange', () => {
            const hasChildren = this._childSlot.assignedElements().length > 0;
            this.classList.toggle('no-children', !hasChildren);
        });
    }

    private _toggleExpand(): void {
        const wasExpanded = this.expanded;
        this.expanded = !wasExpanded;
        const eventName = wasExpanded ? 'vcl-tree-collapse' : 'vcl-tree-expand';
        this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true, composed: true, detail: { node: this }
        }));
    }

    private _selectNode(): void {
        // Deselect siblings handled by VCLTreeView
        this.selected = true;
        this.dispatchEvent(new CustomEvent('vcl-tree-select', {
            bubbles: true, composed: true, detail: { node: this }
        }));
        this._rowEl.focus();
    }

    private _focusFirstChild(): void {
        const first = this.querySelector('vcl-treenode') as VCLTreeNode | null;
        first?._rowEl?.focus();
    }

    private _focusParentNode(): void {
        const parent = this.closest('vcl-treenode:not(:scope)') as VCLTreeNode | null;
        parent?._rowEl?.focus();
    }

    /** Called by VCLTreeView to focus this node's row */
    public focusRow(): void {
        this._rowEl.focus();
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (oldValue === newValue) return;
        this.render();
    }

    protected render(): void {
        let label = this.getAttribute('text') || this.getAttribute('caption') || '';

        // Icon
        const isExpanded = this.hasAttribute('expanded');
        const expandedIcon = this.getAttribute('expanded-icon');
        const collapsedIcon = this.getAttribute('icon');
        const activeIcon = (isExpanded && expandedIcon) ? expandedIcon : (collapsedIcon || '');

        if (collapsedIcon || expandedIcon) {
            // Strip matching leading icon/emoji from text label if icon attribute is specified to avoid double icons
            if (activeIcon && label.startsWith(activeIcon)) {
                label = label.slice(activeIcon.length).trim();
            } else if (collapsedIcon && label.startsWith(collapsedIcon)) {
                label = label.slice(collapsedIcon.length).trim();
            } else if (expandedIcon && label.startsWith(expandedIcon)) {
                label = label.slice(expandedIcon.length).trim();
            }
        }

        this._labelEl.textContent = label;
        this.setAttribute('aria-label', label);
        this._iconEl.textContent = activeIcon;

        // Checkbox
        this._checkEl.checked = this.hasAttribute('checked');
        this._checkEl.disabled = this.hasAttribute('disabled');

        // ARIA
        this.setAttribute('aria-expanded', String(isExpanded));
        this.setAttribute('aria-selected', String(this.hasAttribute('selected')));
        if (this.hasAttribute('checkboxes')) {
            this.setAttribute('aria-checked', String(this.hasAttribute('checked')));
        }

        const hasChildren = this._childSlot.assignedElements().length > 0;
        this.classList.toggle('no-children', !hasChildren);
    }

    // ── Property accessors ──────────────────────────────────────────────────
    get text(): string { return this.getAttribute('text') || this.getAttribute('caption') || ''; }
    set text(v: string) { this.setAttribute('text', v); }

    get expanded(): boolean { return this.hasAttribute('expanded'); }
    set expanded(v: boolean) {
        if (v) this.setAttribute('expanded', '');
        else this.removeAttribute('expanded');
    }

    get selected(): boolean { return this.hasAttribute('selected'); }
    set selected(v: boolean) {
        if (v) this.setAttribute('selected', '');
        else this.removeAttribute('selected');
    }

    get checked(): boolean { return this.hasAttribute('checked'); }
    set checked(v: boolean) {
        if (v) this.setAttribute('checked', '');
        else this.removeAttribute('checked');
        this._checkEl.checked = v;
        this._propagateCheckCascade(v);
    }
}

customElements.define('vcl-treenode', VCLTreeNode);


// ─────────────────────────────────────────────────────────────────────────────
// VCLTreeView — <vcl-treeview>
// Sustituye a TTreeView de Delphi 4 (comctrls.pas)
// ─────────────────────────────────────────────────────────────────────────────
export class VCLTreeView extends VCLContainerElement {

    static get observedAttributes() {
        return ['checkboxes', 'disabled'];
    }

    private _tree: HTMLDivElement;
    private _slotInner: HTMLSlotElement;
    private _selectedNode: VCLTreeNode | null = null;

    constructor() {
        super();
        this.setAttribute('role', 'tree');

        this._tree = document.createElement('div');
        this._tree.className = 'vcl-treeview';

        this._slotInner = document.createElement('slot');
        this._tree.appendChild(this._slotInner);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                box-sizing: border-box;
                width: 100%;
            }

            :host([hidden]) { display: none !important; }

            .vcl-treeview {
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                font-size: 13px;
                color: #1f2937;
                background: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 6px;
                box-sizing: border-box;
                overflow: auto;
                min-height: 80px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }

            :host([disabled]) .vcl-treeview {
                opacity: 0.55;
                pointer-events: none;
            }

            /* Dark mode */
            @media (prefers-color-scheme: dark) {
                .vcl-treeview {
                    background: #111827;
                    border-color: #374151;
                    color: #e5e7eb;
                }
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._tree);

        this._setupEvents();
    }

    private _setupEvents(): void {
        // Selection management — ensure single selection
        this.addEventListener('vcl-tree-select', (e: Event) => {
            const ev = e as CustomEvent;
            const node = ev.detail.node as VCLTreeNode;

            if (this._selectedNode && this._selectedNode !== node) {
                this._selectedNode.selected = false;
            }
            this._selectedNode = node;
        });

        // Keyboard ArrowUp/ArrowDown navigation
        this.addEventListener('vcl-tree-keynav', (e: Event) => {
            const ev = e as CustomEvent;
            const { key, node } = ev.detail as { key: string, node: VCLTreeNode };
            const allVisible = this._getVisibleNodes();
            const idx = allVisible.indexOf(node);

            if (key === 'ArrowDown' && idx < allVisible.length - 1) {
                allVisible[idx + 1].focusRow();
            } else if (key === 'ArrowUp' && idx > 0) {
                allVisible[idx - 1].focusRow();
            }
        });

        // Propagate checkboxes attribute to children
        this._slotInner.addEventListener('slotchange', () => {
            this._syncCheckboxes();
        });
    }

    private _syncCheckboxes(): void {
        if (this.hasAttribute('checkboxes')) {
            this.querySelectorAll('vcl-treenode').forEach(n => n.setAttribute('checkboxes', ''));
        }
    }

    /**
     * Retorna todos los nodos visibles en orden de renderizado (DFS preorder)
     */
    private _getVisibleNodes(): VCLTreeNode[] {
        const result: VCLTreeNode[] = [];
        const visit = (parent: Element) => {
            const children = Array.from(parent.children).filter(c => c.tagName.toLowerCase() === 'vcl-treenode') as VCLTreeNode[];
            for (const child of children) {
                result.push(child);
                if (child.expanded) visit(child);
            }
        };
        visit(this);
        return result;
    }

    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
        if (oldValue === newValue) return;
        this._syncCheckboxes();
        this.render();
    }

    protected render(): void {}

    get selectedNode(): VCLTreeNode | null { return this._selectedNode; }
}

customElements.define('vcl-treeview', VCLTreeView);
