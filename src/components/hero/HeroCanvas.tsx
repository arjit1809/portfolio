import { Suspense, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import GeometricShape from './GeometricShape'
import ParticleCloud from './ParticleCloud'

export default function HeroCanvas() {
  const mouse = useRef<[number, number]>([0, 0])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouse.current = [e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2]
  }, [])

  return (
    <div className="absolute inset-0" onMouseMove={handleMouseMove}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <AdaptiveDpr pixelated />

        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 5]} intensity={4} color="#a78bfa" />
        <pointLight position={[-10, -5, -5]} intensity={2.5} color="#818cf8" />
        <spotLight
          position={[0, 8, 2]}
          intensity={3}
          color="#c4b5fd"
          angle={0.5}
          penumbra={1}
          castShadow
        />

        <Suspense fallback={null}>
          <Environment preset="night" />
          <group position={[3.5, 0, 0]}>
            <GeometricShape mouse={mouse} />
            <ParticleCloud mouse={mouse} />
          </group>

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
        </Suspense>
      </Canvas>
    </div>
  )
}
