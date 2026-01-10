// src/utils/masks.ts

export const decimalMask = (value: string | number, precision = 2) => {
  const onlyDigits = String(value).replace(/\D/g, '');
  
  if (!onlyDigits) {
    return { formatted: '', raw: 0 };
  }

  const numberValue = Number(onlyDigits) / Math.pow(10, precision);

  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(numberValue);

  return { formatted, raw: numberValue };
};

// Helper para converter "1,80" de volta para 1.8 (float) para cálculos de IMC
export const parseFormattedToNumber = (value: string) => {
  if (!value) return 0;
  // Remove pontos de milhar e troca vírgula decimal por ponto
  const cleanValue = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanValue);
};