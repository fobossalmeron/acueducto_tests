import React, { useState } from "react";
//import { useSpring, animated } from "react-spring";
import styled, { createGlobalStyle } from "styled-components/macro";
import { ReactComponent as logo } from "./assets/img/logo.svg";
import P5Wrapper from "react-p5-wrapper";
import original from "./assets/sketches/original";
import pixels from "./assets/sketches/pixels";
import ajustemovimiento from "./assets/sketches/ajustemovimiento";
import sinpatron from "./assets/sketches/sinpatron";
import combinacion from "./assets/sketches/combinacion";
import sketch5 from "./assets/sketches/sketch5";


const GlobalStyle = createGlobalStyle`
body{
  overflow-x:hidden;
  width:100%;
  @import url('https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap');
  font-family: 'Acumin Pro Wide', sans-serif;
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
  pointer-events: auto;
  cursor: pointer;
`;

const Info = styled.p`
position:absolute;
bottom:0;
right:20px;
z-index:12;
color:white;
`;

const Text = styled.div`
  padding: 70px 12%;
  z-index: 10;
  color: #f4f4f4;
  grid-column: 1 / span 3;
  grid-row: 1 / span 2;
  align-self: flex-end;
  h2 {
    max-width: 760px;
    font-weight: 100;
    display: flex;
    justify-self: center;
    font-size: 3.7rem;
    margin:0;
  }
  p{
    font-size: 1.7rem;
    max-width: 530px;
    margin: 15px 0 0 0;
  }
`;

// const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
// const trans1 = (x, y) => `translate3d(${x / 6}px,${y / 6}px,0)`;
// const trans2 = (x, y) => `translateX(${x / 10}px) rotate(${(y + x) / 30}deg)`;

function App() {
  // const [props, set] = useSpring(() => ({
  //   xy: [0, 0],
  //   config: { mass: 2, tension: 200, friction: 50 }
  // }));
  const [loadedSketch, setSketch] = useState(2);
  const [sketchIndex, setSketchIndex] = useState(2);


  const sketches = [ sinpatron, ajustemovimiento, combinacion, sketch5];
  const sketchesNames = [ "Sin Patron", "Ajuste Movimiento", "Combinacion", "Sin Textura Randomizado"];

  const nextSketch = () => {
    console.log("next sketch")
    var _i = loadedSketch;
    _i++;
    if(_i>= sketches.length){
      _i = 0;
    }
    setSketch(_i)
    setSketchIndex(_i)
  }
  return (
    <FullPage
    >
      <FixedHeader>
        <Logo onClick={() => nextSketch()}/>
        <Info>{sketchesNames[sketchIndex]}</Info>
      </FixedHeader>
      <GlobalStyle />
      <SketchContainer>
        <P5Wrapper sketch={sketches[loadedSketch]} id="Frame" />
      </SketchContainer>
      <Text>
        <h2>we are a strategic desgin & development studio</h2>
        <p>We partner with innovators around the globe to develop experiences that tell stories, inspire communities and build meaningful bonds</p>
      </Text>
    </FullPage>
  );
}

export default App;
