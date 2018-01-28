# Are.na Toolkit

The [Are.na Toolkit](https://www.are.na/sam-hart/are-na-toolkit) is a development environment for tools interoperating with Are.na.

<img src="https://github.com/hxrts/arena-toolkit/raw/master/toolkit_screenshot.png" data-canonical-src="https://github.com/hxrts/arena-toolkit/raw/master/toolkit_screenshot.png" width="1200" />

## Adding a Tool

New tools welcome by pull request. Or, fork this repo and make your own project.

Use any framework or language you like. Start by adding your tool code to a new directory in /tools, add any requred imports to manifest.json, and then see /content.js and /background.js for examples on how to begin.

Core code will aim for [idomatic.js](https://github.com/rwaldron/idiomatic.js/), but tool code can be developed in the style of the author's choosing.

## Notes

Repo includes a modified version of xpl's reloading [script](https://github.com/xpl/crx-hotreload) to refresh the background processes on detection of file changes. This script will also attempt to auto-refresh last focused Are.na window to flush content.js.
