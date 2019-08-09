
import { cls, s } from 'osun'

export namespace Fa {

  export const icon = cls('icon', {
    display: 'inline-block',
    height: '1em',
    overflow: 'visible',
    fontSize: 'inherit',
    verticalAlign: '-.125em'
  })

  export const primary = cls('primary')
  export const secondary = cls('secondary', { opacity: 0.4 })

  s`path`.in(icon, {
    fill: 'currentcolor',
    stroke: 'currentcolor'
  })

}
