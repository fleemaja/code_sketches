var mountains = [];
// Gradient Constants
var c1, c2;

function setup() {
  var cHeight = window.innerHeight;
  if (cHeight < 600) {
    cHeight = 600;
  }
  createCanvas(window.innerWidth, cHeight);

  c1 = color(255);
  c2 = color(176,196,222);

  setGradient(0, 0, width, height, c1, c2);

  mountains.push(new Mountain(height - 200, height - 400, [134,171,178]));
  mountains.push(new Mountain(height - 50, height - 300, [94,124,126]));

  for (var j = 0; j < mountains.length; j++) {
    mountains[j].show();
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
    // We are going to draw a polygon out of the wave points
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
