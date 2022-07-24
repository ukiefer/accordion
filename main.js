import Accordion from './accordion.js'

// get all accordions
for (const $accordion of [].concat(...document.querySelectorAll('.accordion'))) {
    const a = new Accordion($accordion, {scrollMarginTop: 50})
    a.initialize()
}