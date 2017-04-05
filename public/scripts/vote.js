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
      <input type    ="button" id="next"
             value   ="Next Pair"
             onClick ="window.location.reload()">
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
  $pointsTracker = $('.user-points');

  const calcPoints = () => {
    storedPoints = localStorage['voterPoints'];

    if (!storedPoints) {
      localStorage.setItem('voterPoints', 10);
    } else if (storedPoints == 70) {    
      alert('HEY, YOU HIT 70 PTS!');
    } else if (storedPoints >= 100) {
      maxPoints = 100;
      localStorage.setItem('voterPoints', maxPoints);
    } else {
      var currentPoints = parseInt(storedPoints);
      localStorage.setItem('voterPoints', (currentPoints + 10));
    }

    return $pointsTracker.animate({width:`${localStorage.getItem('voterPoints')}%`}, 3000, 'swing');
  }

  // Random string generator
  const randStr = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randStr = "";
  for(let i = 0; i < 8; i++){
    let randNum = Math.floor(Math.random()* chars.length)
    randStr += chars[randNum];
    }
  }

  // VOTE RESULTS
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

          if(voteResults.winner.score >= voteResults.loser.score){
            // If voter landed on vote majority, alculate new points
            calcPoints();

            $('#winner-container').html(winnerResult);
            $('#loser-container').html(loserResult);
            $('#message-container').html(userWinner);
            $('#message-container').css('font-size', '38px');
            $('#nextBtn').html(nextButton);
          } else {
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

          if(voteResults.winner.score >= voteResults.loser.score){
            // If voter landed on vote majority, alculate new points
            calcPoints();

            $('#winner-container').html(winnerResult);
            $('#loser-container').html(loserResult);
            $('#message-container').html(userWinner);
            $('#message-container').css('font-size', '38px');
            $('#nextBtn').html(nextButton);
          } else {
            $('#winner-container').html(winnerResult);
            $('#loser-container').html(loserResult);
            $('#message-container').html(userLooser);
            $('#message-container').css('font-size', '38px');
            $('#nextBtn').html(nextButton);
          }
      });
    })
  })

  $('#logout').click( (e) => {
    // Upon user logout, clear points tracker and favourites list
    // localStorage.clear();
    delete localStorage['voterPoints'];
    delete localStorage['addFav'];
    window.location = '/users/logout';
    return false;
  });

})
