import { useState, useEffect } from 'react'
import { PromptBuilder }      from '@/components/PromptBuilder'
import { StreamPlayer }       from '@/components/player/StreamPlayer'
import { TrackLibrary }       from '@/components/library/TrackLibrary'
import { LoginScreen }        from '@/components/LoginScreen'
import { useGenerationStore } from '@/store/generationStore'
import { setAccessToken, registerAuthFailureHandler } from '@/services/api'
import type { GenerationParams } from '@/types'

type Tab = 'generate' | 'library'

export default function App() {
  const [tab,    setTab]    = useState<Tab>('generate')
  const [jobId,  setJobId]  = useState<string | null>(null)
  const [params, setParams] = useState<GenerationParams | null>(null)
  const [token,  setToken]  = useState<string | null>(() => sessionStorage.getItem('ls_token'))
  const [quota,  setQuota]  = useState<number>(20)
  const store = useGenerationStore()

  const handleAuthenticated = (t: string, q: number) => {
    sessionStorage.setItem('ls_token', t)
    setToken(t)
    setQuota(q)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('ls_token')
    setAccessToken(null)
    setToken(null)
  }

  // Register auth failure handler (session expired / refresh failed)
  useEffect(() => {
    registerAuthFailureHandler(() => {
      sessionStorage.removeItem('ls_token')
      setToken(null)
    })
  }, [])

  // Inject token into axios headers whenever it changes
  if (token) setAccessToken(token)

  if (!token) {
    return <LoginScreen onAuthenticated={handleAuthenticated} />
  }

  const handleGenerate = (p: GenerationParams, id: string) => {
    setParams(p)
    setJobId(id)
  }

  return (
    <div className="ls-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* ── Sidebar ── */}
      <nav className="ls-sidebar">
        <div className="ls-logo">
          <div className="ls-logo-icon">
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
              <path d="M3 8a5 5 0 0 1 10 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5.5 10.5a3 3 0 0 1 5 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="8" cy="12.5" r="1" fill="white"/>
            </svg>
          </div>
          <div>
            <div className="ls-logo-name">LyriaStream</div>
            <div className="ls-logo-sub">Self-Hosted AI · TUC</div>
          </div>
        </div>

        <button
          type="button"
          className={`ls-nav-item${tab === 'generate' ? ' active' : ''}`}
          onClick={() => setTab('generate')}
          aria-current={tab === 'generate' ? 'page' : undefined}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <rect x="2" y="2" width="12" height="12" rx="2"/>
            <path d="M5 8h6M5 5.5h4M5 10.5h3"/>
          </svg>
          Generate
        </button>

        <button
          type="button"
          className={`ls-nav-item${tab === 'library' ? ' active' : ''}`}
          onClick={() => setTab('library')}
          aria-current={tab === 'library' ? 'page' : undefined}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 4h12M2 8h9M2 12h6"/>
          </svg>
          Library
        </button>

        <div className="ls-nav-spacer" />

        <div className="ls-sidebar-quota">
          <span>{quota} generation{quota !== 1 ? 's' : ''} left</span>
        </div>

        {store.computeMode && (
          <div className="ls-compute-badge">
            <span className={`ls-compute-dot ls-compute-dot--${
              store.computeMode === 'gpu_full' ? 'gpu' :
              store.computeMode === 'cpu_draft' ? 'cpu' : 'auto'
            }`} />
            {store.computeMode}
          </div>
        )}

        <button type="button" className="ls-nav-item" onClick={handleLogout}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3M10 11l3-3-3-3M13 8H6"/>
          </svg>
          Sign out
        </button>
      </nav>

      {/* ── Main ── */}
      <main id="main-content" className="ls-main">
        {tab === 'generate' && (
          <>
            <div className="ls-page-header">
              <h1>Generate music</h1>
              <p>Describe what you want to hear, then tune the details below</p>
            </div>
            <section aria-label="Music generation">
              <PromptBuilder onGenerate={handleGenerate} />
            </section>
            {jobId && params && (
              <section aria-label="Playback" className="ls-playback-section animate-slide-up">
                <StreamPlayer jobId={jobId} params={params} />
              </section>
            )}
          </>
        )}

        {tab === 'library' && (
          <>
            <div className="ls-page-header">
              <h1>Library</h1>
              <p>Your generated tracks</p>
            </div>
            <section aria-label="Track library">
              <TrackLibrary />
            </section>
          </>
        )}

        <footer className="ls-footer">
          <span>LyriaStream v2.0</span>
          <span>·</span><span>TUC-ICT-SRS-2026-008</span>
          <span>·</span><span>Techbridge University College</span>
          <span>·</span><span>Models: MusicGen (MIT) · Riffusion (MIT)</span>
        </footer>
      </main>
    </div>
  )
}
