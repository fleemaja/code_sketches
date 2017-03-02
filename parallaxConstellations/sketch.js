var stars = [];
var starsWithinMouseRadius = [];
var lines = [];
var mountain;
var sand;
// tree variables
var tree;
var branches = [];
var branchRatio = 0.63;
var rootSize = 36;
var rootLength = 120;
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
  c1 = color(59,18,62);
  c2 = color(165);

  var numStars = innerWidth/2;
  for (var i = 0; i < numStars; i++) {
    stars[i] = new Star();
  }

  mountain = new Mountain(height - 50, height - 200);

  sand = new Sand(25);

  tree = new Tree();
  tree.create();
}

function draw() {

  setGradient(0, 0, width, height, c1, c2);

  stars.forEach(function(s) {
    s.show();
  });

  showLines();

  mountain.show();
  sand.show();
  tree.show();
}

function mouseMoved() {
  getStarsWithinMouseRadius();
  lines = [];
  connectToNeighbors();
}

function showLines() {
  stroke(255);
  strokeWeight(0.15);
  lines.forEach(function(l) {
    line(l[0], l[1], l[2], l[3]);
  });
}

function connectToNeighbors() {
  starsWithinMouseRadius.forEach(function(s1) {
    starsWithinMouseRadius.forEach(function(s2) {
      if (abs(s1.x - s2.x) < 50 && abs(s1.y - s2.y) < 50) {
        lines.push([s1.x, s1.y, s2.x, s2.y]);
      }
    });
  })
}

function getStarsWithinMouseRadius() {
  starsWithinMouseRadius = stars.filter(function(s) {
    return (
      s.x > mouseX - 120 && s.x < mouseX + 120
      && s.y > mouseY - 120 && s.y < mouseY + 120
    );
  })
}

function Tree() {
  this.create = function() {
    var a = createVector(width * 0.61, height);
    var b = createVector(width * 0.61, height - rootLength);
    var root = new Branch(a, b, rootSize);

    branches[0] = root;

    for (var b = 0; b < 6; b++) {
      this.addBranches();
    }
  }

  this.addBranches = function() {
    for (var i = branches.length - 1; i >= 0; i--) {
      if (!branches[i].finished) {
        branches.push(branches[i].branchA());
        branches.push(branches[i].branchB());
      }
      branches[i].finished = true;
    }
  }

  this.show = function() {
    for (var i = 0; i < branches.length; i++) {
      branches[i].show();
    }
  }
}

function Star() {
  this.x = random(0, width);
  this.y = random(0, height);
  this.r = random(1, 3);

  this.show = function() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
    // if (starsWithinMouseRadius.includes(this)) {
    // }
  }
}

function Sand(h) {
  this.h = h;

  this.show = function() {
    fill(111, 73, 67);
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
    fill(93, 28, 26);
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

function Branch(begin, end, size) {
  this.begin = begin;
  this.end = end;
  this.finished = false;
  this.size = size;

  this.show = function() {
    stroke(23, 6, 10);
    strokeWeight(this.size);
    line(this.begin.x, this.begin.y, this.end.x, this.end.y);
  }

  this.branchA = function() {
    var dir = p5.Vector.sub(this.end, this.begin);
    dir.rotate(random(PI/6, PI/9));
    dir.mult(branchRatio);
    var newEnd = p5.Vector.add(this.end, dir);
    var b = new Branch(this.end, newEnd, this.size * branchRatio);
    return b;
  }
  this.branchB = function() {
    var dir = p5.Vector.sub(this.end, this.begin);
    dir.rotate(-PI / 4);
    dir.mult(branchRatio);
    var newEnd = p5.Vector.add(this.end, dir);
    var b = new Branch(this.end, newEnd, this.size * branchRatio);
    return b;
  }
}
