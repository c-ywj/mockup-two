$(() => {

  $('#heart1').on('click', function(ev) {
    $('.fav1').hide();
    $('.fav2').css('display','block');
  })

  $('#heart2').on('click', function(ev) {
    $('.fav2').hide();
    $('.fav1').css('display','block');
  })

  $('#heart3').on('click', function(ev) {
    $('.fav3').hide();
    $('.fav4').css('display','block');
  })

  $('#heart4').on('click', function(ev) {
    $('.fav4').hide();
    $('.fav3').css('display','block');
  })

});
