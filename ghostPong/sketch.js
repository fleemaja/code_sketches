var player;
var computer;
var ball;

function setup() {
  var iHeight = window.innerHeight > 500 ? window.innerHeight : 500;
  createCanvas(window.innerWidth, iHeight);


  player = new Player();
  computer = new Computer();
  ball = new Ball(width/2, height/2);
}

function draw() {
  background(14);

  stroke(255);
  line(width/2, 0, width/2, height);

  player.show();
  computer.show();
  ball.update();
  ball.show();

  if (keyIsDown(UP_ARROW)) {
    player.move(0, -4);
  } else if (keyIsDown(DOWN_ARROW)) {
    player.move(0, 4);
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
    rect(this.x, this.y, this.width, this.height);
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    player.move(0, -4);
  } else if (keyCode === DOWN_ARROW) {
    player.move(0, 4);
  } else {
    player.move(0, 0);
  }
}

function Player() {
  this.paddle = new Paddle(50, (height/2) - 25, 10, 50);

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
  this.paddle = new Paddle(width - 50, (height/2) - 25, 10, 50);

  this.show = function() {
    this.paddle.show();
  }
}

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.xspeed = -3;
  this.yspeed = 0;
  this.radius = 10;
  var topY = this.y;
  var bottomY = this.y + this.radius;

  this.update = function() {
    this.x += this.xspeed;
    this.y += this.yspeed;

    if (this.y < 0) { // hitting the top wall
      this.y = 0;
      this.yspeed = -this.yspeed;
    } else if (this.y + this.radius > height) { // hitting the bottom wall
      this.y = height - this.radius;
      this.yspeed = -this.yspeed;
    }

    if (this.x < 0 || this.x > width) { // a point was scored
      this.xspeed = -3;
      this.yspeed = 0;
      this.x = width/2;
      this.y = height/2;
    }

    var paddle1 = player.paddle;
    var paddle2 = computer.paddle;
    if(topY > paddle1.y && bottomY < paddle1.y + paddle1.height && this.x > paddle1.x && this.x < paddle1.x + paddle1.width) {
      // hit the player's paddle
      this.yspeed += (paddle1.yspeed / 2);
      this.xspeed = 3;
      this.x += this.xspeed;
    }

    if (topY > paddle2.y && bottomY < paddle2.y + paddle2.height && this.x + this.radius > paddle2.x && this.x < paddle2.x) {
      // hit the player's paddle
      this.yspeed += (paddle2.yspeed / 2);
      this.xspeed = -3;
      this.x += this.xspeed;
    }
  };

  this.show = function() {
    fill(255);
    rect(this.x, this.y, this.radius, this.radius);
  }
};
