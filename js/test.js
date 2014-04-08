var board;

$(function() {
  board = new Hexboard('#board');
  board.debug = $('#diagnostic');

  board.draw();

  $(window).on('resize', function() { board.resize() });

})
