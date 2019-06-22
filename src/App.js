import * as THREE from "three";
import React, { useCallback, set } from "react";
import { useSpring, a, interpolate } from "react-spring/three";
import { Canvas } from "react-three-fiber";
import styled, { createGlobalStyle } from "styled-components/macro";
import { Triangle } from "three";

const GlobalStyle = createGlobalStyle`
  canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    pointer-events: none;
    overflow: hidden;
  }
`;

const FullPage = styled.div`
  width: 100%;
  height: 100vh;
  background-color: white;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  position: relative;
  box-sizing: border-box;
  ::after {
    content: " ";
    position: absolute;
    margin: 24px;
    width: calc(100% - 48px);
    height: calc(100% - 48px);
    border: 2px solid black;
    box-sizing: border-box;
    z-index: 5;
    pointer-events: none;
  }
`;

const Text = styled.div`
  padding: 80px;
  grid-column: 1 / span 3;
  grid-row: 1 / span 2;
  background-color: #f4f4f4;
  font-size:2.5rem;
  display:flex;
  justify-content:center;
  align-items:center;
  p{
    max-width:800px;
    display:flex;
    justify-self:center;
  }
`;

const ThreeFull = styled.div`
  grid-column: 4 / span 1;
  z-index:3;
  grid-row: 1 / span 2;
  background-color: black;
  position: relative;
`;

const ThreeBlock = styled.div`
  grid-column: 2 / span 1;
  grid-row: 3 / span 1;
  background-color: black;
`;

const Block1 = styled.div`
  padding: 80px;
  grid-column: 1 / span 1;
  grid-row: 3 / span 1;
  background-color: #cc2e44;
`;
const Block2 = styled.div`
  padding: 80px;
  grid-column: 3 / span 1;
  grid-row: 3 / span 1;
  background-color: #080b0c;
`;
const Block3 = styled.div`
  padding: 80px;
  grid-column: 4 / span 1;
  grid-row: 3 / span 1;
  background-color: #341e6f;
`;

function Plane({ position }) {
  return (
    <mesh receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color="#222429" />
    </mesh>
  );
}

function Box({ mouse, x, y, factor }) {
  return (
    <a.mesh
      position={interpolate([mouse], mouse => [
        (-mouse[0] * factor) / 50000 - x,
        (mouse[1] * factor) / 50000 - y,
        1
      ])}
      castShadow
      receiveShadow
    >
      <sphereGeometry attach="geometry" args={[2.25, 20, 20]} />
      <meshLambertMaterial attach="material" color="#222429" refractionRatio={0.95}/>
    </a.mesh>
  );
}

function Scene({ mouse }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <spotLight
        intensity={0.65}
        position={[-80, 60, 30]}
        angle={0.6}
        penumbra={0.796}
        castShadow
      />
      <Box mouse={mouse} x={0} y={-5.5} factor={40}/>
      <Box mouse={mouse} x={0} y={0} factor={40}/>
      <Box mouse={mouse} x={0} y={5.5} factor={40}/>
      <Plane position={[0, 0, -10]} />
    </>
  );
}

function TriangleX({ mouse, x, y, factor }) {
  return (
    <a.mesh
      position={interpolate([mouse], mouse => [
        (-mouse[0] * factor) / 50000 - x,
        (mouse[1] * factor) / 50000 - y,
        1
      ])}
      castShadow
      receiveShadow
    >
      <pyramidGeometry attach="geometry" args={[2.25, 20, 20]} />
      <meshLambertMaterial attach="material" color="#222429" refractionRatio={0.95}/>
    </a.mesh>
  );
}

function Scene2({ mouse }) {
  return (
    <>
      <ambientLight intensity={1.1} />
      <spotLight
        intensity={0.65}
        position={[-80, 60, 30]}
        angle={0.6}
        penumbra={0.796}
        castShadow
      />
      <Box mouse={mouse} x={0} y={-5.5} factor={40}/>
      <Box mouse={mouse} x={0} y={5.5} factor={40}/>
      <Plane position={[0, 0, -10]} />
    </>
  );
}

function App() {
  const [{ mouse }, set] = useSpring(() => ({ mouse: [0, 0] }));
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }),
    []
  );
  return (
    <FullPage onMouseMove={onMouseMove}>
      <GlobalStyle />
      <Text>
        <p>
      we’re a creative studio who specializes on
inspiring digital strategies and experiences</p>
      </Text>
      <ThreeFull>
        <Canvas
          camera={{ position: [0, 0, 15] }}
          onCreated={({ gl }) => (
            (gl.shadowMap.enabled = true),
            (gl.shadowMap.type = THREE.PCFSoftShadowMap)
          )}
        >
          <Scene mouse={mouse} />
        </Canvas>
      </ThreeFull>
      <Block1 />
      <ThreeBlock>
      <Canvas
          camera={{ position: [0, 0, 15] }}
          onCreated={({ gl }) => (
            (gl.shadowMap.enabled = true),
            (gl.shadowMap.type = THREE.PCFSoftShadowMap)
          )}
        >
          <Scene2 mouse={mouse} />
        </Canvas>
      </ThreeBlock>
      <Block2 />
      <Block3 />
    </FullPage >
  );
}

export default App;
