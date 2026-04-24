'use client'

import { useState, useEffect, useCallback } from 'react'
import { photos, getCurrentDate, getTodayPhotoIndex, getRevealedPhotoIndices, isBirthdayToday, NAME, TOTAL_PHOTOS, BIRTHDAY } from '@/lib/data'

type View = 'oggi' | 'album'

interface Countdown {
  giorni: number
  ore: number
  minuti: number
  secondi: number
}

function getCountdown(): Countdown {
  const now = new Date()
  const thisYear = now.getFullYear()
  let birthday = new Date(thisYear, BIRTHDAY.month - 1, BIRTHDAY.day, 0, 0, 0)
  if (birthday <= now) birthday = new Date(thisYear + 1, BIRTHDAY.month - 1, BIRTHDAY.day, 0, 0, 0)
  const diff = birthday.getTime() - now.getTime()
  const giorni = Math.floor(diff / 86400000)
  const ore = Math.floor((diff % 86400000) / 3600000)
  const minuti = Math.floor((diff % 3600000) / 60000)
  const secondi = Math.floor((diff % 60000) / 1000)
  return { giorni, ore, minuti, secondi }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Confetti ───────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: ['#c9973a', '#d4756a', '#3d6b4f', '#e8c07a', '#f0a89e', '#6a9b7e', '#fdf8f3', '#1a1410'][Math.floor(Math.random() * 8)],
    size: `${6 + Math.random() * 10}px`,
    delay: `${Math.random() * 4}s`,
    duration: `${3 + Math.random() * 4}s`,
    rotate: Math.random() > 0.5 ? 'none' : `${Math.random() * 10}px`,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
  }))

  return (
    <div className="birthday-mode">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            borderRadius: p.borderRadius,
          }}
        />
      ))}
    </div>
  )
}

