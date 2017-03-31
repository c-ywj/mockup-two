$(() => {

  var pro1Title = $('#pro1').html();
  var pro2Title = $('#pro2').html();

  console.log(pro1Title);
  console.log(pro2Title);

  function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  }

  const category = GetURLParameter('category');
  const brand1   = GetURLParameter('brand1');
  const brand2   = GetURLParameter('brand2');

  const createPairElement = function (newPair) {
    return
    `
    <div class="row">
      <div class="col s12 m7">
        <div class="card large">
          <div class="card-image">
            <img src="<%- br1.image1 %>">
            <span class="card-title">Card Title</span>
          </div>
            <div class="card-content">
              <p><span id='pro1'><%= br1.pTitle1 %></span> <br>
                 <%= br1.ProductType1 %>
                 <%= br1.description %>
              </p>
            </div>
          <div class="card-action">
            <a href="<%- br1.DetailPageURL1 %>">Click here to buy the item!</a>
          </div>
        </div>
      </div>
      <button type="submit" id="votePro1">Vote!</button>
    </div>

    <div class="row">
      <div class="col s12 m7">
        <div class="card large">
          <div class="card-image">
            <img src="<%- br2.image2 %>">
            <span class="card-title">Card Title</span>
          </div>
          <div class="card-content">
            <p><span id='pro2'><%= br2.pTitle2 %></span> <br>
               <%= br2.ProductType2 %>
               <%= br2.description %>
            </p>
          </div>
          <div class="card-action">
            <a href="<%- br2.DetailPageURL2 %>">Click here to buy the item!</a>
          </div>
        </div>
      </div>
      <button type="submit" id="votePro2">Vote!</button>
    </div>
    `
  }

  const renderPair = function (pair) {
    const pairContainer = $('#pair-container');
    const result        = createPairElement(pair);
    pairContainer.html(result);
  }

  const fetchPair = function () {
    $.ajax({
      method: "GET",
      url: "/product",
    })
     .done(renderPair)
     .fail(console.error)
  };



  $('#votePro1').click(function(ev) {
    const data = {
      votedPro: pro1Title,
      unvotedPro: pro2Title,
    };
    console.log('clicked');
    ev.preventDefault();
      $.ajax({
        method: "POST",
        url: "/product",
        data: data
      })
      .done(function(){
        fetchPair();
      });
  })

  $('#votePro2').click(function(ev) {
    const data = {
      votedPro: pro2Title,
      unvotedPro: pro1Title,
    };
    console.log('clicked');
    ev.preventDefault();
      $.ajax({
        method: "POST",
        url: "/product",
        data: data
      })
      .done(function(){
        fetchPair();
      });
  })

})
