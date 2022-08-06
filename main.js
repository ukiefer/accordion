import Accordion from './accordion.js'

// get all accordions
let doSingleExpanded = true
for (const $accordion of [].concat(...document.querySelectorAll('.accordion'))) {
    const a = new Accordion(
        $accordion,
        {
            scrollPaddingTop: 50, 
            singleExpanded: doSingleExpanded,
        }
    )
    a.initialize()
    doSingleExpanded = !doSingleExpanded
}