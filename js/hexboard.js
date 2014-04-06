function Hexboard(selector, size) {
  this.container = $(selector);

  this.container.css('position', 'absolute');
  this.container.css('top', 0);
  this.container.css('right', 0);
  this.container.css('bottom', 0);
  this.container.css('left', 0);

  this.canvas = this.container.find('canvas')[0];
  this.context = this.canvas.getContext('2d');

  this.frame = 0;

  this.origin = {
    x: 128,
    y: 128
  };

  this.map = {
    width: 10,
    height: 10
  };

  this.cell = this.generateCells(this.map.width, this.map.height);

  this.cellSize = size || 64;

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

  this.redrawStart();

  this.cell[9][9].color = '#7F7F7F';
}

Hexboard.prototype.redrawStart = function() { 
  var self = this;

  var fnAnimate = function(t) {
    self.draw(t);
    window.requestAnimationFrame(fnAnimate, self);
  }

  window.requestAnimationFrame(fnAnimate, self);
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

var rs = Math.sqrt(3);
var rh = rs / 2;
var rw = 0.5;

Hexboard.prototype.originOf = function(x, y) {
  return {
    x: (3 * x) * rw,
    y: (2 * y + (x % 2)) * rh
  };
}

Hexboard.prototype.cellOf = function(x, y) {
  var gx = (x / this.cellSize) / rw;
  var gy = (y / this.cellSize) / rh;

  var a = {
    x: Math.floor((gx + 2) / 4),
    y: Math.floor((gy + 1) / 2)
  };

  var b = {
    x: Math.floor((gx + 3) / 4),
    y: Math.floor(gy / 2)
  };

  var c = {
    x: Math.floor((gx + 2) / 3),
    y: Math.floor((gy + 1) / 2)
  };

  switch (Math.floor(gx) % 6) {
    case 0:
      return a;
    case 2:
    case 3:
      return b;
    case 5:
      return c;
    /*
    case 1:
      switch (Math.floor(gy)) {
        case 0:
          return (gx % 1 > gy % 1) ? a : b;
        case 1:
          return (1 - gx % 1 < gy % 1) ? a : b;
      }
    case 4:
      switch (Math.floor(gy)) {
        case 0:
          return (1 - gx % 1 < gy % 1) ? a : b;
        case 1:
          return (gx % 1 > gy % 1) ? a : b;
      }
      */
  }
}

Hexboard.prototype.draw = function(t) {
  var _c = this.context;

  var colors = [
    '#BE1E2D',
    '#38B449',
    '#27A9E1',
    '#FBAF3F'
  ];

  ++this.frame;

  _c.fillStyle = '#FDFDFE';
  _c.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
  var bx = this.origin.x;
  var by = this.origin.y;

  var active = this.mouse && this.cellOf(this.mouse.x - bx, this.mouse.y - by);

  var sx = this.cellSize * rw;
  var sy = this.cellSize * rh;
  var w = this.cellSize;

  var left = 0;
  var right = this.map.width - 1;
  var top = 0;
  var bottom = this.map.height - 1;

  for (var y = top; y <= bottom; ++y) {
    for (var x = left; x <= right; ++x) {
      var o = this.originOf(x, y);

      _c.fillStyle = this.cell[x][y].color || colors[x % 2 + (y % 2) * 2];

      if (active && active.x == x && active.y == y) {
        _c.fillStyle = '#000000';
      }

      _c.save();
      _c.translate(bx + o.x * w, by + o.y * w);
      _c.beginPath();
      _c.moveTo(0, 0);
      _c.lineTo(sx, - sy);
      _c.lineTo(sx * 3, - sy);
      _c.lineTo(sx * 3 + sx, 0);
      _c.lineTo(sx * 3, sy);
      _c.lineTo(sx, sy);
      _c.lineTo(0, 0);
      _c.fill();
      _c.restore();
    }
  }

  if (this.mouse) {
    _c.fillStyle = '#7F0000';
    _c.fillRect(this.mouse.x - 5, this.mouse.y - 5, 10, 10)
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
  this.mouse = { x: x, y: y };
}
