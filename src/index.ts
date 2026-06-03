#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { convertFile } from './converters/index.js'

const server = new Server(
  { name: 'convertertomarkdown-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'convert_to_markdown',
      description:
        'Converts a local file to Markdown text. Supported formats: DOCX, PDF (text-based), XLSX, XLS, HTML, TXT, MD, CSV, JSON, XML, JPG, PNG, WEBP, BMP, GIF (OCR).',
      inputSchema: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: 'Absolute path to the file to convert',
          },
        },
        required: ['file_path'],
      },
    },
  ],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== 'convert_to_markdown') {
    throw new Error(`Unknown tool: ${request.params.name}`)
  }

  const args = request.params.arguments as Record<string, unknown>
  const filePath = typeof args.file_path === 'string' ? args.file_path : ''
  const absolutePath = resolve(filePath)

  if (!filePath) {
    return {
      content: [{ type: 'text', text: 'Error: file_path is required.' }],
      isError: true,
    }
  }

  if (!existsSync(absolutePath)) {
    return {
      content: [{ type: 'text', text: `Error: file not found: ${absolutePath}` }],
      isError: true,
    }
  }

  try {
    const markdown = await convertFile(absolutePath)
    return { content: [{ type: 'text', text: markdown }] }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      content: [{ type: 'text', text: `Error converting file: ${message}` }],
      isError: true,
    }
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
