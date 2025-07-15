import React, { useState } from "react";
import { readNFC, writeNFC } from "./nfcHandler";

function App() {
  const [status, setStatus] = useState("Ready.");
  const [textToWrite, setTextToWrite] = useState("");

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>🛰️ Web NFC Demo</h1>
      <p>Status: {status}</p>

      <button onClick={() => readNFC(setStatus)}>📥 Read NFC Tag</button>

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Text to write"
          value={textToWrite}
          onChange={(e) => setTextToWrite(e.target.value)}
        />
        <button onClick={() => writeNFC(textToWrite, setStatus)}>
          📤 Write NFC Tag
        </button>
      </div>
    </div>
  );
}

export default App;
