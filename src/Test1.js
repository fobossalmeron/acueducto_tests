import * as THREE from "three";
import React, { useCallback, set, useEffect } from "react";
import { useSpring, a, interpolate } from "react-spring/three";
import { animated } from "react-spring";
import { Canvas } from "react-three-fiber";
import styled, { createGlobalStyle } from "styled-components/macro";

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
    display:none;
    content: " ";
    position: absolute;
    margin: 24px;
    width: calc(100% - 48px);
    height: calc(100% - 48px);
    border: 2px solid #fff;
    box-sizing: border-box;
    z-index: 5;
    pointer-events: none;
    mix-blend-mode: difference;
    /*filter: grayscale(1) contrast(10) invert(1);*/
  }
`;

const Frame = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  z-index: 10;
  &:before{
    content: ' ';
    border: 2px solid #fff;
    mix-blend-mode: difference;

  }
    margin: 24px;
    width: calc(100% - 48px); 
    height: calc(100% - 48px);
    box-sizing: border-box;
    z-index: 5;
    pointer-events: none;
    /*filter: grayscale(1) contrast(10) invert(1);*/
`;

const Logo = styled.div`
  position: absolute;
  margin: 50px 70px;
  left: 0;
  top: 0;
  ::after {
    content: "acueducto";
    font-weight: 900;
    font-size: 1.5rem;
  }
`;

const Text = styled.div`
  padding: 80px;
  grid-column: 1 / span 3;
  grid-row: 1 / span 2;
  background-color: #f4f4f4;
  font-size: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    max-width: 800px;
    display: flex;
    justify-self: center;
  }
`;

const ThreeFull = styled.div`
  grid-column: 4 / span 1;
  z-index: 3;
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

function Plane({ position, color }) {
  return (
    <mesh receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color={color} />
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
      <meshLambertMaterial
        attach="material"
        color="#222429"
        refractionRatio={0.95}
      />
    </a.mesh>
  );
}

function Scene({ mouse }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <spotLight
        intensity={0.75}
        position={[-80, 60, 30]}
        angle={0.6}
        penumbra={0.796}
        castShadow
      />
      <Box mouse={mouse} x={0} y={-5.5} factor={70} />
      <Box mouse={mouse} x={0} y={0} factor={55} />
      <Box mouse={mouse} x={0} y={5.5} factor={40} />
      <Plane position={[0, 0, -10]} color={"#222429"} />
    </>
  );
}

function Torus({ mouse, x, y, factor }) {
  return (
    <a.mesh
      position={interpolate([mouse], mouse => [
        (-mouse[0] * factor) / 50000 + x,
        (mouse[1] * factor) / 50000 + y,
        1
      ])}
      castShadow
      receiveShadow
    >
      <torusGeometry attach="geometry" args={[30, 8, 16, 100]} />
      <meshLambertMaterial
        attach="material"
        color="#fe5430"
        refractionRatio={0}
      />
    </a.mesh>
  );
}

function Pyramid({ mouse, x, y, factor }) {
  var radius = 4;
  var height = 5;
  return (
    <a.mesh
      position={interpolate([mouse], mouse => [
        (-mouse[0] * factor) / 50000 + x,
        (mouse[1] * factor) / 50000 + y,
        1
      ])}
      castShadow
      receiveShadow
    >
      <cylinderGeometry attach="geometry" args={[0, radius, height, 4, 1]} />
      <meshLambertMaterial
        attach="material"
        color="#fe5430"
        refractionRatio={0}
      />
    </a.mesh>
  );
}

function Pyramid2({ mouse, x, y, z, factor, rotation }) {
  var radius = 6.4;
  var height = 11;
  var radialSegments = 3;
  var heightSegments = 0;
  var openEnded = false;
  var thetaStart = 0;
  var thetaLength = 6.3;
  return (
    <a.mesh
      position={interpolate([mouse], mouse => [
        (-mouse[0] * factor) / 50000 + x,
        (mouse[1] * factor) / 50000 + y,
        z
      ])}
      rotation={rotation}
      castShadow
    >
      <coneGeometry
        attach="geometry"
        args={[
          radius,
          height,
          radialSegments,
          heightSegments,
          openEnded,
          thetaStart,
          thetaLength
        ]}
      />
      <meshStandardMaterial
        opacity={1}
        transparent
        attach="material"
        color="#ff562d"
        roughness={0.73}
        metalness={0.4}
      />
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
      <Torus mouse={mouse} x={30} y={0} factor={90} />
      <Plane position={[0, 0, -10]} color={"#2c365b"} />
    </>
  );
}

function Scene3({ mouse }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <spotLight
        intensity={1.65}
        position={[-80, 60, 30]}
        angle={1}
        penumbra={1}
        castShadow
      />
      <spotLight
        intensity={2.65}
        position={[80, 60, 20]}
        color={"#4c3b5e"}
        angle={1}
        penumbra={0.2}
        castShadow
      />
      <Pyramid2
        mouse={mouse}
        x={5}
        y={0}
        z={-2}
        factor={150}
        rotation={[4, 1, 6]}
      />
      <Pyramid2
        mouse={mouse}
        x={-6.5}
        y={-4}
        z={7}
        factor={60}
        rotation={[8, 8.6, 5.9]}
      />
      <Plane position={[0, 0, -10]} color={"#2c365b"} />
    </>
  );
}

const trans1 = (x, y) => `translate3d(${x / 10}px,${y / 10}px,0)`;

function App() {
  const [{ mouse }, set] = useSpring(() => ({ mouse: [0, 0] }));
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }),
    []
  );
  useEffect(() => {
    document.getElementById("Frame").style.filter = "grayscale(1)";
    console.log("pasó el efecto");
  });

  return (
    <FullPage onMouseMove={onMouseMove}>
      <GlobalStyle />
      <Frame id="Frame"/>
      <Text>
        <Logo />
        <animated.p
          style={{
            transform: mouse.interpolate(
              (x, y) => `translate3d(${x / 10}px,${y / 10}px,0)`
            )
          }}
        >
          we’re a creative studio who specializes on inspiring digital
          strategies and experiences
        </animated.p>
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
    </FullPage>
  );
}

export default App;
