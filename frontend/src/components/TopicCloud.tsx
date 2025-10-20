import { Center, Float, OrbitControls, Text } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Suspense, useMemo } from "react"
import * as THREE from "three"

type TopicCloudProps = {
  topics?: string[]
}

const DEFAULT_TOPICS = [
  "AI",
  "TypeScript",
  "React",
  "Vite",
  "GraphQL",
  "Edge",
  "Serverless",
  "WebGPU",
  "Rust",
  "Kubernetes",
  "Design",
  "UX",
  "Security",
  "Privacy",
  "LLM",
  "Vector DB",
  "Testing",
  "DevTools",
  "Data Viz",
  "Animation",
]

function sphericalFibonacciPoints(count: number, radius: number) {
  const points: THREE.Vector3[] = []
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = goldenAngle * i
    const x = Math.cos(theta) * r
    const z = Math.sin(theta) * r
    points.push(new THREE.Vector3(x * radius, y * radius, z * radius))
  }
  return points
}

const TopicCloud = ({ topics = DEFAULT_TOPICS }: TopicCloudProps) => {
  const positions = useMemo(
    () => sphericalFibonacciPoints(topics.length, 4),
    [topics]
  )

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <Suspense fallback={null}>
          <Float speed={0.4} rotationIntensity={0.7} floatIntensity={0.7}>
            <Center>
              {topics.map((label, idx) => {
                const p = positions[idx]
                const color = new THREE.Color().setHSL(
                  (idx / topics.length) * 0.9,
                  0.6,
                  0.62
                )
                return (
                  <group key={label + idx} position={p.toArray()}>
                    <BillboardText text={label} color={color.getStyle()} />
                  </group>
                )
              })}
            </Center>
          </Float>
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={6}
          maxDistance={14}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  )
}

const BillboardText = ({ text, color }: { text: string; color: string }) => {
  return (
    <Text
      billboard
      fontSize={0.6}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.012}
      outlineColor="#000000"
      outlineOpacity={0.35}
      maxWidth={3}
    >
      {text}
    </Text>
  )
}

export default TopicCloud
