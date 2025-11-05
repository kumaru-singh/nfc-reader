# nfc-reader — Web NFC demo (polished, extended) 🚀📶

A compact, approachable demo that shows reading and writing plain-text NFC (NDEF) records from the browser using the Web NFC API. This version expands the README with interactive tips, emojis, simple graphics, and quick visual guides to help you get started and experiment.

Badges
- ⚡ Minimal • 🔐 Secure context • 📱 Android-friendly

Why this repo exists
- Learn the basics of Web NFC quickly and safely.
- Provide a minimal, working React example you can adapt.
- Show clear separation between UI and NFC logic so you can experiment safely.

Quick file map
- App UI: `src/App.js` — main React component and UI
- NFC logic: `src/nfcHandler.js` — exported helpers for reading and writing
- Entry point: `src/index.js`
- Styles: `src/styles.css`
- Static HTML: `public/index.html`
- Project config: `package.json`

Table of contents
1. Overview
2. Interactive UI & usage (with visuals)
3. Installation
4. Running locally
5. How the Web NFC API is used (detailed)
6. Code examples (read / write snippets)
7. Browser & security notes
8. Troubleshooting & diagnostics
9. Extending the demo — ideas & recipes
10. Contributing
11. License

1 — Overview
This demo focuses on the essentials of Web NFC:
- Scanning tags and decoding text (NDEF) records.
- Writing plain-text NDEF records to tags.
- Minimal UX for read/write flow so you can focus on NFC behavior.

All NFC logic is compact inside `src/nfcHandler.js`; `src/App.js` demonstrates a small accessible UI and how to wire up the helpers.

2 — Interactive UI & usage 🎛️✨

Simple UI layout (conceptual)
```
┌─────────────────────────────────────────┐
│  nfc-reader                             │
│  [📥 Read NFC Tag]   [📤 Write NFC Tag]  │
│                                         │
│  Last read: "Hello world"  ⤵︎           │
│  ─────────────────────────────────────  │
│  Input: [ Type message here        ]    │
│  [📤 Write NFC Tag]                     │
└─────────────────────────────────────────┘
```

Buttons and visual cues
- 📥 Read NFC Tag — triggers a scan, shows a scanning animation and the decoded text.
- 📤 Write NFC Tag — writes the input text to a tag; shows success/err state.
- Use clear affordances for actions and show status messages (scanning, success, error).

Interactive workflow
1. Start dev server.
2. Open on Chrome for Android (HTTPS or localhost).
3. Tap "📥 Read NFC Tag" (user gesture required) → bring tag close → UI shows the text and metadata.
4. Edit the input and tap "📤 Write NFC Tag" → bring tag close → UI confirms write.

Visual NFC tag & device diagram
```
    [Android Phone]  <--tap-->  [NFC tag]
     ┌────────────┐             ┌─────────┐
     │  Screen    │             │  sticker│
     │  🔷 Scan    │             │  NDEF   │
     └────────────┘             └─────────┘
```

3 — Installation ⬇️
Clone and install dependencies.

Using npm:
```bash
git clone <repo-url>
cd project/workspace
npm install
```

Using yarn:
```bash
yarn
```

4 — Running locally ▶️
Start a dev server. Localhost is treated as secure so HTTPS is not required for development.

Using npm:
```bash
npm start
```
Open the served URL on your Android device (or on the same Android device if running the dev server there). For remote testing, use HTTPS or a tunnel that provides HTTPS.

5 — How the Web NFC API is used 🔬
This demo uses the browser's `NDEFReader`. Two primary operations:

- Read (scan)
    - Instantiate `NDEFReader` and call `scan()`.
    - Listen for `reading` events to receive NDEF messages.
    - Decode the first text record (or display the full message).

- Write
    - Use `NDEFReader().write()` with an NDEF message containing a text record.
    - Write must be triggered by a user gesture — the browser prompts to bring a tag close.

Best practices
- Always wrap NFC calls in try/catch.
- Ensure the operation is triggered by a user gesture.
- Provide clear UI feedback (scanning animation, timeouts, error messages).
- For production, handle multiple records, unknown record types, and large payload warnings.

6 — Code examples (illustrative)

Read (improved)
```js
// src/nfcHandler.js (read helper)
export async function readNFC({ signal } = {}) {
    if (!('NDEFReader' in window)) throw new Error('Web NFC not supported.');
    const r = new NDEFReader();
    await r.scan();
    return new Promise((resolve, reject) => {
        const onReading = event => {
            const records = Array.from(event.message.records);
            for (const rec of records) {
                if (rec.recordType === 'text') {
                    const dec = new TextDecoder(rec.encoding || 'utf-8');
                    const text = dec.decode(rec.data);
                    cleanup();
                    resolve({ text, records });
                    return;
                }
            }
            cleanup();
            reject(new Error('No text record found.'));
        };
        const onError = () => { cleanup(); reject(new Error('Failed to read tag.')); };
        const cleanup = () => {
            r.onreading = null;
            r.onreadingerror = null;
        };
        r.onreading = onReading;
        r.onreadingerror = onError;
        if (signal) signal.addEventListener('abort', () => {
            cleanup(); reject(new Error('Read aborted.'));
        }, { once: true });
    });
}
```

Write (improved)
```js
// src/nfcHandler.js (write helper)
export async function writeNFC(text) {
    if (!('NDEFReader' in window)) throw new Error('Web NFC not supported.');
    const w = new NDEFReader();
    // must be a user gesture
    await w.write({ records: [{ recordType: 'text', data: text }] });
    return true;
}
```

7 — Browser & security notes 🔐
- Supported: Chrome on Android (other Chromium-based Android browsers may work).
- Not supported: iOS Safari (status may change — check current browser docs).
- Requires a secure context (HTTPS) or localhost.
- The browser will prompt for permission for NFC operations.

8 — Troubleshooting & diagnostics 🛠️
Checklist
- "Web NFC not supported" → confirm device + browser.
- Permission prompt not shown → ensure action was a user gesture and NFC is enabled in system settings.
- Reads return no text → tag may have non-text records; inspect the raw records.
- Repeated failures → test with another tag and reboot the device's NFC.

Debug tips
- Log event.message.records to inspect recordType, mediaType, id, and data bytes.
- Use an AbortController to time out scans if they hang.
- Surface friendly messages to users (e.g., "Bring the tag close to the top of your phone").

9 — Extending the demo — ideas & recipes 🧪
- Support URI and MIME records (show clickable links).
- Show raw bytes and record metadata for debugging.
- Persist recent reads in localStorage and allow quick re-write.
- Implement a tag inspector view that lists all records and types.
- Add automated tests by mocking `NDEFReader` to exercise read/write flows.

10 — Contributing 🤝
Suggested workflow:
1. Fork the repo.
2. Create a branch: `git checkout -b feat/my-change`
3. Make changes, add tests or a demo if relevant.
4. Open a PR with a clear title and description.

Be respectful in PRs and document breaking changes.

11 — License 📄
This project is released under the terms in the LICENSE file. See LICENSE for details.

Quick UX checklist for PRs or demos
- Clear status messages for scanning/writing.
- Accessibility: buttons keyboard-focusable, live region for results.
- Keep NFC logic testable and isolated from UI.

Enjoy exploring Web NFC! If you'd like, I can generate a mockup React component for the UI or a diagram for the read/write state machine.
