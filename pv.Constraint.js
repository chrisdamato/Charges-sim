pv.Constraint.electrostaticCollision = function() {
  var n = 1, // number of times to repeat the constraint
      extraSpacing = 2; //minimum spacing between objects after collision
      constraint = {};

  constraint.extra = function(extra) {
          //get or set the minimum spacing between colliding objects
          if (arguments.length) {
                  extraSpacing = extra;
                  return this;
          }
          return extraSpacing;
  }
  /**
   * Applies this constraint to the specified particles.
   *
   * @function
   * @name pv.Constraint.collision.prototype.apply
   * @param {pv.Particle} particles particles to which to apply this constraint.
   * @param {pv.Quadtree} q a quadtree for spatial acceleration.
   */
  constraint.apply = function(particles, q) {
    var p1,p2, r, max = -Infinity;
    for (var i = 0; i < n; i++) {
      for (p1 = particles; p1.next; p1 = p1.next) {
         for (p2 = p1.next; p2; p2 = p2.next) {
            var r = p1.r + p2.r + ((p1.q*p2.q<0)?extraSpacing:-extraSpacing); //the new distance between
            var dx = p2.x - p1.x;
            var dy = p2.y - p1.y;
            var d=dx*dx + dy*dy;
            if (d > r*r) continue; //no collision
            d=Math.sqrt(d); //distance between

            //amount to move away
            var m=r-d;
            if (m<1) continue;

            var mx=dx * m / d,
                my=dy * m / d,
                //k1=(p2.m)/(p1.m+p2.m);
                //using inverse masses:
                k1=( p1.m1) / ( p1.m1 + p2.m1 );

            var m1x = mx * k1,
                m2x = mx * (1-k1),
                m1y = my * k1,
                m2y = my * (1-k1);

            p1.x -= m1x; p1.y -= m1y;
            p2.x += m2x; p2.y += m2y;

            //if electron hit proton, stop the electron
            if (p1.q<0 && p2.q>0) {
                p1.px=p1.x-(p2.x-p2.px); p1.py=p1.y-(p2.y-p2.py)
                }
        }
    }
  }
};

  return constraint;
}

pv.Constraint.reBound = function() {
  var constraint = {},
      x,
      y;

  /**
   * Sets or gets the bounds on the x-coordinate.
   *
   * @function
   * @name pv.Constraint.bound.prototype.x
   * @param {number} min the minimum allowed x-coordinate.
   * @param {number} max the maximum allowed x-coordinate.
   * @returns {pv.Constraint.bound} this.
   */
  constraint.x = function(min, max) {
    if (arguments.length) {
      x = {min: Math.min(min, max), max: Math.max(min, max)};
      return this;
    }
    return x;
  };

  /**
   * Sets or gets the bounds on the y-coordinate.
   *
   * @function
   * @name pv.Constraint.bound.prototype.y
   * @param {number} min the minimum allowed y-coordinate.
   * @param {number} max the maximum allowed y-coordinate.
   * @returns {pv.Constraint.bound} this.
   */
  constraint.y = function(min, max) {
    if (arguments.length) {
      y = {min: Math.min(min, max), max: Math.max(min, max)};
      return this;
    }
    return y;
  };

  /**
   * Applies this constraint to the specified particles.
   *
   * @function
   * @name pv.Constraint.bound.prototype.apply
   * @param {pv.Particle} particles particles to which to apply this constraint.
   */
  constraint.apply = function(particles) {
    if (x) for (var p = particles; p; p = p.next) {
      if (p.x < x.min) {
        p.x=2 * x.min - p.x;
        p.px = 2* x.min - p.px;
      } else if (p.x > x.max) {
        p.x = 2 * x.max - p.x;
        p.px = 2 * x.max - p.px;
      }
    }
    if (y) for (p = particles; p; p = p.next) {
      if (p.y < y.min) {
        p.y=2 * y.min - p.y;
        p.py = 2* y.min - p.py;
      } else if (p.y > y.max) {
        p.y = 2 * y.max - p.y;
        p.py = 2 * y.max - p.py;
      }
    }
  };

  return constraint;
}

