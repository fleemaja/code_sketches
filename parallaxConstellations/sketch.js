var stars = [];
var mountain;
var sand;
// Sky Gradient Constants
var c1; var c2;

function setup() {
  var cHeight = innerHeight;
  if (cHeight < 500) {
    cHeight = 500;
  }
  createCanvas(innerWidth, cHeight);
  background(15);

  // Define sky colors
  c1 = color(59,18,97);
  c2 = color(175);

  for (var i = 0; i < 500; i++) {
    stars[i] = new Star();
  }

  mountain = new Mountain(height - 50, height - 200);

  sand = new Sand(15);
}

function draw() {

  setGradient(0, 0, width, height, c1, c2);

  stars.forEach(function(s) {
    s.show();
  });

  mountain.show();

  sand.show();
}

function Star() {
  this.x = random(0, width);
  this.y = random(0, height);
  this.r = random(1, 3);

  this.show = function() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
  }
}

function Sand(h) {
  this.h = h;

  this.show = function() {
    fill(203, 139, 113);
    rect(0, height - this.h, width, this.h);
  }
}

function Mountain(minY, maxY) {
  this.yoff = random(1000);
  this.xoff = 0;
  this.fill = 0;
  this.vertices = [];

  this.vertices.push([0, height]);
    for (var x = 0; x < width + 7; x += 7) {
      var y = map(noise(this.xoff, this.yoff), 0, 1, minY, maxY);
      this.vertices.push([x, y]);
      this.xoff += 0.05;
    }
  this.vertices.push([width, height]);

  this.show = function() {
    // draw a mountain polygon across the width of the screen with perlin noise determined y values
    noStroke();
    fill(46, 21, 18);
    beginShape();
    this.vertices.forEach(function(vert) {
      vertex(vert[0], vert[1]);
    })
    endShape(CLOSE);
  }
}

// for background gradient
function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (var i = y; i <= y+h; i++) {
    var inter = map(i, y, y+h, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x+w, i);
  }
}
