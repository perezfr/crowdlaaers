$( document ).ready(function() {
  google.charts.load('current', {'packages':['table','corechart','calendar']});
  let dataObjects;

  if (hlib.getToken() != ""){
    createGroupInputFormModified();
    let setGroupSelect = new Promise(function(resolve, reject) {  
      setTimeout(function() {                              
        resolve();
      }, 500);
    });
    setGroupSelect.then(function(value) {
      $('#groupControlSelect').val('aYnJE67m');
      params.group = 'aYnJE67m';
      hlib.hApiSearch(params, processSearchResults, '');
      $("#groupControlSelect").prop("disabled", true);
    });
    setGroupSelect;//runs async function to set dropdown to specific group then disable dropdown
  } else {
    openSetTokenModal();
  }

  google.charts.setOnLoadCallback(function() {
    //params.group = '__world__';  
    //hlib.hApiSearch(params, processSearchResults, '');
    //initCharts(dataObjects);
  });

  let response;
  let graphsArray = ['annotation_table_div','url_graph_div','participant_graph_div','threads_graph_div',
    'days_graph_div','tags_graph_div'];
  
  function initCharts(_response){
    _dataObjects = groupObjectBuilder(_response, filter);

    if(_dataObjects.length == 0){
      $( "#annotationCounter" ).html("<h3>No Data Found...</h3>");
      for (let g of graphsArray){
        $( "#" + g ).html("");
      }
      $( "#participantCounter" ).text("0");
      $( "#calendarCounter" ).text("0");
      $( "#threadCounter" ).text("0");
      $( "#tagCounter" ).text("0");
      return false;
    }
    $('[data-toggle="tooltip"]').tooltip();
    annotationTableBuilder(_response,_dataObjects[5],filter);
    participantGraphBuilder(_dataObjects[2],response);
    threadGraphBuilder(_dataObjects[3],response);
    urlGraphBuilder(_dataObjects[0],response);
    daysGraphBuilder(_dataObjects[4],response);
    tagsGraphBuilder(_dataObjects[1],response);
  }

  $( ".nav-link" ).click(function(event) {
    let m = event.target.id;
    inactivate();
    $( "#" + m  ).attr("class", "nav-link active");
    filter = {user: "",group: "",url: syllabus[m]['url'],wildcard_uri: "",tag: "",any: "",max: "",thread: "",date: ""};
    dataObjects = groupObjectBuilder(response, filter);

    annotationTableBuilder(response,dataObjects[5],filter);
    participantGraphBuilder(dataObjects[2],response);
    threadGraphBuilder(dataObjects[3],response);
    urlGraphBuilder(dataObjects[0],response);
    daysGraphBuilder(dataObjects[4],response);
    tagsGraphBuilder(dataObjects[1],response);
    
    //hlib.hApiSearch(params, processSearchResults, '');
    $("#conversation_summary").html(syllabus[m]['summary']);
  });  

  $( "#groupLevel" ).click(function(event) {
    let m = event.target.id;
    inactivate();
    $( "#" + m  ).attr("class", "nav-link active");
    filter = {user: "",group: "",url: "",wildcard_uri: "",tag: "",any: "",max: "",thread: "",date: ""};
    dataObjects = groupObjectBuilder(response, filter);

    annotationTableBuilder(response,dataObjects[5],filter);
    participantGraphBuilder(dataObjects[2],response);
    threadGraphBuilder(dataObjects[3],response);
    urlGraphBuilder(dataObjects[0],response);
    daysGraphBuilder(dataObjects[4],response);
    tagsGraphBuilder(dataObjects[1],response);
    
    //hlib.hApiSearch(params, processSearchResults, '');
    $("#conversation_summary").html("R2L group level");
  });  

  function inactivate() {
    for (var key in syllabus){
      $( "#" + key ).attr("class", "nav-link");
    };
    for (i = 1; i < 7; i++) {
      $("#collapseCell" + i).collapse('show');
    };
    //$( "#annotationCounter" ).html('<h3>Loading...</h3>');
  };

  $("#setTokenButton").click(function(){
  //function setTokenButton(){
    let _token = inputQuerySelector('#tokenInputBar').value;
    localStorage.setItem('h_token', _token);
    $('#setTokenModal').modal('hide');
    createGroupInputFormModified();
    let setGroupSelect = new Promise(function(resolve, reject) {  
      setTimeout(function() {                              
        resolve();
      }, 1000);
    });
    setGroupSelect.then(function(value) {
      $('#groupControlSelect').val('aYnJE67m');
      params.group = 'aYnJE67m';
      hlib.hApiSearch(params, processSearchResults, '');
      $("#groupControlSelect").prop("disabled", true);
    });
    setGroupSelect;//runs async function to set dropdown to specific group then disable dropdown
  });

  function processSearchResults(annos, replies) {
      let format = 'json';
      let csv = '';
      let json = [];
      let gathered = hlib.gatherAnnotationsByUrl(annos);
      let reversedUrls = reverseChronUrls(gathered.urlUpdates);
      let counter = 0;
      reversedUrls.forEach(function (url) {
          counter++;
          let perUrlId = counter;
          let perUrlCount = 0;
          let idsForUrl = gathered.ids[url];
          idsForUrl.forEach(function (id) {
              perUrlCount++;
              let _replies = hlib.findRepliesForId(id, replies);
              _replies = _replies.map(r => {
                  return hlib.parseAnnotation(r);
              });
              let all = [gathered.annos[id]].concat(_replies.reverse());
              all.forEach(function (anno) {
                  let level = 0;
                  if (anno.refs) {
                      level = anno.refs.length;
                  }
                  if (format === 'html') {
                      worker.postMessage({
                          perUrlId: perUrlId,
                          anno: anno,
                          annoId: anno.id,
                          level: level
                      });
                  }
                  else if (format === 'csv') {
                      let _row = document.createElement('div');
                      _row.innerHTML = hlib.csvRow(level, anno);
                      csv += _row.innerText + '\n';
                  }
                  else if (format === 'json') {
                      anno.text = anno.text.replace(/</g, '&lt;');
                      json.push(anno);
                  }
              });
          });
          if (format === 'html') {
              showUrlResults(counter, 'widget', url, perUrlCount, gathered.titles[url]);
          }
      });
      response = json;
      initCharts(json);
  };

  $( "#allResetButton" ).click(function() {
    console.log('inside')
    filter = {user: "",group: "",url: "",wildcard_uri: "",tag: "",any: "",max: "",thread: "",date: ""};
    dataObjects = groupObjectBuilder(response, filter);

    annotationTableBuilder(response,dataObjects[5],filter);
    participantGraphBuilder(dataObjects[2],response);
    threadGraphBuilder(dataObjects[3],response);
    urlGraphBuilder(dataObjects[0],response);
    daysGraphBuilder(dataObjects[4],response);
    tagsGraphBuilder(dataObjects[1],response);
  });
});

