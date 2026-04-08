import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshStandardMaterial } from 'three'
import type { Mesh } from 'three'

interface Props {
  mouse: React.MutableRefObject<[number, number]>
  isMobile?: boolean
}

const COLORS = {
  base: '#7c3aed',
  emissive: '#4c1d95',
}

export default function GeometricShape({ mouse, isMobile }: Props) {
  const meshRef = useRef<Mesh>(null)
  const matRef = useRef<MeshStandardMaterial>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    // Continuous base spin
    meshRef.current.rotation.x = t * 0.18
    meshRef.current.rotation.y = t * 0.28
    meshRef.current.rotation.z = t * 0.07

    // Subtle mouse influence
    const [mx, my] = mouse.current
    meshRef.current.rotation.x += my * 0.00012
    meshRef.current.rotation.y += mx * 0.00012

    // Pulse emissive intensity
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.55 + Math.sin(t * 1.5) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} castShadow>
      {/* Torus Knot — lower segments on mobile for performance */}
      <torusKnotGeometry args={[1.1, 0.38, isMobile ? 64 : 200, isMobile ? 16 : 32, 2, 3]} />
      <meshStandardMaterial
        ref={matRef}
        color={COLORS.base}
        emissive={COLORS.emissive}
        emissiveIntensity={0.6}
        roughness={0.08}
        metalness={0.92}
        wireframe={false}
      />
    </mesh>
  )
}
