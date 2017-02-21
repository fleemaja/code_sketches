var player;
var computer;
var ball;
var playerServe;
var goalWaitPeriod = false;
// for sparks effect on goal
var sparks = [];
// for lightning effect before serve
var lightningBall;
var isPlayerForcePush = false;
var isCompForcePush = false;
var xoff = 0.0;

function setup() {
  var iHeight = window.innerHeight > 500 ? window.innerHeight : 500;
  createCanvas(window.innerWidth, iHeight);

  player = new Player();
  computer = new Computer();
  ball = new Ball(width/2, height/2);
  scoreboard = new Scoreboard();
  playerServe = true;
  // indicator animation that a serve is coming
  lightningBall = new LightningBall();

  textSize(32);
  textFont("Helvetica");
}

function draw() {

  if (goalWaitPeriod) {
    // Screen Shakes
    translate(random(-10, 10), random(-10, 10));
  }

  background(25, 55);

  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = "lightsteelblue";

  stroke(255);
  line(width/2, 0, width/2, height);

  player.update();
  if (keyIsDown(UP_ARROW)) {
    player.move(0, -8);
  } else if (keyIsDown(DOWN_ARROW)) {
    player.move(0, 8);
  }

  player.show();
  if (isPlayerForcePush) {
    player.paddle.forceUpdate('player');
  }

  computer.update();
  if (isCompForcePush) {
    computer.paddle.forceUpdate('computer');
  }
  computer.show();

  text(scoreboard.playerScore + " / 7", width/2 - 120, 60);
  text(scoreboard.computerScore + " / 7", width/2 + 60, 60);

  for (var i = sparks.length - 1; i >= 0; i--) {
    sparks[i].update();
    sparks[i].show();
    if (sparks[i].done()) {
      sparks.splice(i, 1);
    }
  }

  if (scoreboard.gameOver()) {
    fill(25, 123);
    noStroke();
    rect(0, 0, width, height);
    fill(255);
    var result = scoreboard.playerScore > scoreboard.computerScore ? "You win! " : "You lose! ";
    text(result + scoreboard.playerScore + " to " + scoreboard.computerScore + ".", width/2 - 130, height/2 - 40);
    text("Press the spacebar to play again.", width/2 - 240, height/2);
  } else {
    if (!goalWaitPeriod) {
      if (lightningBall.ballIsFormed()) {
        ball.update();
        ball.show();
      } else {
        lightningBall.update();
        lightningBall.show();
      }
    }
  }
}

function keyPressed() {
  // if game over and spacebar is pressed
  if (scoreboard.gameOver && keyCode === 32) {
    scoreboard.resetScore();
  }
}

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.xspeed = 0;
  this.yspeed = 0;
  this.forcePushTime = 0;

  this.show = function() {
    if (isPlayerForcePush) {
      fill(255);
    } else {
      fill(240);
    }
    rect(this.x, this.y, this.width, this.height, 5);
  }

  this.forceUpdate = function(pType) {
    if (pType == 'player') {
      if (this.forcePushTime < 6) {
        this.width += 4;
        this.y -= 3;
        this.height += 6;
        this.forcePushTime += 1;
      } else if (this.forcePushTime < 12) {
        this.width -= 4;
        this.y += 3;
        this.height -= 6;
        this.forcePushTime += 1;
      } else {
        isPlayerForcePush = false;
        this.forcePushTime = 0;
      }
    } else {
      if (this.forcePushTime < 6) {
        this.x -= 4;
        this.width += 4;
        this.y -= 3;
        this.height += 6;
        this.forcePushTime += 1;
      } else if (this.forcePushTime < 12) {
        this.x += 4;
        this.width -= 4;
        this.y += 3;
        this.height -= 6;
        this.forcePushTime += 1;
      } else {
        isCompForcePush = false;
        this.forcePushTime = 0;
      }
    }
  }
}

function Scoreboard() {
  this.playerScore = 0;
  this.computerScore = 0;

  this.gameOver = function() {
    return this.playerScore === 7 || this.computerScore === 7;
  }

  this.resetScore = function() {
    this.playerScore = 0;
    this.computerScore = 0;
  }

  this.playerScored = function() {
    this.playerScore += 1;
  }

  this.computerScored = function() {
    this.computerScore += 1;
  }
}

function Player() {
  this.paddle = new Paddle(50, (height/2) - 25, 20, 70);

  this.update = function() {
    this.paddle.xspeed = 0;
    this.paddle.yspeed = 0;
  }

  this.move = function(x, y) {
    this.paddle.x += x;
    this.paddle.y += y;
    this.paddle.xspeed = x;
    this.paddle.yspeed = y;
    if (this.paddle.y < 0) { // all the way to the top
      this.paddle.y = 0;
      this.paddle.yspeed = 0;
    } else if (this.paddle.y + this.paddle.height > height) { // all the way to the bottom
      this.paddle.y = height - this.paddle.height;
      this.paddle.yspeed = 0;
    }
  }

  this.show = function() {
    this.paddle.show();
  }
}

