# convertertomarkdown-mcp

MCP server that converts files to Markdown — DOCX, PDF, XLSX, HTML, CSV, JSON, XML, and images (OCR). Runs locally in Node.js, no browser required.

Built on the same conversion engine as [convertertomarkdown.com](https://convertertomarkdown.com).

## Supported formats

| Format | Method |
|--------|--------|
| DOCX | mammoth |
| PDF | pdfjs-dist (text-based; scanned PDFs → use the web app) |
| XLSX / XLS | xlsx |
| HTML / HTM | turndown + jsdom |
| CSV | papaparse |
| JSON | passthrough in code block |
| XML | passthrough in code block |
| TXT / MD | raw text |
| JPG, PNG, WEBP, BMP, GIF | tesseract.js OCR |

## Installation

```bash
npx convertertomarkdown-mcp
```

Or install globally:

```bash
npm install -g convertertomarkdown-mcp
```

## Claude Desktop configuration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

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

## Tool

### `convert_to_markdown`

Converts a local file to Markdown text.

**Input:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `file_path` | `string` | Absolute path to the file |

**Example usage in Claude:**

> Convert the file `/Users/me/report.pdf` to markdown

Claude will call `convert_to_markdown` with `file_path: "/Users/me/report.pdf"` and return the extracted Markdown.

## Local development

```bash
git clone https://github.com/PacoValero/convertertomarkdown-mcp
cd convertertomarkdown-mcp
npm install
npm run build
node dist/index.js
```

## License

MIT
