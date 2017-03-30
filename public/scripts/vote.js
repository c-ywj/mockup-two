$(() => {

  var pro1Title = $('#pro1').html();
  var pro2Title = $('#pro2').html();

  console.log(pro1Title);
  console.log(pro2Title);

  function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  }

  const category = GetURLParameter('category');
  const brand1   = GetURLParameter('brand1');
  const brand2   = GetURLParameter('brand2');



  $('#votePro1').click(function(ev) {
    const data = {
      votedPro: pro1Title,
      unvotedPro: pro2Title,
    };
    console.log('clicked');
    ev.preventDefault();
      $.ajax({
        method: "POST",
        url: "/product",
        data: data
      })
    .done(function(msg){
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
