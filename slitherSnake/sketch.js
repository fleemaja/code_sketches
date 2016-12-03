// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Seeking "vehicle" follows the mouse position

// Implements Craig Reynold's autonomous steering behaviors
// One vehicle "seeks"
// See: http://www.red3d.com/cwr/

var v;
var ghost;

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  v = new Vehicle(width/2, height/2);
  ghost = new Ghost();
}

function draw() {
  background(51);
  textSize(16);
  text("use the arrow keys to move the white block", width/3, 30);
  text("(make sure the game window is in focus to use arrow keys)", width/3, 60);

  ghost.update();
  ghost.show();

  var ghostVect = createVector(ghost.x, ghost.y);

  // Call the appropriate steering behaviors for our agents
  // snake follows the ghost to steer
  v.seek(ghostVect);
  v.update();
  v.display();

}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    ghost.dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    ghost.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    ghost.dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    ghost.dir(-1, 0);
  }
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// The "Vehicle" class

function Vehicle(x,y) {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(0,-2);
  this.position = createVector(x,y);
  this.r = 32;
  this.maxspeed = 3;
  this.maxforce = 0.2;
  this.history = [];

  // Method to update location
  this.update = function() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);

    var v = createVector(this.position.x,this.position.y);
    this.history.push(v);

    if (this.history.length > 100) {
        this.history.splice(0,1);
    }
  };

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  };

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.seek = function(target) {

    var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired,this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force

    this.applyForce(steer);
  };

  this.display = function() {
    // Draw a snake rotated in the direction of velocity
    var theta = this.velocity.heading() + PI/2;
    fill(0,150,150);
    noStroke();
    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      var size = map(i,0,this.history.length,5,this.r);
      ellipse(pos.x, pos.y, size, size);
    }
    fill(0,150,150);
    ellipse(this.x,this.y,this.r,this.r);
    push();
    translate(this.position.x,this.position.y);
    rotate(theta);
    ellipse(0, 0, this.r, this.r);
    fill(255);
    ellipse(-this.r/5, 0, 8, 8);
    ellipse(this.r/5, 0, 8, 8);
    fill(98);
    ellipse(-this.r/5, 0, 4, 4);
    ellipse(this.r/5, 0, 4, 4);
    pop();
  };
}

function Ghost() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 5;
  this.yspeed = 5;

  this.dir = function(x, y) {
    this.xspeed = x * 5;
    this.yspeed = y * 5;
  }

  this.update = function() {

    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;

    this.x = constrain(this.x, 0, width - 20);
    this.y = constrain(this.y, 0, height - 20);
  }

  this.show = function() {
    fill(255);
    rect(this.x, this.y, 20, 20);
  }
}
