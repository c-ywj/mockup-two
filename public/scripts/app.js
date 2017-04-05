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


  // Initialize collapse button for side nav
  $(".button-collapse").sideNav();

  // Favourites List
  var $addFav = $('.add-fav');
  var addToFave = localStorage['addFav'];
  var $sideBarList = $('.user-list_content');
  var $scrollList = $('.scroll-list');

  var loadFavList = () => {
    $sideBarList.children().remove();

    if (!addToFave) {
      $scrollList.addClass('hide');
    } else {
      $scrollList.removeClass('hide');
      var favList = addToFave.split(';');
      console.log(favList);

      favList.forEach((item) => {
        eval('var someItem = ' + item);
        var alreadyAdded = $('.add-fav-wrapper').attr('data-item');
        console.log(someItem);

        if (someItem.Item === alreadyAdded) {
          console.log("THIS ITEM IS ALREADY SAVED: ", alreadyAdded);
          
          $(`div[data-item='${alreadyAdded}']`).html('<i class="material-icons saved-fave">favorite</i> Added to list');
        } else {
          console.log("NOT SAVED: ");
        }

        $sideBarList.append(`<li class="user-fave" data-saved-item="${someItem.Item}">
          <a href="${someItem.URL}" target="new">${someItem.Item}</a>
        </li>`);
      })
    }
  }

  $addFav.on('click', function(e) {
    var $testItem = $(this).parent().attr('data-item');
    var $itemLink = $(this).parent().attr('data-item-link');
    var itemObj = `{Item: '${$testItem}', URL: '${$itemLink}'}`;

    if (!addToFave) {
      localStorage.setItem('addFav', itemObj);
      loadFavList();
    } else {
      var favList = addToFave.split(';');
      var notSaved = '';

      favList.forEach((item) => {
        eval('var itemData = ' + item);

        if (itemData.Item === $testItem) {
          console.log('THIS IS ALREADY SAVED: ', $testItem);
        } else {
          console.log('THIS IS NOT YET SAVED: ', $testItem);

          notSaved = itemObj;
        }

        // console.log(itemData);
        console.log(itemData.Item);
      })

      localStorage['addFav'] += `;${itemObj}`;
      $(this).html('<i class="material-icons saved-fave">favorite</i> Added to list');

      console.log('WHAT HAPPENED: ', localStorage['addFav']);
      loadFavList();
    }
  });


  // Load list upon page refresh [this is important!]
  if (addToFave) {
    $('.user-list_heading').removeClass('hide');
    loadFavList();
  }

});
