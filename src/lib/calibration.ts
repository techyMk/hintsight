/**
 * Calibration math. Pure functions — no IO, no AI.
 *
 * A prediction is "reviewed" when status is 'right' | 'wrong'. The 'unclear'
 * status is treated as undecidable and excluded from calibration scoring.
 */

export type ReviewedStatus = "right" | "wrong";
export type AnyStatus = "pending" | "right" | "wrong" | "unclear";

export type PredictionRecord = {
  confidence: number;
  status: AnyStatus;
  category: string | null;
};

export type Bin = {
  predicted: number;
  observed: number;
  n: number;
};

export type CategoryStat = {
  category: string;
  n: number;
  accuracy: number;
};

export type CalibrationResult = {
  totalReviewed: number;
  accuracy: number;
  brier: number;
  averageGap: number;
  bins: Bin[];
  byCategory: CategoryStat[];
};

const DEFAULT_BIN_SIZE = 10;

export function isDecisive(p: { status: AnyStatus }): p is {
  status: ReviewedStatus;
} {
  return p.status === "right" || p.status === "wrong";
}

/** Score a confidence value into a bin index for the given bin width. */
function binIndex(confidence: number, binSize = DEFAULT_BIN_SIZE) {
  const clamped = Math.max(0, Math.min(100, confidence));
  const idx = Math.floor(clamped / binSize);
  const maxIdx = Math.floor(100 / binSize) - 1;
  return Math.min(idx, maxIdx);
}

function binMidpoint(idx: number, binSize = DEFAULT_BIN_SIZE) {
  return idx * binSize + binSize / 2;
}

/**
 * Compute the calibration profile across reviewed predictions.
 *
 * - accuracy:    overall % of decisive predictions that were "right"
 * - brier:       mean (confidence/100 - rightAsBinary)^2 — 0 perfect, 1 worst
 * - averageGap:  mean |predicted - observed| across populated bins, in pts
 * - bins:        per-confidence-bin (predicted midpoint, observed accuracy, n)
 * - byCategory:  decisive count + accuracy per category
 */
export function computeCalibration(
  predictions: PredictionRecord[],
  binSize = DEFAULT_BIN_SIZE
): CalibrationResult {
  const decisive = predictions.filter(isDecisive);
  const totalReviewed = decisive.length;

  if (totalReviewed === 0) {
    return {
      totalReviewed: 0,
      accuracy: 0,
      brier: 0,
      averageGap: 0,
      bins: [],
      byCategory: [],
    };
  }

  // Overall accuracy + Brier
  let rightCount = 0;
  let brierSum = 0;
  for (const p of decisive) {
    const right = p.status === "right" ? 1 : 0;
    rightCount += right;
    const probability = p.confidence / 100;
    brierSum += (probability - right) ** 2;
  }
  const accuracy = (rightCount / totalReviewed) * 100;
  const brier = brierSum / totalReviewed;

  // Bins
  const binCount = Math.floor(100 / binSize);
  const buckets: { right: number; n: number }[] = Array.from(
    { length: binCount },
    () => ({ right: 0, n: 0 })
  );
  for (const p of decisive) {
    const idx = binIndex(p.confidence, binSize);
    buckets[idx].n += 1;
    if (p.status === "right") buckets[idx].right += 1;
  }
  const bins: Bin[] = buckets
    .map((b, i) => ({
      predicted: binMidpoint(i, binSize),
      observed: b.n > 0 ? (b.right / b.n) * 100 : 0,
      n: b.n,
    }))
    .filter((b) => b.n > 0);

  const averageGap =
    bins.length === 0
      ? 0
      : bins.reduce((sum, b) => sum + Math.abs(b.predicted - b.observed), 0) /
        bins.length;

  // By category
  const catMap = new Map<string, { right: number; n: number }>();
  for (const p of decisive) {
    const key = p.category?.trim() || "uncategorised";
    const cur = catMap.get(key) ?? { right: 0, n: 0 };
    cur.n += 1;
    if (p.status === "right") cur.right += 1;
    catMap.set(key, cur);
  }
  const byCategory: CategoryStat[] = Array.from(catMap.entries())
    .map(([category, v]) => ({
      category,
      n: v.n,
      accuracy: (v.right / v.n) * 100,
    }))
    .sort((a, b) => b.n - a.n);

  return {
    totalReviewed,
    accuracy,
    brier,
    averageGap,
    bins,
    byCategory,
  };
}

/** Minimum reviewed predictions before we surface a meaningful score. */
export const CALIBRATION_THRESHOLD = 5;

export function isCalibrationMeaningful(totalReviewed: number) {
  return totalReviewed >= CALIBRATION_THRESHOLD;
}
