var hexagons = [];

function setup() {
  var iHeight = constrain(window.innerHeight, 500, 900);
  var iWidth = constrain(window.innerWidth, 500, 1200);

  createCanvas(iWidth, iHeight);

  var hexSize = 3.125;
  while (hexSize < 500) {
    hexagons.push(new Hexagon(hexSize));
    hexSize *= 2;
  }
}

function draw() {
  background(51);
  hexagons.forEach(function(h) {
    h.render();
  });
}

function Hexagon(size) {
  this.size = size;
}

Hexagon.prototype.render = function() {
  noFill();
  strokeWeight(this.size / 4);
  stroke(179, 255, 200);
  push();
  translate(width * 0.5, height * 0.5);
  rotate(frameCount / this.size);
  polygon(0, 0, this.size, 6);
  pop();
}

function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
