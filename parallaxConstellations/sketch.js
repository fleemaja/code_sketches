var stars = [];
var starsWithinMouseRadius = [];
var lines = [];
var mountains = [];
var sand;
var cactus;
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

  mountains.push(new Mountain(height - 20, height - 250, false));
  mountains.push(new Mountain(height - 20, height - 150, true));

  sand = new Sand(25);

  cactus = new Cactus(72);

  tree = new Tree();
  tree.create();
}

function draw() {

  setGradient(0, 0, width, height, c1, c2);

  stars.forEach(function(s) {
    s.show();
  });

  showLines();

  mountains.forEach(function(m) {
    m.show();
    m.update();
  });

  sand.show();

  cactus.update();
  cactus.show();

  tree.update();
  tree.show();
}

function mouseMoved() {
  getStarsWithinMouseRadius();
  lines = [];
  connectToNeighbors();
}

function showLines() {
  stroke(255);
  strokeWeight(0.25);
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
    branchRatio = 0.63;
    rootSize = random(24, 42);
    rootLength = random(70, 140);
    var a = createVector(width + 200, height);
    var b = createVector(width + 200, height - rootLength);
    var root = new Branch(a, b, rootSize);
    branches = [];
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

  this.update = function() {
    if (branches[0].begin.x < -200) {
      this.create();
    } else {
      branches[0].begin.x -= 4;
      branches.forEach(function(b) {
        b.end.x -= 4;
      });
    }
  }
}

function Star() {
  this.x = random(-50, width + 50);
  this.y = random(-50, height + 50);
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
    noStroke();
    rect(0, height - this.h, width, this.h);
  }
}

function Mountain(minY, maxY, lightColor) {
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

  this.update = function() {
    // get rid of constant edge vertices and previous 'first' element
    innerVerts = this.vertices.slice(1, -1);
    // shift x value of all vertices by 7 (value chosen to space x values)
    innerVerts = innerVerts.map(function(vert) {
      return [vert[0] - 1, vert[1]];
    });
    // clear vertices
    this.vertices = [];
    // add 'left' closing vertex
    this.vertices.push([0, height]);
    // add shifted vertices
    this.vertices.concat(innerVerts);
    var that = this;
    innerVerts.forEach(function(vert) {
      that.vertices.push(vert);
    });
    // every seventh frame add a new vertex
    if (frameCount % 7 == 0) {
      this.vertices.splice(2, 1);
      var y = map(noise(this.xoff, this.yoff), 0, 1, minY, maxY);
      this.vertices.push([width + 7, y]);
      this.xoff += 0.05;
    }
    // add 'right' closing vertex
    this.vertices.push([width, height]);
  }

  this.show = function() {
    // draw a mountain polygon across the width of the screen with perlin noise determined y values
    noStroke();
    if (lightColor) {
      fill(93, 28, 26);
    } else {
      fill(64, 19, 12);
    }
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

function Cactus(h) {
  this.h = h;
  this.w = this.h/4;
  this.x = width - 111;
  this.y = height - this.h - random(sand.h);
  this.big = this.h/4;
  this.small = 3*this.w/4;

  this.update = function() {
    if (this.x < -331) {
      this.x = width + 331;
    } else {
      this.x -= 4;
    }
  }

  this.show = function() {
    fill(0);
    push();
    // rectMode(CENTER);
    translate(this.x, this.y);
    // root
    rect(0, 0, this.w, this.h, this.w, this.w, 0, 0);
    // left horizontal
    rect(-this.big, (this.h/2) - this.small/2, this.big, this.small, 0, 0, 0, this.small);
    // left vertical
    rect(-this.big, (this.h/2) - this.small/2 - this.big, this.small, this.big, this.small, this.small, 0, 0);

    // right horizontal
    rect(this.w, this.h/2 + this.small/2, this.big, this.small, 0, 0, this.small, 0);
    // right vertical
    rect(this.big + this.w - this.small, this.h/2 + this.small/2 - this.big, this.small, this.big, this.small, this.small, 0, 0);
    // rect(, (this.h/2) - this.small/2 - this.big, this.small, this.big);
    pop();
  }
}
