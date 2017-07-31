class Car {
  constructor() {
    this.position = createVector(width/2, height/2)
    this.width = width/36
    this.length = this.width * 2
    this.direction = 0
    this.rotation = 0
    this.velocity = createVector(0, 0)
    this.isAccelerating = false
  }

  update() {
    if (this.isAccelerating) {
      this.accelerate()
    }
    this.position.add(this.velocity)
    // FRICTION
    this.velocity.mult(0.95)
  }

  accelerating(isAccelerating) {
    this.isAccelerating = isAccelerating
  }

  accelerate() {
    var force = p5.Vector.fromAngle(this.direction)
    force.mult(0.5)
    this.velocity.add(force)
  }

  turn() {
    this.direction += this.rotation
  }

  setRotation(angle) {
    this.rotation = angle
  }

  detectEdges() {
    const x = this.position.x
    const y = this.position.y
    const leftWallX = this.width
    const rightWallX = width - this.width
    const topWallY = this.width
    const bottomWallY = height - this.width

    if (x > rightWallX) {
      this.position.x = rightWallX
    } else if (x < leftWallX) {
      this.position.x = leftWallX
    }

    if (y < topWallY) {
      this.position.y = topWallY
    } else if (y > bottomWallY) {
      this.position.y = bottomWallY
    }
  }

  render() {
    push()
    fill(255, 100, 100)
    noStroke()
    rectMode(CENTER)
    translate(this.position.x, this.position.y)
    rotate(this.direction + PI/2)
    rect(0, 0, this.width, this.length)
    pop()
  }
}
