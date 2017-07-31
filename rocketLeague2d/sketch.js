class Car {
  constructor() {
    this.position = createVector(width/2, height/2)
    this.width = width/36
    this.length = this.width * 2
    this.direction = 0
    this.rotation = 0
  }

  turn() {
    this.direction += this.rotation
  }

  setRotation(angle) {
    this.rotation = angle
  }

  render() {
    push()
    fill(255, 100, 100)
    noStroke()
    rectMode(CENTER)
    translate(this.position.x, this.position.y)
    rotate(this.direction)
    rect(0, 0, this.width, this.length)
    pop()
  }
}

let car;

function setup() {
  createCanvas(800, 500)

  car = new Car()
}

function keyReleased() {
  car.setRotation(0)
}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    car.setRotation(PI/36)
  } else if (keyCode == LEFT_ARROW) {
    car.setRotation(-PI/36)
  }
}

function draw() {
  drawSoccerField()
  car.render()
  car.turn()
}

function drawSoccerField() {
  background(51)
  noFill()
  stroke(255)
  strokeWeight(1)

  // center field line
  line(width/2, 0, width/2, height)
  ellipse(width/2, height/2, width/6)

  // left goalie box
  rect(0, height/2 - width/6, width/6, width/3)
  rect(0, height/2 - width/12, width/18, width/6)
  // right goalie box
  rect(width - width/6, height/2 - width/6, width/6, width/3)
  rect(width - width/18, height/2 - width/12, width/18, width/6)
}
