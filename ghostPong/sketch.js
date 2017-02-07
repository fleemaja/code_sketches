var blobs = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 60;
  drawingContext.shadowColor = "rgb(255, 176, 190)";

  for (var i = 0; i < 13; i++) {
    blobs.push(new Blob(random(width), random(height)));
  }
}

function draw() {
  background(13, 33);

  for (var b = 0; b < blobs.length; b++) {
    blobs[b].update();
    blobs[b].show();
  }
}

function Blob(x, y) {
  this.pos = createVector(x, y);
  this.vel = p5.Vector.random2D();
  this.vel.mult(random(1, 3));
  this.r = random(48, 72);
  this.yoff = random(1000);

  this.update = function() {
    this.pos.add(this.vel);
    if (this.pos.x > width || this.pos.x < 0) {
      this.vel.x *= -1;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      this.vel.y *= -1;
    }
  }

  this.show = function() {
    noStroke();
    fill(255);
    push();
    translate(this.pos.x, this.pos.y);
    beginShape();
    var xoff = 0;
    for (var a = 0; a < TWO_PI; a += 0.1) {
      var offset;
      if (a > PI/6 && a < 5 * PI/6) {
        offset = map(noise(xoff, this.yoff), 0, 1, -20, 50);
      } else {
        offset = 0;
      }
      var r = this.r + offset;
      var x = r * cos(a);
      var y = r * sin(a);
      vertex(x, y);
      xoff += 0.1;
    }
    endShape();

    this.yoff += 0.08;
    pop();

    var eyeOffset = 15;

    stroke(54);
    ellipse(this.pos.x - eyeOffset, this.pos.y - eyeOffset, 20, 20);
    ellipse(this.pos.x + eyeOffset, this.pos.y - eyeOffset, 20, 20);
    fill(54);
    ellipse(this.pos.x - eyeOffset, this.pos.y - eyeOffset, 5, 5);
    ellipse(this.pos.x + eyeOffset, this.pos.y - eyeOffset, 5, 5);
  }
}
