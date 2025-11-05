# nfc-reader — Web NFC demo (large & polished)

nfc-reader is a compact, friendly demo app that shows how to read and write plain-text NFC records from the browser using the Web NFC API. It's built with React and deliberately minimal so you can focus on the Web NFC integration and quickly experiment on supported devices (Chrome on Android, secure contexts).

Highlights
- Clean, minimal React UI for quick experimentation.
- Read and write simple text records to NFC tags.
- Small, easy-to-audit NFC logic in a single file.

Live files and key symbols
- App UI: [src/App.js](src/App.js) — the `App` component that drives the demo.
- Entry point: [src/index.js](src/index.js)
- NFC logic: [src/nfcHandler.js](src/nfcHandler.js) — contains [`readNFC`](src/nfcHandler.js) and [`writeNFC`](src/nfcHandler.js).
- Static HTML: [public/index.html](public/index.html)
- Styles: [src/styles.css](src/styles.css)
- Project manifest & metadata: [package.json](package.json)

Table of contents
1. Overview
2. Screens & usage
3. Installation
4. Running the app
5. How the NFC API is used
6. Browser & security notes
7. Troubleshooting
8. Extending the demo
9. Contributing
10. License

1 — Overview
This demo focuses on the basics of Web NFC:
- Scanning tags and decoding text records.
- Writing simple text records to tags.

All NFC logic is small and readable in [src/nfcHandler.js](src/nfcHandler.js) and the UI that calls it lives in [src/App.js](src/App.js).

2 — Screens & usage
Open the app on a supported device (Chrome on Android over HTTPS or localhost during development). The interface provides two main actions:
- "📥 Read NFC Tag" — calls [`readNFC`](src/nfcHandler.js) and displays the first text record read from the tag.
- "📤 Write NFC Tag" — calls [`writeNFC`](src/nfcHandler.js) with the text from the input and writes it to the tag.

Basic workflow:
1. Start the dev server (see below).
2. Open the app URL on your device.
3. Tap "📥 Read NFC Tag" and place an NFC tag near the device.
4. Type a message and tap "📤 Write NFC Tag" to write it.

3 — Installation
Clone or open this repository and install dependencies.

Using npm:
```sh
npm install
```
