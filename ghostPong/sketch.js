var blobs = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 60;
  drawingContext.shadowColor = "white";

  for (var i = 0; i < 3; i++) {
    blobs.push(new Blob(random(width), random(height)));
  }
}

function draw() {
  background(13);

  for (var b = 0; b < blobs.length; b++) {
    blobs[b].update();
    blobs[b].show();
  }
}

function Blob(x, y) {
  this.pos = createVector(x, y);
  this.vel = p5.Vector.random2D();
  this.vel.mult(random(2, 5));
  this.r = random(64, 128);

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
      ellipse(this.pos.x,this.pos.y,this.r,this.r);
  }
}
