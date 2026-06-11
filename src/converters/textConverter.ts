import Papa from 'papaparse'
import { readFile } from 'node:fs/promises'

export async function convertText(filePath: string): Promise<string> {
  return readFile(filePath, 'utf-8')
}

function renderForm(rows: string[][]): string {
  const lines: string[] = []
  let headingCount = 0
  for (const row of rows) {
    const label = (row[1] ?? '').trim().replace(/\*+\s*$/, '').trim()
    const value = (row[2] ?? '').trim()
    if (!label) continue
    if (!value) {
      headingCount++
      if (lines.length > 0) lines.push('')
      lines.push(headingCount === 1 ? `# ${label}` : `## ${label}`)
    } else {
      lines.push(`**${label}:** ${value}`)
    }
  }
  return lines.join('\n')
}

function renderTable(data: string[][]): string {
  if (data.length === 0) return ''
  const toRow = (cells: string[]) => `| ${cells.join(' | ')} |`
  const sep = data[0].map(() => '---')
  return [toRow(data[0]), toRow(sep), ...data.slice(1).map(toRow)].join('\n')
}

export async function convertCsv(filePath: string): Promise<string> {
  const raw = await readFile(filePath, 'utf-8')
  const parsed = Papa.parse<string[]>(raw, { skipEmptyLines: false, dynamicTyping: false })
  const rawRows: string[][] = parsed.data.map(row =>
    (row as string[]).map(cell => (cell ?? '').trim())
  )
  const nonEmptyRows = rawRows.filter(row => row.some(c => c !== ''))
  if (nonEmptyRows.length === 0) return ''

  const colCount = Math.max(...nonEmptyRows.map(r => r.length))
  let nonEmptyColCount = 0
  for (let c = 0; c < colCount; c++) {
    if (nonEmptyRows.some(row => (row[c] ?? '') !== '')) nonEmptyColCount++
  }
  const col0AllEmpty = nonEmptyRows.every(row => (row[0] ?? '') === '')

  let body: string
  if (nonEmptyColCount <= 7 && col0AllEmpty) {
    body = renderForm(nonEmptyRows)
  } else {
    const activeColIndices: number[] = []
    for (let c = 0; c < colCount; c++) {
      if (nonEmptyRows.some(row => (row[c] ?? '') !== '')) activeColIndices.push(c)
    }
    const data = nonEmptyRows.map(row => activeColIndices.map(c => row[c] ?? ''))
    body = renderTable(data)
  }

  return body
}

export async function convertJson(filePath: string): Promise<string> {
  const text = await readFile(filePath, 'utf-8')
  try {
    JSON.parse(text)
  } catch {
    throw new Error('Invalid JSON.')
  }
  return `\`\`\`json\n${text}\n\`\`\``
}

export async function convertXml(filePath: string): Promise<string> {
  const text = await readFile(filePath, 'utf-8')
  return `\`\`\`xml\n${text}\n\`\`\``
}
