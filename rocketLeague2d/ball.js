class Ball {
  constructor() {
    this.position = createVector(width/2, height/2)
    this.radius = width/32
    const options = {
      restitution: 0.9,
      friction: 0.001,
      density: 0.0001
    }
    this.body = Bodies.circle(
      this.position.x, this.position.y, this.radius/2, options
    )
    World.add(world, this.body)
  }

  render() {
    push()
    translate(this.body.position.x, this.body.position.y)
    fill(255)
    noStroke()
    ellipse(0, 0, this.radius)
    pop()
  }
}
