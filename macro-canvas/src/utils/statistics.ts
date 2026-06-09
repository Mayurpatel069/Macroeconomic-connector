import type { DataPoint, AnalysisResult, MacroSeries } from '../types'

function mean(arr: number[]): number {
  return arr.reduce((s, v) => s + v, 0) / arr.length
}

function variance(arr: number[]): number {
  const m = mean(arr)
  return arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1)
}

export function stdDev(arr: number[]): number {
  return Math.sqrt(variance(arr))
}

export function covariance(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length)
  const mx = mean(x.slice(0, n))
  const my = mean(y.slice(0, n))
  return x.slice(0, n).reduce((s, xi, i) => s + (xi - mx) * (y[i] - my), 0) / (n - 1)
}

export function pearsonCorrelation(x: number[], y: number[]): number {
  const cov = covariance(x, y)
  const sx = stdDev(x)
  const sy = stdDev(y)
  if (sx === 0 || sy === 0) return 0
  return cov / (sx * sy)
}

export function coefficientOfVariation(arr: number[]): number {
  const m = mean(arr)
  if (m === 0) return 0
  return (stdDev(arr) / Math.abs(m)) * 100
}

export function rSquared(x: number[], y: number[]): number {
  return pearsonCorrelation(x, y) ** 2
}

export function alignSeries(
  dataA: DataPoint[],
  dataB: DataPoint[]
): { date: string; valueA: number; valueB: number }[] {
  const mapB = new Map(dataB.map((d) => [d.date, d.value]))
  return dataA
    .filter((d) => mapB.has(d.date))
    .map((d) => ({ date: d.date, valueA: d.value, valueB: mapB.get(d.date)! }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function computeAnalysis(
  edgeId: string,
  nodeAId: string,
  nodeBId: string,
  seriesA: MacroSeries,
  seriesB: MacroSeries,
  dataA: DataPoint[],
  dataB: DataPoint[]
): AnalysisResult {
  const aligned = alignSeries(dataA, dataB)
  const xs = aligned.map((d) => d.valueA)
  const ys = aligned.map((d) => d.valueB)

  return {
    edgeId,
    nodeAId,
    nodeBId,
    seriesA,
    seriesB,
    dataA,
    dataB,
    aligned,
    correlation: aligned.length > 1 ? pearsonCorrelation(xs, ys) : 0,
    covariance: aligned.length > 1 ? covariance(xs, ys) : 0,
    stdDevA: dataA.length > 1 ? stdDev(dataA.map((d) => d.value)) : 0,
    stdDevB: dataB.length > 1 ? stdDev(dataB.map((d) => d.value)) : 0,
    cvA: dataA.length > 1 ? coefficientOfVariation(dataA.map((d) => d.value)) : 0,
    cvB: dataB.length > 1 ? coefficientOfVariation(dataB.map((d) => d.value)) : 0,
    rSquared: aligned.length > 1 ? rSquared(xs, ys) : 0,
    meanA: dataA.length > 0 ? mean(dataA.map((d) => d.value)) : 0,
    meanB: dataB.length > 0 ? mean(dataB.map((d) => d.value)) : 0,
  }
}

export function correlationLabel(r: number): string {
  const abs = Math.abs(r)
  const dir = r >= 0 ? 'positive' : 'negative'
  if (abs >= 0.9) return `Very strong ${dir}`
  if (abs >= 0.7) return `Strong ${dir}`
  if (abs >= 0.5) return `Moderate ${dir}`
  if (abs >= 0.3) return `Weak ${dir}`
  return 'Negligible correlation'
}

export function correlationColor(r: number): string {
  const abs = Math.abs(r)
  if (abs >= 0.7) return r >= 0 ? '#3fb950' : '#f85149'
  if (abs >= 0.4) return r >= 0 ? '#e3b341' : '#ffa657'
  return '#8b949e'
}

export function formatStat(value: number, decimals = 4): string {
  if (Math.abs(value) >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M'
  if (Math.abs(value) >= 1_000) return (value / 1_000).toFixed(2) + 'K'
  return value.toFixed(decimals)
}
