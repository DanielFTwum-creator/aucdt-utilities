import { useEffect, useRef } from 'react'

const BASE_COLORS: [number, number, number][] = [
  [30, 41, 59],
  [41, 37, 36],
  [39, 39, 42],
  [31, 41, 55],
  [30, 27, 75],
  [20, 53, 35],
  [60, 20, 10],
  [28, 25, 58],
]

interface VideoCanvasProps {
  colorIndex: number
  paused?: boolean
}

export function VideoCanvas({ colorIndex, paused }: VideoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runningRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const [r, g, b] = BASE_COLORS[colorIndex % BASE_COLORS.length]
    runningRef.current = true
    let timeoutId: ReturnType<typeof setTimeout>
    let rafId: number

    const draw = () => {
      if (!runningRef.current) return
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (!paused) {
        for (let i = 0; i < 120; i++) {
          const x = Math.floor(Math.random() * canvas.width)
          const y = Math.floor(Math.random() * canvas.height)
          const n = (Math.random() - 0.5) * 16
          const nr = Math.min(255, Math.max(0, Math.round(r + n)))
          const ng = Math.min(255, Math.max(0, Math.round(g + n)))
          const nb = Math.min(255, Math.max(0, Math.round(b + n)))
          ctx.fillStyle = `rgba(${nr},${ng},${nb},0.6)`
          ctx.fillRect(x, y, 3, 3)
        }
      }

      timeoutId = setTimeout(() => {
        if (runningRef.current) rafId = requestAnimationFrame(draw)
      }, paused ? 500 : 130)
    }

    rafId = requestAnimationFrame(draw)
    return () => {
      runningRef.current = false
      clearTimeout(timeoutId)
      cancelAnimationFrame(rafId)
    }
  }, [colorIndex, paused])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ objectFit: 'cover' }}
      width={320}
      height={240}
    />
  )
}
