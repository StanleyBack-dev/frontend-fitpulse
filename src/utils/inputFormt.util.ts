/**
 * Limita o tamanho do texto e remove caracteres indesejados se necessário.
 * @param text O texto atual
 * @param maxLength O tamanho máximo permitido (ex: 200 caracteres)
 */
export const sanitizeObservation = (text: string, maxLength: number): string => {
  if (!text) return "";
  
  return text.slice(0, maxLength);
};