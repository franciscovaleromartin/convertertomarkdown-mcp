import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

// pdfjs-dist legacy build: compatible con Node.js sin worker
const _require = createRequire(import.meta.url)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pdfjsLib = _require('pdfjs-dist/legacy/build/pdf.js') as typeof import('pdfjs-dist')
pdfjsLib.GlobalWorkerOptions.workerSrc = '' as unknown as never

export async function convertPdf(filePath: string, onProgress?: (pct: number) => void): Promise<string> {
  const data = await readFile(filePath)
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(data) }).promise

  const textPages: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = (content.items as Array<{ str?: string }>)
      .filter(item => typeof item.str === 'string')
      .map(item => item.str as string)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    textPages.push(text)
    onProgress?.(Math.round((i / pdf.numPages) * 100))
  }

  const extracted = textPages.filter(Boolean)
  if (extracted.length === 0) {
    throw new Error(
      'Este PDF no contiene texto extraíble. Para PDFs escaneados usa la versión web: https://convertertomarkdown.com'
    )
  }

  return extracted.join('\n\n')
}
