'use strict';

$(() => {
  var $addFav = $('.add-fav');
  var addToFave = localStorage['addFav'];
  // this stores all saved favourites into an array
  var currentFavList = localStorage['sessionFav'];
  var sideBarList = $('.user-current-list');

  if(addToFave) {
    var separateItems = addToFave.split('; ');

    separateItems.forEach((item) => {
      console.log('ITEM: ', item);
    });
  }

  $addFav.on('click', function(e) {
    var $testItem = $(this).data('item');

    if (!addToFave) {
      localStorage.setItem('addFav', $testItem);
    } else {
      localStorage.setItem('addFav', (addToFave + '; ' + $testItem));
    }



    $(this).html('<i class="material-icons saved-fave">favorite</i> Added to list');

    console.log('DATA-ATTR', $testItem);
    console.log('addFav: ', addToFave, '\nsessionFave: ', currentFavList);
  });

  // $('#heart1').on('click', function(ev) {
  //   $('.fav1').hide();
  //   $('.fav2').css('display','block');
  // })

  // $('#heart2').on('click', function(ev) {
  //   $('.fav2').hide();
  //   $('.fav1').css('display','block');
  // })

  // $('#heart3').on('click', function(ev) {
  //   $('.fav3').hide();
  //   $('.fav4').css('display','block');
  // })

  // $('#heart4').on('click', function(ev) {
  //   $('.fav4').hide();
  //   $('.fav3').css('display','block');
  // })

});
