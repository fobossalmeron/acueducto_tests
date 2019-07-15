export default function sketch(p) {
    var step = 30;
    var offset = 30;

    p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight); 
      p.colorMode(p.HSB, 360, 100, 100); 
      //p.frameRate(2);
    }

    p.draw = function() {
      p.randomSeed(1);
      p.fill(0, 0, 100, 40);
      for (var y = -offset; y <= p.height+offset; y = y + p.map(y,-offset,p.height+offset,step*2,step/2)) {
        p.stroke(0, 0, 100);
        p.strokeWeight(3);
        p.fill(0);
        p.beginShape();
        for (var x = -offset; x <= p.width+offset; x = x + step) {
          var n = p.noise(y*0.1, x*0.001, (y+p.frameCount)*0.005);
          n = p.map(n, 0, 1, -p.height/3, p.height/3);
          var y2 = y + n;
          p.vertex(x, y2);
        }
        p.vertex(p.width+offset, p.height+offset);
        p.vertex(-offset, p.height+offset);
        p.endShape(p.CLOSE);
      }
    }
}
