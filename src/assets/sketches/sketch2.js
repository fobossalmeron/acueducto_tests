

import p5 from "p5";
export default function sketch(p) {
  let shad, graph;
  const colors = ["#cc2e44", "#2f54b4", "#080b0c","#080b0c","#080b0c", "#080b0c"];
  //#cc es rojo #2f es azul
  const grid = 40;

  var vert=`
  // our vertex data
  attribute vec3 aPosition;
  attribute vec2 aTexCoord;
  
  // lets get texcoords just for fun! 
  varying vec2 vTexCoord;
  
  void main() {
    // copy the texcoords
    vTexCoord = aTexCoord;
  
    // copy the position data into a vec4, using 1.0 as the w component
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  
    // send the vertex information on to the fragment shader
    gl_Position = positionVec4;
  }
  `;
  
  var frag=`
  precision mediump float;
  
  // texcoords from the vertex shader
  varying vec2 vTexCoord;
  uniform float iTime;
  
  
  // --- Perlin noise by inigo quilez - iq/2013   https://www.shadertoy.com/view/XdXGW8
  vec2 hash( vec2 x )  // replace this by something better
  {
      const vec2 k = vec2( 0.3183099, 0.3678794 );
      x = x*k + k.yx;
      return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );
  }
  
  float noise( in vec2 p )
  {
      vec2 i = floor( p );
      vec2 f = fract( p );
    
      vec2 u = f*f*(3.0-2.0*f);
  
      return mix( mix( dot( hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                       dot( hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                  mix( dot( hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                       dot( hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
  }
  
  // -----------------------------------------------
  
  void main()
  {
    vec2 uv = vTexCoord;
    float f = noise( 32.0*uv+iTime )*0.5+0.5;
    gl_FragColor = vec4( f, f, f, 1.0 );
  }
  `

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    graph = p.createGraphics(p.windowWidth, p.windowHeight, p.WEBGL);
    graph.pixelDensity(1);
    graph.noStroke();
    shad = new p5.Shader(graph._renderer, vert, frag);
    p.pixelDensity(1);
    p.noStroke();
  }
  
  p.draw = function() {
    p.background(255);
    graph.shader(shad);
    shad.setUniform('iTime', p.millis()/2000);
    graph.rect(0, 0, p.width, p.height);
    p.image(graph, 0, 0, p.width, p.height);
    graph.loadPixels();
    let g = p.floor(p.map(p.mouseX, 0, p.width, 10, grid));
    for(let x=0; x<p.width; x+=g){
      for(let y=0; y<p.height; y+=g){
        let index = (x + (p.height-1-y) * p.width) * 4;
        let red = graph.pixels[index];
        let color = colors[p.floor(p.map(red, 60, 160, 0, colors.length-1, true))];
        p.fill(color);
        p.rect(x, y, g, g);
      }
    }
  }
}
