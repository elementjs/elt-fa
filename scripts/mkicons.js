#!/usr/bin/env node
/// <reference types="node" />
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
import { css } from "elt"

css\`
/* */
.eltfa {
  height: 1em;
  color: currentcolor;
  height: 1em;
  vertical-align: -.125em;
}
.eltfa > path {
  fill: currentcolor;
}
.eltfa > .fa-secondary {
  opacity: 0.5;
}
\`
`, "utf-8")

// const css = fs.readFileSync(path.join(root, "css/fontawesome.css"), "utf-8")

function mksnake(str) { return str.replace(/\b-?([a-z0-9])/g, (_, m) => m.toUpperCase()) }


for (let dir of fs.readdirSync(path.join(root, "svgs"))) {

  const res = []
  const dts = []

  dts.push(`import { Attrs } from "elt"`)

  res.push(`

import "./style"

`)

  for (let icon of fs.readdirSync(path.join(root, "svgs", dir))) {
    const contents = fs.readFileSync(path.join(root, "svgs", dir, icon), "utf-8")
      .replace(`xmlns="http://www.w3.org/2000/svg" `, "")
      .replace(/<!--[^]*-->/m, '')
      .replace(/(<defs>)?<style>.fa-secondary{opacity:.4}<\/style>(<\/defs>)?/, "")
      .replace(/<\/[^>]+?>/g, ")")
      .replace(/\/>/g, "}), ")
      .replace(/>/g, " }, ")
      .replace(/<([^\s]+)/g, "E(\"$1\", {")
      .replace(/="/g, ": \"")
      .replace(/viewBox/g, "class: \"eltfa\", viewBox")

    const fnname = "Fa" + mksnake(icon.replace(".svg", ""))
    res.push(`export let ${fnname} = /** @__PURE__ */ () => ${contents}`)
    dts.push(`export function ${fnname}(attrs?: Attrs): SVGElement`)
    // console.log(dir, icon, fnname)
  }
  fs.writeFileSync(path.join(__dirname, `../${dir}.js`), res.join("\n"), "utf-8")
  fs.writeFileSync(path.join(__dirname, `../${dir}.d.ts`), dts.join("\n"), "utf-8")
}
