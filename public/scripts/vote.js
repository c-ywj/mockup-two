$(() => {
  var pro1Title = $('#pro1').html();
  var pro2Title = $('#pro2').html();
  var pro1asin  = $('#pro1asin').html();
  var pro2asin  = $('#pro2asin').html();
  var image1 = $('#prodImg1').html();
  var image2 = $('#prodImg2').html();
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
  const keywords = GetURLParameter('keywords')
  const brand1   = GetURLParameter('brand1');
  const brand2   = GetURLParameter('brand2');
  const renderWinnerVoteCount = function (scoreObj) {
    return `
      <div class="vote-results">
        <span > The product you voted has : ${scoreObj.winner.score} % votes! </span>
        <div class="percentage">
          <span id='span' style="width: ${scoreObj.winner.score}%"></span>
        </div>
      </div>
    `;
  }
  const renderLoserVoteCount = function(scoreObj) {
    return `
      <div class="vote-results">
        <span > versus : ${scoreObj.loser.score} % </span>
        <div class="percentage">
          <span id='span' style="width:${scoreObj.loser.score}%"></span>
        </div>
      </div>
    `;
  }
  const renderNextButton = function() {
    return `
      <button type="submit" id="next">Next Pair</button>
    `;
  }
  const userWinner = (e) => {
    return `
      <div class="vote-results">
        <span > Congratulation! You've earned 10 points!!!</span>
      </div>
    `;
  }
  const userLooser = (e) => {
    return `
      <div class="vote-results">
        <span > You lost the battle but not the war!Keep fighting!</span>
      </div>
    `;
  }

  // POINTS TRACKER LOGIC
  const calcPoints = () => {
    if (!localStorage['voterPoints']) {
      localStorage.setItem('voterPoints', 10);
      return `<div class="meter">
        <span style="width:1%"></span>
      </div>`
    } else {
      var currentPoints = parseInt(localStorage.getItem('voterPoints'));
      localStorage.setItem('voterPoints', (currentPoints + 10))
      return `<div class="meter">
        <span style="width:${currentPoints}%"></span>
      </div>`
    }
    console.log(localStorage.getItem('voterPoints'));
    console.log(`CURRENT POINTS: ${localStorage.getItem('voterPoints')}`);
    trackPoints()
  }

  const trackPoints = () => {
    const userPoint = localStorage.getItem('voterPoints');
    return `<div class="meter">
      <span style="width:${userPoint || 1}%"></span>
    </div>`
  }

  $('#pointsCnt').html(trackPoints());

  const randStr = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randStr = "";
  for(let i = 0; i < 8; i++){
    let randNum = Math.floor(Math.random()* chars.length)
    randStr += chars[randNum];
    }
  }

  const renderNextPair = (productInfo) => {
    const pro1Title = productInfo.br1.pTitle1[0];
    const pro2Title = productInfo.br2.pTitle2[0];
    const pro1Img   = productInfo.br1.image1[0];
    const pro2Img   = productInfo.br2.image2[0];
    const pro1Asin  = productInfo.br1.asin[0];
    const pro2Asin  = productInfo.br2.asin[0];
    const pro1Type  = productInfo.br1.ProductType1[0];
    const pro2Type  = productInfo.br2.ProductType2[0];
    return `
          <h1 id= 'message-container' >may the odds be with you</h1>
      <div class="row">
        <div class="card_products col s3 m4 l5" id="firstProd">
          <div class="card">
            <div class="card-image">
              <img id="prodImg1" src="${pro1Img}">
            </div>
            <div class="card-content">
              <h6 id='pro1'>${pro1Title}</h6>
               <p>${pro1Type}
                  (<span id="pro1asin">${pro1Asin}</span>)
               }
              </p>
                <div class='fav1'>
                   <p><img id='heart1' src='/images/heart.png'/>click to add on your favorite list </p>
                </div>
                <div class='fav2'>
                   <p><img id='heart2' src='/images/heartFilled.png'/> added to favorite list</p>
                </div>
            </div>
            <div class="card-action">
              <a href="<%- br1.DetailPageURL1 %>">Click here to buy the item!</a>
            </div>
          </div>
         <button type="submit" class ='voteBtn' id="votePro1">Vote!</button>
        </div>


        <div class="card_products col s3 m4 l5" id='secondProd'>
          <div class="card">
            <div class="card-image">
              <img id "prodImg2" src="${pro2Img}">
            </div>
            <div class="card-content">
              <h6 id='pro2'>${pro2Title}</h6>
              <p>
                 ${pro2Type}
                 (<span id="pro2asin">${pro2Asin}</span>)
              </p>
              <div class='fav3'>
                 <p><img id='heart3' src='/images/heart.png'/>click to add on your favorite list </p>
              </div>
              <div class='fav4'>
                 <p><img id='heart4' src='/images/heartFilled.png'/> added to favorite list</p>
              </div>
            </div>
            <div class="card-action">
              <a href="<%- br2.DetailPageURL2 %>">Click here to buy the item!</a>
            </div>
          </div>
          <button type="submit" class ='voteBtn' id="votePro2">Vote!</button>
        </div>

      </div>
      `
  }

  $('#votePro1').click(function(ev) {
    ev.preventDefault();
    const data = {
      votedPro: pro1Title,
      votedAsin: pro1asin,
      unvotedPro: pro2Title,
      unvotedAsin: pro2asin
    };
    console.log('clicked');
    $.ajax({
      method: "POST",
      url: "/search/product",
      data: data
    })
    .done(() => {
      console.log('second ajax');
      $.ajax({
        method: "POST",
        url: "/votes",
        data: data
      })
      .done(function(voteResults) {
        console.log('second ajax response');
        console.log(voteResults);
        const winnerResult = renderWinnerVoteCount(voteResults);
        const loserResult = renderLoserVoteCount(voteResults);
        const nextButton = renderNextButton();
        // $('#winner-container').html(winnerResult);
        // $('#loser-container').html(loserResult);

          if(voteResults.winner.score >= voteResults.loser.score){
            $('#winner-container').html(winnerResult);
            $('#loser-container').html(loserResult);
            $('#message-container').html(userWinner);
            $('#message-container').css('font-size', '38px');
            $('#pointsCnt').html(calcPoints());
            $('#nextBtn').html(nextButton);
          } else {
            $('#pointsCnt').html(trackPoints());
            $('#winner-container').html(winnerResult);
            $('#loser-container').html(loserResult);
            $('#message-container').html(userLooser);
            $('#message-container').css('font-size', '38px');
            $('#nextBtn').html(nextButton);
          }
      });
    })
  });
  $('#votePro2').click(function(ev) {
    ev.preventDefault();
    const data = {
      votedPro: pro2Title,
      votedAsin: pro2asin,
      unvotedPro: pro1Title,
      unvotedAsin: pro1asin
    };
    console.log('clicked');
    $.ajax({
      method: "POST",
      url: "/search/product",
      data: data
    })
    .done(() => {
      console.log('second ajax');
      $.ajax({
        method: "POST",
        url: "/votes",
        data: data
      })
      .done(function(voteResults) {
        console.log('second ajax response');
        console.log(voteResults);
        const winnerResult = renderWinnerVoteCount(voteResults);
        const loserResult = renderLoserVoteCount(voteResults);
        const nextButton = renderNextButton();
        // $('#winner-container').html(winnerResult);
        // $('#loser-container').html(loserResult);

          if(voteResults.winner.score >= voteResults.loser.score){
            $('#pointsCnt').html(calcPoints());
            $('#winner-container').html(winnerResult);
            $('#loser-container').html(loserResult);
            $('#message-container').html(userWinner);
            $('#message-container').css('font-size', '38px');
            $('#nextBtn').html(nextButton);
          } else {
            $('#pointsCnt').html(trackPoints());
            $('#winner-container').html(winnerResult);
            $('#loser-container').html(loserResult);
            $('#message-container').html(userLooser);
            $('#message-container').css('font-size', '38px');
            $('#nextBtn').html(nextButton);
          }
      });
    })
  })
  //
  $('#logout').click( (e) => {
      localStorage.clear();
      window.location = '/users/logout';
      return false;
  });

  $(document).on('click', '#next', function(ev) {
    console.log('clicked');
    ev.preventDefault();
          $.ajax({
        method: "POST",
        url: "/search/product/nextpair",
        data: {
          category: category,
          keywords: keywords,
          brand1: brand1,
          brand2: brand2
        }
      }).then(function(productInfo) {
        console.log(productInfo.br2.pTitle2[0]);
          const newPair = renderNextPair(productInfo);
          $("body").html(newPair);
          });
  })

// $(() => {
//     $('#next').click(function(ev) {
//       console.log('clicked');
//       $.ajax({
//         method: "POST",
//         url: "/search/product/nextpair",
//         data: {
//           category: category,
//           keywords: keywords,
//           brand1: brand1,
//           brand2: brand2
//         }
//       }).then({function(result) {
//         console.log(result);
//         }
//       })
//     })
//   })

  // $('#logout').click(function()
  // {
  //   $.ajax({
  //     method:"POST",
  //     url: "/users/register",
  //     data:{
  //       email: email,
  //       password: password
  //     }
  //   }).done((e) =>{
  //     localStorage.clear();
  //     location.reload();
  //     return false;
  //
  //   })
  //
  //     });
  // });

})
