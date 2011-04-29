/**
 * Created by IntelliJ IDEA.
 * User: chris
 * Date: Apr 27, 2011
 * Time: 12:34:48 PM
 * To change this template use File | Settings | File Templates.
 */

function mono(globals) {
    var g=globals;
    var Setup={};
    var pos=[], neg=[], sim={}, vis={};
    nP=2;
    nN=2;
    Setup.initNodes=function() {
        var nq=0;
        pos = pv.range(nP).map(function (i) {
            var x = g.w * Math.random(),
                y = g.h * Math.random(); //(parseInt(i / nx) + 1) * h / (ny + 1),
            var q = +1;
            return {
                x: x,
                y: y,
                q: +1
            };
        });
        //create negatives
        neg= pv.range(nN).map(function (i) {
            return {
                x: g.w * Math.random(),
                y: g.h * Math.random(),
                q: -1
            };
        });
        return [];
    }
    Setup.initSim=function() {
        sim = pv.simulationES(pos.concat(neg))
            //.force(pv.Force.electrostatic(forceK).domain(forceDistMin, forceDistMax))
            //.force(pv.Force.mousePlus(100))
            //.force(pv.Force.drag(0.001))
            //.constraint(pv.Constraint.electrostaticCollision().extra(extraSpace))
            //.constraint(pv.Constraint.reBound().x(10, g.w - 10).y(10, g.h - 10))
            //.stabilize()
            ;
        return sim;
    }
    Setup.initVis=function() {
        vis = new pv.Panel().width(g.w).height(g.h)
            //.event("click",function(){alert()})
            ;
        vis.add(pv.Dot)
            .data(pos)
            .left(function (d) {return d.x})
            .top(function (d) {return d.y})
            .radius(function (d) {return 4 })
            .strokeStyle("red")
            .fillStyle("rgba(255,0,0,0.5)")
            ;
        return vis;
    }


   return Setup
}

function Chemistry(globals) {
    var g=globals;
    var qPos=+4,
        nPos=16,
        sPos=(g.size)*2,
        mPos=100*qPos; //multiple of mNeg
    var qNeg=-1,
        nNeg=nPos*qPos,
        sNeg=g.size*2,
        mNeg=1;
    var vInitMax=6;
    var forceK=120*g.size,
        forceDistMin=g.size*2,
        forceDistMax=1300,
        extraSpace=-sNeg;
    var nodes=[], sim={}, vis={};
    var Setup={};

    Setup.initNodes=function () {
        //create positives
        var nq=0;
        nodes = [].concat(pv.range(nPos).map(function (i) {
            var x = g.w * Math.random(),
                y = g.h * Math.random(); //(parseInt(i / nx) + 1) * h / (ny + 1),
                q = i%3+3;
                nq+=q;
            return {
                x: x,
                y: y,
                px: x + Math.random() * vInitMax * 2 - vInitMax,
                py: y + Math.random() * vInitMax * 2 - vInitMax,
                q: q,
                m1: 1 / (mPos),
                r: sPos*Math.sqrt(q),
                Ex:0, Ey:0, E:0
            };
        }));
        //create negatives
        nodes = nodes.concat(pv.range(nq).map(function (i) {
            return {
                x: g.w * Math.random(),
                y: g.h * Math.random(),
                q: qNeg,
                m1: 1 / (mNeg),
                r: sNeg

            };
        }));

        return nodes;

    };
    
    Setup.initSim=function() {
        sim = pv.simulation(nodes)
            .force(pv.Force.electrostatic(forceK).domain(forceDistMin, forceDistMax))
            //.force(pv.Force.mousePlus(100))
            //.force(pv.Force.drag(0.001))
            .constraint(pv.Constraint.electrostaticCollision().extra(extraSpace))
            .constraint(pv.Constraint.reBound().x(10, g.w - 10).y(10, g.h - 10))
            //.stabilize()
            ;
        return sim;
    }
    Setup.initVis=function() {
        vis = new pv.Panel().width(g.w).height(g.h)
            //.event("click",function(){alert()})
            ;
        var fillPosNeg=function(d) {  return (d.q > 0) ? "rgba(255,0,0,0.3)" : "rgba(0,0,255,0.3)" };
        var fillByE=function(d) {
            var i=d.E;
            //i=(d.E<0)?parseInt(Math.min(i/minE*255,255)):parseInt(Math.min(i/maxE*255,255));
            i=(d.q>0) ?
                ("rgb(255,"+(i)+","+(i)+")" ):("rgb("+i+","+i+",255)" );
            //console.log(i);
            return i;
          };

        vis.add(pv.Dot)
            .data(nodes)
            .left(function (d) {return d.x})
            .top(function (d) {return d.y})
            .radius(function (d) {return d.r })
            .event("mousedown", pv.Behavior.drag())
            .event("drag", function () {return this.parent})
            .strokeStyle(function (d) {  return (d.q > 0) ? "rgba(255,0,0,0.5)" : "rgba(0,0,255,0.5)"})
            .fillStyle(fillPosNeg)
            ;
        return vis;
    }


   return Setup
}


