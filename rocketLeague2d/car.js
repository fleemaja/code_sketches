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
    // if (this.isRotating) {
    this.rotate(this.rotation)
    // }
  }

  accelerating(isAccelerating) {
    this.isAccelerating = isAccelerating
  }

  // rotating(isAccelerating) {
  //   this.isAccelerating = isAccelerating
  // }

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
    fill(255, 100, 100)
    noStroke()
    rectMode(CENTER)
    translate(this.body.position.x, this.body.position.y)
    rotate(angle);
    rect(0, 0, this.length, this.width)
    pop()
  }
}
