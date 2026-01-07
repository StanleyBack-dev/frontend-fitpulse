/** 
 * Calcula o IMC com base em peso (kg) e altura (cm).
 * Retorna número com 2 casas decimais.
 */
export function calculateImc(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
}

/**
 * Remove pontuação (ponto e vírgula) de um número decimal
 * e retorna o valor como inteiro (ex: 28.41 → 2841)
 */
export function sanitizeDecimalToInt(value: number | string): number {
  if (!value) return 0;
  return parseInt(String(value).replace(/\D/g, ""), 10);
}

/**
 * Recebe uma data ISO (ex: "2026-01-07T00:00:00.000Z")
 * e retorna apenas a parte YYYY-MM-DD
 */
export function toDateOnly(date: string | Date | undefined): string | undefined {
  if (!date) return undefined;
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}