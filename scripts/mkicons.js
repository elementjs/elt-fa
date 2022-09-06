#!/usr/bin/env node
/**
 * Make the icons .js files as well as their .d.ts
 */
const path = require('path')

function try_require(pkg) {
  try {
    // The file returned is actually two folders up.
    return path.join(require.resolve(pkg), '../..')
  } catch (e) {
    return null
  }
}


const fs = require("fs")
const root = try_require('@fortawesome/fontawesome-pro') ?? try_require('@fortawesome/fontawesome-free')
if (!root) {
  throw new Error(`Could not find any fontawesome package`)
}

const kind = path.basename(root)
const version = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf-8")).version
console.log(`building elt-fa for ${kind} ${version}`)

fs.writeFileSync(path.join(__dirname, "../style.js"), `
const st = document.createElement("style")
st.textContent = \`.eltfa {
  color: currentcolor;
  height: 1em;
  vertical-align: -.125em;
}
.eltfa path {
  fill: currentcolor;
}
.eltfa .fa-secondary {
  opacity: 0.5;
}
\`
document.head.appendChild(st)
`, "utf-8")

// const css = fs.readFileSync(path.join(root, "css/fontawesome.css"), "utf-8")

function mksnake(str) { return str.replace(/\b-?([a-z0-9])/g, (_, m) => m.toUpperCase()) }


for (let dir of fs.readdirSync(path.join(root, "svgs"))) {

  const res = []
  const dts = []

  dts.push(`import { Attrs } from "elt"`)

  res.push(`

import "./style"

function _(svg) {
  const tpl = document.createElement("template")
  tpl.innerHTML = svg
  const node = tpl.content.firstChild
  return function () {
    return node.cloneNode(true)
  }
}
`)

  for (let icon of fs.readdirSync(path.join(root, "svgs", dir))) {
    const contents = fs.readFileSync(path.join(root, "svgs", dir, icon), "utf-8")
      .replace(`xmlns="http://www.w3.org/2000/svg" `, `class="eltfa" `)
      .replace(/<!--[^]*-->/m, '')
      .replace(/(<defs>)?<style>.fa-secondary{opacity:.4}<\/style>(<\/defs>)?/, '')

    const fnname = "Fa" + mksnake(icon.replace(".svg", ""))
    res.push(`export let ${fnname} = /** @__PURE__ */ () => { const r = _(\`${contents}\`); ${fnname} = r; return r() }`)
    dts.push(`export function ${fnname}(attrs?: Attrs): SVGElement`)
    // console.log(dir, icon, fnname)
  }
  fs.writeFileSync(path.join(__dirname, `../${dir}.js`), res.join("\n"), "utf-8")
  fs.writeFileSync(path.join(__dirname, `../${dir}.d.ts`), dts.join("\n"), "utf-8")
}

// let match
// while ((match = re_extract.exec(css))) {
//   const [name, code] = match.slice(1)
//   const snake_name = mksnake(name)
//   // console.log(`export const Fa${snake_name} = "\\${code.length === 4 ? "u" : "x"}${code}",`)
//   const faname = `Fa${snake_name}`
//   res.push(`export const ${faname} = _("\\${code.length === 4 ? "u" : "x"}${code}")`)
//   dts.push(`export function ${faname}(attrs?: Attrs): HTMLSpanElement`)
// }

// // console.log(dts.join("\n"))
// fs.writeFileSync(path.join(__dirname, "../index.js"), res.join("\n"))
// fs.writeFileSync(path.join(__dirname, "../index.d.ts"), dts.join("\n"))


// // Brands are their own functions, so are duotones
// const fonts = [
//   ["sharp-solid", 900, "_fass", 700],
//   ["solid", 900, "_fas"],
//   ["regular", 400, "_far"],
//   ["light", 300, "_fal"],
//   ["thin", 100, "_fat"],
// ]
// for (let [bundle, weight, kls, weight2] of fonts) {
//   const css = fs.readFileSync(path.join(root, `css/${bundle}.min.css`), "utf-8")
//     .replace(/,url\([^)]*\) format\("truetype"\)/)
//   const snake = mksnake(bundle)
//   const fontFile = fs.readFileSync(path.join(root, `webfonts/fa-${bundle}-${weight}.woff2`))
//   const data = "data:font/woff2;base64," + fontFile.toString("base64")

//   // console.log(css)

//   const fnname = `loadfont_${bundle.replace(/-/g, "_")}`

//   const contents = `
// const st = document.createElement("style")
// st.textContent = \`
// @font-face {
// font-family: 'fontawesome';
// font-style: normal;
// font-weight: ${weight2 ?? weight};
// font-display: block;
// src: url("${data}") format("woff2"); }

// ._fa {
// font-family: 'fontawesome';
// font-weight: ${weight2 ?? weight}; }
// \`
// document.head.appendChild(st)
// `
//   const out = path.join(__dirname, "../" + bundle + ".js")
//   console.log("writing file ", out)
//   fs.writeFileSync(out, contents, { encoding: "utf-8" })

//   const outts = path.join(__dirname, "../" + bundle + ".d.ts")
//   console.log("writing file ", outts)
//   fs.writeFileSync(outts, "export const __fake: any", { encoding: "utf-8" })

// }