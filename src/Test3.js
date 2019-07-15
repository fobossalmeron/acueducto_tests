import React from "react";
import { useSpring, animated } from 'react-spring'
import styled, { createGlobalStyle, keyframes } from "styled-components/macro";
import bg from "./assets/img/bg.svg";
import { ReactComponent as Front } from "./assets/img/front.svg";

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

const moveBackground = keyframes`
  0% {
		-webkit-transform: translate3d(0px, 0px, 0px);
	}
	100% { 
		-webkit-transform: translate3d(1000px, 0px, 0px);
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
  border: 1px solid #fff;
  margin: 24px;
  width: calc(100% - 48px);
  height: calc(100% - 48px);
  box-sizing: border-box;
  z-index: 5;
  pointer-events: none;
`;

const Logo = styled.div`
  position: absolute;
  margin: 50px 70px;
  left: 0;
  top: 0;
  ::after {
    content: "acueducto";
    color:white;
    font-weight: 900;
    font-size: 1.4rem;
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

const Container = styled(animated.div)`
position:absolute;
width:100%;
height:100vh;
z-index: 0;
`;

const BackgroundMoving = styled(animated.div)`
  width: 150%;
  height: 150%;
  background: transparent url(${bg}) repeat;
  background-size: 250px;
  position: absolute;
  transform-origin:50% 50%;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
  /*animation: ${moveBackground} 15s linear infinite;*/
`;

const ForegroundShape = styled(Front)`
  position: absolute;
  height: 130vh;
  width: auto;
  top: -15%;
  left: -10%;
  z-index: 1;
  filter: drop-shadow(0px 20px 14px rgba(0, 0, 0, 0.4));
`;

const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
const trans1 = (x, y) => `translate3d(${x / 6}px,${y / 6}px,0)`
const trans2 = (x, y) => `translateX(${x / 10}px) rotate(${(y+x)/30}deg)`

function App() {
  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 2, tension: 200, friction: 50 }
  }));

  return (
    <FullPage
      onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}
    >
      <GlobalStyle />
      <Frame id="Frame" />
      <BackgroundMoving style={{ transform: props.xy.interpolate(trans2)}}/>

      <Container style={{ transform: props.xy.interpolate(trans1) }}>
      <ForegroundShape/>

      </Container>
      <Text>
        <Logo />
        <p>
          we’re a creative studio who specializes on inspiring digital
          strategies and experiences
        </p>
      </Text>
    </FullPage>
  );
}

export default App;
