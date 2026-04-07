import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  mouse: React.MutableRefObject<[number, number]>
}

export default function ParticleCloud({ mouse }: Props) {
  const ref = useRef<THREE.Points>(null)
  const { viewport } = useThree()

  // Generate random particle positions in a sphere
  const positions = useMemo(() => {
    const count = 2200
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    // Slow base rotation
    ref.current.rotation.x -= delta * 0.02
    ref.current.rotation.y -= delta * 0.04

    // Mouse parallax
    const [mx, my] = mouse.current
    ref.current.rotation.x += (my * 0.0008 - ref.current.rotation.x) * 0.05
    ref.current.rotation.y += (mx * 0.0008 - ref.current.rotation.y) * 0.05

    void viewport // suppress unused warning
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#a78bfa"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  )
}
