# Use font-awesome with elt without hassle

```bash
npm install elt-fa
```

This library allows you to use fontawesome with elt easily.

While you can use font-awesome with its icon font packs (ttf/woff/...) and `<i>` tags, you end up having to download the whole font
everytime you use it, even if using just a small subset. Also, icon fonts are not that great (https://www.lambdatest.com/blog/its-2019-lets-end-the-debate-on-icon-fonts-vs-svg-icons/ or https://cloudfour.com/thinks/seriously-dont-use-icon-fonts/).

`elt-fa` instead goes the svg route ; when installing it, it will get all the .svg files in `@fortawesome/fontawesome-free` or `@fortawesome/fontawesome-pro` if you are a subscriber and compile them into .tsx files ready to be imported in your project.

Icon styles are used with suffixes for individual icons (`-regular`, `-light`, `-duotone` or `-solid`). You can use the regular icon name without suffix, in which case it will use whichever version was imported last.

It exports two ways of using icons ; `I()`, which can take an `o.RO<string>` and returns a dynamic icon that may change, or `<I name='...'>` which looks more like tsx code and makes it easier to assign classes, but which uses a static icon name.

There is no need to declare CSS or import a file, elt-fa injects its own style node at the end of `<head>`.

You need to import all the icons you use one by one. If you don't, then the icon will not be recognized and this will result in a compilation error, which is what we actually want.

> NOTE : You **MUST** add yourself a dependency of @fortawesome/fontawesome-pro in your project before installing elt-fa for it to find the pro icons.

When using duotone icons, use the classes `.fa-primary` and `.fa-secondary` in your CSS to style the icons. elt-fa does not define anything special about these classes except the fact that their `fill` css property uses `currentcolor`. Font awesome defines an opacity on the secondary, but this was discarded to keep flexibility.

Do not hesitate to do something like this in your css.

```css
.fa-secondary {
  opacity: 0.4; /* original value */
}
```

# How to use it

```tsx
import { setup_mutation_observer } from 'elt'
setup_mutation_observer(document.body)

import { I } from 'elt-fa'

import 'elt-fa/power-off-duotone'
import 'elt-fa/user-solid'
import 'elt-fa/search-duotone'
import 'elt-fa/search-solid'

document.body.appendChild(<div>
  {/* Pick your poison. */}
  {I('power-off')}
  {I('power-off-duotone')}
  {I('power-off', { class: 'some-class' })} {/* I accepts classic arguments for SVGSVGElement */}
  {I('not-imported')} {/* compile error */}
  {I('user', svg_node => { /* you can use decorators also if needed */ })}

  <I name='power-off' class='some-class'/> {/* classic style is also supported */}
  <I name='search'>
    <path d='M40 10 L230 118'> {/* children are appended at the end of the svg */}
    {node => { /* decorators are also usable with this form */ }}
  </I>
</div>)
```