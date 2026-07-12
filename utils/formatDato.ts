export const formatDato = (
  dato: string | Date | null | undefined,
  style: 'short' | 'long' = 'long',
): string => {
  if (!dato) return ''
  const d = typeof dato === 'string' ? new Date(dato) : dato
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('da-DK', {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'numeric',
    year: 'numeric',
  })
}
