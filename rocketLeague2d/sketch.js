function setup() {
  createCanvas(800, 500)
}

function draw() {
  drawSoccerField()
}

class Car {
  constructor() {
    this.position = createVector(width/2, height/2)
  }


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
