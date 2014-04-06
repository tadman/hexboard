var board;

$(function() {
  board = new Hexboard('#board');

  board.draw();

  $(window).on('resize', function() { board.resize() });
})
