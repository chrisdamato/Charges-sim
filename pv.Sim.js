pv.simulationES = function(particles) {
  return new pv.SimulationES(particles);
};

/**
 * My hacked up version of the pv.simulationES
 */
 
pv.SimulationES = function(particles) {
  for (var i = 0; i < particles.length; i++) this.particle(particles[i]);
};

pv.simulationES.prototype.particle = function(p) {
  p.next = this.particles;
  /* Default velocities and forces to zero if unset. */
  if (isNaN(p.px)) p.px = p.x;
  if (isNaN(p.py)) p.py = p.y;
  if (isNaN(p.fx)) p.fx = 0;
  if (isNaN(p.fy)) p.fy = 0;
  if (isNaN(p.m)) p.m = 1;
  if (isNaN(p.m1)) p.m1 = 1/p.m;
  this.particles = p;
  return this;
};

/**
 * Adds the specified force to the simulation.
 *
 * @param {pv.Force} f the new force.
 * @returns {pv.simulationES} this.
 */
pv.simulationES.prototype.force = function(f) {
  f.next = this.forces;
  this.forces = f;
  return this;
};

/**
 * Adds the specified constraint to the simulation.
 *
 * @param {pv.Constraint} c the new constraint.
 * @returns {pv.simulationES} this.
 */
pv.simulationES.prototype.constraint = function(c) {
  c.next = this.constraints;
  this.constraints = c;
  return this;
};

/**
 * Apply constraints, and then set the velocities to zero.
 *
 * @returns {pv.simulationES} this.
 */
pv.simulationES.prototype.stabilize = function(n) {
  var c;
  if (!arguments.length) n = 3; // TODO use cooling schedule
  for (var i = 0; i < n; i++) {
    //var q = new pv.Quadtree(this.particles);
    for (c = this.constraints; c; c = c.next) c.apply(this.particles, q);
  }
  for (var p = this.particles; p; p = p.next) {
    p.px = p.x;
    p.py = p.y;
  }
  return this;
};

/**
 * Advances the simulation one time-step.
 */
pv.simulationES.prototype.step = function() {
  var p, f, c;

  /*
   * Assumptions:
   * - The mass (m) of every particles is 1.
   * - The time step (dt) is 1.
   */

  /* Position Verlet integration. */
  for (p = this.particles; p; p = p.next) {
    var px = p.px, py = p.py;
    p.px = p.x;
    p.py = p.y;
    p.x += p.vx = ((p.x - px) + p.fx);
    p.y += p.vy = ((p.y - py) + p.fy);
  }

  /* Apply constraints, then accumulate new forces. */
  //var q = new pv.Quadtree(this.particles);
  for (c = this.constraints; c; c = c.next) c.apply(this.particles);
  for (p = this.particles; p; p = p.next) p.fx = p.fy = 0;
  for (f = this.forces; f; f = f.next) f.apply(this.particles);
};