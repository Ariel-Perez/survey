
/*
 * Animates smoothly an object in a circular motion from positions pi to pf
 * It is the center of the object that moves along the trajectory.
 */
function animateMotion(object, pi, pf, splits, duration) {
  // Finish all previous animations
  $(object).stop(true, true);

  // Animate each frame
  for (var split = 1; split <= splits; split++) {
    var fraction = split / splits;

    // Get the destination for this frame
    var intermediate = interpolate(pi, pf, fraction);
    // Get the cartesian coordinates
    intermediate = intermediate.cartesian();

    var properties = {
      top: intermediate.y - $(object).height() / 2,
      left: intermediate.x - $(object).width() / 2
    }

    // Animate a linear movement from origin to the frame's destination
    var options = {
      duration: duration / splits,
      easing: 'linear',
      queue: true
      // Enqueue so that all motions are completed one after the other
    }

    $(object).animate(properties, options);
  }
}

/*
 * Interpolate two points a and b according to p, where:
 * interpolate(a, b, 1) = b
 * interpolate(a, b, 0) = a
 *
 * If both points are instances of PolarPoint, polar interpolation is used.
 * This means, both the radius and angle are interpolated as scalars.
 * Otherwise, regular interpolation as cartesians is used.
 */
function interpolate(a, b, p) {
  if (a instanceof PolarPoint &&
      b instanceof PolarPoint &&
      a.center == b.center) {
    return new PolarPoint(scalarInterpolation(a.r, b.r, p),
                          scalarInterpolation(a.alpha, b.alpha, p),
                          a.center);
  }
  else {
    a = a.cartesian();
    b = b.cartesian();
    return new Point(scalarInterpolation(a.r, b.r, p),
                     scalarInterpolation(a.alpha, b.alpha, p));
  }
}

/*
 * Interpolate two scalars a and b according to p, where:
 * scalarInterpolation(a, b, 1) = b
 * scalarInterpolation(a, b, 0) = a
 */
function scalarInterpolation(a, b, p) {
  return a + (b - a) * p;
}

var PolarPoint = function(r, alpha, center) {
  this.r = parseFloat(r);
  this.alpha = parseFloat(alpha);
  this.center = center;

  this.cartesian = function() {
    var x = center.x + r * Math.cos(alpha);
    var y = center.y + r * Math.sin(alpha);

    return new Point(x, y);
  }

  this.polar = function() { return this; }
};

var Point = function(x, y) {
  this.x = parseFloat(x);
  this.y = parseFloat(y);

  this.cartesian = function() { return this; }

  this.polar = function(center) {
    var dy = this.y - center.y;
    var dx = this.x - center.x;


    var alpha = Math.atan(dy / dx);
    if (dx < 0) {
      alpha += Math.PI;
    }

    if (dx == 0 && dy == 0) {
      alpha = 0;
    }

    if (alpha < 0 ) {
      alpha += 2 * Math.PI;
    }

    var r = Math.sqrt(dx * dx + dy * dy);
    return new PolarPoint(r, alpha, center);
  }
};