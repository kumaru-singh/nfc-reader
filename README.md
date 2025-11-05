# nfc-reader — Web NFC demo (polished, extended)

nfc-reader is a compact, approachable demo that demonstrates how to read and write plain-text NFC (NDEF) records from the browser using the Web NFC API. The project prioritizes clarity: NFC logic is small and easy to audit, the UI is minimal and accessible, and the README documents how the API is used and how to extend the demo.

Why this repo exists
- Learn the basics of Web NFC quickly and safely.
- Provide a minimal, working React example you can adapt.
- Show clean separation between UI and NFC logic for easy experimentation.

Quick file map
- App UI: src/App.js — main React component and UI.
- NFC logic: src/nfcHandler.js — contains exported helpers for reading and writing.
- Entry point: src/index.js
- Styles: src/styles.css
- Static HTML: public/index.html
- Project config: package.json

Table of contents
1. Overview
2. UI & usage
3. Installation
4. Running locally
5. How the Web NFC API is used (detailed)
6. Code examples (read/write snippets)
7. Browser & security notes
8. Troubleshooting
9. Extending the demo
10. Contributing
11. License

1 — Overview
This demo concentrates on the simplest, most portable parts of Web NFC:
- Scanning tags and decoding text (NDEF) records.
- Writing plain-text NDEF records to tags.
- Minimal UX for read/write flow so you can focus on NFC behavior.

All NFC logic is intentionally compact and lives in src/nfcHandler.js; the UI in src/App.js demonstrates one way to present read / write actions and results.

2 — UI & usage
Open the app on a supported device (Chrome on Android with a secure context). The UI exposes two main actions:
- "📥 Read NFC Tag" — scans for a tag, decodes the first text record, and shows it in the UI.
- "📤 Write NFC Tag" — writes the text from the input to the tag as a simple text NDEF record.

Typical workflow
1. Start the dev server (see Running locally).
2. Open the app on your Android device (HTTPS or localhost).
3. Tap "📥 Read NFC Tag", then bring a tag close to the device to read.
4. Type a message and tap "📤 Write NFC Tag", then bring a tag close to the device to write.

3 — Installation
Clone the repository and install dependencies.

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

4 — Running locally
Start a development server. The demo requires a secure context; localhost is treated as secure by browsers, so local development works without HTTPS.

Using npm:
```bash
npm start
```

Then open the served URL on your Android device (or open it on the same Android device if running the dev server there). For testing on a remote machine, serve over HTTPS or use a tunnel that provides HTTPS.

5 — How the Web NFC API is used
This demo relies on the browser's Web NFC implementation (NDEFReader). The app implements two operations:

- Read (scan)
    - Create an NDEFReader instance and call scan().
    - Listen for `reading` events to receive NDEF messages from a nearby tag.
    - Decode and display the first text record (if present).

- Write
    - Use the same NDEFReader instance (or a new one) and call write() with a simple NDEF message containing a text record.
    - The write operation is user-initiated and will prompt the user to bring a tag into range.

Key behavior and best practices
- All NFC operations require a user gesture (click/tap).
- Use try/catch around API calls to handle permission errors and device limitations.
- Only simple text records (MIME/text) are shown in this demo; the API supports other record types and more complex messages.

6 — Code examples (illustrative snippets)
Read (conceptual)
```js
// src/nfcHandler.js (read helper)
export async function readNFC() {
    if (!('NDEFReader' in window)) {
        throw new Error('Web NFC is not supported on this device/browser.');
    }
    const reader = new NDEFReader();
    await reader.scan();
    return new Promise((resolve, reject) => {
        reader.onreading = event => {
            const records = Array.from(event.message.records);
            // Find first text record
            for (const record of records) {
                if (record.recordType === 'text') {
                    const text = new TextDecoder(record.encoding || 'utf-8')
                        .decode(record.data);
                    resolve({ text, records });
                    return;
                }
            }
            reject(new Error('No text record found.'));
        };
        reader.onreadingerror = () => reject(new Error('Failed to read tag.'));
    });
}
```

Write (conceptual)
```js
// src/nfcHandler.js (write helper)
export async function writeNFC(text) {
    if (!('NDEFReader' in window)) {
        throw new Error('Web NFC is not supported on this device/browser.');
    }
    const writer = new NDEFReader();
    // user gesture required by browser
    await writer.write({ records: [{ recordType: 'text', data: text }] });
    return true;
}
```

Notes
- The above snippets are simplified and intended to explain the approach used by the demo.
- The real demo includes UI state updates, error messages, and basic input validation.

7 — Browser & security notes
- Supported: Chrome on Android (other Chromium-based Android browsers may work).
- Not supported: iOS Safari (as of the last update), desktop browsers without NFC hardware.
- The API requires a secure context (HTTPS) or localhost for development.
- Permissions: The browser will ask the user for permission when trying to perform NFC operations. Respect user denials and surface clear messages.

8 — Troubleshooting
- "Web NFC is not supported" — confirm you are on a supported browser and device.
- Permission prompt not shown / operations fail — ensure the action was triggered by a user gesture and try again.
- Reads return no text records — some tags may not contain text NDEF records; try different tags or check the tag contents with another tool.
- Repeated failures — check device NFC settings and ensure NFC is enabled in the system settings.

9 — Extending the demo
Ideas for improvements and experiments:
- Support additional record types (URI, MIME).
- Batch reads: show full NDEF message with all records and record metadata.
- Add tag formatting / capacity warnings when writing larger payloads.
- Persist recent reads in localStorage for quick testing.
- Add automated tests (mock NDEFReader) for the NFC logic.

10 — Contributing
Contributions are welcome. Suggested workflow:
1. Fork the repo.
2. Create a feature branch: git checkout -b feat/my-change
3. Make changes and include tests or a short demo description where relevant.
4. Submit a pull request with a clear title and the change rationale.

11 — License
This project is released under the terms in the LICENSE file. See LICENSE for details.

If you need a shorter README, a version with more code comments, or a version targeted at beginners, say which style you prefer and I will generate it.
