export interface IMCCalculationResult {
  imc: number;
  category: string;
  idealWeight: string;
  color: string;
}

export const calculateIMC = (heightCm: number, weightKg: number, age: number, sex: 'male' | 'female'): IMCCalculationResult => {
  const heightMeters = heightCm / 100;
  if (heightMeters <= 0) return { imc: 0, category: "-", color: "#fff", idealWeight: "0" };

  const imc = weightKg / (heightMeters * heightMeters);
  let category = "";
  let color = "";

  // 1. LÓGICA PARA CRIANÇAS E ADOLESCENTES (2 a 19 anos)
  if (age < 20) {
    if (imc < 14) { category = "Abaixo do peso (Infantil)"; color = "#00d1ff"; }
    else if (imc >= 14 && imc <= 22) { category = "Peso Saudável (Infantil)"; color = "#adff2f"; }
    else if (imc > 22 && imc <= 26) { category = "Sobrepeso (Infantil)"; color = "#ffcc00"; }
    else { category = "Obesidade (Infantil)"; color = "#ff4400"; }
  } 
  // 2. LÓGICA PARA IDOSOS (65+ anos)
  else if (age >= 65) {
    if (imc < 22) { category = "Abaixo do peso (Idoso)"; color = "#00d1ff"; }
    else if (imc >= 22 && imc <= 27) { category = "Peso Ideal (Idoso)"; color = "#adff2f"; }
    else { category = "Sobrepeso (Idoso)"; color = "#ffcc00"; }
  } 
  // 3. LÓGICA PARA ADULTOS (20 a 64 anos)
  else {
    if (imc < 18.5) { category = "Abaixo do peso"; color = "#00d1ff"; }
    else if (imc < 25) { category = "Peso Ideal"; color = "#adff2f"; }
    else if (imc < 30) { category = "Sobrepeso"; color = "#ffcc00"; }
    else if (imc < 35) { category = "Obesidade I"; color = "#ff8800"; }
    else if (imc < 40) { category = "Obesidade II"; color = "#ff4400"; }
    else { category = "Obesidade III"; color = "#ff0000"; }
  }

  let minIMC = 18.5; let maxIMC = 24.9;
  if (age < 20) { minIMC = 15; maxIMC = 21; }
  else if (age >= 65) { minIMC = 22; maxIMC = 27; }
  
  const minWeight = minIMC * (heightMeters * heightMeters);
  const maxWeight = maxIMC * (heightMeters * heightMeters);

  return {
    imc: parseFloat(imc.toFixed(1)),
    category,
    color,
    idealWeight: `${minWeight.toFixed(1)}kg - ${maxWeight.toFixed(1)}kg`
  };
};