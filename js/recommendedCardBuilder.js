function threadAndMsgRecommender(threadData, Response){
  let response = Response;
  let profileName = localStorage.getItem('h_profile');
  let sortedDates = [];
  let profileSortedDates = [];
  let card_title_1, textSummary_1, card_title_2, textSummary_2, card_title_3, textSummary_3, card_url_container;
  let cardContentObject_1 = {};

  //removes the card first
  $('#card_container_1').attr("class", "col-sm-4 d-none");
  $('#card_container_3').attr("class", "col-sm-4 d-none");

  //build array of thread ID and date for sorting by date
  for (let t in threadData){
    if ( threadData[t]['names'].includes(profileName) ){
      profileSortedDates.push({ threadID: t, date: threadData[t]['threadsDateLatest'] });
    } else {
      sortedDates.push({ threadID: t, date: threadData[t]['threadsDateLatest'] });
    }
  }

  //sort both by date
  profileSortedDates.sort(function(a, b){
    return a.date > b.date ? -1: a.date < b.date ? 1: 0; 
  });
  sortedDates.sort(function(a, b){
    return a.date > b.date ? -1: a.date < b.date ? 1: 0; 
  });

  //find the text for the message
  if ( profileSortedDates.length > 0) {
    for ( let row in response ){
      if ( response[row]['id'] == profileSortedDates[0]['threadID'] ) {
        if (response[row]['refs'].length == 0){
          card_title_1 = response[row]['user'] + " annotated...";
        } else {
          card_title_1 = response[row]['user'] + " replied...";
        }
        if (response[row]['text'].length > 140){
            textSummary_1 = response[row]['text'].slice(0, 140) + "...";
        } else {
            textSummary_1 = response[row]['text'];
        } 
        card_url_container = "window.open('https://hyp.is/" + response[row]['id'] + "')"

        $( "#recommended_card_title_1" ).text(card_title_1);
        $( "#card_url_container_1" ).text(textSummary_1);
        $('#card_url_container_1').attr("onclick", card_url_container);
        $('#card_container_1').attr("class", "col-sm-4"); //shows the card by removing the 'd-none' class 
        break;
      }
    }
  }
  if ( sortedDates.length > 0 ){
    for ( let row in response){
      if ( response[row]['id'] == sortedDates[0]['threadID'] ){
        if (response[row]['refs'].length == 0){
          card_title_3 = response[row]['user'] + " annotated...";
        } else {
          card_title_3 = response[row]['user'] + " replied...";
        }
        if (response[row]['text'].length > 50){
            textSummary_3 = response[row]['text'].slice(0, 140) + "...";
        } else {
            textSummary_3 = response[row]['text'];
        }
        card_url_container = "window.open('https://hyp.is/" + response[row]['id'] + "')"

        $( "#recommended_card_title_3" ).text(card_title_3);
        $( "#recommended_card_text_3" ).text(textSummary_3);
        $( "#card_url_container_3" ).attr("onclick", card_url_container);
        $( "#card_container_3" ).attr("class", "col-sm-4"); //shows the card by removing the 'd-none' class 
        break;
      }
    }   
  }  
}

function userRecommender(participantData, Response){
  let response = Response;
  let sortedParticipantDates = [];
  let latestMsgIDforParticipant, card_url_container;
  let card_title_2, textSummary_2;

  $('#card_container_2').attr("class", "col-sm-4 d-none");

  for ( let p in participantData ){
    sortedParticipantDates.push({ user:p, repliesReceived:participantData[p]['repliesReceived'] });
  }

  //sort by most replies received
  sortedParticipantDates.sort(function( a,b ){
    return a.repliesReceived > b.repliesReceived ? -1: a.date < b.date ? 1: 0;
  });  
  
  if ( sortedParticipantDates.length > 0 ){
    latestMsgIDforParticipant = participantData[sortedParticipantDates[0]['user']]['dateLatestMsgID'];
    for ( let row in response ){
      if ( response[row]['id'] == latestMsgIDforParticipant ){
        if (response[row]['refs'].length == 0){
          card_title_2 = response[row]['user'] + " annotated...";
        } else {
          card_title_2 = response[row]['user'] + " replied...";
        };

        if (response[row]['text'].length > 140){
            textSummary_2 = response[row]['text'].slice(0, 140) + "...";
        } else {
            textSummary_2 = response[row]['text'];
        };
        card_url_container = "window.open('https://hyp.is/" + response[row]['id'] + "')"

        $( "#card_url_container_2" ).attr("onclick", card_url_container);
        $( "#card_container_2" ).attr("class", "col-sm-4");
        break;
      }
    }
    $( "#recommended_card_title_2" ).text(card_title_2);
    $( "#recommended_card_text_2" ).text(textSummary_2);
  }

}

function buildRecommendedCard(content, card){

}












