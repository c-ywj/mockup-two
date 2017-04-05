$(() => {
  $("#logNow").click(function(e) {
    e.preventDefault();
    const email = $("#emailLogin").val();
    const password = $("#passLogin").val();
    const errorMsg = $('.errorMsg');
    if(!email || !password){
      errorMsg.remove();
      return $(".formdata").append('<span class= "errorMsg">Please fill out the form</span>')
    }
    $.ajax({
    method:"POST",
    url: "/users/login",
    data:{
      email: email,
      password: password
      }
    })
    .done((response) => {
      if(response === 'success') {
        window.location = "/search";
      } else {
        errorMsg.remove();
        $(".formdata").append('<span class= "errorMsg">This email or password is incorrect!</span>');
      }
    })
  })


  // Initialize collapse button
  $(".button-collapse").sideNav();

  // Favourites List
  var $addFav = $('.add-fav');
  var addToFave = localStorage['addFav'];
  var $sideBarList = $('.user-current-list');

  if(addToFave) {
    var separateItems = addToFave.split('; ');

    separateItems.forEach((item) => {
      var splitURL = item.split(' - URL: ');

      $sideBarList.append(`<li data-saved-item="${splitURL[0]}"><a href="${splitURL[1]}" target="new">${splitURL[0]}</a></li>`);
      
      console.log('ITEM: ', item);
    });
  }

  $addFav.on('click', function(e) {
    var $testItem = $(this).data('item');
    var $itemLink = $(this).data('item-link');

    if (!addToFave) {
      localStorage.setItem('addFav', ($testItem + ' - URL: ' + $itemLink));
    } else {
      localStorage.setItem('addFav', (addToFave + '; ' + $testItem + ' - URL: ' + $itemLink));
    }

    $(this).html('<i class="material-icons saved-fave">favorite</i> Added to list');

    console.log('DATA-ATTR', $testItem);
    console.log('addFav: ', addToFave, '\nsessionFave: ', currentFavList);
  });

});
