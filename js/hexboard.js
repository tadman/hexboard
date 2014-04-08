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

Hexboard.prototype.gridToPixels = function(p) {
  return {
    x: Math.floor(p.x * rw * this.cellSize),
    y: Math.floor(p.y * rh * this.cellSize)
  };
}

Hexboard.prototype.pixelsToGrid = function(p) {
  return {
    x: p.x / rw / this.cellSize,
    y: p.y / rh / this.cellSize
  };
}

Hexboard.prototype.originOf = function(p) {
  return this.gridToPixels({
    x: (3 * p.x),
    y: (2 * p.y + (p.x % 2))
  });
}

Hexboard.prototype.gridDimensions = function(p) {
  var grid = this.pixelsToGrid(p);
  var pixel = this.gridToPixels({
    x: Math.floor(grid.x),
    y: Math.floor(grid.y)
  });

  pixel.w = rw * this.cellSize;
  pixel.h = rh * this.cellSize;

  return pixel;
}

Hexboard.prototype.cellOf = function(p) {
  var pg = this.pixelsToGrid(p);

  var mx = pg.x % 6;
  if (mx < 0) {
    mx += 6;
  }

  var my = pg.y % 2;
  if (my < 0) {
    my += 2;
  }

  if (this.debug) {
    this.debug.html('x=' + mx + ' y=' + my)
  }

  var xEven = Math.floor((pg.x + 2) / 6) * 2;
  var xOdd = Math.floor((pg.x - 1) / 6) * 2 + 1;
  var y = Math.floor(pg.y / 2);

  if (mx >= 2 && mx <= 4) {
    return { x: xOdd, y: y };
  }

  if (mx < 1 || mx > 5) {
    if (my > 1) {
      return { x: xEven, y: y + 1 };
    }
    else {
     return { x: xEven, y: y }; 
    }
  }

  if (mx >= 1 && mx < 2) {
    if (my <= 1) {
      if ((2 - mx) > my) {
        return { x: xEven, y: y };
      }
      else {
        return { x: xOdd, y: y };
      }
    }
    else {
      if (mx > my) {
        return { x: xOdd, y: y };
      }
      else {
        return { x: xEven, y: y + 1 };
      }
    }
  }

  if (mx >= 4 && mx < 5) {
    if (my <= 1) {
      if ((mx - 4) > my) {
        return { x: xEven, y: y };
      }
      else {
        return { x: xOdd, y: y };
      }
    }
    else {
      if ((6 - mx) > my) {
        return { x: xEven, y: y + 1 };
      }
      else {
        return { x: xOdd, y: y };
      }
    }
  }

  return { x: xOdd, y: y };
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

  var mousePos = this.mouse && { x: this.mouse.x - bx, y: this.mouse.y - by };
  var active = this.mouse && this.cellOf(mousePos);

  var sx = this.cellSize * rw;
  var sy = this.cellSize * rh;
  var w = this.cellSize;

  var left = 0;
  var right = this.map.width - 1;
  var top = 0;
  var bottom = this.map.height - 1;

  for (var y = top; y <= bottom; ++y) {
    for (var x = left; x <= right; ++x) {
      var o = this.originOf({ x: x, y: y });

      _c.fillStyle = this.cell[x][y].color || colors[x % 2 + (y % 2) * 2];

      if (active && active.x == x && active.y == y) {
        _c.fillStyle = '#7F7F7F';
      }

      _c.save();
      _c.translate(bx + o.x, by + o.y);
      _c.beginPath();
      _c.moveTo(-sx * 2, 0);
      _c.lineTo(-sx, - sy);
      _c.lineTo(sx, - sy);
      _c.lineTo(sx * 2, 0);
      _c.lineTo(sx, sy);
      _c.lineTo(-sx, sy);
      _c.lineTo(-sx * 2, 0);
      _c.fill();
      _c.restore();
    }
  }

  if (this.mouse) {
    if (this.mouse.x < this.origin.x || this.mouse.y < this.origin.y) {
      _c.fillStyle = '#007F00';
    }
    else {
      _c.fillStyle = '#7F0000';
    }
    _c.fillRect(this.mouse.x - 5, this.mouse.y - 5, 10, 10)

    _c.strokeStyle = '#000000';

    var box = this.gridDimensions(mousePos);

    _c.strokeRect(bx + box.x, by + box.y, box.w, box.h);
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
