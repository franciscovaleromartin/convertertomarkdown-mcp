import TurndownService from 'turndown'
import { JSDOM } from 'jsdom'
import { readFile } from 'node:fs/promises'

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })

td.addRule('skipSvg', {
  filter: (node) => node.nodeName.toLowerCase() === 'svg',
  replacement: () => '',
})
td.addRule('skipNoise', {
  filter: ['style', 'script', 'noscript'],
  replacement: () => '',
})
td.addRule('brToNewline', {
  filter: 'br',
  replacement: () => '\n',
})
td.addRule('buttonToText', {
  filter: 'button',
  replacement: (content) => content,
})

export async function convertHtml(filePath: string): Promise<string> {
  const text = await readFile(filePath, 'utf-8')
  const dom = new JSDOM(text)
  const doc = dom.window.document

  for (const sel of ['style', 'script', 'link', 'meta', 'noscript', 'svg']) {
    doc.querySelectorAll(sel).forEach(el => el.remove())
  }
  doc.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'))

  const clean = doc.body ? doc.body.innerHTML : doc.documentElement.innerHTML
  const result = td.turndown(clean).trim()

  if (!result) {
    throw new Error('Could not extract content from the HTML.')
  }

  return result
}
