import { create } from 'zustand'
import type { Node, Edge } from '@xyflow/react'
import type { AnalysisResult, NewsArticle, VariableNodeData } from '../types'
import { NEWS_ARTICLES } from '../data/newsArticles'

interface AppState {
  // FRED API key
  apiKey: string | null
  setApiKey: (key: string | null) => void
  showApiKeyModal: boolean
  setShowApiKeyModal: (v: boolean) => void

  // Canvas nodes / edges (kept in sync with ReactFlow state for palette duplicate check)
  nodes: Node<VariableNodeData>[]
  edges: Edge[]
  setNodes: (nodes: Node<VariableNodeData>[]) => void
  setEdges: (edges: Edge[]) => void

  // Active analysis (right panel)
  activeAnalysis: AnalysisResult | null
  setActiveAnalysis: (r: AnalysisResult | null) => void

  // Analysis cache keyed by edgeId
  analysisCache: Record<string, AnalysisResult>
  cacheAnalysis: (result: AnalysisResult) => void
  clearAnalysisCache: () => void

  // Sidebar view
  sidebarView: 'news'
  setSidebarView: (v: 'news') => void
  sidebarOpen: boolean
  toggleSidebar: () => void

  // News
  articles: NewsArticle[]
  activeArticleId: string | null
  setActiveArticleId: (id: string | null) => void
  playingArticleId: string | null
  setPlayingArticleId: (id: string | null) => void

  // Node palette
  paletteOpen: boolean
  togglePalette: () => void

  // Data range in months (for FRED API fetch window)
  dataMonths: number
  setDataMonths: (months: number) => void
}

export const useAppStore = create<AppState>((set) => ({
  apiKey: localStorage.getItem('fred_api_key'),
  setApiKey: (key) => {
    if (key) localStorage.setItem('fred_api_key', key)
    else localStorage.removeItem('fred_api_key')
    set({ apiKey: key })
  },
  showApiKeyModal: false,
  setShowApiKeyModal: (v) => set({ showApiKeyModal: v }),

  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  activeAnalysis: null,
  setActiveAnalysis: (r) => set({ activeAnalysis: r }),

  analysisCache: {},
  cacheAnalysis: (result) =>
    set((s) => ({ analysisCache: { ...s.analysisCache, [result.edgeId]: result } })),
  clearAnalysisCache: () => set({ analysisCache: {} }),

  sidebarView: 'news',
  setSidebarView: (v) => set({ sidebarView: v }),
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  articles: NEWS_ARTICLES,
  activeArticleId: null,
  setActiveArticleId: (id) => set({ activeArticleId: id }),
  playingArticleId: null,
  setPlayingArticleId: (id) => set({ playingArticleId: id }),

  paletteOpen: true,
  togglePalette: () => set((s) => ({ paletteOpen: !s.paletteOpen })),

  dataMonths: parseInt(localStorage.getItem('mc_data_months') ?? '60') || 60,
  setDataMonths: (months) => {
    localStorage.setItem('mc_data_months', String(months))
    set({ dataMonths: months })
  },
}))
