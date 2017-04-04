$(() => {
  $("#logNow").click(function(e) {
    e.preventDefault();
    const email = $("#emailLogin").val();
    const password = $("#passLogin").val();
    const errorMsg = $('.errorMsg');
    if(!email || !password){
      errorMsg.remove();
      return $(".formdata").append('<span class= "errorMsg">Please fill out the form</span>')
    }
    $.ajax({
    method:"POST",
    url: "/users/login",
    data:{
      email: email,
      password: password
      }
    })
    .done((response) => {
      if(response === 'success') {
        window.location = "/search";
      } else {
        errorMsg.remove();
        $(".formdata").append('<span class= "errorMsg">This email or password is incorrect!</span>');
      }
    })
  })


  // Initialize collapse button
  $(".button-collapse").sideNav();

  // POINTS INITIALIZER
  $pointsTracker = $('.user-points');
  $storedPoints = localStorage['voterPoints'];

  if (!$storedPoints) {
    $pointsTracker.css('width', '1%');
  } else if (parseInt($storedPoints) >= 100) {
    $pointsTracker.css('width', '100%');
  } else {
    $pointsTracker.css('width', `${localStorage.getItem('voterPoints')}%`);
  };

});
