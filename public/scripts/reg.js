$(() => {
  $("#regBtn").click ((e) => {
    e.preventDefault();
    const email = $("#emailReg").val();
    const password = $("#passReg").val();
    const errorMsg = $('.errorMsg');
    if(!email || !password){
      errorMsg.remove();
      return $(".regForm").append('<span class="errorMsg">Please fill out the form</span>')
    }
    $.ajax({
      method:"POST",
      url: "/users/register",
      data:{
        email: email,
        password: password
      }
    })
    .done((response) => {
      console.log(response);
      if(response === 'success') {
        window.location = "/search";
      } else {
        errorMsg.remove();
        $(".regForm").append('<span class="errorMsg">This email already exists</span>');
      }
      // if( response.email === email ){
      //   return $(".regForm").append('<span>This email already exists</span>')
      // } else {
      //   window.location = "/";
      // }
    })
  })
});
