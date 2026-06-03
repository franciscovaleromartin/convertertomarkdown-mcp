import { createWorker } from 'tesseract.js'

const LANG_MAP: Record<string, string> = {
  en: 'eng', es: 'spa', fr: 'fra', de: 'deu', pt: 'por',
  it: 'ita', nl: 'nld', ru: 'rus', ja: 'jpn', zh: 'chi_sim',
  pl: 'pol', ko: 'kor', ar: 'ara', tr: 'tur', sv: 'swe',
}

function detectLang(): string {
  const env = process.env.LANG ?? process.env.LANGUAGE ?? 'en'
  const code = env.split(/[_.\-]/)[0].toLowerCase()
  return LANG_MAP[code] ?? 'eng'
}

export async function convertImage(filePath: string, onProgress?: (pct: number) => void): Promise<string> {
  const lang = detectLang()
  const worker = await createWorker(lang, 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && typeof m.progress === 'number') {
        onProgress?.(Math.round(m.progress * 100))
      }
    },
  })

  try {
    const { data } = await worker.recognize(filePath)
    const result = data.text.trim()
    if (!result) {
      throw new Error('No se pudo extraer texto de la imagen. Asegúrate de que contiene texto impreso legible.')
    }
    return result
  } finally {
    await worker.terminate()
  }
}
