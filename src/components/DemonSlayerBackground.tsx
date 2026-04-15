/**
 * DemonSlayerBackground
 * ---------------------
 * Renders the "Infinity Breathing" particle swarm from demon_slayer.jsx
 * as a seamless, fixed background behind the entire portfolio.
 *
 * Design goals:
 *  - position: fixed, z-index: 0  → sits below ALL content
 *  - pointer-events: none           → never captures clicks
 *  - Low opacity (0.18 light / 0.22 dark) → decorative, not distracting
 *  - No OrbitControls → camera is stationary, particles self-balance
 *  - Bloom via @react-three/postprocessing (already installed)
 *  - Mobile: reduced particle count + no bloom to stay performant
 */

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

/* ─── Particle Swarm ──────────────────────────────────────────────────────── */
function ParticleSwarm({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const count = isMobile ? 6000 : 20000
  const speedMult = 1

  const dummy  = useMemo(() => new THREE.Object3D(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const pColor = useMemo(() => new THREE.Color(), [])

  const positionsRef = useRef<THREE.Vector3[]>([])

  /* Spawn positions in a wide cube */
  useEffect(() => {
    const pos: THREE.Vector3[] = []
    for (let i = 0; i < count; i++) {
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
        ),
      )
    }
    positionsRef.current = pos
  }, [count])

  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.25), [])
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true }),
    [],
  )

  /* Shared PARAMS from demon_slayer (tuned for background use) */
  const PARAMS = useMemo(
    () => ({ zoom: 1.45, swirl: 0.635, layers: 4.16 }),
    [],
  )

  useFrame((state) => {
    if (!meshRef.current || positionsRef.current.length === 0) return
    const time  = state.clock.getElapsedTime() * speedMult
    const zoom   = PARAMS.zoom
    const swirl  = PARAMS.swirl
    const layers = Math.round(PARAMS.layers)
    const t      = time * 0.6

    for (let i = 0; i < count; i++) {
      let x     = 0
      let y     = 0
      let scale = 1

      /* Fractal layering — identical to original demon_slayer logic */
      for (let j = 0; j < layers; j++) {
        const angle = i * 0.1 * scale + t * swirl
        const r     = (Math.sqrt(i / count) * 120) / scale
        x += Math.cos(angle) * r
        y += Math.sin(angle) * r
        scale *= zoom
      }

      /* Breathing pulse */
      const pulse = Math.sin(t * 2) * 20
      x += pulse
      y += pulse * 0.5

      target.set(x, y, 0)

      /* Demon Slayer vibe: teal + red hues */
      const hue   = (0.5 + Math.sin(i * 0.01 + t) * 0.1) % 1
      const light = 0.5 + Math.sin(t + i * 0.02) * 0.2
      pColor.setHSL(hue, 0.9, light)

      positionsRef.current[i].lerp(target, 0.1)
      dummy.position.copy(positionsRef.current[i])
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, pColor)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }

  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} />
  )
}

/* ─── Root Background Canvas ──────────────────────────────────────────────── */
export default function DemonSlayerBackground() {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none), (pointer: coarse)').matches ||
        window.innerWidth < 768),
  )

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)')
    const onResize = () =>
      setIsMobile(mq.matches || window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    /* Fixed behind everything — pointer-events none so clicks pass through */
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{
        /* Subtle opacity so it reads as "background flavour" not foreground */
        opacity: 0.18,
        /* Blend into dark theme naturally */
        mixBlendMode: 'screen',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 100], fov: 60 }}
        dpr={isMobile ? [0.6, 0.8] : [0.8, 1.2]}
        gl={{
          antialias: false,          // off for perf — tiny particles look fine
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <fog attach="fog" args={['#000000', 0.005, 500]} />

        <ParticleSwarm isMobile={isMobile} />

        {/* Bloom only on desktop — keeps mobile smooth */}
        {!isMobile && (
          <EffectComposer>
            <Bloom
              intensity={1.6}
              luminanceThreshold={0.1}
              luminanceSmoothing={0.85}
              blendFunction={BlendFunction.SCREEN}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
