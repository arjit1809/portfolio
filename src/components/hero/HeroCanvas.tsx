import { Suspense, useRef, useCallback, useMemo, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import GeometricShape from './GeometricShape'
import ParticleCloud from './ParticleCloud'

export default function HeroCanvas() {
  const mouse = useRef<[number, number]>([0, 0])
  
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' && (window.matchMedia('(hover: none), (pointer: coarse)').matches || window.innerWidth < 768)
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.matchMedia('(hover: none), (pointer: coarse)').matches || window.innerWidth < 768
      )
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouse.current = [e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2]
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) {
      mouse.current = [touch.clientX - window.innerWidth / 2, touch.clientY - window.innerHeight / 2]
    }
  }, [])

  // Responsive 3D position: center on mobile, offset right on desktop
  const shapeX = isMobile ? 0 : 3.5

  // Mobile: cap DPR tightly to save GPU, desktop: allow up to 2
  const dpr = useMemo(() => isMobile ? [0.8, 1] as [number, number] : [1, 2] as [number, number], [isMobile])

  return (
    <div className="absolute inset-0" onMouseMove={handleMouseMove} onTouchMove={handleTouchMove}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={dpr}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: isMobile ? 'low-power' : 'high-performance' }}
      >
        {/* AdaptiveDpr only helps on desktop where DPR can vary */}
        {!isMobile && <AdaptiveDpr pixelated />}

        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 5]} intensity={4} color="#a78bfa" />
        <pointLight position={[-10, -5, -5]} intensity={2.5} color="#818cf8" />
        {!isMobile && (
          <spotLight
            position={[0, 8, 2]}
            intensity={3}
            color="#c4b5fd"
            angle={0.5}
            penumbra={1}
            castShadow
          />
        )}

        <Suspense fallback={null}>
          <Environment preset="night" />
          <group position={[shapeX, 0, 0]}>
            <GeometricShape mouse={mouse} isMobile={isMobile} />
            <ParticleCloud mouse={mouse} isMobile={isMobile} />
          </group>

          {/* Heavy post-processing: desktop only */}
          {!isMobile && (
            <EffectComposer>
              <Bloom
                intensity={1.8}
                luminanceThreshold={0.15}
                luminanceSmoothing={0.85}
                blendFunction={BlendFunction.SCREEN}
                mipmapBlur
              />
              <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={new Vector2(0.0006, 0.0006)}
                radialModulation={false}
                modulationOffset={0}
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
