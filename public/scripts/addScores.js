
$(() => {
  let $productCard = $('.card_products');
  let $resultsCard = $('.card_results');

    $('.voteBtn').on('click', function(ev) {
      $('.res').css('display','block');
      $('#firstProd').css('-webkit-transform','rotateY(70deg) translateX( -150px )  translateY(24px) translateZ(50px)');
      $('#secondProd').css('-webkit-transform','rotateY(-70deg) translateX(150px) translateY(24px) translateZ(50px)' );
      $('.voteBtn').hide();
    })

});
