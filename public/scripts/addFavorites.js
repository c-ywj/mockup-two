$(() => {

  $('#heart1').on('click', function(ev) {
    $('.heart1').hide();
    $('.heart2').css('display','block');
  })

  $('#heart2').on('click', function(ev) {
    $('.heart2').hide();
    $('.heart1').css('display','block');
  })

});
