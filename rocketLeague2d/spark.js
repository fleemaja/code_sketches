class Spark {
  constructor(x, y, xVel) {
    this.pos = createVector(x, y);
    this.lifespan = 255;

    this.vel = createVector(random(0, xVel), random(-xVel, xVel));
    // we just want the direction
    this.vel.normalize();
    // then add random speed
    this.vel.mult(random(0, 20));
    this.fill = [random(255), random(255), random(255)]
  }

  update() {
    this.vel.mult(0.95);
    this.lifespan -= 5;
    this.pos.add(this.vel);
  }

  done() {
    return this.lifespan < 0;
  }

  render() {
    if (!this.done()) {
      noStroke();
      fill(this.fill, this.lifespan);
      rect(this.pos.x, this.pos.y, this.lifespan/20, this.lifespan/20, 3);
    }
  }

}
