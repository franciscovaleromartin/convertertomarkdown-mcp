import { extname } from 'node:path'

export function getExtension(filePath: string): string {
  return extname(filePath).toLowerCase()
}

export async function convertFile(filePath: string, onProgress?: (pct: number) => void): Promise<string> {
  const ext = getExtension(filePath)

  switch (ext) {
    case '.docx': {
      const { convertDocx } = await import('./docxConverter.js')
      return convertDocx(filePath)
    }
    case '.pdf': {
      const { convertPdf } = await import('./pdfConverter.js')
      return convertPdf(filePath, onProgress)
    }
    case '.xlsx':
    case '.xls': {
      const { convertXlsx } = await import('./xlsxConverter.js')
      return convertXlsx(filePath)
    }
    case '.html':
    case '.htm': {
      const { convertHtml } = await import('./htmlConverter.js')
      return convertHtml(filePath)
    }
    case '.txt':
    case '.md': {
      const { convertText } = await import('./textConverter.js')
      return convertText(filePath)
    }
    case '.csv': {
      const { convertCsv } = await import('./textConverter.js')
      return convertCsv(filePath)
    }
    case '.json': {
      const { convertJson } = await import('./textConverter.js')
      return convertJson(filePath)
    }
    case '.xml': {
      const { convertXml } = await import('./textConverter.js')
      return convertXml(filePath)
    }
    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.webp':
    case '.bmp':
    case '.gif': {
      const { convertImage } = await import('./imageConverter.js')
      return convertImage(filePath, onProgress)
    }
    default:
      throw new Error(
        `Unsupported format: ${ext || '(no extension)'}. Accepted formats: DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON, XML, JPG, PNG, WEBP, BMP, GIF.`
      )
  }
}
