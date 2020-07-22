
import { e, o, Attrs, Renderable, Decorator, Insertable } from 'elt'

export interface RegisteredIcons {

}

const registered_icons: {[name: string]: (a: Attrs<SVGSVGElement>, children: Renderable[]) => SVGSVGElement } = {}

export function I<K extends keyof RegisteredIcons>(attrs: Attrs<SVGSVGElement> & { name: K }, chld: Renderable[]): SVGSVGElement
export function I<K extends keyof RegisteredIcons>(name: o.RO<K>, ...attrs: (Attrs<SVGSVGElement> | Decorator<SVGSVGElement>)[]): o.RO<SVGSVGElement>
export function I<K extends keyof RegisteredIcons>(name: o.RO<K> | Attrs<SVGSVGElement>, ...more: (Attrs<SVGSVGElement> | Insertable<SVGSVGElement>)[]): any {
  if (typeof name === 'string' || name instanceof o.Observable)
    return o.tf(name, name => (e as any)(registered_icons[name], ...more))
  return (e as any)(registered_icons[(name as any).name], name, ...more)
}

I.register = function (name: string, fn: (a: Attrs<SVGSVGElement>) => SVGSVGElement) {
  registered_icons[name] = fn
}


const style = document.createElement('style')
style.appendChild(document.createTextNode(
`
.--eltfa-icon {
  display: inline-block;
  height: 1em;
  overflow: visible;
  font-size: inherit;
  vertical-align: -.125em;
}

.--eltfa-icon {
  fill: currentcolor;
}
`
))
document.head.appendChild(style)
