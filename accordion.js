/**
 * @module accordion
 *
 * @author Uwe Kiefer <uwe.kiefer.dev@gmail.com>
 */

 class Accordion {
    constructor(el, obj = {}) {
        this.el = el
        this.options = Object.assign({}, {
            aria: true,
            singleExpanded: true,
            scrollPaddingTop: 0,
        }, obj)
        this._isTransitioningShow = false
        this._isTransitioningHide = false
        
        this.toogleItem = this.toogleItem.bind(this)
    }

    // static selectors
    static get SELECTOR_BODY() { return '.accordion__body' }
    static get SELECTOR_BUTTON() { return '.accordion__button' }
    static get SELECTOR_COLLAPSE() { return '.accordion__collapse' }
    static get SELECTOR_COLLAPSE_INNER() { return '.accordion__collapse-inner' }
    static get SELECTOR_HEADER() { return '.accordion__header' }
    static get SELECTOR_ITEM() { return '.accordion__item' }

    // static modifire classes
    // static get CLASS_CLOSING() { return 'accordion__collapse--closing' }
    // static get CLASS_COLLAPSED() { return 'accordion__button--collapsed' }
    // static get CLASS_COLLAPSING() { return 'accordion__collapse--collapsing' }
    // static get CLASS_SHOW() { return 'accordion__collapse--show' }
 
    initialize() {
        this.id = this.el.id || `accordion-${Math.floor(Math.random() * Date.now())}`
        this.items = Array.prototype.slice.call(this.el.children)
        for (const item of this.items) {
            const body = item.querySelector(Accordion.SELECTOR_BODY)
            const collapse = document.createElement('div')
            collapse.className = 'accordion__collapse'
            const inner = document.createElement('div')
            inner.className = 'accordion__collapse-inner'

            body.parentElement.appendChild(collapse)
            collapse.appendChild(inner)
            inner.appendChild(body)
        }
        this.setupItems()
        this.bindEvents()
        this.el.classList.add('accordion--init')
    }

    destroy() {
        for (const item of this.items) {
            item.querySelector(Accordion.SELECTOR_BUTTON).removeEventListener('click', this.toogleItem)
        }
    }

    bindEvents() {
        for (const item of this.items) {
            item.querySelector(Accordion.SELECTOR_BUTTON).addEventListener('click', this.toogleItem)
        }
    }

    setupItems() {
        let openItems = 0
        let i = 1
        for (const item of this.items) {
            const isOpen = item.dataset.hasOwnProperty('open') 
            if (isOpen) {
                openItems++
            }
            if (this.options.aria) {
                const button = item.querySelector(Accordion.SELECTOR_BUTTON)
                const collapse = item.querySelector(Accordion.SELECTOR_COLLAPSE)
                const header = item.querySelector(Accordion.SELECTOR_HEADER)

                const idHeading = header.id || `${this.id}-${i}-heading`
                header.id = idHeading
                collapse.setAttribute('aria-labelledby', idHeading)

                const idCollapse = collapse.id || `${this.id}-${i}-collapse`
                collapse.id = idCollapse
                button.setAttribute('aria-controls', idCollapse)

                button.setAttribute('aria-expanded', isOpen)
            }
            i++
        }
        if (openItems > 1) {
            // use singe expanded if several items are open
            this.options.singleExpanded = false
        }
        console.log("🚀 ~ file: accordion.js:94 ~ Accordion ~ setupItems ~ this.options.singleExpanded:", openItems, this.options.singleExpanded)
    }

    _getHeightOfItemsBetween(first, last) {
        let height = 0
        let doAdd = false
        for (const item of this.items) {
            if (item === last) {
                doAdd = false
            }
            if (doAdd) {
                height += item.querySelector(Accordion.SELECTOR_HEADER).clientHeight
            }
            if (item === first) {
                doAdd = true
            }
        }
        return height
    }
        
    toogleItem({target}) {
        const currentItem = target.closest(Accordion.SELECTOR_ITEM)
        if (currentItem.dataset.hasOwnProperty('open')) {      
            this.hideItem(currentItem)
        } else {
            if (this.options.singleExpanded) {
                const openItem = this.el.querySelector('[data-open]')
                if (openItem && this.items.indexOf(openItem) < this.items.indexOf(currentItem)) {
                    // scroll window
                    const bound = openItem.querySelector(Accordion.SELECTOR_HEADER).getBoundingClientRect()
                    const diff = bound.height + bound.y - this.options.scrollPaddingTop
                    if (diff < 0) {
                        window.scrollTo({
                            top: window.scrollY + diff + this._getHeightOfItemsBetween(openItem, currentItem),
                            left: 0,
                            behavior: 'smooth'
                        })
                    }
                }
                this.hideItem(openItem)
            }
            this.showItem(currentItem)
        }
    }

    showItem(item) {
        if (!item) return

        if (this.options.aria) {
            item.querySelector(Accordion.SELECTOR_BUTTON).setAttribute('aria-expanded', true)
        }

        item.setAttribute('data-open', '')
    }

    hideItem(item) {
        if (!item) return

        if (this.options.aria) {
            item.querySelector(Accordion.SELECTOR_BUTTON).setAttribute('aria-expanded', false)
        }

        item.removeAttribute('data-open')
    }
 }
 
 // Returns the constructor
 export default Accordion
 