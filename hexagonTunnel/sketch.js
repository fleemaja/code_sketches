var hexagons = [];
var from;
var to;
var startSize = 4;

function setup() {
  var iHeight = constrain(window.innerHeight, 500, 900);
  var iWidth = constrain(window.innerWidth, 500, 1200);

  createCanvas(iWidth, iHeight);

  drawingContext.shadowBlur = 50;
  drawingContext.shadowColor = 'black';

  from = color(55, 55, 55, 5);
  to = color(179, 255, 200, 0.9 * 255);

  var hexSize = startSize;
  var hexNum = 1;
  while (hexSize < width) {
    hexagons.push(new Hexagon(hexSize, hexNum));
    // hexSize += 50;
    var mult = map(hexSize, startSize, width, 1.13, 1.5);
    hexSize *= mult;
    hexNum += 3;
  }
}

function draw() {
  background(51);

  hexagons.forEach(function(h) {
    h.render();
    h.update();
  });
}

function Hexagon(size, rotation) {
  this.size = size;
  this.rotation = rotation;
  this.color = lerpColor(from, to, 0);
}

Hexagon.prototype.update = function() {
  if (this.size > width) {
    this.size = startSize;
  }

  var mult = map(this.size, startSize, width, 1.005, 1.018);
  this.size *= mult;
  var col = map(this.size, startSize, width/2, 0, 1);
  this.color = lerpColor(from, to, col);
  this.rotation += 0.004;
}

Hexagon.prototype.render = function() {
  noFill();
  strokeWeight(this.size * 0.3);
  stroke(this.color);
  push();
  translate(width * 0.5, height * 0.5);
  rotate(this.rotation);
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