function Computer() {
  this.paddle = new Paddle(width - 50, (height/2) - 25, 20, 70);

  this.move = function(x, y) {
    this.paddle.x += x;
    this.paddle.y += y;
    this.paddle.xspeed = x;
    this.paddle.yspeed = y;
    if (this.paddle.y < 0) { // all the way to the top
      this.paddle.y = 0;
      this.paddle.yspeed = 0;
    } else if (this.paddle.y + this.paddle.height > height) { // all the way to the bottom
      this.paddle.y = height - this.paddle.height;
      this.paddle.yspeed = 0;
    }
  }

  this.update = function() {
    var yPos = ball.y;
    var diff = -((this.paddle.y + (this.paddle.height / 2)) - yPos);
    if (diff < 0 && diff < -4) { // max speed up
      diff = -8;
    } else if (diff > 0 && diff > 4) { // max speed down
      diff = 8;
    }
    this.move(0, diff);
    if (this.paddle.y < 0) {
      this.paddle.y = 0;
    } else if (this.paddle.y + this.paddle.height > height) {
      this.paddle.y = height - this.paddle.height;
    }
};

  this.show = function() {
    this.paddle.show();
  }
}

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.xspeed = -6;
  this.yspeed = random(-1, 1);
  this.radius = 20;
  var topY = this.y;
  var bottomY = this.y + this.radius;

  this.resetBall = function() {
    this.x = width/2;
    this.y = height/2;
    this.xspeed = playerServe ? -6 : 6;
    this.yspeed = random(-1, 1);
  }

  this.update = function() {
    this.x += this.xspeed;
    this.y += this.yspeed;

    topY = this.y;
    bottomY = this.y + this.radius;

    if (this.y < 0) { // hitting the top wall
      this.y = 0;
      this.yspeed = -this.yspeed;
    } else if (this.y + this.radius > height) { // hitting the bottom wall
      this.y = height - this.radius;
      this.yspeed = -this.yspeed;
    }

    // a point was scored
    if (this.x < 0 || this.x > width) {
      shootSparks(this.x, this.y, -this.xspeed);
      goalWaitPeriod = true;
      setTimeout(function() {
        goalWaitPeriod = false;
        lightningBall.resetLightningBall();
      }, 500);
      this.x < 0 ? scoreboard.computerScored() : scoreboard.playerScored();
      playerServe = !playerServe;
      this.resetBall();
    }

    var paddle1 = player.paddle;
    var paddle2 = computer.paddle;
    if(bottomY >= paddle1.y && topY < paddle1.y + paddle1.height && this.x > paddle1.x - 20 && this.x < paddle1.x + paddle1.width) {
      // hit the player's paddle
      this.yspeed += (paddle1.yspeed / 2);

      isPlayerForcePush = true;
      this.xspeed = 12;

      this.x += this.xspeed;
    }

    if (bottomY > paddle2.y && topY < paddle2.y + paddle2.height && this.x + this.radius > paddle2.x && this.x < paddle2.x) {
      isCompForcePush = true;
      this.xspeed = -12;
      // hit the computer's paddle
      this.yspeed += (paddle2.yspeed / 2);
      this.x += this.xspeed;
    }
  };

  this.show = function() {
    if (!goalWaitPeriod) {
      fill(255);
      rect(this.x, this.y, this.radius, this.radius, 5);
    }
  }
};

function shootSparks(x, y, xVel) {
    for (var i = 0; i < 50; i++) {
      var s = new Spark(x, y, xVel);
      sparks.push(s);
   }
}

function Spark(x, y, xVel) {
  this.pos = createVector(x, y);
  this.lifespan = 255;

  this.vel = createVector(random(0, xVel), random(-xVel, xVel));
  // we just want the direction
  this.vel.normalize();
  // then add random speed
  this.vel.mult(random(0, 10));

  this.update = function() {
    this.vel.mult(0.95);
    this.lifespan -= 5;
    this.pos.add(this.vel);
  }

  this.done = function() {
    return this.lifespan < 0;
  }

  this.show = function() {
    noStroke();
    fill(255, this.lifespan);
    rect(this.pos.x, this.pos.y, 4, 4, 1);
  }

}

function LightningBall() {
  this.x = width/2;
  this.y = height/2;
  this.lifespan = 355;
  this.history = [];

  this.resetLightningBall = function() {
    this.x = width/2;
    this.y = height/2;
    this.lifespan = 355;
    this.history = [];
  }

  this.ballIsFormed = function() {
    return this.lifespan < 0;
  }

  this.update = function() {
    this.lifespan -= 5;
    this.x += random(-0.01, 0.01);
    this.y += random(-0.01, 0.01);

    for (var i = 0; i < this.history.length; i++) {
      this.history[i].x += random(-10, 10);
      this.history[i].y += random(-10, 10);
    }

    var v = createVector(this.x, this.y);
    this.history.push(v);
    if (this.history.length > 100) {
      this.history.splice(0, 1);
    }
  }

  this.show = function() {
    push();
    stroke(255);
    strokeWeight(4);
    line(width/2, 0, width/2, height);
    noFill();
    beginShape();
    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      vertex(pos.x, pos.y);
    }
    endShape(CLOSE);
    pop();
  }
}
