let car;

function setup() {
  createCanvas(800, 500)

  car = new Car()
}

function keyReleased() {
  if (keyCode == UP_ARROW) {
    car.accelerating(false)
  } else if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {
    car.setRotation(0)
  }
}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    car.setRotation(PI/36)
  } else if (keyCode == LEFT_ARROW) {
    car.setRotation(-PI/36)
  } else if (keyCode == UP_ARROW) {
    car.accelerating(true)
  }
}

function draw() {
  drawSoccerField()
  car.render()
  car.turn()
  car.update()
  car.detectEdges()
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
