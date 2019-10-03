
import { style, rule } from 'osun'

export namespace Fa {

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
