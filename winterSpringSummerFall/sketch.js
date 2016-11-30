var mountains = [];
// branch size constants
var rootSize = 42;
var branchRatio = 0.67;
// gradient constants
var c1, c2;
// tree variables
var tree = [];
var leaves = [];
var count = 0;

function setup() {
  var cHeight = window.innerHeight;
  if (cHeight < 600) {
    cHeight = 600;
  }
  createCanvas(window.innerWidth, cHeight);

  c1 = color(255);
  c2 = color(176,196,222);

  setGradient(0, 0, width, height, c1, c2);

  // hard coded two mountains
  mountains.push(new Mountain(height - 200, height - 400, [134,171,178]));
  mountains.push(new Mountain(height - 50, height - 300, [94,124,126]));

  for (var j = 0; j < mountains.length; j++) {
    mountains[j].show();
  }

  var a = createVector(width / 2, height);
  var b = createVector(width / 2, height - 200);
  var root = new Branch(a, b, rootSize);

  tree[0] = root;

  for (var b = 0; b < 10; b++) {
    addBranches();
  }

  for (var i = 0; i < tree.length; i++) {
    tree[i].show();
  }

  for (var i = 0; i < leaves.length; i++) {
    fill(255, 0, 100, 100);
    noStroke();
    ellipse(leaves[i].x + random(-5, 5), leaves[i].y + random(-20, 20), 8, 8);
  }
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (var i = y; i <= y+h; i++) {
    var inter = map(i, y, y+h, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x+w, i);
  }
}

function Mountain(minY, maxY, phil) {
  this.yoff = random(1000);
  this.xoff = 0;
  this.fill = phil;

  this.show = function() {
    noStroke();
    fill(this.fill);
    // draw a mountain polygon across the width of the screen with perlin noise determined y values
    beginShape();
    vertex(0, height);
    for (var x = 0; x < width + 7; x += 7) {
      var y = map(noise(this.xoff, this.yoff), 0, 1, minY, maxY);
      vertex(x, y);
      this.xoff += 0.05;
    }
    vertex(width, height);
    endShape(CLOSE);
  }
}

function Branch(begin, end, size) {
  this.begin = begin;
  this.end = end;
  this.finished = false;
  this.size = size;

  this.show = function() {
    stroke(32);
    strokeWeight(this.size);
    line(this.begin.x, this.begin.y, this.end.x, this.end.y);
  }

  this.branchA = function() {
    var dir = p5.Vector.sub(this.end, this.begin);
    dir.rotate(PI / 6);
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

function addBranches() {
  for (var i = tree.length - 1; i >= 0; i--) {
    if (!tree[i].finished) {
      tree.push(tree[i].branchA());
      tree.push(tree[i].branchB());
    }
    tree[i].finished = true;
  }
  count++;

  if (count > 4) {
    for (var i = 0; i < tree.length; i++) {
      if (!tree[i].finished) {
        var leaf = tree[i].end.copy();
        leaves.push(leaf);
      }
    }
  }

}
