export async function readNFC(setMessage) {
  if (!("NDEFReader" in window)) {
    setMessage("Web NFC not supported.");
    return;
  }

  try {
    const reader = new NDEFReader();
    await reader.scan();

    setMessage("Scan an NFC tag...");

    reader.onreading = (event) => {
      const decoder = new TextDecoder();
      for (const record of event.message.records) {
        const text = decoder.decode(record.data);
        setMessage(`Tag Read: ${text}`);
      }
    };
  } catch (err) {
    setMessage(`Error reading NFC: ${err}`);
  }
}

export async function writeNFC(text, setMessage) {
  if (!("NDEFReader" in window)) {
    setMessage("Web NFC not supported.");
    return;
  }

  try {
    const writer = new NDEFReader();
    await writer.write({ records: [{ recordType: "text", data: text }] });
    setMessage("Data written to NFC tag!");
  } catch (err) {
    setMessage(`Error writing NFC: ${err}`);
  }
}
