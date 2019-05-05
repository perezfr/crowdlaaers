//var rows = response;
//var total = response.length;
let groupData = {};
let threadsID = [];
let threadsData = {};
let tagsData = {};
let gtagCounts = {};
let glevel = 0;
let participantData = {};
let urlCounts = {};
let dateCounts = {};

function groupObjectBuilder(rows){
  for (ss of rows){
    //create array of annotations with replies as root for threads
    if (ss['refs'].length > 0){
      if ( !threadsID.includes(ss['refs'][0]) ){
        threadsID.push(ss['refs'][0]);
      }
    }  
  }

  for (s of rows){
    let offset = new Date().getTimezoneOffset()*60;
    let date = new Date(s['updated']);
    let newdate = new Date(date.getTime() + offset);
    let year = date.getYear() + 1900;
    let month = date.getMonth() + 1;
    let dateDay = date.getDate();
    let _date =new Date( month + "/" + dateDay + "/" + year );
    let hour = date.getHours();
    let mins = date.getMinutes();
    let second = date.getSeconds();
    let username = s['user'];
    let textTotal = s['text'];
    let url = s['url'];
    let glevel = s['refs'].length;
    //HLIB doesn't return 'incontext' field. so...
    let tags = s['tags'].join().toLowerCase();

    if ( !participantData[username] ){  //url is not in object
      participantData[username] = {
        'participantTotalMessages':0, 
        'dateLatest':null,
        'replies':0, 
        'annotations':0
      };
    }
    ++participantData[username]['participantTotalMessages'];
    participantData[username]['dateLatest'] = date;

    //for messagetype
    if (glevel == 0) {
      ++participantData[username]['annotations'];
    } else {
      ++participantData[username]['replies'];
    }

    if ( !(url in urlCounts) ) {
      urlCounts[url] = {
        'count': 0,
        'urlDateLatest': date
      }
    }
    ++urlCounts[url]['count'];
    if(urlCounts[url]['urlDateLatest'] < date){
      urlCounts[url]['urlDateLatest'] = date;
    }

    if (s['tags'].length > 0){
      //iterate through each tag on annotation
      s['tags'].forEach(function (tt) {
        let tagInArray = false;
        t = tt.toLowerCase();

        if ( !(t in tagsData) ){
          tagsData[t] = {
            'count': 0,
            'tagDateLatest': date
          }
          
        }
        ++tagsData[t]['count'];
        if ( tagsData[t]['tagDateLatest'] < date ){
          tagsData[t]['tagDateLatest'] = date;
        }    
      });
    }

    if ( s['id'] in threadsID ){
      threadsData[s['id']] = {
        'names': [username],
        'threadsDateLatest': date,
        'threadMsgCount': 1
      };
    };

    if ( s['refs'].length > 0 ){
      if ( !(s['refs'][0] in threadsData) ){
        threadsData[s['refs'][0]] = {
          'names': [username],
          'threadsDateLatest': date,
          'threadMsgCount': 1
        };
      } else {
        if ( !threadsData[s['refs'][0]]['names'].includes(username) ){
          threadsData[s['refs'][0]]['names'].push(username);
        }
        ++threadsData[s['refs'][0]]['threadMsgCount'];
        if ( threadsData[s['refs'][0]]['threadsDateLatest'] < date ){
          threadsData[s['refs'][0]]['threadsDateLatest'] = date;
        }
      }
    }

    if ( !(_date in dateCounts ) ){
      dateCounts[_date]= 1;
    } else {
      ++dateCounts[_date];
    }
  } // end rows loop

  return [urlCounts,tagsData,participantData,threadsData,dateCounts,threadsID];
}