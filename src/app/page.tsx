'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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

// ─── Confetti (diradato) ─────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    color: ['#c9973a', '#d4756a', '#3d6b4f', '#e8c07a', '#f0a89e', '#6a9b7e'][Math.floor(Math.random() * 6)],
    size: `${7 + Math.random() * 9}px`,
    delay: `${Math.random() * 6}s`,
    duration: `${5 + Math.random() * 5}s`,
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

// ─── Photo placeholder ───────────────────────────────────────
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

// ─── Shared Audio Engine ─────────────────────────────────────
// Un unico AudioContext condiviso tra melodia e boom.
// Creato lazy al primo gesto utente (policy browser).

let sharedCtx: AudioContext | null = null
let melodyMasterGain: GainNode | null = null

function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!sharedCtx) {
      sharedCtx = new AudioContext()
      // Master gain per la melodia (separato dal boom)
      melodyMasterGain = sharedCtx.createGain()
      melodyMasterGain.gain.value = 0.18
      melodyMasterGain.connect(sharedCtx.destination)
    }
    if (sharedCtx.state === 'suspended') sharedCtx.resume()
    return sharedCtx
  } catch { return null }
}

// ─── Melodia "Tanti Auguri a Te" ─────────────────────────────
// Note: frequenza Hz, durata in unità (1 = quarto di battuta @ BPM)
// Tonalità: Do maggiore  |  BPM: 76  |  Terzine di terzine

const NOTE: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46,
  G5: 783.99, A5: 880.00,
  R:  0,      // pausa
}

// [nota, durata_beats]  (1 beat = 1 quarto)
// "Tanti Auguri a Te" — versione tradizionale completa (2 strofe)
const HAPPY_BIRTHDAY: Array<[string, number]> = [
  // "Tan-ti au-gu-ri a te"
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  // "Tan-ti au-gu-ri a te"
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  // "Tan-ti au-gu-ri Ca-ro/a [nome]"
  ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 1],
  // "Tan-ti au-gu-ri a te"
  ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2],
  ['R', 1],
]

// Schedula una singola riproduzione della melodia a partire da `startTime`.
// Restituisce il tempo di fine (in secondi AudioContext).
function scheduleMelody(ctx: AudioContext, startTime: number): number {
  if (!melodyMasterGain) return startTime
  const BPM = 76
  const beatDur = 60 / BPM  // secondi per beat

  let t = startTime
  for (const [noteName, beats] of HAPPY_BIRTHDAY) {
    const dur = beats * beatDur
    const freq = NOTE[noteName]
    if (freq > 0) {
      // Oscillatore principale (sine arrotondato → campanellino)
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = freq

      // Secondo oscillatore una ottava sopra per brillantezza
      const osc2 = ctx.createOscillator()
      osc2.type = 'sine'
      osc2.frequency.value = freq * 2

      const env = ctx.createGain()
      // Attacco veloce, decay medio, sustain, release
      env.gain.setValueAtTime(0, t)
      env.gain.linearRampToValueAtTime(1, t + 0.02)
      env.gain.setValueAtTime(0.7, t + 0.06)
      env.gain.setValueAtTime(0.6, t + dur * 0.75)
      env.gain.linearRampToValueAtTime(0, t + dur * 0.92)

      osc.connect(env)
      osc2.connect(env)
      env.connect(melodyMasterGain!)

      osc.start(t)
      osc.stop(t + dur)
      osc2.start(t)
      osc2.stop(t + dur)
    }
    t += dur
  }
  return t
}

// Hook: avvia la melodia in loop; restituisce funzione stop
function useMelodyLoop(active: boolean, muted: boolean) {
  const scheduleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeRef   = useRef(active)
  const mutedRef    = useRef(muted)

  useEffect(() => { activeRef.current = active }, [active])
  useEffect(() => {
    mutedRef.current = muted
    if (melodyMasterGain) melodyMasterGain.gain.value = muted ? 0 : 0.18
  }, [muted])

  useEffect(() => {
    if (!active) return

    let nextStart = -1
    let cancelled = false

    function loop() {
      if (cancelled) return
      const ctx = getAudioCtx()
      if (!ctx) return
      const now = ctx.currentTime
      if (nextStart < now) nextStart = now + 0.1
      const endTime = scheduleMelody(ctx, nextStart)
      const gap = 1.5  // pausa tra ripetizioni (secondi)
      nextStart = endTime + gap
      const msUntilReschedule = (endTime - now - 0.5) * 1000
      scheduleRef.current = setTimeout(loop, Math.max(100, msUntilReschedule))
    }

    // Piccolo delay per aspettare interazione utente prima di creare AudioContext
    scheduleRef.current = setTimeout(loop, 200)

    return () => {
      cancelled = true
      if (scheduleRef.current) clearTimeout(scheduleRef.current)
    }
  }, [active])
}

