import { Canvas } from '@react-three/fiber'
import { OrthographicCamera, Text } from '@react-three/drei'
import { useState, useMemo } from 'react'

// Tile component
const Tile = ({ position, color = "green" }: { position: [number, number, number], color?: string }) => (
  <group position={position}>
    <mesh>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} />
    </mesh>
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="black" wireframe />
    </mesh>
  </group>
)

// Player component
const Player = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <Text
      position={[0, 0, 0.1]}
      fontSize={0.5}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      @
    </Text>
  </group>
)

const mapDataString = `
# # # # # # # # # # # #
# · · · · · · · · · · #
# · · · · · · · · · · #
# · · · · · · · · · · #
# · · · · · · · · · · #
# · · · · · · · · · · #
# · · · · · · · · · · #
# · · · · · · · · · · #
# · · · · · · · · · · #
# # # # # # # # # # # #
`

const mapData = mapDataString.trim().split('\n').map(row => row.trim().split(' '))

const App = () => {
  const tileSize = 64 // pixels
  const mapWidth = mapData[0].length
  const mapHeight = mapData.length
  const canvasWidth = mapWidth * tileSize
  const canvasHeight = mapHeight * tileSize

  const [playerPos, setPlayerPos] = useState<[number, number, number]>([1, 1, 0.1])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const [x, y, z] = playerPos
    switch (event.key) {
      case 'ArrowUp':
        if (y > 1 && mapData[mapData.length - y][x] !== '#') setPlayerPos([x, y - 1, z])
        break
      case 'ArrowDown':
        if (y < mapData.length - 2 && mapData[mapData.length - y - 2][x] !== '#') setPlayerPos([x, y + 1, z])
        break
      case 'ArrowLeft':
        if (x > 1 && mapData[mapData.length - y - 1][x - 1] !== '#') setPlayerPos([x - 1, y, z])
        break
      case 'ArrowRight':
        if (x < mapData[0].length - 2 && mapData[mapData.length - y - 1][x + 1] !== '#') setPlayerPos([x + 1, y, z])
        break
    }
  }

  const memoizedMapData = useMemo(() => {
    return mapData.map((row, y) =>
      row.map((type, x) => {
        const key = `${x}-${y}`
        const position: [number, number, number] = [
          x - (mapWidth - 1) / 2,
          (mapHeight - 1) / 2 - y,
          0
        ]
        switch (type) {
          case "#":
            return <Tile key={key} position={position} color="brown" />
          case "·":
            return <Tile key={key} position={position} color="green" />
          default:
            return null
        }
      })
    )
  }, [])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#f0f0f0',
    }}>
      <div
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <Canvas style={{ width: '100%', height: '100%' }}>
          <OrthographicCamera
            makeDefault
            zoom={1}
            position={[0, 0, 5]}
            left={-mapWidth / 2}
            right={mapWidth / 2}
            top={mapHeight / 2}
            bottom={-mapHeight / 2}
          />
          {memoizedMapData}
          <Player position={[
            playerPos[0] - (mapWidth - 1) / 2,
            (mapHeight - 1) / 2 - playerPos[1],
            playerPos[2]
          ]} />
        </Canvas>
      </div>
    </div>
  )
}

export default App