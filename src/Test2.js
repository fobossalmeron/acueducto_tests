import * as THREE from "three";
import React, { useCallback, useEffect, useState } from "react";
import { useSpring, a, interpolate } from "react-spring/three";
import { animated } from "react-spring";
import { Canvas } from "react-three-fiber";
import styled, { createGlobalStyle } from "styled-components/macro";
import flat from "lodash-es/flatten";
import { SVGLoader } from "./resources/SVGLoader";
import LogoSVG from "./resources/logo.svg";

const deg = THREE.Math.degToRad;
const loaders = new Promise(res =>
  new SVGLoader().load(LogoSVG, shapes =>
    res(
      flat(
        shapes.map((group, index) =>
          group
            .toShapes(true)
            .map(shape => ({ shape, color: group.color, index }))
        )
      )
    )
  )
);

const GlobalStyle = createGlobalStyle`
  canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    pointer-events: none;
    overflow: hidden;
  }
  body{
    background-color: black;
  }
`;

const AllPages = styled.div`
  width: 100%;
  height: 300vh;
`;

const FullPage = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  position: relative;
  box-sizing: border-box;
  background-color: #f4f4f4;
  cursor: none;
  ::after {
    content: " ";
    position: fixed;
    margin: 24px;
    width: calc(100% - 48px);
    height: calc(100% - 48px);
    border: 1px solid #fff;
    box-sizing: border-box;
    z-index: 5;
    pointer-events: none;
    mix-blend-mode: difference;
  }
`;

const Logo = styled.div`
  position: fixed;
  margin: 50px 70px;
  left: 0;
  top: 0;
  ::after {
    content: "acueducto";
    color: white;
    font-weight: 900;
    font-size: 1.5rem;
  }
`;

const Text = styled.div`
  padding: 80px;
  grid-column: 1 / span 3;
  grid-row: 1 / span 3;
  font-size: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 4;
  p {
    max-width: 800px;
    display: flex;
    justify-self: center;
    color: white;
  }
`;

const ThreeFull = styled.div`
  grid-column: 1 / span 4;
  z-index: 3;
  grid-row: 1 / span 3;
  background-color: black;
  position: relative;
`;

function Graphic({ mouse, shapes, top }) {
  const extrudeSettings = {
    steps: 10,
    depth: 700,
    bevelEnabled: true,
    bevelThickness: 0,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 1
  };
  const extrudeSettings2 = {
    steps: 1,
    depth: 15,
    bevelEnabled: false,
    bevelThickness: 20,
    bevelSize: 10,
    bevelOffset: 0,
    bevelSegments: 1
  };
  const factor = 1000;
  const x = -60;
  const y = 30;
  const z = 0;
  const scaleFactor = 0.04;
  const reducer = 1;

  return (
    <a.group
      scale={interpolate([top], top => [
        scaleFactor + (top / reducer),
        scaleFactor + (top / reducer),
        scaleFactor + (top / reducer)
      ])}
      position={interpolate([mouse], mouse => [
        (-mouse[0] * factor) / 50000 + x,
        (mouse[1] * factor) / 50000 + y,
        z
      ])}
    >
      {shapes.map(({ shape }, key) => (
        <a.mesh key={key} rotation={[deg(0), deg(180), deg(180)]}>
          <meshStandardMaterial
            opacity={1}
            transparent
            attach="material"
            color={key === 0 ? "#080b0c" : "white"}
            roughness={0.73}
            side={THREE.DoubleSide}
            metalness={0.4}
          />
          <extrudeBufferGeometry
            attach="geometry"
            args={[shape, key === 0 ? extrudeSettings : extrudeSettings2]}
          />
        </a.mesh>
      ))}
    </a.group>
  );
}

function Cursor({ mouse }) {
  const pointLight2 = new THREE.PointLight();
  return (
    <a.group
      position={interpolate([mouse], mouse => [mouse[0] / 5, -mouse[1] / 5, 4])}
    >
      <primitive
        object={pointLight2}
        color={"white"}
        intensity={5}
        sphereSize={1}
        position={[0, 0, 0]}
      />
      <a.mesh position={[0, 0, 0]}>
        <sphereGeometry attach="geometry" args={[1, 20, 20]} />
        <meshLambertMaterial
          attach="material"
          color="white"
          refractionRatio={0.95}
        />
      </a.mesh>
    </a.group>
  );
}

function Scene({ mouse, top }) {
  const [shapes, setShape] = useState([]);
  useEffect(() => void loaders.then(setTheShape), []);

  function setTheShape() {
    void loaders.then(setShape);
  }
  const pointLight = new THREE.PointLight();

  return (
    <>
      <ambientLight intensity={1} sphereSize={1} color="white" />
      <spotLight intensity={0} position={[300, 300, 4000]} />
      <primitive
        object={pointLight}
        color={"#2f54b4"}
        intensity={25}
        position={[65, 2, 0]}
        sphereSize={1}
      />
      <Cursor mouse={mouse} />
      <Graphic mouse={mouse} shapes={shapes} top={top} />
    </>
  );
}

function App() {
  const [{ mouse }, set] = useSpring(() => ({ mouse: [0, 0] }));
  const [{ top }, setTop] = useSpring(() => ({ top: 0 }));

  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }),
    []
  );
  const onScroll = useCallback(
    e => setTop({ top: e.target.scrollTop }),
    []
  );
  return (
    <AllPages onScroll={onScroll}>
      <FullPage onMouseMove={onMouseMove}>
        <GlobalStyle />
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
            invalidateFrameloop
            camera={{
              position: [0, 0, 100]
            }}
          >
            <Scene mouse={mouse} top={top} />
          </Canvas>
        </ThreeFull>
      </FullPage>
    </AllPages>
  );
}

export default App;
