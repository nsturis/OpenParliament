import { marked } from 'marked'

// Markdown from the PDF pipeline (pymupdf4llm) -> HTML. Raw HTML in the source is
// escaped, so only marked's own markup reaches v-html.
export function renderMarkdown(md: string): string {
  const safe = md
    .replace(/<!-- Start of picture text -->[\s\S]*?<!-- End of picture text -->/g, '') // PDF masthead logos
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/</g, '&lt;')
  return marked.parse(safe, { async: false }) as string
}
