import { VCLControlElement } from '../../core/VCLControlElement';

/**
 * <vcl-carousel> — Web Component Nativo de Carrusel de Diapositivas
 * Sustituye a TCarousel / TCarouselPage de VCL.JS
 */
export class VCLCarousel extends VCLControlElement {
    static get observedAttributes() {
        return ['autoplay', 'interval', 'show-indicators', 'show-arrows'];
    }

    private _wrapper: HTMLDivElement;
    private _track: HTMLDivElement;
    private _dotsContainer: HTMLDivElement;
    private _prevBtn: HTMLButtonElement;
    private _nextBtn: HTMLButtonElement;
    private _currentIndex: number = 0;
    private _timer: any = null;

    constructor() {
        super();

        this._wrapper = document.createElement('div');
        this._wrapper.className = 'vcl-carousel-wrapper';

        this._track = document.createElement('div');
        this._track.className = 'carousel-track';

        const slot = document.createElement('slot');
        this._track.appendChild(slot);

        this._prevBtn = document.createElement('button');
        this._prevBtn.type = 'button';
        this._prevBtn.className = 'carousel-nav-btn prev';
        this._prevBtn.innerHTML = '&#10094;';

        this._nextBtn = document.createElement('button');
        this._nextBtn.type = 'button';
        this._nextBtn.className = 'carousel-nav-btn next';
        this._nextBtn.innerHTML = '&#10095;';

        this._dotsContainer = document.createElement('div');
        this._dotsContainer.className = 'carousel-dots';

        this._wrapper.appendChild(this._track);
        this._wrapper.appendChild(this._prevBtn);
        this._wrapper.appendChild(this._nextBtn);
        this._wrapper.appendChild(this._dotsContainer);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                position: relative;
                width: 100%;
                height: 320px;
                box-sizing: border-box;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            }

            :host([hidden]) { display: none !important; }

            .vcl-carousel-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
                user-select: none;
            }

            .carousel-track {
                display: flex;
                width: 100%;
                height: 100%;
                transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
            }

            ::slotted(vcl-carousel-page) {
                flex: 0 0 100%;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
            }

            .carousel-nav-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(15, 23, 42, 0.6);
                backdrop-filter: blur(4px);
                color: #ffffff;
                border: none;
                width: 38px;
                height: 38px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.2s ease;
                z-index: 10;
            }

            .carousel-nav-btn:hover {
                background: rgba(15, 23, 42, 0.9);
                transform: translateY(-50%) scale(1.1);
            }

            .carousel-nav-btn.prev { left: 12px; }
            .carousel-nav-btn.next { right: 12px; }

            .carousel-dots {
                position: absolute;
                bottom: 12px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 8px;
                z-index: 10;
            }

            .dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .dot.active {
                background: #ffffff;
                width: 24px;
                border-radius: 6px;
            }
        `;

        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(this._wrapper);

        this._initEvents();
    }

    connectedCallback() {
        super.connectedCallback();
        this._initAutoplay();
        this.render();
    }

    disconnectedCallback() {
        this._stopAutoplay();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this._initAutoplay();
            this.render();
        }
    }

    protected render(): void {
        this._updateView();
    }

    public get activeIndex(): number {
        return this._currentIndex;
    }
    public set activeIndex(val: number) {
        this.goTo(val);
    }

    public get totalPages(): number {
        return this.querySelectorAll('vcl-carousel-page').length;
    }

    public next() {
        const total = this.totalPages;
        if (total > 0) {
            this.goTo((this._currentIndex + 1) % total);
        }
    }

    public prev() {
        const total = this.totalPages;
        if (total > 0) {
            this.goTo((this._currentIndex - 1 + total) % total);
        }
    }

    public goTo(index: number) {
        const total = this.totalPages;
        if (total === 0) return;
        this._currentIndex = Math.max(0, Math.min(index, total - 1));
        this._updateView();
        this.dispatchEvent(new CustomEvent('vcl-change', {
            detail: { activeIndex: this._currentIndex },
            bubbles: true,
            composed: true
        }));
    }

    private _initEvents() {
        this._prevBtn.onclick = (e) => { e.stopPropagation(); this.prev(); };
        this._nextBtn.onclick = (e) => { e.stopPropagation(); this.next(); };

        this._wrapper.addEventListener('mouseenter', () => this._stopAutoplay());
        this._wrapper.addEventListener('mouseleave', () => this._initAutoplay());
    }

    private _initAutoplay() {
        this._stopAutoplay();
        if (this.hasAttribute('autoplay')) {
            const interval = parseInt(this.getAttribute('interval') || '4000', 10);
            this._timer = setInterval(() => this.next(), interval);
        }
    }

    private _stopAutoplay() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    private _updateView() {
        this._track.style.transform = `translateX(-${this._currentIndex * 100}%)`;

        const total = this.totalPages;
        this._dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('div');
            dot.className = `dot ${i === this._currentIndex ? 'active' : ''}`;
            dot.onclick = () => this.goTo(i);
            this._dotsContainer.appendChild(dot);
        }
    }
}

/**
 * <vcl-carousel-page> — Página individual de carrusel
 */
export class VCLCarouselPage extends HTMLElement {
    constructor() {
        super();
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
            }
        `;
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(style);
        shadow.appendChild(document.createElement('slot'));
    }
}

customElements.define('vcl-carousel', VCLCarousel);
customElements.define('vcl-carousel-page', VCLCarouselPage);
