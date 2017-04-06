
$(() => {
  let $productCard = $('.card_products');
  let $resultsCard = $('.card_results');

    $('.voteBtn').on('click', (ev) => {
      $resultsCard.removeClass('hide');
      $('#firstProd').css('-webkit-transform','rotateY(70deg) translateX( -150px )  translateY(24px) translateZ(50px)');
      $('#secondProd').css('-webkit-transform','rotateY(-70deg) translateX(150px) translateY(24px) translateZ(50px)' );
      $('.voteBtn').hide();
      $('#cont').css( '-webkit-transform', 'translate3d( 0px, 240px, 0px)');
    })
    //
    // $('').on('click',(ev) => {
    //
    // })
});
