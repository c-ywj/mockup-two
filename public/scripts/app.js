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

  var renderList = (listItem) => `<li class="user-fave" data-saved-item="${listItem.Item}">
          <a href="${listItem.URL}" target="new">${listItem.Item}</a>
        </li>`;

  var loadFavList = () => {
    $sideBarList.children().remove();

    if (addToFave) {
      var favList = addToFave.split(';');
      if (favList.length >= 6) {
        $scrollList.removeClass('hide');
      }
      console.log(favList);

      favList.forEach((item) => {
        eval('var itemData = ' + item);
        var card1 = $('.add-fav-wrapper#card1').attr('data-item');
        var card2 = $('.add-fav-wrapper#card2').attr('data-item');
        console.log(itemData);

        if (itemData.Item === card1 || itemData.Item === card2) {
          console.log("THIS ITEM IS ALREADY SAVED: ", itemData.Item);
          
          $(`div[data-item='${itemData.Item}']`).html('<i class="material-icons saved-fave">favorite</i> Added to list');
        } else {
          console.log("NO DUPLICATES");
        }

        var $render = renderList(itemData);
        $sideBarList.prepend($render);
      })
    }
  }

  // Load list upon page refresh [this is important!]
  if (addToFave) {
    $('.user-list_heading').removeClass('hide');
    loadFavList();
  } else {
    $sideBarList.html('<span class="scroll-list"><em>(Oops! Your list is empty!)<br/>Product links you save get added here until the end of each session</em></span>');
  }

  $addFav.on('click', function(e) {
    var $testItem = $(this).parent().attr('data-item');
    var $itemLink = $(this).parent().attr('data-item-link');
    var itemObj = `{Item: '${$testItem}', URL: '${$itemLink}'}`;

    if (!addToFave) {
      localStorage.setItem('addFav', itemObj);
      $(this).html('<i class="material-icons saved-fave">favorite</i> Added to list');
    } else {
      localStorage['addFav'] += `;${itemObj}`;
      $(this).html('<i class="material-icons saved-fave">favorite</i> Added to list');

      console.log('UPDATED LOCALSTORAGE["ADDFAVE"]: ', localStorage['addFav']);
    }

    loadFavList();
  });

});
