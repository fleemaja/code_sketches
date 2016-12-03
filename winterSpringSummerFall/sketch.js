var mountains = [];
// branch size constants
if (window.innerWidth > 900) {
  var rootSize = 42;
  var rootLength = 200;
} else {
  var rootSize = 36;
  var rootLength = 170;
}
var branchRatio = 0.67;
// gradient constants
var c1, c2;
// tree variables
var tree = [];
var leaves = [];
var count = 0;
// clock
var time = 0;
var clockPos;

function setup() {
  var cHeight = window.innerHeight;
  if (cHeight < 600) {
    cHeight = 600;
  }
  createCanvas(window.innerWidth, cHeight);

  clockPos = {
    'x': width - 150,
    'y': 100
  };

  c1 = color(255);
  c2 = color(176,196,222);

  setGradient(0, 0, width, height, c1, c2);

  // hard coded two mountains
  mountains.push(new Mountain(height - 200, height - 400, [134,171,178]));
  mountains.push(new Mountain(height - 50, height - 300, [94,124,126]));

  for (var j = 0; j < mountains.length; j++) {
    mountains[j].create();
  }

  var a = createVector(width * 0.41, height);
  var b = createVector(width * 0.41, height - rootLength);
  var root = new Branch(a, b, rootSize);

  tree[0] = root;

  for (var b = 0; b < 10; b++) {
    addBranches();
  }
}

function draw() {
  setGradient(0, 0, width, height, c1, c2);
  for (var j = 0; j < mountains.length; j++) {
    mountains[j].show();
  }
  for (var i = 0; i < tree.length; i++) {
    tree[i].show();
  }
  for (var i = 0; i < leaves.length; i++) {
    fill(255, 0, 100, 100);
    noStroke();
    ellipse(leaves[i].x, leaves[i].y, 8, 8);
  }
  noFill();
  strokeWeight(20);
  stroke(231,201,171);
  ellipse(clockPos.x, clockPos.y, 100, 100);
  strokeWeight(1);
  stroke(0);
  fill(255);
  var radius = 50;
  var angle = radians(time);
  var x = clockPos.x + (radius * cos(angle));
  var y = clockPos.y + (radius * sin(angle));
  ellipse(clockPos.x, clockPos.y, 10, 10);
  strokeWeight(3);
  line(clockPos.x, clockPos.y, x, y);
  time = time % 360;
  time += 1;
  noStroke();
  textSize(16);
  if (time > 225 && time < 315) {
    fill(219, 50, 54);
  } else {
    fill(0);
  }
  text("winter", clockPos.x - 20, 30);
  if ((time > 315 && time < 365) || (time >= 0 && time < 45)) {
    fill(72, 133, 237);
  } else {
    fill(0);
  }
  text("spring", clockPos.x + 70, 100);
  if (time > 45 && time < 135) {
    fill(60, 186, 84);
  } else {
    fill(0);
  }
  text("summer", clockPos.x - 27, 180);
  if (time >= 135 && time < 225) {
    fill(244, 194, 13);
  } else {
    fill(0);
  }
  text("autumn", clockPos.x - 122, 100);
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
  this.vertices = [];

  this.create = function() {
    this.vertices.push([0, height]);
    for (var x = 0; x < width + 7; x += 7) {
      var y = map(noise(this.xoff, this.yoff), 0, 1, minY, maxY);
      this.vertices.push([x, y]);
      this.xoff += 0.05;
    }
    this.vertices.push([width, height]);
  }

  this.show = function() {
    // draw a mountain polygon across the width of the screen with perlin noise determined y values
    noStroke();
    fill(this.fill);
    beginShape();
    this.vertices.forEach(function(vert) {
      vertex(vert[0], vert[1]);
    })
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
        leaf.x += random(-20, 20);
        leaf.y += random(-20, 20);
        leaves.push(leaf);
      }
    }
  }

}
