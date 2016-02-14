
var Disc = function(position, size, orbit, options) {
  this.size = size;
  this.orbit = orbit;
  this.position = position;

  this.disc = $('<div class="circle disc"></div>');
  this.center = $('<div class="circle center"></div>');
  this.label = $('<span class="label"></span>');

  this.satellites = [];

  this.center.append(this.label);
  this.disc.append(this.center);

  if (options !== undefined) {
    for (key in options) {
      this.disc.attr(key, options[key]);
    }
  }

  this.setText = function(text) {
    this.label.text(text);
  }

  this.setPosition = function(point) {
    this.position = position;
    this.disc.css('top', point.y - this.orbit / 2);
    this.disc.css('left', point.x - this.orbit / 2);
  }

  this.setSize = function(size) {
    this.size = size;
    this.center.css('width', size);
    this.center.css('height', size);
    this.center.css('top', this.orbit / 2 - this.size / 2);
    this.center.css('left', this.orbit / 2 - this.size / 2);
  }

  this.setOrbit = function(orbit) {
    this.orbit = orbit;
    this.disc.css('width', orbit);
    this.disc.css('height', orbit);
    this.center.css('top', this.orbit / 2 - this.size / 2);
    this.center.css('left', this.orbit / 2 - this.size / 2);
  }

  this.setSize(size);
  this.setOrbit(orbit);
  this.setPosition(position);

  this.appendSatellite = function(satellite) {
    this.satellites.splice(1, 0, satellite);
    if (this.disc.parent()) {
      this.disc.parent().append(satellite.satellite);
    }

    var n = this.satellites.length;
    var interval = 2 * Math.PI / n;

    var radius = this.orbit / 2;
    var center = this.position;
    var totalDuration = 400;
    var splits = 10;

    this.satellites.forEach(function(sat, index) {
      var x = parseFloat(sat.satellite.css('left')) + sat.size / 2;
      var y = parseFloat(sat.satellite.css('top')) + sat.size / 2;
      var satPosition = new Point(x, y);

      var iniPolar = satPosition.polar(center);
      var endPolar = new PolarPoint(radius, interval * index, center);

      animateMotion(sat.satellite, iniPolar, endPolar, splits, totalDuration);
      sat.position = endPolar.cartesian();
    });
  }
}


var Satellite = function(position, size, options) {
  this.satellite = $('<div class="satellite circle"></div>');
  this.label = $('<span class="label"></span>');

  if (options !== undefined) {
    for (key in options) {
      if (key != "class") {
        this.satellite.attr(key, options[key]);
      } else {
        this.satellite.addClass(options[key]);
      }
    }
  }

  this.satellite.append(this.label);

  this.setText = function(text) {
    this.label.text(text);
  }

  this.setSize = function(size) {
    this.size = size;
    this.satellite.css('width', size);
    this.satellite.css('height', size);
  }

  this.setPosition = function(point) {
    this.position = point;
    this.satellite.css('top', point.y - this.size / 2);
    this.satellite.css('left', point.x - this.size / 2);
  }

  this.setSize(size);
  this.setPosition(position);
};
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
}