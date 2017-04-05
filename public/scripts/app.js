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
  var $userFave = $('.user-fave');

  var loadFavList = () => {
    if (addToFave.indexOf('; ') > -1) {
      var separateItems = addToFave.split('; ');

      separateItems.forEach((item) => {
        var splitURL = item.split(' - URL: ');
        
        $sideBarList.append(`<li class="user-fave" data-saved-item="${splitURL[0]}"><a class="waves-effect" href="${splitURL[1]}" target="new">${splitURL[0]}</a></li>`);
      });
    } else if (!addToFave) {
      $userFave.remove();
    } else {
      var splitURL = addToFave.split(' - URL: ');

      $sideBarList.append(`<li class="user-fave" data-saved-item="${splitURL[0]}"><a class="btn" href="${splitURL[1]}" target="new">${splitURL[0]}</a></li>`);
    }
  }

  $addFav.on('click', function(e) {
    var $testItem = $(this).data('item');
    var $itemLink = $(this).data('item-link');

    if (!addToFave) {
      localStorage.setItem('addFav', ($testItem + ' - URL: ' + $itemLink));
      $userFave.remove();
      loadFavList();
    } else {
      localStorage.setItem('addFav', (addToFave + '; ' + $testItem + ' - URL: ' + $itemLink));
      $userFave.remove();
      loadFavList();
    }

    $(this).html('<i class="material-icons saved-fave">favorite</i> Added to list');
  });

  // Load faves list upon page refresh [important!]
  if (addToFave) {
    loadFavList();
  }

});
