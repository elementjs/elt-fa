
import { e, o, Attrs, Renderable, Decorator, Insertable } from 'elt'
import { style, rule } from 'osun'


export function Fa<K extends keyof RegisteredIcons>(a: Attrs<SVGSVGElement> & {name: K}) {
	return e(registered_icons[a.name], a)
}

export namespace Fa.css {

  export const icon = style('icon', {
    display: 'inline-block',
    height: '1em',
    overflow: 'visible',
    fontSize: 'inherit',
    verticalAlign: '-.125em'
  })

  export const primary = style('primary')
  export const secondary = style('secondary', { opacity: 0.4 })

  rule`${icon} path`({
    fill: 'currentcolor',
    stroke: 'currentcolor'
  })

}


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
