// $(document).ready(initializeSatellites);
$(document).ready(function() {
  window.disc = new Disc(new Point(300, 200), 200, 400);
  var add = new Satellite(new Point(500, 200), 150, {'class': 'add'});
  var sat1 = new Satellite(new Point(500, 200), 150);
  var sat2 = new Satellite(new Point(500, 200), 150);

  add.satellite.click(function() {
    var sat = new Satellite(add.position, add.size);
    disc.appendSatellite(sat);
  });

  $('.canvas').append(disc.disc);

  disc.appendSatellite(add);
  // disc.appendSatellite(sat1);
  // disc.appendSatellite(sat2);
});


function initializeSatellites() {
  var disc = $('.disc');

  disc.append(createSatellite(center, 'add'));
  $.each(data.categories, function(index, category) {
    createSatellite(center, 'category', category).insertAfter('.disc :nth-child(2)');
  });

  adjustSatellites();
  nextQuery();

  $('.add').click(addButtonClick);
}

function nextQuery() {
  query = data.queries.shift();
  if (query == undefined) {
    $('.center span.label').text('-');
  }
  else {
    $('.center span.label').text(query);
  }
}

function classify(id) {
  $('[data-id=' + id + ']').attr('data-count', ++data.categories[id - 1].count);
  nextQuery();
}

function appendInput(element, category) {
  var placeholder = 'Categoría';
  var label = $('<span class="label"></span>');
  var input = $('<input type="text"></input>');
  input.attr('placeholder', placeholder);
  input.val(category.name);
  label.append(input);
  element.append(label);

  input.click(function(event) {
    event.stopPropagation();
  })
  input.change(function() {
    category.name = input.val();
  });
  input.keyup(function (e) {
    if (e.keyCode == 13) {
      input.blur();
    }
  });

  return label;
}

function addButtonClick() {
  var pos = { x: center.x, y: center.y };
  var cat = new Category();
  var sat = createSatellite(pos, 'category', cat);
  sat.insertAfter('.disc :nth-child(2)');
  data.categories.push(cat);

  sat.find('input').focus();
  adjustSatellites();
}

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


var Category = function(id, name, count) {
  Category.incrementalId = Category.incrementalId || 1;

  this.id = id || Category.incrementalId;
  this.name = name || '';
  this.count = count || 0;

  Category.incrementalId = Math.max(Category.incrementalId, this.id + 1);
};

var r = 200;
var center = { x: r, y: r };
var newClassId = 0;
var data = {
  categories: [
    //new Category(1, 'Docencia', 3),
    //new Category(2, 'Infraestructura', 2),
  ],
  queries: [
    'Los profesores son muy buenos',
    'Las salas se gotean',
    'Más áreas verdes',
    'La comida es muy mala',
    'El profesor tiene mala voluntad',
    'La profesora llega tarde',
    'Las salas tienen mucho espacio',
    'Los aranceles son muy caros',
    'La institución tiene mucho prestigio',
  ]
};