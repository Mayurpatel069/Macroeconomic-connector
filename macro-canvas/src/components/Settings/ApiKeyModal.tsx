import { useState } from 'react'
import { X, KeyRound, ExternalLink, Check, Loader2, AlertCircle, SkipForward } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { validateApiKey } from '../../services/fredApi'

export default function ApiKeyModal() {
  const { apiKey, setApiKey, setShowApiKeyModal } = useAppStore()
  const [input, setInput] = useState(apiKey ?? '')
  const [status, setStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle')

  const close = () => setShowApiKeyModal(false)

  const handleSave = async () => {
    if (!input.trim()) return
    setStatus('validating')
    const ok = await validateApiKey(input.trim())
    if (ok) {
      setApiKey(input.trim())
      setStatus('valid')
      setTimeout(close, 800)
    } else {
      setStatus('invalid')
    }
  }

  const handleSaveAnyway = () => {
    if (!input.trim()) return
    setApiKey(input.trim())
    setStatus('valid')
    setTimeout(close, 600)
  }

  const handleRemove = () => {
    setApiKey(null)
    setInput('')
    setStatus('idle')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl">
      <div className="w-full max-w-md mx-4 rounded-2xl border border-white/[0.1] glass shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-obs-accent/[0.12] flex items-center justify-center">
              <KeyRound size={13} className="text-obs-accent" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-obs-text tracking-[-0.01em]">FRED API Key</h2>
              <p className="text-[10px] text-obs-subtle font-light">Federal Reserve Economic Data</p>
            </div>
          </div>
          <button
            onClick={close}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-obs-subtle hover:text-obs-muted transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Info */}
          <div className="rounded-xl bg-obs-accent/[0.05] border border-obs-accent/[0.12] p-3.5 text-[11px] text-obs-subtle leading-relaxed space-y-1.5">
            <p className="text-obs-muted font-medium text-xs">How to get a free FRED API key:</p>
            <ol className="list-decimal list-inside space-y-1 font-light">
              <li>Visit fred.stlouisfed.org</li>
              <li>Create a free account</li>
              <li>Go to My Account → API Keys</li>
              <li>Request an API key (approved instantly)</li>
            </ol>
            <a
              href="https://fred.stlouisfed.org/docs/api/api_key.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-obs-accent hover:underline mt-2 text-[11px]"
            >
              <ExternalLink size={10} /> fred.stlouisfed.org/docs/api/api_key.html
            </a>
          </div>

          {/* Input */}
          <div>
            <label className="block text-[11px] font-medium text-obs-muted mb-1.5 tracking-[-0.01em]">API Key</label>
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setStatus('idle') }}
              placeholder="Enter your FRED API key..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-obs-text font-mono placeholder-obs-subtle outline-none focus:border-obs-accent/50 transition-all duration-200"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />

            {status === 'invalid' && (
              <div className="mt-2.5 rounded-xl bg-obs-red/[0.05] border border-obs-red/[0.15] p-3 space-y-1.5">
                <p className="flex items-center gap-1.5 text-[11px] text-obs-red font-medium">
                  <AlertCircle size={11} /> Validation failed
                </p>
                <p className="text-[10px] text-obs-subtle leading-relaxed font-light">
                  Newly created FRED keys can take a few minutes to activate. Use{' '}
                  <span className="text-obs-yellow font-medium">Save Anyway</span> if your key is correct.
                </p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-1 flex-wrap">
            {apiKey && (
              <button
                onClick={handleRemove}
                className="px-3 py-2 text-[11px] rounded-xl border border-obs-red/25 text-obs-red hover:bg-obs-red/[0.08] transition-all duration-150"
              >
                Remove Key
              </button>
            )}
            <button
              onClick={close}
              className="px-3 py-2 text-[11px] rounded-xl border border-white/[0.08] text-obs-muted hover:bg-white/[0.05] transition-all duration-150"
            >
              Cancel
            </button>

            {status === 'invalid' && (
              <button
                onClick={handleSaveAnyway}
                className="flex items-center gap-1.5 px-3 py-2 text-[11px] rounded-xl border border-obs-yellow/30 text-obs-yellow bg-obs-yellow/[0.06] hover:bg-obs-yellow/[0.1] transition-all duration-150"
              >
                <SkipForward size={11} /> Save Anyway
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={!input.trim() || status === 'validating'}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 text-[11px] rounded-xl bg-obs-accent text-white font-semibold hover:bg-[#0071e3] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 tracking-[-0.01em]"
            >
              {status === 'validating' && <Loader2 size={11} className="animate-spin" />}
              {status === 'valid' && <Check size={11} />}
              {status === 'validating' ? 'Validating…' : status === 'valid' ? 'Connected!' : 'Save & Connect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
