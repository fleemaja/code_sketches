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

  didScore() {
    const [x, y] = [this.body.position.x, this.body.position.y]
    const topOfGoalY = height/2 + goalHeight/2
    const bottomOfGoalY = height/2 - goalHeight/2
    const withinGoalRange = y < topOfGoalY && y > bottomOfGoalY
    if (withinGoalRange) {
      return (x <= this.radius/2 || x >= width - this.radius/2)
    }
    return false
  }

  render() {
    this.position.x = this.body.position.x
    this.position.y = this.body.position.y

    push()
    translate(this.body.position.x, this.body.position.y)
    rotate(this.body.angle)
    fill(173,255,47)
    ellipse(0, 0, this.radius)
    fill(54)
    ellipse(0, 0, this.radius/3)
    line(-this.radius/2, 0, this.radius/2, 0)
    pop()
  }
}
