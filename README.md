# electron-puppeteer-quick-start

## Install deps
`yarn`

## Execute in dev mode
`electron .`

Main process runs puppeteer => Chrome opens google.de

Render process does nothing interesting

## Build
`yarn build`

## Actual problem
`yarn open`

Main process does nothing

# Potential reason

## Unpack asar to `app-asar`
`yarn extract:mac`

## Execute asar
`cd app-asar && electron .`

Main process does nothing

## Modify rights deep (still in `app-asar` directory)

`chmod +x node_modules/puppeteer/.local-chromium/mac-571375/chrome-mac/Chromium.app/Contents/MacOS/Chromium`
`electron .`

Main process runs puppeteer => Chrome open, but google.de is not shown


## Modify rights shallow (still in `app-asar` directory)

`chmod -R +x node_modules/puppeteer`
`electron .`

Main process runs puppeteer => Chrome opens google.de