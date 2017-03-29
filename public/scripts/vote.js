$(() => {

    var pro1Title = $('#pro1').html();
    var pro2Title = $('#pro2').html();

    console.log(pro1Title);
    console.log(pro2Title);


  $('#votePro1').click(function(ev) {
    const data = {
      votedPro: pro1Title,
      unvotedPro: pro2Title,
    };
    console.log('clicked');
    ev.preventDefault();
    $.ajax({
      method: "POST",
      url: "/searchres",
      data: data
    }).done(function(msg){
      console.log('this is the msg: ' + msg);
      alert('VOTED!');
    });
  })

  $('#votePro2').click(function(ev) {
    const data = {
      votedPro: pro2Title,
      unvotedPro: pro1Title
    };
    console.log('clicked');
    ev.preventDefault();
    $.ajax({
      method: "POST",
      url: "/searchres",
      data: data
    }).done(function(msg){
      console.log('this is the msg: ' + msg);
      alert('VOTED!');
    });
  })

})
