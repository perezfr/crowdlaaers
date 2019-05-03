//var rows = response;
//var total = response.length;
let threads = [];
let tagsData = {};
let tagCounts = {};
let messageTypeCount = {};
let level = 0;
let _threads = {};
let participantData = {};

function urlObjectBuilder(rows){
  for (ss of rows){
    //create array of annotations with replies as root for threads
    if (ss['refs'].length > 0){
      if (!threads.includes(ss['refs'][0])){
        threads.push(ss['refs'][0]);
      }
    }  
  }

  for (s of rows){
    //Count the threads
    let nodeMsg;
    level = 0;
    if ( threads.includes(s['id']) ){
      //if message is anchor annotation in the thread sets anchor ID it to
      //message ID 
      nodeMsg = s['id'];
    }

    if (s['refs'].length > 0){
      //Sets anchor ID to the first anchor annotation
      nodeMsg = s['refs'][0];
      level = s['refs'].length;
    }

    var offset = new Date().getTimezoneOffset()*60;
    //console.log(offset);
    var date = new Date(s['updated']);
    let newdate = new Date(date.getTime() + offset);
    //console.log(date.getTime() + offset);
    var year = date.getYear() + 1900;
    var month = date.getMonth();
    var dateDay = date.getDate();
    //console.log(dateDay + " and " + newdate.getDate());
    var hour = date.getHours();
    var mins = date.getMinutes();
    var second = date.getSeconds();
    //var username = s['user'].slice(5,-12);
    var username = s['user'];
    var textTotal = s['text'];
    //var link = s['links']['incontext'];
    //HLIB doesn't return 'incontext' field. so...
    if (nodeMsg == 'document'){
      var link = "https://hyp.is/" + s['id'];
    } else {
      var link = "https://hyp.is/" + nodeMsg;
    }
    var tags = s['tags'].join().toLowerCase();
    //Add the table graph rows
    // data.addRows([
    //   [new Date(year, month, dateDay), username, textSummary, nodeMsg, textTotal, tags , link , level, s['url']]
    // ]);

    //At the URL level
    if ( !participantData[username] ){  //url is not in object

      participantData[username] = {
        'participantTotalMessages':0, 
        'dateLatest':null,
        'replies':0, 
        'annotations':0
      };
      ++participantData[username]['urlTotalMessages'];
      participantData[username]['dateLatest'] = date;

      //for messagetype
      if (level == 0) {
        ++participantData[username]['annotations'];
      } else {
        ++participantData[username]['replies'];
      }

    } else { //if url is present in object
      let userInArray = false;

      ++_urlData[s['url']]['urlTotalMessages'];
      if (!_urlData[s['url']]['names'].includes(username)) {
        _urlData[s['url']]['names'].push(username);
      }
      if(_urlData[s['url']]['dateLatest'] < date){
        _urlData[s['url']]['dateLatest'] = date;
      }

      for ( p of _urlData[s['url']]['participants'] ){ //search participant array
        if ( p['username'] == username ){  //if participant already present
          ++p['messageTypes']['totalMessages'];
          if ( p['userDateLatest'] < date ){
            p['userDateLatest'] = date;
          }
          if ( level == 0 ) {
            ++p['messageTypes']['annotations'];
          } else {
            ++p['messageTypes']['replies'];
          }
          userInArray = true;
          break;
        }
      }
      if ( !userInArray ){
        messageTypeCount = {
          'username': username,
          'userDateLatest': date,
          'messageTypes':{
            'totalMessages':0, 
            'replies':0, 
            'annotations':0
          }
        };
        ++messageTypeCount['messageTypes']['totalMessages'];
        if (level == 0) {
          ++messageTypeCount['messageTypes']['annotations'];
        } else {
          ++messageTypeCount['messageTypes']['replies'];
        }
        _urlData[s['url']]['participants'].push(messageTypeCount);
      } 
    } //end else if url is present in object

    if (s['tags'].length > 0){
      //iterate through each tag on annotation
      s['tags'].forEach(function (tt) {
        let tagInArray = false;
        t = tt.toLowerCase();

        for ( _t of tagsData[t]){
          if ( _t['tag'] == t ){  //if tag is already present
            ++_t['count'];
            if ( _t['tagDateLatest'] < date ){
              _t['tagDateLatest'] = date;
            } //if date latest
            tagInArray = true;
            break;
          } 
        }
        if ( !tagInArray ){
          tagCount = {
            'tag': t,
            'count':0,
            'tagDateLatest':date
          }
          ++tagCount['count'];
          _urlData[s['url']]['urlTags'].push(tagCount);
        }
      });
    }

    let msgInThread = false;
    if (s['id'] in _threads){
      threadsCount = {
        'rootMessageID': s['id'],
        'names': [username],
        'threadsDateLatest': date,
        'threadMsgCount': 1
      };
      _urlData[s['url']]['urlThreads'].push(threadsCount);
    };
    if (s['refs'].length > 0){
      for ( _th of _urlData[s['url']]['urlThreads'] ){
        if (s['refs'][0] == _th['rootMessageID']){
          if ( !_th['names'].includes(username) ){
            _th['names'].push(username);
          }
          ++_th['threadMsgCount'];
          if ( _th['threadsDateLatest'] < date ){
            _th['threadsDateLatest'] = date;
          }
          msgInThread = true;
        }
      }
      if ( !msgInThread ){
        threadsCount = {
          'rootMessageID': s['refs'][0],
          'names': [username], //this is missing a name
          'threadsDateLatest': date,
          'threadMsgCount': 2
        };
        _urlData[s['url']]['urlThreads'].push(threadsCount);
      }
    }
    if (nodeMsg in _threads){
      ++_threads[nodeMsg]['totalMessages'];
      if(!_threads[nodeMsg]['names'].includes(username)) {
        _threads[nodeMsg]['names'].push(username);
      }
    }    
  } // end rows loop

  return _urlData;
}