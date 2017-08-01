class Car {
  constructor() {
    this.position = createVector(width/4, height/2)
    this.width = width/36
    this.length = this.width * 2
    this.isAccelerating = false
    this.rotation = 0
    const options = { density: 0.01, friction: 0.2 }
    this.body = Bodies.rectangle(
      this.position.x, this.position.y, this.length, this.width, options
    )
    World.add(world, this.body)
  }

  update() {
    if (this.isAccelerating) {
      this.accelerate()
    }
    this.rotate(this.rotation)
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
    fill(255, 100, 100)
    rect(0, 0, this.length, this.width, 5);
    fill(54);
    rect(-this.length/24, 0, 0.7 * this.length, 0.8 * this.width, 5);
    fill(255, 100, 100);
    rect(-this.length/12, 0, 0.45 * this.length, 0.6 * this.width, 5);
    // headlights
    fill(255, 255, 200)
    ellipse(this.length/2, -this.width/3, this.width/8, this.width/4);
    ellipse(this.length/2, this.width/3, this.width/8, this.width/4);
    pop()
  }
}
