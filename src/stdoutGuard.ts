// En un servidor MCP por stdio, stdout está reservado para JSON-RPC: cualquier
// log de dependencias (p. ej. pdfjs emite sus warnings con console.log al
// cargar el módulo) corrompería el canal, así que se desvía todo a stderr.
console.log = (...args: unknown[]) => {
  // mismo filtro que el de console.warn en pdfConverter: ruido sin efecto en la extracción de texto
  if (String(args[0] ?? '').includes('Cannot polyfill')) return
  console.error(...args)
}

export {}