// ─── Photo placeholder ──────────────────────────────────────
function PhotoDisplay({ filename, alt, className }: { filename: string; alt: string; className?: string }) {
  const [error, setError] = useState(false)
  const isVideo = filename.toLowerCase().endsWith('.mp4')

  if (error) {
    return (
      <div className="photo-placeholder">
        <span>📷</span>
        <span>{filename}</span>
      </div>
    )
  }

  if (isVideo) {
    return (
      <video
        src={`/photos/${filename}`}
        className={className}
        controls
        playsInline
        preload="metadata"
        onError={() => setError(true)}
      >
        {alt}
      </video>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/photos/${filename}`}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}

// ─── Lightbox ───────────────────────────────────────────────
function Lightbox({ photoIndex, onClose }: { photoIndex: number; onClose: () => void }) {
  const photo = photos[photoIndex]
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
        <PhotoDisplay filename={photo.filename} alt={`Foto ${photoIndex + 1}`} className="lightbox-img" />
        <div className="lightbox-body">
          <button className="lightbox-close" onClick={onClose}>✕</button>
          <div style={{ fontSize: 28, marginBottom: 12 }}>{photo.emoji}</div>
          <p className="lightbox-dedica">{photo.dedica}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main App ───────────────────────────────────────────────
export default function Home() {
  const [view, setView] = useState<View>('oggi')
  const [countdown, setCountdown] = useState<Countdown>(getCountdown())
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const isBirthday = isBirthdayToday()
  const todayPhotoIndex = getTodayPhotoIndex()
  const revealedIndices = getRevealedPhotoIndices()
  const todayPhoto = photos[todayPhotoIndex]
  const today = getCurrentDate()

  useEffect(() => {
    if (isBirthday) return
    const interval = setInterval(() => setCountdown(getCountdown()), 1000)
    return () => clearInterval(interval)
  }, [isBirthday])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  return (
    <>
      {isBirthday && <Confetti />}

      {/* Nav */}
      <nav>
        <div className="nav-inner">
          {!isBirthday && <div className="nav-heading">Ciao {NAME}, questa e' la tua foto di oggi.</div>}
          <div className="nav-tabs nav-tabs-bottom">
            <button className={`nav-tab ${view === 'oggi' ? 'active' : ''}`} onClick={() => setView('oggi')}>
              Oggi
            </button>
            <button className={`nav-tab ${view === 'album' ? 'active' : ''}`} onClick={() => setView('album')}>
              Album · {revealedIndices.length}
            </button>
          </div>
        </div>
      </nav>

      <main>
        {!isBirthday && (
          <div className="ambient-background" aria-hidden="true">
            <span className="ambient-blob ambient-blob-left" />
            <span className="ambient-blob ambient-blob-right" />
            <span className="ambient-blob ambient-blob-top" />
            <span className="rocket-trail rocket-trail-left rocket-trail-left-one" />
            <span className="rocket-trail rocket-trail-left rocket-trail-left-two" />
            <span className="rocket-trail rocket-trail-right rocket-trail-right-one" />
            <span className="rocket-trail rocket-trail-right rocket-trail-right-two" />
            <span className="burst burst-left burst-left-one" />
            <span className="burst burst-left burst-left-two" />
            <span className="burst burst-right burst-right-one" />
            <span className="burst burst-right burst-right-two" />
          </div>
        )}
        <div className="container">

          {/* ── BIRTHDAY BANNER ── */}
          {isBirthday && (
            <div style={{ paddingTop: 40 }}>
              <div className="birthday-banner">
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎂✨🎉</div>
                <h1>Buon Compleanno {NAME}!</h1>
                <p>Oggi compi 18 anni. Questo giorno è tutto per te — ogni ora, ogni minuto, ogni secondo. ❤️</p>
              </div>
            </div>
          )}

          {/* ── TODAY VIEW ── */}
          {view === 'oggi' && (
            <>
              {/* Hero */}
              {!isBirthday && <div className="hero" />}

              {/* Photo of the day */}
              <div className="photo-day-card" onClick={() => setLightboxIndex(todayPhotoIndex)}>
                <div className="photo-day-image-wrap">
                  <div className="photo-day-badge">
                    Foto {todayPhotoIndex + 1} di {TOTAL_PHOTOS}
                  </div>
                  <PhotoDisplay filename={todayPhoto.filename} alt="Foto del giorno" />
                </div>
                <div className="photo-day-content">
                  <div className="photo-day-message">
                    <span className="photo-day-emoji">{todayPhoto.emoji}</span>
                    <p className="photo-day-dedica">{todayPhoto.dedica}</p>
                  </div>
                  <span className="photo-day-date">{formatDate(today)}</span>
                </div>
              </div>

              {/* Countdown */}
              {!isBirthday && (
                <>
                  <div className="section-header">
                    <h2 className="section-title">Al tuo compleanno mancano…</h2>
                  </div>
                  <div className="countdown-strip">
                    {[
                      { num: countdown.giorni, label: countdown.giorni === 1 ? 'giorno' : 'giorni' },
                      { num: countdown.ore, label: countdown.ore === 1 ? 'ora' : 'ore' },
                      { num: countdown.minuti, label: 'minuti' },
                      { num: countdown.secondi, label: 'secondi' },
                    ].map(({ num, label }) => (
                      <div className="countdown-unit" key={label}>
                        <span className="countdown-num">{String(num).padStart(2, '0')}</span>
                        <span className="countdown-label">{label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* ── ALBUM VIEW ── */}
          {view === 'album' && (
            <>
              <div className="hero" style={{ paddingBottom: 32 }}>
                <div className="hero-label">La tua collezione</div>
                <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 6vw, 52px)' }}>
                  Il tuo <em>album</em>
                </h1>
                <p className="hero-subtitle">
                  {revealedIndices.length === TOTAL_PHOTOS
                    ? 'Tutte le foto sono svelate — buon compleanno! 🎉'
                    : `${revealedIndices.length} foto svelate su ${TOTAL_PHOTOS}. Torna ogni giorno per scoprirne una nuova.`}
                </p>
              </div>

              <div className="section-header">
                <h2 className="section-title">Foto svelate</h2>
                <span className="section-count">{revealedIndices.length} di {TOTAL_PHOTOS}</span>
              </div>

              <div className="album-grid">
                {photos.map((photo, idx) => {
                  const isRevealed = revealedIndices.includes(idx)
                  return (
                    <div
                      key={photo.id}
                      className="album-item"
                      onClick={() => isRevealed && setLightboxIndex(idx)}
                      style={{ cursor: isRevealed ? 'pointer' : 'default' }}
                    >
                      {isRevealed ? (
                        <>
                          <PhotoDisplay filename={photo.filename} alt={`Foto ${idx + 1}`} />
                          <div className="album-item-overlay">
                            <span className="album-item-emoji">{photo.emoji}</span>
                          </div>
                        </>
                      ) : (
                        <div className="album-item-locked">
                          <span>🔒</span>
                          <span>Foto {idx + 1}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}

        </div>
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox photoIndex={lightboxIndex} onClose={closeLightbox} />
      )}
    </>
  )
}
