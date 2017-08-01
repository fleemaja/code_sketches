const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

let engine;
let world;

const exaustClouds = 25;
let car;
let computerCar;
let ball;

// for goal explosion effect
let sparks = [];

let goalHeight;
let goalWaitPeriod = false;

let playerScore = 0;
let computerScore = 0;

function setup() {
  const w = window.innerWidth
  // keep field dimensions nice
  const h = min(window.innerHeight, w * 0.61);
  createCanvas(w, h)

  goalHeight = width/6

  engine = Engine.create();
  world = engine.world;

  // disable matter.js gravity (top-down game)
  engine.world.gravity.y = 0;

  addWalls()

  const redHexVals = [255, 100, 100]
  const playerStartX = width/4;
  car = new Car(redHexVals, playerStartX)
  const blueHexVals = [100, 100, 255]
  const computerStartX = 3*width/4;
  computerCar = new Car(blueHexVals, computerStartX)

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
    car.rotate(PI/72)
  } else if (keyCode == LEFT_ARROW) {
    car.rotate(-PI/72)
  } else if (keyCode == UP_ARROW) {
    car.accelerating(true)
  }
}

function draw() {
  if (goalWaitPeriod) {
    // Screen Shakes On Goal (User feedback)
    translate(random(-13, 13), random(-13, 13));
  }

  drawSoccerField()

  Engine.update(engine)

  car.render()
  car.update()

  computerCar.render()
  computerCar.update()

  computerCar.accelerating(true)
  computerCar.pointTowardsBall()


  ball.render()
  if (ball.didScore()) {
    const [x, y] = [ball.body.position.x, ball.body.position.y]
    x < width/2 ? computerScore++ : playerScore++;
    shootSparks(x, y)
    goalWaitPeriod = true
    setTimeout(function() {
      goalWaitPeriod = false
    }, 1000);
  }

  textSize(18);
  noStroke();
  fill(255, 100, 100);
  text("player", width/2 - 100, height/16);
  fill(100, 100, 255);
  text("computer", width/2 + 50, height/16)
  fill(4);
  textSize(48);
  text(playerScore, width/2 - 88, height/6);
  text(computerScore, width/2 + 78, height/6);

  if (goalWaitPeriod) {
    fill(random(255), random(255), random(255));
    textSize(64);
    text("GOOOOOOAL", width/2 - 200, height/2)
  }

  // update, show, and delete sparks for goals
  goSparksGo()

}

function shootSparks(x, y) {
    // shoot sparks in opposite direction (towards middle)
    const xVel = x < width/2 ? 10 : -10;
    const xPos = x < width/2 ? 0 : width;
    for (var i = 0; i < 50; i++) {
      var s = new Spark(xPos, y, xVel);
      sparks.push(s);
   }
}

function goSparksGo() {
  // go backwards through array in case we splice (will break if forwards)
  for (var i = sparks.length - 1; i >= 0; i--) {
      sparks[i].update();
      sparks[i].render();
      if (sparks[i].done()) {
        sparks.splice(i, 1);
      }
  }
}

function drawSoccerField() {
  background(255)
  noFill()
  stroke(55)
  strokeWeight(1)

  // center field line
  line(width/2, 0, width/2, height)
  ellipse(width/2, height/2, width/6)

  // left goalie box
  rect(0, height/2 - width/6, width/6, width/3)
  rect(0, height/2 - width/12, width/18, goalHeight)
  // right goalie box
  rect(width - width/6, height/2 - width/6, width/6, width/3)
  rect(width - width/18, height/2 - width/12, width/18, goalHeight)
}

function addWalls() {
  const wallThickness = 500;
  const wt2 = wallThickness/2;

  bottomWall = new Wall(width/2, height + wt2, width, wallThickness, 0)
  topWall = new Wall(width/2, -wt2, width, wallThickness, 0)

  leftWall = new Wall(-wt2, height/2, height, wallThickness, PI/2)
  rightWall = new Wall(width + wt2, height/2, height, wallThickness, PI/2)
}
