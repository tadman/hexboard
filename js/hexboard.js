function Hexboard(selector, size) {
  this.container = $(selector);

  this.container.css('position', 'absolute');
  this.container.css('top', 0);
  this.container.css('right', 0);
  this.container.css('bottom', 0);
  this.container.css('left', 0);

  this.canvas = this.container.find('canvas')[0];
  this.context = this.canvas.getContext('2d');

  this.origin = {
    x: 200,
    y: 200
  };

  this.grid = {
    width: 400,
    height: 400
  };

  this.cell = this.generateCells(this.grid.width, this.grid.height);

  this.gridSize = size || 25;

  this.resize();

  var self = this;

  $(this.canvas).on('click', function(ev) {
    return self.click(ev.pageX, ev.pageY, ev);
  });

  $(this.canvas).on('mousedown', function(ev) {
    return self.mousedown(ev.pageX, ev.pageY, ev);
  });

  $(this.canvas).on('mouseup', function(ev) {
    return self.mouseup(ev.pageX, ev.pageY, ev);
  });

  $(this.canvas).on('mousemove', function(ev) {
    return self.mousemove(ev.pageX, ev.pageY, ev);
  });
}

Hexboard.prototype.generateCells = function(w, h) {
  var cells = [ ];

  for (var i = 0; i < w; ++i) {
    var row = [ ];
    cells.push(row);

    for (var j = 0; j < h; ++j) {
      row.push({ });
    }
  }

  return cells;
}

Hexboard.prototype.resize = function() {
  this.canvasWidth = this.container.width();
  this.canvasHeight = this.container.height();

  this.canvas.width = this.canvasWidth;
  this.canvas.height = this.canvasHeight;

  this.draw();
}

Hexboard.prototype.draw = function() {
  var _c = this.context;

  _c.fillStyle = '#FDFDFE';
  _c.fillRect(0, 0, this.canvas.width, this.canvas.height);

  var bx = Math.floor(-(this.canvasWidth / 2));
  var by = Math.floor(-(this.canvasHeight / 2));

  var w = this.gridSize;
  var sx = w / 2;
  var sy = Math.sqrt(3) / 2 * w;

  for (var y = 0; y < this.grid.height; ++y) {

    var oy = by + (2 * sy * y) - sy + y * 3;

    for (var x = 0; x < this.grid.width; ++x) {
      var ox = bx + (3 * x * w) / 2 + x * 2;

      var dy = oy + (x % 2) * sy;

      _c.fillStyle = this.cell[x][y].color || '#F0F0F0';

      _c.beginPath();
      _c.moveTo(ox, dy);
      _c.lineTo(ox + sx, dy - sy);
      _c.lineTo(ox + sx + w, dy - sy);
      _c.lineTo(ox + sx + w + sx, dy);
      _c.lineTo(ox + sx + w, dy + sy);
      _c.lineTo(ox + sx, dy + sy);
      _c.lineTo(ox, dy);
      _c.fill();
    }
  }
}

Hexboard.prototype.click = function(x, y, ev) {

}

Hexboard.prototype.mousedown = function(x, y, ev) {
  this.down = { x: x, y: y };
}

Hexboard.prototype.mouseup = function(x, y, ev) {
  this.down = undefined;
}

Hexboard.prototype.mousemove = function(x, y, ev) {
  
}