// ─── Boom (usa lo stesso sharedCtx) ──────────────────────────
function createBoomPlayer(): (() => void) | null {
  if (typeof window === 'undefined') return null

  return function playBoom() {
    try {
      const ctx = getAudioCtx()
      if (!ctx) return
      const now = ctx.currentTime

      // Bassa percussiva
      const kick = ctx.createOscillator()
      const kickGain = ctx.createGain()
      kick.type = 'sine'
      kick.frequency.setValueAtTime(140, now)
      kick.frequency.exponentialRampToValueAtTime(28, now + 0.18)
      kickGain.gain.setValueAtTime(0.9, now)
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)
      kick.connect(kickGain)
      kickGain.connect(ctx.destination)
      kick.start(now)
      kick.stop(now + 0.3)

      // Sfrigolio burst
      const bufSize = ctx.sampleRate * 0.22
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1)
      const noise = ctx.createBufferSource()
      noise.buffer = buf
      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = 'bandpass'
      noiseFilter.frequency.value = 1800
      noiseFilter.Q.value = 0.7
      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.45, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)
      noise.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noise.start(now)
      noise.stop(now + 0.22)

      // Fischio lancio
      const whistle = ctx.createOscillator()
      const whistleGain = ctx.createGain()
      whistle.type = 'sine'
      whistle.frequency.setValueAtTime(400, now - 0.55)
      whistle.frequency.exponentialRampToValueAtTime(1800, now)
      whistleGain.gain.setValueAtTime(0.07, now - 0.55)
      whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02)
      whistle.connect(whistleGain)
      whistleGain.connect(ctx.destination)
      whistle.start(Math.max(0, now - 0.55))
      whistle.stop(now + 0.05)
    } catch { /* ignore */ }
  }
}

// ─── Fireworks Canvas ────────────────────────────────────────
interface Particle {
  x: number; y: number
  vx: number; vy: number
  alpha: number
  color: string
  radius: number
  decay: number
  tail: Array<{ x: number; y: number }>
}

interface Rocket {
  sx: number; sy: number
  tx: number; ty: number
  x: number; y: number
  color: string
  duration: number
  startTime: number
  burst: boolean
  particles: Particle[]
  prevPositions: Array<{ x: number; y: number }>
  colorSet: string[]
}

const GOLD_COLORS  = ['#f3bf55', '#ffe08a', '#fff3c0', '#ffd54f', '#ffec9e', '#ffffff']
const ROSE_COLORS  = ['#e88d83', '#f0a89e', '#ffd0cb', '#ff8a80', '#ffb3ab', '#ffffff']
const GREEN_COLORS = ['#6fcf8e', '#a8e6be', '#52b96e', '#c8f0d4', '#ffffff']
const BLUE_COLORS  = ['#7ec8e3', '#b3dff0', '#4ab5d6', '#d0eef8', '#ffffff']
const COLOR_SETS   = [GOLD_COLORS, ROSE_COLORS, GREEN_COLORS, BLUE_COLORS]

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.substring(0,2),16), parseInt(h.substring(2,4),16), parseInt(h.substring(4,6),16)]
}

function makeParticles(cx: number, cy: number, colors: string[]): Particle[] {
  return Array.from({ length: 55 }, () => {
    const angle = Math.random() * Math.PI * 2
    const speed = 2.5 + Math.random() * 6.5
    return {
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      radius: 2.5 + Math.random() * 3,
      decay: 0.008 + Math.random() * 0.008,
      tail: [],
    }
  })
}



