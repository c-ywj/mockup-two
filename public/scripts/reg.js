$(() => {
  $("#regBtn").click ((e) => {
    e.preventDefault();
    var email = $("#emailReg").val();
    var password = $("#passReg").val();
    if(!email || !password){
      return $(".regForm").append('<span>Please fill out the form</span>')
    }
    $.ajax({
      method:"POST",
      url: "/register",
      data:{
        email: email,
        password: password
      }
    })
    .done((response) => {
      console.log(response);
      if(response === 'success') {
        window.location = "/";
      } else {
        $(".regForm").append('<span>This email already exists</span>');
      }
      // if( response.email === email ){
      //   return $(".regForm").append('<span>This email already exists</span>')
      // } else {
      //   window.location = "/";
      // }
    })
  })
});