function BigBang(globals) {
    var g=globals;
    var qPos=+4,
        nPos=12,
        sPos=(g.size)*3,
        mPos=100*qPos; //multiple of mNeg
    var qNeg=-1,
        nNeg=nPos*qPos,
        sNeg=g.size,
        mNeg=1;
    var vInitMax=6;
    var forceK=60*g.size,
        forceDistMin=g.size*4,
        forceDistMax=1300,
        extraSpace=-2*g.size;
    var nodes=[], sim={}, vis={};
    var Setup={};

    Setup.initNodes=function () {
        //create positives
        nodes = [].concat(pv.range(nPos).map(function (i) {
            var x = g.w * Math.random(),
                y = g.h * Math.random(); //(parseInt(i / nx) + 1) * h / (ny + 1),
                q = i%4+1;
            return {
                x: x,
                y: y,
                px: x + Math.random() * vInitMax * 2 - vInitMax,
                py: y + Math.random() * vInitMax * 2 - vInitMax,
                q: q,
                m1: 1 / (mPos),
                r: g.size*q,
                Ex:0, Ey:0, E:0
            };
        }));
        //create negatives
        nodes = nodes.concat(pv.range(nNeg).map(function (i) {
            return {
                x: g.w * Math.random(),
                y: g.h * Math.random(),
                q: qNeg,
                m1: 1 / (mNeg),
                r: sNeg

            };
        }));

        return nodes;

    };
    
    Setup.initSim=function() {
        sim = pv.simulation(nodes)
            .force(pv.Force.electrostatic(forceK).domain(forceDistMin, forceDistMax))
            //.force(pv.Force.mousePlus(100))
            //.force(pv.Force.drag(0.001))
            .constraint(pv.Constraint.electrostaticCollision().extra(extraSpace))
            .constraint(pv.Constraint.reBound().x(10, g.w - 10).y(10, g.h - 10))
            //.stabilize()
            ;
        return sim;
    }
    Setup.initVis=function() {
        vis = new pv.Panel().width(g.w).height(g.h)
            //.event("click",function(){alert()})
            ;
        var fillPosNeg=function(d) {  return (d.q > 0) ? "rgba(255,0,0,0.3)" : "rgba(0,0,255,0.3)" };
        var fillByE=function(d) {
            var i=d.E;
            //i=(d.E<0)?parseInt(Math.min(i/minE*255,255)):parseInt(Math.min(i/maxE*255,255));
            i=(d.q>0) ?
                ("rgb(255,"+(i)+","+(i)+")" ):("rgb("+i+","+i+",255)" );
            //console.log(i);
            return i;
          };

        vis.add(pv.Dot)
            .data(nodes)
            .left(function (d) {return d.x})
            .top(function (d) {return d.y})
            .radius(function (d) {return d.r })
            .event("mousedown", pv.Behavior.drag())
            .event("drag", function () {return this.parent})
            .strokeStyle(function (d) {  return (d.q > 0) ? "rgba(255,0,0,0.5)" : "rgba(0,0,255,0.5)"})
            .fillStyle(fillPosNeg)
            ;
        return vis;
    }


   return Setup
}