function FireworksCanvas({ active, muted }: { active: boolean; muted: boolean }) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const rocketsRef   = useRef<Rocket[]>([])
  const rafRef       = useRef<number | null>(null)
  const lastSpawnRef = useRef<number>(0)
  const spawnCount   = useRef(0)
  const boomRef      = useRef<(() => void) | null>(null)

  useEffect(() => { boomRef.current = createBoomPlayer() }, [])

  // Melodia in loop di sottofondo
  useMelodyLoop(active, muted)

  useEffect(() => {
    if (!active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rocketsRef.current = []
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const cols = 5; const rows = 4
    const targets: Array<{ tx: number; ty: number }> = []
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        targets.push({ tx: (c + 0.15 + Math.random() * 0.7) / cols, ty: (r + 0.15 + Math.random() * 0.7) / rows })
    for (let i = targets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[targets[i], targets[j]] = [targets[j], targets[i]]
    }

    function spawnRocket(now: number) {
      if (!canvas) return
      const idx = spawnCount.current % targets.length
      const { tx, ty } = targets[idx]
      const n = spawnCount.current++
      const colorSet = COLOR_SETS[n % COLOR_SETS.length]
      rocketsRef.current.push({
        sx: canvas.width * (0.3 + Math.random() * 0.4), sy: canvas.height + 12,
        tx, ty, x: 0, y: 0,
        color: colorSet[0],
        duration: 600 + Math.random() * 350,
        startTime: now,
        burst: false, particles: [], prevPositions: [],
        colorSet,
      })
    }

    function draw(now: number) {
      if (!canvas || !ctx) return

      const interval = spawnCount.current < 10 ? 180 : 700
      if (now - lastSpawnRef.current > interval) {
        spawnRocket(now)
        lastSpawnRef.current = now
      }

      // Pulisci ogni frame — la foto sotto rimane visibile
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const rocket of rocketsRef.current) {
        if (!rocket.burst) {
          const elapsed = now - rocket.startTime
          const t = Math.min(elapsed / rocket.duration, 1)
          const eased = t < 0.5 ? 2*t*t : -1+(4-2*t)*t

          const prevX = rocket.x || rocket.sx
          const prevY = rocket.y || rocket.sy
          rocket.x = rocket.sx + (rocket.tx * canvas.width  - rocket.sx) * eased
          rocket.y = rocket.sy + (rocket.ty * canvas.height - rocket.sy) * eased

          rocket.prevPositions.push({ x: prevX, y: prevY })
          if (rocket.prevPositions.length > 22) rocket.prevPositions.shift()

          if (rocket.prevPositions.length > 1) {
            ctx.beginPath()
            ctx.moveTo(rocket.prevPositions[0].x, rocket.prevPositions[0].y)
            for (let i = 1; i < rocket.prevPositions.length; i++)
              ctx.lineTo(rocket.prevPositions[i].x, rocket.prevPositions[i].y)
            ctx.lineTo(rocket.x, rocket.y)
            const [r,g,b] = hexToRgb(rocket.color)
            ctx.strokeStyle = `rgba(${r},${g},${b},0.8)`
            ctx.lineWidth = 2.8
            ctx.lineCap = 'round'
            ctx.stroke()
          }

          // Testa
          ctx.beginPath()
          ctx.arc(rocket.x, rocket.y, 4.5, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,255,255,1)'
          ctx.fill()

          // Aureola
          const glow = ctx.createRadialGradient(rocket.x, rocket.y, 0, rocket.x, rocket.y, 12)
          glow.addColorStop(0, 'rgba(255,255,255,0.7)')
          glow.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.beginPath()
          ctx.arc(rocket.x, rocket.y, 12, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()

          if (t >= 1) {
            rocket.burst = true
            rocket.particles = makeParticles(rocket.x, rocket.y, rocket.colorSet)

            // Flash grande
            const flash = ctx.createRadialGradient(rocket.x, rocket.y, 0, rocket.x, rocket.y, 42)
            flash.addColorStop(0, 'rgba(255,255,255,1)')
            flash.addColorStop(0.35, 'rgba(255,245,200,0.7)')
            flash.addColorStop(1, 'rgba(255,255,255,0)')
            ctx.beginPath()
            ctx.arc(rocket.x, rocket.y, 42, 0, Math.PI * 2)
            ctx.fillStyle = flash
            ctx.fill()

            boomRef.current?.()
          }
        } else {
          for (const p of rocket.particles) {
            p.tail.push({ x: p.x, y: p.y })
            if (p.tail.length > 8) p.tail.shift()
            p.x  += p.vx
            p.y  += p.vy
            p.vy += 0.06
            p.vx *= 0.98
            p.alpha -= p.decay
            if (p.alpha <= 0) continue

            const [r,g,b] = hexToRgb(p.color)
            // Coda
            for (let i = 1; i < p.tail.length; i++) {
              ctx.beginPath()
              ctx.arc(p.tail[i].x, p.tail[i].y, p.radius * (i / p.tail.length), 0, Math.PI * 2)
              ctx.fillStyle = `rgba(${r},${g},${b},${(i / p.tail.length) * p.alpha * 0.5})`
              ctx.fill()
            }
            // Corpo
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`
            ctx.fill()
          }
        }
      }

      rocketsRef.current = rocketsRef.current.filter(
        r => !r.burst || r.particles.some(p => p.alpha > 0)
      )
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 6,
        borderRadius: 'inherit',
      }}
    />
  )
}

// ─── Photo Reveal ────────────────────────────────────────────
function PhotoReveal({ onDone }: { onDone: () => void }) {
  const COLS = 12; const ROWS = 8; const TOTAL = COLS * ROWS
  const [hidden, setHidden] = useState<Set<number>>(
    () => new Set(Array.from({ length: TOTAL }, (_, i) => i))
  )

  useEffect(() => {
    const arr = Array.from({ length: TOTAL }, (_, i) => i)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    const TOTAL_MS = 6000
    const timers: ReturnType<typeof setTimeout>[] = []
    arr.forEach((panelIdx, i) => {
      timers.push(setTimeout(() => {
        setHidden(prev => { const n = new Set(prev); n.delete(panelIdx); return n })
      }, (i / TOTAL) * TOTAL_MS))
    })
    timers.push(setTimeout(() => onDone(), TOTAL_MS + 300))
    return () => timers.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: TOTAL }, (_, i) => (
        <div key={i} style={{
          background: '#f5ede0',
          opacity: hidden.has(i) ? 1 : 0,
          transition: 'opacity 0.18s cubic-bezier(0.16,1,0.3,1)',
        }} />
      ))}
    </div>
  )
}

// ─── Lightbox ────────────────────────────────────────────────
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

// ─── Main App ────────────────────────────────────────────────
export default function Home() {
  const [view, setView] = useState<View>('oggi')
  const [countdown, setCountdown] = useState<Countdown | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [birthdayRevealDone, setBirthdayRevealDone] = useState(false)
  const [muted, setMuted] = useState(false)

  const isBirthday = isBirthdayToday()
  const todayPhotoIndex = getTodayPhotoIndex()
  const revealedIndices = getRevealedPhotoIndices()
  const todayPhoto = photos[todayPhotoIndex]
  const today = getCurrentDate()

  useEffect(() => {
    if (isBirthday) return
    setCountdown(getCountdown())
    const interval = setInterval(() => setCountdown(getCountdown()), 1000)
    return () => clearInterval(interval)
  }, [isBirthday])

  useEffect(() => {
    if (!isBirthday) setBirthdayRevealDone(false)
  }, [isBirthday])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  return (
    <>
      {isBirthday && birthdayRevealDone && <Confetti />}

      <nav>
        <div className="nav-inner">
          {!isBirthday && (
            <div className="nav-heading">
              Ciao <span className="nav-heading-name">{NAME}</span>, questa e&apos; la tua foto di oggi.
            </div>
          )}
          <div className="nav-tabs nav-tabs-bottom">
            {isBirthday && (
              <button
                className="nav-tab"
                onClick={() => setMuted(m => !m)}
                title={muted ? 'Attiva audio' : 'Silenzia'}
                style={{ fontSize: 16, padding: '6px 12px' }}
              >
                {muted ? '🔇' : '🎵'}
              </button>
            )}
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
          {isBirthday && (
            <div style={{ paddingTop: 40 }}>
              <div className={`birthday-banner ${birthdayRevealDone ? 'birthday-banner-visible' : 'birthday-banner-hidden'}`}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎂✨🎉</div>
                <h1>Buon Compleanno {NAME}!</h1>
                <p>Oggi compi 18 anni. Questo giorno è tutto per te — ogni ora, ogni minuto, ogni secondo. ❤️</p>
              </div>
            </div>
          )}

          {view === 'oggi' && (
            <>
              {!isBirthday && <div className="hero" />}

              <div className="photo-day-card" onClick={() => setLightboxIndex(todayPhotoIndex)}>
                <div className="photo-day-image-wrap">
                  <div className="photo-day-badge">
                    Foto {todayPhotoIndex + 1} di {TOTAL_PHOTOS}
                  </div>

                  <PhotoDisplay filename={todayPhoto.filename} alt="Foto del giorno" className={undefined} />

                  <FireworksCanvas active={isBirthday} muted={muted} />

                  {isBirthday && !birthdayRevealDone && (
                    <PhotoReveal onDone={() => setBirthdayRevealDone(true)} />
                  )}
                </div>

                <div className="photo-day-content">
                  <div className="photo-day-message">
                    <span className="photo-day-emoji">{todayPhoto.emoji}</span>
                    <p className="photo-day-dedica">{todayPhoto.dedica}</p>
                  </div>
                  <span className="photo-day-date">{formatDate(today)}</span>
                </div>
              </div>

              {!isBirthday && (
                <>
                  <div className="section-header">
                    <h2 className="section-title">Al tuo compleanno mancano…</h2>
                  </div>
                  {countdown && (
                    <div className="countdown-strip">
                      {[
                        { num: countdown.giorni,  label: countdown.giorni === 1  ? 'giorno' : 'giorni' },
                        { num: countdown.ore,     label: countdown.ore === 1     ? 'ora'    : 'ore'    },
                        { num: countdown.minuti,  label: 'minuti'  },
                        { num: countdown.secondi, label: 'secondi' },
                      ].map(({ num, label }) => (
                        <div className="countdown-unit" key={label}>
                          <span className="countdown-num">{String(num).padStart(2, '0')}</span>
                          <span className="countdown-label">{label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}

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

      {lightboxIndex !== null && (
        <Lightbox photoIndex={lightboxIndex} onClose={closeLightbox} />
      )}
    </>
  )
}
