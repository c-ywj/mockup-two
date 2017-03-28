$(() => {
  $("#loginBtn").click(function(e) {
    e.preventDefault();
    var email = $("#emailLogin").val();
    var password = $("#passLogin").val();
    if(!email || !password){
      return $(".formdata").append('<span>Please fill out the form</span>')
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
        window.location = "/";
      } else {
        $(".formdata").append('<span>This email or password is incorrect!</span>');
      }
    })
  })
});
