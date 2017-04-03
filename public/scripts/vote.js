$(() => {
  var pro1Title = $('#pro1').html();
  var pro2Title = $('#pro2').html();
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
        <span class='res'> The product you voted has : ${scoreObj.winner.score} votes! </span>
      </div>
    `;
  }
  const renderLoserVoteCount = function(scoreObj) {
    return `
      <div class="vote-results">
        <span class='res'> versus : ${scoreObj.loser.score} </span>
      </div>
    `;
  }
  $('#votePro1').click(function(ev) {
    ev.preventDefault();
    const data = {
      votedPro: pro1Title,
      unvotedPro: pro2Title,
    };
    $('.vote-results').css('width','250px');
    $('.vote-results').css('background-color','white');
    console.log('clicked');
    $.ajax({
      method: "POST",
      url: "/product",
      data: data
    })
    .done(() => {
      console.log('second ajax');
    })
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
      $('#winner-container').html(winnerResult);
      $('#loser-container').html(loserResult);
    });
  })
  $('#votePro2').click(function(ev) {
    ev.preventDefault();
    const data = {
      votedPro: pro2Title,
      unvotedPro: pro1Title,
    };
  $('.vote-results').css('width','250px');
  $('.vote-results').css('background-color','white');
    console.log('clicked');
    $.ajax({
      method: "POST",
      url: "/product",
      data: data
    })
    .done(() => {
      console.log('second ajax');
    })
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
      $('#winner-container').html(winnerResult);
      $('#loser-container').html(loserResult);
    });
  })
})
