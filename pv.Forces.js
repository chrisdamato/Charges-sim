pv.Force.electrostatic = function(k) {
  var min = 8, // minimum distance at which to observe forces
      min1 = 1 / min,
      max = 1000, // maximum distance at which to observe forces
      max1 = 1 / max,
      force = {};

  maxE = 0; minE=0;

  if (!arguments.length) k = -40; // default charge constant (repulsion)

  force.constant = function(x) {
    if (arguments.length) {
      k = Number(x);
      return force;
    }
    return k;
  };

  /**
   * Sets or gets the domain; specifies the minimum and maximum domain within
   * which charge forces are applied. A minimum distance threshold avoids
   * applying forces that are two strong (due to granularity of the simulation's
   * numeric integration). A maximum distance threshold improves performance by
   * skipping force calculations for particles that are far apart.
   *
   * <p>The default domain is [2, 500].
   *
   * @function
   * @name pv.Force.charge.prototype.domain
   * @param {number} a
   * @param {number} b
   * @returns {pv.Force.charge} this.
   */
  force.domain = function(a, b) {
    if (arguments.length) {
      min = Number(a);
      min1 = 1 / min;
      max = Number(b);
      max1 = 1 / max;
      return force;
    }
    return [min, max];
  };
  force.apply = function(particles, q) {
    for (var p1 = particles; p1.next; p1 = p1.next) {
        p1.Ex=0;p1.Ey=0; p1.E=0;
    }
    window.maxE=0;
    window.minE=0;
    for (var p1 = particles; p1.next; p1 = p1.next) {
        for (var p2 = p1.next; p2; p2 = p2.next) {
            es1Force(p1,p2);
        }
    }
    for (var p = particles; p.next; p = p.next) {
        //p.fx=Math.max(p.fx,10);p.fy=Math.max(p.fy,10);

    }
  };
  
  function es1Force(p1, p2) {
    if (p1===p2) throw "Should not be the same particle!";
    var dx = p2.x - p1.x,
        dy = p2.y - p1.y,
        dn = 1 / Math.sqrt(dx * dx + dy * dy),
        dr = 1 / (p1.r + p2.r);

    if (dn < max1) return;
    if (dn > dr) dn = dr;
    var kc = k * dn * dn * dn,
        kq = - p2.q * p1.q, //
        fx = dx * kq * kc, //
        fy = dy * kq * kc; //
    p1.fx += fx * p1.m1;
    p1.fy += fy * p1.m1;
    p2.fx -= fx * p2.m1;
    p2.fy -= fy * p2.m1;
  }
  
  function es1ForceWithE(p1, p2) {
    if (p1===p2) throw "Should not be the same particle!";
    var dx = p2.x - p1.x,
        dy = p2.y - p1.y,
        dn = 1 / Math.sqrt(dx * dx + dy * dy);
    if (dn < max1) return;
    if (dn > min1) dn = min1;
    var kc = k * dn * dn * dn,
        kq = - p2.q * p1.q, //
        kx = dx * kc, //
        ky = dy * kc; //
    p1.fx += kx * kq * p1.m1;
    p1.fy += ky * kq  * p1.m1;
    p2.fx -= kx * kq  * p2.m1;
    p2.fy -= ky * kq  * p2.m1;
    var E=
    
    p1.E+=p2.q*dn*dn;
    p2.E+=p1.q*dn*dn;

    window.maxE = Math.max(window.maxE,p1.E,p2.E);

    window.minE = Math.min(window.minE,p1.E,p2.E);

  }
  
  function es2Force(p, p2) {
    if (p===p2) throw "Should not be the same particle!";
    var dx = p2.x - p.x,
        dy = p2.y - p.y,
        d = Math.sqrt(dx * dx + dy * dy);
    if (d > max) return;
    if (d < min) d = min;
    var kq = k * (p2.q * p.q), //
        fx = kq / dx / dx, //
        fy = kq / dy / dy; //
    p.fx += fx * p.m1;
    p.fy += fy * p.m1;
    p2.fx -= fx * p2.m1;
    p2.fy -= fy * p2.m1;
  }
    
  return force;
};

pv.Force.es2 = function(k) {
    //stronger forces for neg close to pos
  var min = 8, // minimum distance at which to observe forces
      min1 = 1 / min,
      max = 1200, // maximum distance at which to observe forces
      max1 = 1 / max,
      bond = 20,
      bond1 = 1 / bond,
      force = {};
  if (!arguments.length) k = -40; // default charge constant (repulsion)

  force.constant = function(x) {
    if (arguments.length) {
      k = Number(x);
      return force;
    }
    return k;
  };
  force.domain = function(a, b) {
    if (arguments.length) {
      min = Number(a);
      min1 = 1 / min;
      max = Number(b);
      max1 = 1 / max;
      return force;
    }
    return [min, max];
  };
   //
   //
   //chris
  force.apply = function(particles, q) {
    for (var p = particles; p; p = p.next) {
        for (var p2 = p.next; p2; p2 = p2.next) {
            chrisforce(p,p2);
        }
    }
  };
  function chrisforce(p, p2) {
    if (p===p2) throw "Should not be the same particle!";
    var dx = p2.x - p.x,
        dy = p2.y - p.y,
        dn = 1 / Math.sqrt(dx * dx + dy * dy),
        bond1 = 1 / (p.r+p2.r+3)
        kbond=40,
        pkbond = 1,
        p2kbond = 1;
  if (dn < max1) return;
  //stronger bond for negative next to pos
  if (dn > bond1) {
          if (p.q<0 || p2.q >2) pkbond=kbond;
          if (p2.q<0 || p.q >2) p2kbond=kbond;
          }
  
  if (dn > min1) dn = min1;
    var kc = kbond * dn * dn * dn,
        kq = - p2.q * p.q, //
        fx = dx * kc * kq, //
        fy = dy * kc * kq; //
    p.fx += fx * p.m1 * pkbond;
    p.fy += fy * p.m1 * pkbond;
    p2.fx -= fx * p2.m1 * p2kbond;
    p2.fy -= fy * p2.m1 * p2kbond;
      }
    
  return force;
};

pv.Force.externalE = function(Ex,Ey) {
  var force={};

  force.apply = function(particles, q) {
    for (var p = particles; p; p = p.next) {
        for (var p2 = p.next; p2; p2 = p2.next) {
            p.fx += Ex * p.q;
            p.fy += Ey * p.q;
                    }
    }
  };
  
  function externalE(p) {
  if (dn < max1) return;
  if (dn > min1) dn = min1;
    var kc = k * dn * dn * dn,
        kq = - p2.q * p.q, //
        fx = dx * kc * kq, //
        fy = dy * kc * kq; //
    p.fx += fx;
    p.fy += fy;
    p2.fx -= fx
    p2.fy -= fy;
      }
    
  return force;
};

pv.Force.mousePlus = function(k) {
  var force={};

  force.apply = function(particles, q) {
    if (isFinite(mouseX+mouseY)) {
        for (var p = particles; p; p = p.next) {
            mouseforce(p);
        }
    }
  };
  
  function mouseforce(p) {
    var dx = mouseX - p.x,
        dy = mouseY - p.y,
        dn = 1 / Math.sqrt(dx * dx + dy * dy);
    if (dn>0.02) return;
    var kc = k * dn * dn * dn,
        kq = - 25 * p.q, //
        fx = dx * kc * kq, //
        fy = dy * kc * kq; //
    p.fx += fx;
    p.fy += fy;
      }
  
  return force;
};
