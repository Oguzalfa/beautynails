import { useEffect, useRef } from 'react'
import type { SceneApi } from '../lib/heroScene'

type Props = {
  progress: number
  pointer: { x: number; y: number }
  active: boolean
  reduced: boolean
  isMobile: boolean
  enabled: boolean
  onContextLost?: () => void
}

function whenIdle(cb: () => void, timeout = 1200) {
  const ric = window.requestIdleCallback?.bind(window)
  if (ric) {
    const id = ric(() => cb(), { timeout })
    return () => window.cancelIdleCallback?.(id)
  }
  const t = window.setTimeout(cb, Math.min(400, timeout))
  return () => window.clearTimeout(t)
}

export function HeroSceneCanvas({
  progress,
  pointer,
  active,
  reduced,
  isMobile,
  enabled,
  onContextLost,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const apiRef = useRef<SceneApi | null>(null)
  const onLostRef = useRef(onContextLost)
  onLostRef.current = onContextLost

  useEffect(() => {
    if (!enabled || !canvasRef.current) return
    let cancelled = false
    let api: SceneApi | null = null
    let cancelIdle: (() => void) | undefined

    let started = false
    const boot = () => {
      if (cancelled || started) return
      started = true
      window.removeEventListener('scroll', onScrollKick, true)
      window.clearTimeout(fallbackTimer)
      cancelIdle = whenIdle(() => {
        void (async () => {
          try {
            const { createHeroScene } = await import('../lib/heroScene')
            if (cancelled || !canvasRef.current) return
            api = createHeroScene({
              canvas: canvasRef.current,
              isMobile,
              onContextLost: () => {
                apiRef.current?.dispose()
                apiRef.current = null
                onLostRef.current?.()
              },
            })
            apiRef.current = api
            api.setReduced(reduced)
            api.setVisible(active)
            api.setProgress(progress)
            api.setPointer(pointer.x, pointer.y)
          } catch {
            apiRef.current = null
            onLostRef.current?.()
          }
        })()
      }, isMobile ? 900 : 700)
    }

    const onScrollKick = () => boot()
    window.addEventListener('scroll', onScrollKick, { passive: true, capture: true })
    // Keep first paint free of Three.js; still boot later if user doesn't scroll.
    const fallbackTimer = window.setTimeout(boot, isMobile ? 2800 : 1400)

    const onResize = () => apiRef.current?.resize()
    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      cancelIdle?.()
      window.clearTimeout(fallbackTimer)
      window.removeEventListener('scroll', onScrollKick, true)
      window.removeEventListener('resize', onResize)
      api?.dispose()
      apiRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- progress/pointer/active/reduced sync via dedicated effects
  }, [enabled, isMobile])

  useEffect(() => {
    apiRef.current?.setProgress(progress)
  }, [progress])

  useEffect(() => {
    apiRef.current?.setPointer(pointer.x, pointer.y)
  }, [pointer])

  useEffect(() => {
    apiRef.current?.setVisible(active)
  }, [active])

  useEffect(() => {
    apiRef.current?.setReduced(reduced)
  }, [reduced])

  if (!enabled) return null

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
}
