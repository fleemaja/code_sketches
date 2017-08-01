class Car {
  constructor(paintColor, startX) {
    const startY = startX < width/2 ? height/4 : 3*height/4
    this.position = createVector(startX, startY)
    this.width = width/36
    this.length = this.width * 2
    this.isAccelerating = false
    this.rotation = 0
    this.color = paintColor
    this.history = [];
    const options = { density: 0.01, friction: 0.2, mass: 50 }
    this.body = Bodies.rectangle(
      this.position.x, this.position.y, this.length, this.width, options
    )
    World.add(world, this.body)
    if (startX > width/2) {
      Body.setAngle(this.body, PI)
    }
  }

  update() {
    if (this.isAccelerating) {
      this.accelerate()
    }
    this.rotate(this.rotation)
    this.history.push([this.body.position.x, this.body.position.y]);
    if (this.history.length > exaustClouds) {
      this.history.splice(0, 1);
    }
    this.position.x = this.body.position.x
    this.position.y = this.body.position.y
  }

  accelerating(isAccelerating) {
    this.isAccelerating = isAccelerating
  }

  accelerate() {
    var force = p5.Vector.fromAngle(this.body.angle)
    force.mult(0.02);
    Body.applyForce(this.body, this.body.position, force)
  }

  rotate(rotation) {
    this.rotation = rotation
    Body.setAngularVelocity(this.body, rotation)
  }

  pointTowardsBall() {
    const desired = p5.Vector.sub(ball.position, this.position)
    const angle = desired.heading()
    Body.setAngle(this.body, angle);
  }

  render() {
    var angle = this.body.angle;
    push()
    rectMode(CENTER)
    translate(this.body.position.x, this.body.position.y)
    rotate(angle);
    // tires
    fill(54)
    ellipse(this.length/3, -this.width/2, this.width/4, this.width/8)
    ellipse(this.length/3, this.width/2, this.width/4, this.width/8)
    ellipse(-this.length/3, -this.width/2, this.width/4, this.width/8)
    ellipse(-this.length/3, this.width/2, this.width/4, this.width/8)
    // car body
    fill(this.color)
    rect(0, 0, this.length, this.width, 5);
    fill(54);
    rect(-this.length/24, 0, 0.7 * this.length, 0.8 * this.width, 5);
    fill(this.color);
    rect(-this.length/12, 0, 0.45 * this.length, 0.6 * this.width, 5);
    // headlights
    fill(255, 255, 200)
    ellipse(this.length/2, -this.width/3, this.width/8, this.width/4);
    ellipse(this.length/2, this.width/3, this.width/8, this.width/4);
    pop()
    push()
    noStroke();
    const carWidth = this.width;
    this.history.forEach(function(h, i) {
      const [ x, y ] = h
      push()
      translate(x, y)
      rotate(angle);
      fill(54, i);
      ellipse(-carWidth, 0, exaustClouds - i + random(-10, 10), exaustClouds - i + random(-3, 3));
      pop()
    })
    pop()
  }
}
