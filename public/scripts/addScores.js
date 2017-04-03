
$(() => {

    $('.voteBtn').on('click', function(ev) {
      $('#firstProd').css('-webkit-transform','rotateY(70deg) translateX( -150px )  translateY(24px) translateZ(50px)');
      $('#secondProd').css('-webkit-transform','rotateY(-70deg) translateX(150px) translateY(24px) translateZ(50px)' );
      $('.voteBtn').hide();
    })



});
