import p5 from "p5";
export default function sketch(p) {
  var noctaves, c, LDShader;
  //var gl;
  var frag = `

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;
uniform int noctaves;
uniform float c[22];
float mousefactor;

float noise( in vec2 x )
{
	return sin(0.8*x.x)*sin(0.9*x.y);
}

const mat2 rot = mat2( 0.80,  0.6, -0.6,  0.8 );
float fbm ( in vec2 _st) {
    float v = 4.0;
    float a = 2.9;
    vec2 shift = 100.0*vec2(c[11],c[12]);
    for (int i = 0; i < 12; ++i) {//noprotect
		if(i>=noctaves)break;
        v += a * noise(_st);
        _st = rot*_st* 2.0 + shift;
        a *= -0.4;
    }
    return v;
}

void main() {
		vec2 mouse=iMouse/iResolution;
    vec2 st =(-iResolution.xy+2.0*gl_FragCoord.xy)/iResolution.y;//(gl_FragCoord.xy/iResolution.xy);//
    vec3 color = vec3(0.149, 0.035, 0.827);
    vec2 q = vec2(1.);
    q.x = fbm( st+vec2(c[1],c[20]*0.01*iTime) );
    q.y = fbm( st+vec2(c[2],c[6]) );
    vec2 r = vec2(1.);

//play with the values here!
r.x = fbm( st+ (5.0*mouse.x+0.4)*q+vec2(c[5],c[6]));
r.y = fbm( st+ (1.0*mouse.y+0.1)*q*sin(.01*iTime)+vec2(c[8]*.05*iTime,c[9]));
float f = fbm(st+c[1]*(r+length(q) ));
color = smoothstep(vec3(0.247, 1.035, -0.127),vec3(0.127, 0.035, -0.117),color);
color = mix(color,vec3(-0.16,-0.05*(cos(10.1*iTime)),-0.958),r.y+length(q));// verde
color = mix(color,vec3(-1.1*sin(10.1*iTime),-10.0,3.1*cos(-10.13*iTime)),length(r+q));//.2+.2*(1.0+cos(0.5+.3*iTime)) //no mover los del tiempo //mover el primer time a 0.1
color = mix(color, vec3(0.121, -0.935, -9.184), dot(r,r) );
//color = smoothstep(vec3(0.827, 0.035, 0.152),vec3(0.184, 0.035, 0.827),color);
color*=(-0.5*f*f*f-1.2*f*f+-3.3*f);

//color+=.4*vec3(1.96+r.x,0.015+q);
//color=pow(color, vec3(.5));
//

    gl_FragColor = vec4(color,1.);
}

`;
  var vert = `
//standard vertex shader
#ifdef GL_ES
      precision mediump float;
    #endif
		#extension GL_OES_standard_derivatives : enable
    // attributes, in
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aTexCoord;
    attribute vec4 aVertexColor;

    // attributes, out
    varying vec3 var_vertPos;
    varying vec4 var_vertCol;
    varying vec3 var_vertNormal;
    varying vec2 var_vertTexCoord;
    
    // matrices
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat3 uNormalMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);

      // just passing things through
      var_vertPos      = aPosition;
      var_vertCol      = aVertexColor;
      var_vertNormal   = aNormal;
      var_vertTexCoord = aTexCoord;
    }
`;
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    //gl = this.canvas.getContext("webgl");
    //gl.disable(gl.DEPTH_LDShader);
    p.mouseX = p.width;
    p.mouseY = 1;
    noctaves = 5.5;
    c = [];
    c = [0, 2, 3, 4, -1, 3, 4, 0, -3, 3, -2, 2, 1, -2, 4, -4, 2, -2, 0, -1, -4, 1]
    //c = [2.557566094429557, -4.296410644670314, -3.878153787190912, 4.113294966369807, 4.194878482216399, -3.143719222093857, -3.6571718448449664, -3.581960007281053, -1.9680436900826193, 0.8420085737706806, -2.5445653181743544, -3.0780415497762714, -1.934072665962141, -1.274849027059144, -2.9806958019568697, 3.8084704316059526, -1.6879492717415423, -0.4146388134507113, -0.1793594902147122, 4.738002974789719, -2.8164652466472906, 1.867132640344174]
    //initc(); //randomize initial points
    LDShader = new p5.Shader(this._renderer, vert, frag); //load shaders
    p.shader(LDShader); //shaders are applied
  };
  function initc() {
    for (var i = 0; i < 22; i++) {
      c[i] = p.random(-5, 5);
      console.log(c)
    }
  }
  p.draw = function() {
    LDShader.setUniform("iResolution", [p.width, p.height]); //pass some values to the shader
    LDShader.setUniform("iTime", p.millis() * 0.001);
    LDShader.setUniform("iMouse", [p.mouseX, p.mouseY]);
    LDShader.setUniform("noctaves", noctaves); 
    LDShader.setUniform("c", c);
    p.shader(LDShader);
    p.box(p.width);
  };
   function mouseClicked() {
    initc();
   }
}

// Sketch adapted from Pierre Marzin
