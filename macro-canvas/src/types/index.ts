export type SeriesCategory = 'monetary' | 'fiscal' | 'trade' | 'market' | 'labor' | 'prices' | 'output'

export interface MacroSeries {
  id: string
  name: string
  fredId: string
  source?: 'fred' | 'mospi'
  category: SeriesCategory
  unit: string
  frequency: string
  description: string
  color: string
}

export interface DataPoint {
  date: string
  value: number
}

export interface VariableNodeData extends MacroSeries {
  seriesData: DataPoint[]
  loading: boolean
  error?: string
  [key: string]: unknown
}

export interface AnalysisResult {
  edgeId: string
  nodeAId: string
  nodeBId: string
  seriesA: MacroSeries
  seriesB: MacroSeries
  dataA: DataPoint[]
  dataB: DataPoint[]
  aligned: { date: string; valueA: number; valueB: number }[]
  correlation: number
  covariance: number
  stdDevA: number
  stdDevB: number
  cvA: number
  cvB: number
  rSquared: number
  meanA: number
  meanB: number
}

export interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  audioUrl?: string
  duration?: number
  category: string
  publishedAt: string
  source: string
  tags: string[]
  sentiment: 'positive' | 'negative' | 'neutral'
  relatedSeriesIds: string[]
}

export interface AppView {
  active: 'canvas' | 'news'
}
