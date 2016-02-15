var Circle = function(position, size, options) {
  this.circle = $('<div class="circle"></div>');
  this.label = $('<span class="label"></span>');

  this.circle.append(this.label);

  this.setText = function(text) {
    this.label.text(text);
  };

  this.setSize = function(size) {
    if (size !== undefined) {
      this.size = size;
      this.circle.css('width', size);
      this.circle.css('height', size);
    }
  };

  this.setPosition = function(position) {
    if (position !== undefined) {
      this.position = position;
      this.circle.css('top', position.y - this.size / 2);
      this.circle.css('left', position.x - this.size / 2);
    }
  };

  this.setOptions = function(options) {
    if (options !== undefined) {
      for (key in options) {
        if (key != "class") {
          this.circle.attr(key, options[key]);
        } else {
          this.circle.addClass(options[key]);
        }
      }
    }
  };

  this.setOptions(options);

  this.setSize(size);
  this.setPosition(position);
}

var Satellite = function(position, size, options) {
  Circle.call(this, position, size, options);
  this.setOptions({'class': 'satellite'});
  this.satellite = this.circle;
};

Satellite.prototype = new Circle();

var Disc = function(position, size, orbit, options) {
  Circle.call(this, position, orbit, options);
  this.setOptions({'class': 'disc'});
  this.disc = this.circle;
  this.center = new Circle(new Point(orbit / 2, orbit / 2), size, options);
  this.center.setOptions({'class': 'center'});

  this.disc.append(this.center.circle);
  this.satellites = [];

  this.orbit = orbit;
  this.size = size;

  this.adjustSatellites = function() {
    var n = this.satellites.length;
    var interval = 2 * Math.PI / n;

    var radius = this.orbit / 4 + this.size / 4;
    var center = this.position;
    var totalDuration = 400;
    var splits = 30;

    this.satellites.forEach(function(sat, index) {
      var x = parseFloat(sat.satellite.css('left')) + sat.size / 2;
      var y = parseFloat(sat.satellite.css('top')) + sat.size / 2;
      var satPosition = new Point(x, y);

      var iniPolar = satPosition.polar(center);
      var endPolar = new PolarPoint(radius, interval * index, center);

      animateMotion(sat.satellite, iniPolar, endPolar, splits, totalDuration);
      sat.position = endPolar.cartesian();
    });
  };

  this.appendSatellite = function(satellite) {
    this.satellites.splice(1, 0, satellite);
    if (this.disc.parent()) {
      this.disc.parent().append(satellite.satellite);
    }
    this.adjustSatellites();
  };

  this.setText = function(text) {
    this.center.setText(text);
  }
}

Disc.prototype = new Circle();
/*
function createSatellite(position, classes, category) { //,content, count) {
  var satelliteContainer = $('<div class="satellite-container"></div>');
  var satellite = $('<div class="satellite circle"></div>');
  satellite.addClass(classes);
  satelliteContainer.append(satellite);
  satelliteContainer.css('top', position.y);
  satelliteContainer.css('left', position.x);
  satelliteContainer.attr('data-center-x', position.x);
  satelliteContainer.attr('data-center-y', position.y);

  if (category != undefined) {
    appendInput(satellite, category);
    satellite.attr('data-count', category.count);
    satellite.attr('data-id', category.id);
    satellite.click(function() {
      classify(category.id);
    });
  }

  return satelliteContainer;
}*/