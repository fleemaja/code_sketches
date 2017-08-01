class Wall {
  constructor(x, y, w, h, a) {
    var options = {
      friction: 0.5,
      restitution: 0.5,
      angle: a,
      isStatic: true
    }
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    World.add(world, this.body);
  }
}
