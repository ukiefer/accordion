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
        this.items = []
        this._isTransitioningShow = false
        this._isTransitioningHide = false
        
        this.toogleItem = this.toogleItem.bind(this)
    }

    // static selectors
    static get SELECTOR_BODY() { return '.accordion__body' }
    static get SELECTOR_BUTTON() { return '.accordion__button' }
    static get SELECTOR_COLLAPSE() { return '.accordion__collapse' }
    static get SELECTOR_HEADER() { return '.accordion__header' }
    static get SELECTOR_ITEM() { return '.accordion__item' }

    // static modifire classes
    static get CLASS_CLOSING() { return 'accordion__collapse--closing' }
    static get CLASS_COLLAPSED() { return 'accordion__button--collapsed' }
    static get CLASS_COLLAPSING() { return 'accordion__collapse--collapsing' }
    static get CLASS_SHOW() { return 'accordion__collapse--show' }
 
    initialize() {
        this.id = this.el.id || `accordion-${Math.floor(Math.random() * Date.now())}`
        for (const item of [].concat(...this.el.querySelectorAll(Accordion.SELECTOR_ITEM))) {
            this.items.push({
                item: item,
                header: item.querySelector(Accordion.SELECTOR_HEADER),
                button: item.querySelector(Accordion.SELECTOR_BUTTON),
                collapse: item.querySelector(Accordion.SELECTOR_COLLAPSE),
                body: item.querySelector(Accordion.SELECTOR_BODY)
            });
        }
        this.setupItems()
        this.bindEvents()
        this.el.classList.add('accordion--init')
    }

    destroy() {
        for (const item of this.items) {
            item.button.removeEventListener('click', this.toogleItem)
        }
    }

    bindEvents() {
        for (const item of this.items) {
            item.button.addEventListener('click', this.toogleItem)
        }
    }

    setupItems() {
        let openItems = 0
        let i = 1
        for (const item of this.items) {
            const isOpen = item.item.dataset.hasOwnProperty('open') 
            if (isOpen) {
                item.collapse.classList.add(Accordion.CLASS_SHOW)
                openItems++
            } else {
                item.button.classList.add(Accordion.CLASS_COLLAPSED)
            }
            if (this.options.aria) {
                const idHeading = item.header.id || `${this.id}-${i}-heading`
                const idCollapse = item.collapse.id || `${this.id}-${i}-collapse`
                item.header.id = idHeading
                item.collapse.id = idCollapse
                item.button.setAttribute('aria-controls', idCollapse)
                item.button.setAttribute('aria-expanded', isOpen)
                item.collapse.setAttribute('aria-labelledby', idHeading)
            }
            i++
        }
        if (openItems > 1) {
            // use singe expanded if several items are open
            this.options.singleExpanded = true
        }
    }

    _getHeightOfItemsBetween(first, last) {
        let height = 0
        let doAdd = false
        for (const item of this.items) {
            if (item === last) {
                doAdd = false
            }
            if (doAdd) {
                height += item.header.clientHeight
            }
            if (item === first) {
                doAdd = true
            }
        }
        return height
    }

    toogleItem(e) {
        const currentItemElement = e.target.closest(Accordion.SELECTOR_ITEM)
        let currentItem
        let oldItem
        let doCheckAbove = true
        let above = 0
        for (const item of this.items) {
            if (item.item == currentItemElement) {
                currentItem = item
                doCheckAbove = false
            } else if (item.collapse.classList.contains(Accordion.CLASS_SHOW)) {
                oldItem = item
                if (doCheckAbove) {
                    above += 1
                }
            }
        }

        if (currentItem.collapse.classList.contains(Accordion.CLASS_SHOW)) {
            this.hideItem(currentItem)
        } else {
            if (this.options.singleExpanded && above > 0) {
                // scroll window
                const bound = oldItem.header.getBoundingClientRect()
                const diff = bound.height + bound.y - this.options.scrollPaddingTop
                if (diff < 0) {
                    window.scrollTo({
                        top: window.scrollY + diff + this._getHeightOfItemsBetween(oldItem, currentItem),
                        left: 0,
                        behavior: 'smooth'
                    })
                }
            }
            this.showItem(currentItem)
            if (this.options.singleExpanded) {
                this.hideItem(oldItem)
            }
        }
    }

    showItem(item) {
        if (!item) return
        if (this._isTransitioningShow) return

        this._isTransitioningShow = true
        item.button.classList.remove(Accordion.CLASS_COLLAPSED)
        if (this.options.aria) {
            item.button.setAttribute('aria-expanded', true)
        }

        item.collapse.classList.add(Accordion.CLASS_COLLAPSING, Accordion.CLASS_SHOW)
        item.collapse.addEventListener('transitionend', () => {
            item.collapse.classList.remove(Accordion.CLASS_COLLAPSING)
            item.collapse.style = ''
            this._isTransitioningShow = false
        }, {once: true})

        setTimeout(() => {
            item.collapse.style = `height:${item.body.scrollHeight}px`
        }, 1)
    }

    hideItem(item) {
        if (!item) return
        if (this._isTransitioningHide) return
        
        this._isTransitioningHide = true
        item.collapse.addEventListener('transitionend', () => {
            item.collapse.classList.remove(Accordion.CLASS_CLOSING, Accordion.CLASS_SHOW)
            item.collapse.style = ''
            this._isTransitioningHide = false
        }, {once: true})

        item.button.classList.add(Accordion.CLASS_COLLAPSED)
        if (this.options.aria) {
            item.button.setAttribute('aria-expanded', false)
        }

        item.collapse.style = `height:${item.body.scrollHeight}px`
        item.collapse.classList.add(Accordion.CLASS_CLOSING)

        setTimeout(() => {
            item.collapse.style = `height:0`
        }, 1)
    }
 }
 
 // Returns the constructor
 export default Accordion
 