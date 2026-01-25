export interface RawHealthRecord {
  bmi: number;
  bmiStatus: string;
  weightKg: number;
  heightCm: number;
  measurementDate: string;
}

export interface HealthInsights extends RawHealthRecord {
  idealMinWeight: number;
  idealMaxWeight: number;
  waterGoal: number;
  proteinGoal: number;
  basalCalories: number;
  weightChange: number;
  weightDirection: "lost" | "gained" | "same";
  previousWeightKg: number | null;
}

export class HealthCalculator {
  static analyzeLatest(
    records: RawHealthRecord[],
    profileHeightM?: number
  ): HealthInsights | null {
    if (!records || records.length === 0) return null;

    const sorted = records.slice().sort(
      (a, b) => new Date(b.measurementDate).getTime() - new Date(a.measurementDate).getTime()
    );

    const latest = sorted[0];
    const previous = sorted.length > 1 ? sorted[1] : null;

    return this.calculateMetrics(latest, previous, profileHeightM);
  }

  private static calculateMetrics(
    current: RawHealthRecord,
    previous: RawHealthRecord | null,
    profileHeightM?: number
  ): HealthInsights {
    // Se o registro não tiver altura, usar a altura do perfil (convertendo para cm)
    const heightM =
      current.heightCm && current.heightCm > 0
        ? current.heightCm / 100
        : profileHeightM || 1.7; // fallback seguro

    const minW = 18.5 * (heightM * heightM);
    const maxW = 24.9 * (heightM * heightM);

    const water = (current.weightKg * 35) / 1000;
    const protein = current.weightKg * 2.0;
    const bmr = current.weightKg * 24;

    let change = 0;
    let direction: "lost" | "gained" | "same" = "same";

    if (previous) {
      change = current.weightKg - previous.weightKg;
      if (change < -0.1) direction = "lost";
      else if (change > 0.1) direction = "gained";
    }

    return {
      ...current,
      idealMinWeight: minW,
      idealMaxWeight: maxW,
      waterGoal: water,
      proteinGoal: protein,
      basalCalories: bmr,
      weightChange: Math.abs(change),
      weightDirection: direction,
      previousWeightKg: previous ? previous.weightKg : null,
    };
  }
}