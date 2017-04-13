var polygons = [];
var from;
var to;
var startSize = 4;
var strokeSize = 0.33;
var polygonPoints = 6;

function setup() {
  var iHeight = constrain(window.innerHeight, 500, 900);
  var iWidth = constrain(window.innerWidth, 500, 1200);

  createCanvas(iWidth, iHeight);

  drawingContext.shadowBlur = 50;
  drawingContext.shadowColor = 'black';

  // dark interpolated color
  from = color(55, 55, 55, 0);
  chooseColor();

  var colourPick = select('#base');
  var stroke = select('#stroke');
  var points = select('#points');

  colourPick.changed(chooseColor);
  stroke.changed(chooseStroke);
  points.changed(choosePoly);

  setupPolygons();
}

function choosePoly() {
  polygonPoints = select('#points').value();
}

function chooseStroke() {
  strokeSize = select('#stroke').value();
}

function chooseColor() {
  var colour = select('#base').value();
  colour = hexToRgb(colour);

  to = color(colour.r, colour.g, colour.b);
}

function setupPolygons() {
  var polySize = startSize;
  var polyRot = 1;
  var polyId = 0;
  while (polySize < width) {
    polygons.push(new Polygon(polySize, polyRot, polyId));
    // hexSize += 50;
    var mult = map(polySize, startSize, width, 1.13, 1.5);
    polySize *= mult;
    polyRot += 4;
    polyId += 1;
  }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function mousePressed() {
    console.log("first: " + polygons[0].rotation + ", last: " + polygons[polygons.length - 1].rotation);
}

function draw() {
  background(51);

  polygons.forEach(function(p) {
    p.render();
    p.update();
  });
}

function Polygon(size, rotation) {
  this.size = size;
  this.rotation = rotation;
  this.color = lerpColor(from, to, 0);
}

Polygon.prototype.update = function() {
  if (this.size > (width * 1.5)) {
    this.size = startSize;
    // this.rotation = 0;
  }

  var mult = map(this.size, startSize, width, 1.005, 1.018);
  this.size *= mult;
  var col = map(this.size, startSize, width/2, 0, 1);
  this.color = lerpColor(from, to, col);
  this.rotation += 0.004;
}

Polygon.prototype.render = function() {
  noFill();
  strokeWeight(this.size * strokeSize);
  stroke(this.color);
  push();
  translate(width * 0.5, height * 0.47);
  rotate(this.rotation);
  polygon(0, 0, this.size, polygonPoints);
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