function openSetTokenModal(){
  $('#setTokenModal').modal('show');
};

function inputQuerySelector(query) {
  return document.querySelector(query);
}

let params = {
  user: "",//inputQuerySelector('#userContainer input').value,
  group: "",//"G9d4q3j6"
  url: "",//inputQuerySelector('#urlContainer input').value,
  wildcard_uri: "",//inputQuerySelector('#wildcard_uriContainer input').value,
  tag: "",//inputQuerySelector('#tagContainer input').value,
  any: "",//inputQuerySelector('#anyContainer input').value,
  max: ""//inputQuerySelector('#maxContainer input').value,
};

let filter = {
  user: "",
  group: "",
  url: "",
  wildcard_uri: "",
  tag: "",
  any: "",
  max: "",
  thread: "",
  date: ""
};

function reverseChronUrls(urlUpdates) {
    var reverseChronUrls = [];
    for (var urlUpdate in urlUpdates) {
        reverseChronUrls.push([urlUpdate, urlUpdates[urlUpdate]]);
    }
    reverseChronUrls.sort(function (a, b) {
        return new Date(b[1]).getTime() - new Date(a[1]).getTime();
    });
    return reverseChronUrls.map(item => item[0]);
};

function createGroupInputFormModified(e, selectId) {
    var _selectId = selectId ? selectId : 'groupsList';
    function createGroupSelector(groups, selectId) {
        var currentGroup = hlib.getGroup();
        var options = '';
        groups.forEach(function (g) {
            var selected = '';
            if (currentGroup == g.id) {
                selected = 'selected';
            }
            options += "<option " + selected + " value=\"" + g.id + "\">" + g.name + "</option>\n";
        });
        return options;
    }
    var token = hlib.getToken();
    var opts = {
        method: 'get',
        url: 'https://hypothes.is/api/profile',
        headers: {},
        params: {}
    };
    opts = hlib.setApiTokenHeaders(opts, token);
    hlib.httpRequest(opts)
        .then(function (data) {
        var _data = data;
        var response = JSON.parse(_data.response);
        let form = createGroupSelector(response.groups);
        let g = document.getElementById("groupControlSelect");
        g.innerHTML = form;
    })["catch"](function (e) {
        console.log(e);
    });
};