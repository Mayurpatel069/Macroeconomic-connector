import { KeyRound, PanelLeftClose, PanelLeftOpen, Network, Clock } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

const RANGE_OPTIONS = [
  { label: '1Y',  months: 12  },
  { label: '3Y',  months: 36  },
  { label: '5Y',  months: 60  },
  { label: '10Y', months: 120 },
  { label: 'Max', months: 360 },
]

export default function TopNav() {
  const { apiKey, setShowApiKeyModal, sidebarOpen, toggleSidebar, dataMonths, setDataMonths } = useAppStore()

  return (
    <div className="h-11 flex items-center gap-2 px-3 border-b border-white/[0.06] glass-nav shrink-0 z-10">
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="p-1.5 rounded-lg hover:bg-white/[0.06] text-obs-muted hover:text-obs-text transition-all duration-150"
        title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2 mr-auto">
        <Network size={17} className="text-obs-accent" strokeWidth={1.75} />
        <span className="font-semibold text-sm text-obs-text tracking-[-0.01em]">MacroCanvas</span>
        <span className="text-obs-subtle text-xs hidden lg:block font-light">— Macroeconomic Analysis</span>
      </div>

      {/* Data range selector */}
      <div className="flex items-center gap-0.5 bg-white/[0.04] border border-white/[0.06] rounded-lg px-1.5 py-1">
        <Clock size={10} className="text-obs-subtle mr-0.5" />
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.months}
            onClick={() => setDataMonths(opt.months)}
            title={`Fetch last ${opt.label} of data for new nodes`}
            className={`text-[11px] px-1.5 py-0.5 rounded-md transition-all duration-150 ${
              dataMonths === opt.months
                ? 'bg-obs-accent/[0.15] text-obs-accent font-semibold'
                : 'text-obs-muted hover:text-obs-text hover:bg-white/[0.06]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* FRED API key status */}
      <button
        onClick={() => setShowApiKeyModal(true)}
        className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border transition-all duration-200 ${
          apiKey
            ? 'border-obs-green/30 text-obs-green bg-obs-green/[0.08] hover:bg-obs-green/[0.12]'
            : 'border-obs-orange/30 text-obs-orange bg-obs-orange/[0.08] hover:bg-obs-orange/[0.12] animate-pulse'
        }`}
      >
        <KeyRound size={11} strokeWidth={1.75} />
        {apiKey ? 'FRED Connected' : 'Add FRED Key'}
      </button>
    </div>
  )
}