function Another4Valent(globals) {
    var g=globals;
    var qPos=+4,
        nPos=12,
        sPos=(g.size)*3,
        mPos=100*qPos; //multiple of mNeg
    var qNeg=-1,
        nNeg=nPos*qPos,
        sNeg=g.size*2,
        mNeg=1;
    var vInitMax=6;
    var forceK=60*g.size,
        forceDistMin=g.size*3,
        forceDistMax=1300,
        extraSpace=-2*g.size;
    var nodes=[], sim={}, vis={};
    var Setup={};

    Setup.initNodes=function () {
        //create positives
        nodes = [].concat(pv.range(nPos).map(function (i) {
            var x = g.w * Math.random(),
                y = g.h * Math.random(); //(parseInt(i / nx) + 1) * h / (ny + 1);
            return {
                x: x,
                y: y,
                px: x + Math.random() * vInitMax * 2 - vInitMax,
                py: y + Math.random() * vInitMax * 2 - vInitMax,
                q: qPos,
                m1: 1 / (mPos),
                r: sPos,
                Ex:0, Ey:0, E:0
            };
        }));
        //create negatives
        nodes = nodes.concat(pv.range(nNeg).map(function (i) {
            return {
                x: g.w * Math.random(),
                y: g.h * Math.random(),
                q: qNeg,
                m1: 1 / (mNeg),
                r: sNeg

            };
        }));

        return nodes;

    };
    Setup.initSim=function() {
        sim = pv.simulation(nodes)
            .force(pv.Force.electrostatic(forceK).domain(forceDistMin, forceDistMax))
            //.force(pv.Force.mousePlus(100))
            //.force(pv.Force.drag(0.001))
            .constraint(pv.Constraint.electrostaticCollision().extra(extraSpace))
            .constraint(pv.Constraint.reBound().x(10, g.w - 10).y(10, g.h - 10))
            //.stabilize()
            ;
        return sim;
    }
    Setup.initVis=function() {
        vis = new pv.Panel().width(g.w).height(g.h)
            //.event("click",function(){alert()})
            ;
        var fillPosNeg=function(d) {  return (d.q > 0) ? "rgba(255,0,0,0.3)" : "rgba(0,0,255,0.3)" };
        var fillByE=function(d) {
            var i=d.E;
            //i=(d.E<0)?parseInt(Math.min(i/minE*255,255)):parseInt(Math.min(i/maxE*255,255));
            i=(d.q>0) ?
                ("rgb(255,"+(i)+","+(i)+")" ):("rgb("+i+","+i+",255)" );
            //console.log(i);
            return i;
          };

        vis.add(pv.Dot)
            .data(nodes)
            .left(function (d) {return d.x})
            .top(function (d) {return d.y})
            .radius(function (d) {return d.r })
            //.anchor("center").add(pv.Label).text(function(d) {return d.q>0?d.q:undefined})
            .event("mousedown", pv.Behavior.drag())
            .event("drag", function () {return this.parent})
            .strokeStyle(function (d) {  return (d.q > 0) ? "rgba(255,0,0,0.5)" : "rgba(0,0,255,0.5)"})
            .fillStyle(fillPosNeg)
            ;
        return vis;
    }


   return Setup
}

function NobleGas(globals) {
    var g=globals;
    var qPos=+4,
        nPos=12,
        sPos=(g.size)*3,
        mPos=100*qPos; //multiple of mNeg
    var qNeg=-1,
        nNeg=nPos*qPos,
        sNeg=g.size*2,
        mNeg=1;
    var vInitMax=6;
    var forceK=200,
        forceDistMin=16,
        forceDistMax=1300,
        extraSpace=-2*g.size;
    var nodes=[], sim={}, vis={};
    var Setup={};

    Setup.initNodes=function () {
        //create positives
        nodes = [].concat(pv.range(nPos).map(function (i) {
            var x = g.w * Math.random(),
                y = g.h * Math.random(); //(parseInt(i / nx) + 1) * h / (ny + 1);
            return {
                x: x,
                y: y,
                px: x + Math.random() * vInitMax * 2 - vInitMax,
                py: y + Math.random() * vInitMax * 2 - vInitMax,
                q: qPos,
                m1: 1 / (mPos),
                r: sPos,
                Ex:0, Ey:0, E:0
            };
        }));
        //create negatives
        nodes = nodes.concat(pv.range(nNeg).map(function (i) {
            return {
                x: g.w * Math.random(),
                y: g.h * Math.random(),
                q: qNeg,
                m1: 1 / (mNeg),
                r: sNeg

            };
        }));

        return nodes;

    };
    Setup.initSim=function() {
        sim = pv.simulation(nodes)
            .force(pv.Force.electrostatic(forceK).domain(forceDistMin, forceDistMax))
            //.force(pv.Force.mousePlus(100))
            //.force(pv.Force.drag(0.001))
            .constraint(pv.Constraint.electrostaticCollision().extra(extraSpace))
            .constraint(pv.Constraint.reBound().x(10, g.w - 10).y(10, g.h - 10))
            //.stabilize()
            ;
        return sim;
    }
    Setup.initVis=function() {
        vis = new pv.Panel().width(g.w).height(g.h)
            //.event("click",function(){alert()})
            ;
        var fillPosNeg=function(d) {  return (d.q > 0) ? "rgba(255,0,0,0.3)" : "rgba(0,0,255,0.3)" };
        var fillByE=function(d) {
            var i=d.E;
            //i=(d.E<0)?parseInt(Math.min(i/minE*255,255)):parseInt(Math.min(i/maxE*255,255));
            i=(d.q>0) ?
                ("rgb(255,"+(i)+","+(i)+")" ):("rgb("+i+","+i+",255)" );
            //console.log(i);
            return i;
          };

        vis.add(pv.Dot)
            .data(nodes)
            .left(function (d) {return d.x})
            .top(function (d) {return d.y})
            .radius(function (d) {return d.r })
            .event("mousedown", pv.Behavior.drag())
            .event("drag", function () {return this.parent})
            .strokeStyle(function (d) {  return (d.q > 0) ? "rgba(255,0,0,0.5)" : "rgba(0,0,255,0.5)"})
            .fillStyle(fillPosNeg)
            ;
        return vis;
    }


   return Setup
};
