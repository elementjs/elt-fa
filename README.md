# Use font-awesome with elt without hassle

```bash
npm install elt-fa
```

This library allows you to use fontawesome with elt easily.

While you can use font-awesome with its icon font packs (ttf/woff/...) and `<i>` tags, you end up having to download the whole font
everytime you use it, even if using just a small subset. Also, icon fonts are not that great (https://www.lambdatest.com/blog/its-2019-lets-end-the-debate-on-icon-fonts-vs-svg-icons/ or https://cloudfour.com/thinks/seriously-dont-use-icon-fonts/).

`elt-fa` instead goes the svg route ; when installing it, it will get all the .svg files in `@fortawesome/fontawesome-free` or `@fortawesome/fontawesome-pro` if you are a subscriber and compile them into .tsx files ready to be imported in your project.

Icon styles are used with suffixes for individual icons (`-regular`, `-light`, `-duotone` or `-solid`). You can use the regular icon name without suffix, in which case it will use whichever version was imported last.

It exports two ways of using icons ; `I()`, which can take an `o.RO<string>` and returns a dynamic icon that may change, or `<Fa name='...'>` which looks more like tsx code and makes it easier to assign classes.

You need to import all the icons you use one by one. If you don't, then the icon will not be recognized and this will result in a compilation error, which is what we actually want.

# How to use it

```tsx
import { setup_mutation_observer } from 'elt'
setup_mutation_observer(document.body)

import { I, Fa } from 'elt-fa'

import 'elt-fa/power-off-duotone'
import 'elt-fa/user-solid'
import 'elt-fa/search-duotone'
import 'elt-fa/search-solid'

document.body.appendChild(<div>
</div>)
```