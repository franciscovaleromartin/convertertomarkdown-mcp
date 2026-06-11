import mammoth from 'mammoth'
import TurndownService from 'turndown'
import { readFile } from 'node:fs/promises'

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })

export async function convertDocx(filePath: string): Promise<string> {
  const buffer = await readFile(filePath)
  const result = await mammoth.convertToHtml({ buffer })
  if (!result.value.trim()) {
    throw new Error('Could not extract text from the document. It may be empty or corrupted.')
  }
  return td.turndown(result.value)
}
