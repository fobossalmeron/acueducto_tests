import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import styled, { createGlobalStyle, keyframes } from "styled-components/macro";
import { ReactComponent as logo } from "./assets/img/logo.svg";
import P5Wrapper from "react-p5-wrapper";
import sketch0 from "./assets/sketches/sketch2";
import sketch1 from "./assets/sketches/sketch1";
import sketch2 from "./assets/sketches/sketch3";

const GlobalStyle = createGlobalStyle`
body{
  overflow-x:hidden;
  width:100%;
}
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
    display: none;
    content: " ";
    position: absolute;
    margin: 20px;
    width: calc(100% - 44px);
    height: calc(100% - 44px);
    border: 2px solid #fff;
    box-sizing: border-box;
    z-index: 5;
    pointer-events: none;
    mix-blend-mode: difference;
  }
`;

const FixedHeader = styled.div`
  content: " ";
  position: absolute;
  margin: 24px;
  width: calc(100% - 48px);
  height: calc(100% - 48px);
  border: 2px solid #fff;
  box-sizing: border-box;
  z-index: 10;
  pointer-events: none;
  mix-blend-mode: difference;
`;

// Contenedor del Sketch
const SketchContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  z-index: 10;
  z-index: 0;
  pointer-events: none;
`;

const Logo = styled(logo)`
  position: absolute;
  margin: 35px 45px;
  left: 0;
  top: 0;
  max-width: 160px;
`;

const Text = styled.div`
  padding: 70px;
  z-index: 10;
  color: #f4f4f4;
  grid-column: 1 / span 3;
  grid-row: 1 / span 2;
  font-size: 3.1rem;
  font-weight: normal;
  align-self: flex-end;
  p {
    max-width: 800px;
    display: flex;
    justify-self: center;
  }
`;

const Container = styled(animated.div)`
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 0;
`;

const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
const trans1 = (x, y) => `translate3d(${x / 6}px,${y / 6}px,0)`;
const trans2 = (x, y) => `translateX(${x / 10}px) rotate(${(y + x) / 30}deg)`;

function App() {
  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 2, tension: 200, friction: 50 }
  }));
  const [loadedSketch, setSketch] = useState(1);

  const sketches = [sketch0, sketch1, sketch2];

  return (
    <FullPage
      onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}
    >
      <FixedHeader>
        <Logo />
      </FixedHeader>
      <GlobalStyle />
      <SketchContainer>
        <P5Wrapper sketch={sketches[loadedSketch]} id="Frame" />
      </SketchContainer>
      <Text>
        <p>we are a strategic desgin & creative digital studio</p>
        <button onClick={() => setSketch(1)}>Sketch1</button>
        <button onClick={() => setSketch(0)}>Sketch2</button>
        <button onClick={() => setSketch(2)}>Sketch3</button>

      </Text>
    </FullPage>
  );
}

export default App;
