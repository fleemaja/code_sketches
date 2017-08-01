const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

let engine;
let world;

let car;
let ball;

function setup() {
  const w = window.innerWidth
  const h = window.innerHeight
  createCanvas(w, h)

  engine = Engine.create();
  world = engine.world;

  // disable matter.js gravity
  engine.world.gravity.y = 0;

  addWalls()
  car = new Car()
  ball = new Ball()
}

function keyReleased() {
  if (keyCode == UP_ARROW) {
    car.accelerating(false)
  } else if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {
    car.rotate(0)
  }
}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    car.rotate(PI/36)
  } else if (keyCode == LEFT_ARROW) {
    car.rotate(-PI/36)
  } else if (keyCode == UP_ARROW) {
    car.accelerating(true)
  }
}

function draw() {
  drawSoccerField()

  Engine.update(engine)

  car.render()
  car.update()

  ball.render()
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

function addWalls() {
  const wallThickness = 50;
  const wt2 = wallThickness/2;

  bottomWall = new Wall(width/2, height + wt2, width, wallThickness, 0)
  topWall = new Wall(width/2, -wt2, width, wallThickness, 0)

  leftWall = new Wall(-wt2, height/2, height, wallThickness, PI/2)
  rightWall = new Wall(width + wt2, height/2, height, wallThickness, PI/2)
}
