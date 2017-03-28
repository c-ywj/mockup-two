$(() => {

    var pro1Title = $('#pro1').html();
    var pro2Title = $('#pro2').html();

    console.log(pro1Title);
    console.log(pro2Title);

    var data = {
      pro1Title: pro1Title,
      pro2Title: pro2Title
    }


  $('#votePro1').click(function(ev) {
    console.log('clicked');
    ev.preventDefault();
    $.ajax({
      method: "POST",
      url: "/test",
      data: data
    }).done(function(msg){
      console.log('this is the msg: ' + msg);
      alert('VOTED!');
    });
  })

})
