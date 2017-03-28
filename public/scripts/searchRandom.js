$(() => {
  var $searchR = $('.form-wrapper button');

  $search.on('submit', function(ev) {
    ev.preventDefault();

    const rand2 = Math.floor(Math.random() * 5);

    $.ajax({
      method: 'GET',
      url: "/test",
      data: {

      }
    }).done(function() {

    });
  })
}
