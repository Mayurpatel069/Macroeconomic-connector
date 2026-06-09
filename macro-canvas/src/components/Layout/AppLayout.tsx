import TopNav from './TopNav'
import Sidebar from './Sidebar'
import MacroCanvas from '../Canvas/MacroCanvas'
import AnalysisPanel from '../Analysis/AnalysisPanel'
import { useAppStore } from '../../store/appStore'

export default function AppLayout() {
  const { sidebarOpen, activeAnalysis } = useAppStore()

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obs-bg">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div
          className={`shrink-0 border-r border-white/[0.06] bg-obs-panel overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            sidebarOpen ? 'w-72' : 'w-0'
          }`}
        >
          {sidebarOpen && <Sidebar />}
        </div>

        {/* Main canvas */}
        <div className="flex-1 relative overflow-hidden">
          <MacroCanvas />
        </div>

        {/* Right analysis panel */}
        <div
          className={`shrink-0 border-l border-white/[0.06] bg-obs-panel overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            activeAnalysis ? 'w-96' : 'w-0'
          }`}
        >
          {activeAnalysis && <AnalysisPanel />}
        </div>
      </div>
    </div>
  )
}
