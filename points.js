function animateMotion(object, pi, pf, splits, duration) {
  // Finish all previous animations
  $(object).stop(true, true);

  for (var split = 1; split <= splits; split++) {
    var fraction = split / splits;
    var intermediate = interpolate(pi, pf, fraction).cartesian();

    var properties = {
      top: intermediate.y,
      left: intermediate.x
    }

    var options = {
      duration: duration / splits,
      easing: 'linear',
      queue: true
    }

    $(object).animate(properties, options);
  }
}

function interpolate(a, b, p) {
  if (a instanceof PolarPoint && b instanceof PolarPoint) {
    return new PolarPoint(interpolation(a.r, b.r, p), interpolation(a.alpha, b.alpha, p));
  }
  else {
    a = a.cartesian();
    b = b.cartesian();
    return new Point(interpolation(a.r, b.r, p), interpolation(a.alpha, b.alpha, p));
  }
}

function interpolation(a, b, p) {
  return a + (b - a) * p;
}

var PolarPoint = function(r, alpha) {
  this.r = parseFloat(r);
  this.alpha = parseFloat(alpha);

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

  this.polar = function() {
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
    return new PolarPoint(r, alpha);
  }
};