// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });

$(() => {
  var $formdata = $('.formdata form');

  $formdata.on('submit', function(ev) {
    ev.preventDefault();
    const formData = $(ev.target).serialize();
    $.ajax({
      method: 'POST',
      url: "http://localhost:8080/login",
      data: formData
    }).done(function() {
      window.location = 'http://localhost:8080';
    });
  })
}
