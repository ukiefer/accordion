# Accordion
Basic functionalities of an accordion including accessibility

## How it works
Create an accordion by using the following markup:
```
<div class="accordion">
    <div class="accordion__item">
        <div class="accordion__header">
            <button class="accordion__button" type="button">
                Accordion Item #1
            </button>
        </div>
        <div class="accordion__collapse">
            <div class="accordion__body">
                Item Body #1
            </div>
        </div>
    </div>
    <div class="accordion__item">
        <div class="accordion__header">
            <button class="accordion__button" type="button">
                Accordion Item #2
            </button>
        </div>
        <div class="accordion__collapse">
            <div class="accordion__body">
                Item Body #2
            </div>
        </div>
    </div>
</div>
```

To render an accordion that’s expanded, add the data attribute ``data-open`` on the ``.accordion__item``.

```
<div class="accordion__item" data-open>
    <div class="accordion__header">
        ...
    </div>
    <div class="accordion__collapse">
        ...
    </div>
</div>
```
Initialize all accorions on a page
```
import Accordion from './accordion.js'

// get all accordions
for (const accordion of [].concat(...document.querySelectorAll('.accordion'))) {
    const a = new Accordion(accordion)
    a.initialize()
}
```
## Options
You can setup an accordion with options:
```
const a = new Accordion(document.querySelector('.accordion'), {
    aria: true,
    singleExpanded: true,
    scrollMarginTop: 0,
})
```

### aria
Type: `Boolean`  
Default: `true`

Whether to use the aria attributes `aria-controls`, `aria-expanded`, and `aria-labelledby` automaticly.


### singleExpanded
Type: `Boolean`  
Default: `true`

Whether to open only one item of the accordion at a time.


### scrollMarginTop
Type: `Integer`  
Default: `0`

Distance of the scroll-margin-top in pixels to be taken into account.

## Accessibility

The aria attributes will be used by default. If the ``.accordion`` has no ``id``, an unique id will be generated automaticly.