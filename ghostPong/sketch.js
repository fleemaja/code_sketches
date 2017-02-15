var player;
var computer;
var ball;

var playerServe;

// for sparks effect on goal
var sparks = [];

function setup() {
  var iHeight = window.innerHeight > 500 ? window.innerHeight : 500;
  createCanvas(window.innerWidth, iHeight);

  player = new Player();
  computer = new Computer();
  ball = new Ball(width/2, height/2);
  scoreboard = new Scoreboard();
  playerServe = true;

  textSize(32);
  textFont('Raleway Dots');
}

function draw() {
  background(0, 95);

  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = "white";

  stroke(255);
  line(width/2, 0, width/2, height);

  player.update();
  if (keyIsDown(UP_ARROW)) {
    player.move(0, -6);
  } else if (keyIsDown(DOWN_ARROW)) {
    player.move(0, 6);
  }

  player.show();

  computer.update();
  computer.show();

  text(scoreboard.playerScore, width/2 - 80, 60);
  text(scoreboard.computerScore, width/2 + 60, 60);

  ball.update();
  ball.show();

  for (var i = sparks.length - 1; i >= 0; i--) {
    sparks[i].update();
    sparks[i].show();
    if (sparks[i].done()) {
      sparks.splice(i, 1);
    }
  }
}

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.xspeed = 0;
  this.yspeed = 0;

  this.show = function() {
    fill(255);
    rect(this.x, this.y, this.width, this.height, 5);
  }
}

function Scoreboard() {
  this.playerScore = 0;
  this.computerScore = 0;

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
      diff = -5;
    } else if (diff > 0 && diff > 4) { // max speed down
      diff = 5;
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
      this.x < 0 ? scoreboard.computerScored() : scoreboard.playerScored();
      playerServe = !playerServe;
      this.xspeed = playerServe ? -6 : 6;
      this.yspeed = random(-1, 1);
      this.x = width/2;
      this.y = height/2;
    }

    var paddle1 = player.paddle;
    var paddle2 = computer.paddle;
    if(bottomY >= paddle1.y && topY < paddle1.y + paddle1.height && this.x > paddle1.x - 20 && this.x < paddle1.x + paddle1.width) {
      // hit the player's paddle
      this.yspeed += (paddle1.yspeed / 2);
      this.xspeed = 6;
      this.x += this.xspeed;
    }

    if (bottomY > paddle2.y && topY < paddle2.y + paddle2.height && this.x + this.radius > paddle2.x && this.x < paddle2.x) {
      // hit the player's paddle
      this.yspeed += (paddle2.yspeed / 2);
      this.xspeed = -6;
      this.x += this.xspeed;
    }
  };

  this.show = function() {
    fill(255);
    rect(this.x, this.y, this.radius, this.radius, 5);
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
    if (this.lifespan < 0) {
      return true;
    } else {
      return false;
    }
  }

  this.show = function() {
    noStroke();
    fill(255, this.lifespan);
    rect(this.pos.x, this.pos.y, 4, 4, 1);
  }

}
