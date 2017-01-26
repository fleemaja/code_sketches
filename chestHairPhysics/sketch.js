var bg;
var scl = 10;
var cols, rows;
var inc = 0.1;
var zoff = 0;

var windSlider;

function setup() {
  bg = loadImage("http://res.cloudinary.com/dkw0kkkgd/image/upload/v1485384063/blowin-in-the-wind_n0nkja.jpg");
  createCanvas(407, 479);
  cols = floor(width / (2 * scl));
  rows = floor(height / (2.3 * scl));

  windSlider = select('#windiness');
}

function draw() {
  background(bg);

  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = (x + y * width) * 4;
      var angle = noise(xoff, yoff, zoff) * TWO_PI;
      var v = p5.Vector.fromAngle(angle);
      xoff += inc;
      stroke(0);
      push();
      translate(100 + x * scl, 175 + y * scl);
      rotate(v.heading());
      line(0, 0, scl, 0);
      pop();
    }
    yoff += inc;

    wind = windSlider.value();

    zoff += wind;
  }
}
