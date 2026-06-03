# convertertomarkdown-mcp

> MCP server that lets AI agents convert local files to Markdown — no browser, no server, no API key.

Built on the same engine as [convertertomarkdown.com](https://convertertomarkdown.com). Works with Claude Desktop, Cursor, Windsurf, and any MCP-compatible client.

---

## What it does

When connected to an AI agent, this tool allows the agent to read any local file and convert it to clean Markdown text before processing it. This removes friction from document-heavy workflows: instead of copy-pasting content or uploading files manually, the agent converts the file inline and works with the resulting Markdown directly.

**Example:**
> "Summarize the key points from `/Users/me/reports/Q1-2025.pdf`"

The agent calls `convert_to_markdown` on the file, receives the Markdown, and processes it — all in one step.

---

## Supported formats

| Format | Engine |
|--------|--------|
| `.docx` | mammoth |
| `.pdf` | pdfjs-dist (text-based PDFs; scanned PDFs → use [the web app](https://convertertomarkdown.com)) |
| `.xlsx`, `.xls` | xlsx |
| `.html`, `.htm` | turndown + jsdom |
| `.csv` | papaparse |
| `.json` | passthrough (fenced code block) |
| `.xml` | passthrough (fenced code block) |
| `.txt`, `.md` | raw text |
| `.jpg`, `.jpeg`, `.png`, `.webp`, `.bmp`, `.gif` | tesseract.js OCR |

---

## Installation

No installation required. Just add it to your MCP client config and `npx` handles the rest.

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "convertertomarkdown": {
      "command": "npx",
      "args": ["-y", "convertertomarkdown-mcp"]
    }
  }
}
```

Restart Claude Desktop. The tool `convert_to_markdown` will appear in the toolbar.

### Cursor / Windsurf / other MCP clients

```json
{
  "mcpServers": {
    "convertertomarkdown": {
      "command": "npx",
      "args": ["-y", "convertertomarkdown-mcp"]
    }
  }
}
```

---

## Tool reference

### `convert_to_markdown`

Converts a local file to Markdown text.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file_path` | `string` | yes | Absolute path to the file |

**Returns:** Markdown string.

**Error cases:**
- File not found → returns an error message with the resolved path
- Unsupported extension → lists accepted formats
- Scanned PDF (no extractable text) → suggests using the web app

---

## How it works

The converters run entirely in Node.js — no browser APIs, no external services. Each format has a dedicated converter:

```
src/
├── index.ts                  # MCP server (stdio transport)
└── converters/
    ├── index.ts              # Dispatcher by file extension
    ├── docxConverter.ts      # mammoth → HTML → Markdown
    ├── pdfConverter.ts       # pdfjs-dist legacy build (text extraction)
    ├── xlsxConverter.ts      # xlsx → Markdown tables
    ├── htmlConverter.ts      # jsdom cleanup → turndown
    ├── imageConverter.ts     # tesseract.js OCR
    └── textConverter.ts      # txt, csv (papaparse), json, xml
```

Key adaptation from the browser version: `File` objects replaced with file paths, `DOMParser` replaced with `jsdom`, `URL.createObjectURL` not needed (tesseract.js accepts paths natively in Node.js).

---

## Local development

```bash
git clone https://github.com/franciscovaleromartin/convertertomarkdown-mcp
cd convertertomarkdown-mcp
npm install
npm run build
node dist/index.js   # starts the MCP server on stdio
```

To test a conversion directly:

```bash
npx tsx test.ts /path/to/file.pdf
```

---

## Requirements

- Node.js ≥ 18

---

## Related

- [convertertomarkdown.com](https://convertertomarkdown.com) — web app version with drag & drop, batch conversion, and OCR for scanned PDFs
- [npm package](https://www.npmjs.com/package/convertertomarkdown-mcp)

---

## License

MIT © [Francisco Valero](https://convertertomarkdown.com)
