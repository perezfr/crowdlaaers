function threadAndMsgRecommender(threadData, Response){
  let _response = Response;
  let profileName = localStorage.getItem('h_profile');
  let sortedDates = [];
  let profileSortedDates = [];
  let card_title_1, textSummary_1, card_title_3, textSummary_3;
  let cardContentObject_1 = {};

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
  for ( let row in _response ){
    if ( profileSortedDates.length > 0) {
      if ( _response[row]['id'] == profileSortedDates[0]['threadID'] ) {
        if (_response[row]['refs'].length == 0){
          card_title_1 = _response[row]['user'] + " annotated...";
        } else {
          card_title_1 = _response[row]['user'] + " replied...";
        }
        if (_response[row]['text'].length > 140){
            textSummary_1 = _response[row]['text'].slice(0, 140) + "...";
        } else {
            textSummary_1 = _response[row]['text'];
        } 
      }
      if ( _response[row]['id'] == sortedDates[0]['threadID'] ) {
        if (_response[row]['refs'].length == 0){
          card_title_2 = _response[row]['user'] + " annotated...";
        } else {
          card_title_2 = _response[row]['user'] + " replied...";
        }
        if (_response[row]['text'].length > 140){
            textSummary_2 = _response[row]['text'].slice(0, 140) + "...";
        } else {
            textSummary_2 = _response[row]['text'];
        }  
      }
      if ( _response[row]['id'] == sortedDates[1]['threadID'] ) {
        if (_response[row]['refs'].length == 0){
          card_title_3 = _response[row]['user'] + " annotated...";
        } else {
          card_title_3 = _response[row]['user'] + " replied...";
        }
        if (_response[row]['text'].length > 140){
            textSummary_3 = _response[row]['text'].slice(0, 140) + "...";
        } else {
            textSummary_3 = _response[row]['text'];
        }  
      }
    } else if ( _response[row]['id'] == sortedDates[0]['threadID'] ){
      if (_response[row]['refs'].length == 0){
        card_title_1 = _response[row]['user'] + " annotated...";
      } else {
        card_title_1 = _response[row]['user'] + " replied...";
      }
      if (_response[row]['text'].length > 50){
          textSummary_1 = _response[row]['text'].slice(0, 140) + "...";
      } else {
          textSummary_1 = _response[row]['text'];
      }  
      //$('#inContextButton').attr("href", annotationDataTable.getValue(row, 6));
      // $('#annotationModalLabel').text(annotationDataTable.getValue(row, 1) + ":");
      // $('#annotationModalBody').text(annotationDataTable.getValue(row, 4));
      // $('#inContextButton').attr("href", annotationDataTable.getValue(row, 6));
      // $('#threadButton').attr("thread", annotationDataTable.getValue(row, 3));
      //$('#annotationModal').modal('show');
    }
  }
  $('#card_container_1').attr("class", "col-sm-4");
  $( "#recommended_card_title_1" ).text(card_title_1);
  $( "#recommended_card_text_1" ).text(textSummary_1);
  $('#card_container_2').attr("class", "col-sm-4");
  $( "#recommended_card_title_2" ).text(card_title_2);
  $( "#recommended_card_text_2" ).text(textSummary_2);
  $('#card_container_3').attr("class", "col-sm-4");
  $( "#recommended_card_title_3" ).text(card_title_3);
  $( "#recommended_card_text_3" ).text(textSummary_3);

}

function userRecommender(participantData, Response){
  let _response = Response;

}

function buildRecommendedCard(content, card){

}