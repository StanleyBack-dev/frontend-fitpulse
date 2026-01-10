/**
 * Classifies BMI according to the WHO table.
 * Returns the textual status based on the numerical value of the BMI.
*/
export function getBmiStatus(bmi: number): string {
  if (bmi < 16) return "Magreza grave";
  if (bmi < 17) return "Magreza moderada";
  if (bmi < 18.5) return "Magreza leve";
  if (bmi < 25) return "Peso normal";
  if (bmi < 30) return "Sobrepeso";
  if (bmi < 35) return "Obesidade grau I";
  if (bmi < 40) return "Obesidade grau II";
  return "Obesidade grau III (mórbida)";
}