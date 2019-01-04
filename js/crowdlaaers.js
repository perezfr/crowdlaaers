$( document ).ready(function() {

  google.charts.load('current', {'packages':['table','corechart','calendar']});
  var response;

  function inactivate() {
    for (var key in syllabus){
      $( "#" + key ).attr("class", "nav-link");
    };

    $( "#contributorsClick" ).attr("class", "nav-link active");
    $( "#calendarClick" ).attr("class", "nav-link");
    $( "#threadsClick" ).attr("class", "nav-link");
    $( "#tagsClick" ).attr("class", "nav-link");
    $( "#graph" ).css("height","300px");
    $( "#graph" ).html('<h3>Loading...</h3>');
  };

  function drawTable(response) {
    if(response.length == 0){
      $( "#graph" ).html("<h3>No Data Found...</h3>");
      $( "#table_div" ).html("");
      $( "#participantCounter" ).text("0");
      $( "#calendarCounter" ).text("0");
      $( "#threadCounter" ).text("0");
      $( "#tagCounter" ).text("0");
      return false;
    }
    $('[data-toggle="tooltip"]').tooltip();
    var data = new google.visualization.DataTable();
    var tagData = new google.visualization.DataTable();
    var messageTypeData = new google.visualization.DataTable();
    //Table columns
    data.addColumn({type: 'date', id: 'Date', label: 'Date'});
    data.addColumn({type: 'string', id: 'user', label: 'Contributor'});
    data.addColumn({type: 'string', id: 'textSummary', label: 'Annotation'});
    data.addColumn({type: 'string', id: 'NodeMsg', label: 'Anchor'});
    data.addColumn({type: 'string', id: 'textComplete', role: 'annotationText'});
    data.addColumn({type: 'string', id: 'tags', label: 'Tags'});
    data.addColumn({type: 'string', id: 'link', label: 'Link'});
    data.addColumn({type: 'number', id: 'level', label: 'Level'});
    //Tag chart columns
    tagData.addColumn({type: 'string', id: 'tag', label: 'Tag'});
    tagData.addColumn({type: 'number', id: 'count', label: 'Count'});
    //message type columns
    messageTypeData.addColumn({type: 'string', id: 'tag', label: 'Tag'});
    messageTypeData.addColumn({type: 'number', id: 'total', label: 'Total'});
    messageTypeData.addColumn({type: 'number', id: 'annotations', label: 'Annotations'});
    messageTypeData.addColumn({type: 'number', id: 'replies', label: 'Replies'});


    //var rows = response['rows'];
    //var total = response['total'];
    var rows = response;
    var total = response.length;

    var threads = [];
    var tagArray = [];
    var tagCounts = {};
    var messageTypeCount = {};
    var level = 0;

    for (ss of rows){
      //create array of annotations with replies as root for threads
      //if (ss['references']){
      //  if (!threads.includes(ss['references'][0])){
      //    threads.push(ss['references'][0]);
      if (ss['refs'].length > 0){
        if (!threads.includes(ss['refs'][0])){
          threads.push(ss['refs'][0]);
        }
      }  
      //create array of tags to build tag column graph
      if (ss['tags'].length > 0){
        ss['tags'].forEach(function (t) {
          tagArray.push(t.toLowerCase());
        });
      }
    }
    for (s of rows) {
      //Count the threads
      level = 0;
      var nodeMsg = "Document";
      if (threads.includes(s['id'])){
        //if message is anchor annotation in the thread sets anchor ID it to
        //message ID 
        nodeMsg = s['id'];
      }

      //if (s['references']){
        //Sets anchor ID to the first anchor annotation
      //  nodeMsg = s['references'][0];
      //  level = s['references'].length;
      if (s['refs']){
        //Sets anchor ID to the first anchor annotation
        nodeMsg = s['refs'][0];
        level = s['refs'].length;
      }

      //Creates a annotation clip to display in table
      if (s['text'].length > 50){
        var textSummary = s['text'].slice(0, 50) + "...";
      } else {
        var textSummary = s['text'];
      }

      //var date = new Date(s['created']);
      var date = new Date(s['updated']);
      var year = date.getYear() + 1900;
      var month = date.getMonth();
      var dateDay = date.getDate();
      var hour = date.getHours();
      var mins = date.getMinutes();
      var second = date.getSeconds();
      //var username = s['user'].slice(5,-12);
      var username = s['user'];
      var textTotal = s['text'];
      //var link = s['links']['incontext'];
      var link = "https://hyp.is/" + s['id']
      var tags = s['tags'].join().toLowerCase();
      //Add the table graph rows
      data.addRows([
        [new Date(year, month, dateDay), username, textSummary, nodeMsg, textTotal, tags , link , level]
      ]);
      
      //count annotations, replies and total messages per user
      if (!messageTypeCount[username]){
        messageTypeCount[username] = {'totalMessages':0, 'replies':0, 'annotations':0};
        ++messageTypeCount[username]['totalMessages'];
        if (level == 0) {
          ++messageTypeCount[username]['annotations'];
        } else {
          ++messageTypeCount[username]['replies'];
        }
      } else {
        ++messageTypeCount[username]['totalMessages'];
        if (level == 0) {
          ++messageTypeCount[username]['annotations'];
        } else {
          ++messageTypeCount[username]['replies'];
        }
      }
    }
    //console.log(messageTypeCount);
    //Count instances of unique tags
    for (var i = 0; i < tagArray.length; i++) {
      tagCounts[tagArray[i]] = 1 + (tagCounts[tagArray[i]] || 0);
    }
    //Build the rows for the tag table/graph
    for (var t in tagCounts) {
      tagData.addRows([
        [ t, tagCounts[t] ]
      ]);
    }
    tagData.sort({column: 1, desc: true});

    //Build the message type graph
    for (var m in messageTypeCount) {
      messageTypeData.addRows([
        [ m, messageTypeCount[m]['totalMessages'], messageTypeCount[m]['annotations'], messageTypeCount[m]['replies']]
      ]);
    }

    var table = new google.visualization.Table(document.getElementById('table_div'));
    /*
    ** use the chartwrapper here **
    **
    */
    var bar_graph_contributors = new google.visualization.ColumnChart(document.getElementById('graphContributors'));
    var bar_graph_threads = new google.visualization.ColumnChart(document.getElementById('graphThreads'));
    var bar_graph_tags = new google.visualization.ColumnChart(document.getElementById('graphTags'));
    var calendar = new google.visualization.Calendar(document.getElementById('graphCalendar'));
    var opts = {
      width: '100%', height: '100%', page: 'enable', pageSize: 25, legend: { position: 'none' },
      vAxis: { format: '#' }, isStacked: true, colors: ['#243c68', '#e6693e'], 
    };
    var view = new google.visualization.DataView(data);
    view.hideColumns([3,4,6]);

    var messagesPerUser = google.visualization.data.group(
      data,
      [1], //aggregate annotations by users
      [{'column': 1, 'aggregation': google.visualization.data.count, 'type': 'number',
      'label': 'Contributions'}]
    );
    messagesPerUser.sort({column: 1, desc: true});

    var messagesPerThread = google.visualization.data.group(
      data,
      [3], //aggregate annotations by thread
      [{'column': 1, 'aggregation': google.visualization.data.count, 'type': 'number',
      'label': 'Annotations'}]
    );
    messagesPerThread.sort({column: 1, desc: true});
    messagesPerThread.removeRow(0);

    var messagesPerDay = google.visualization.data.group(
      data,
      [0], //aggregate annotations by day
      [{'column': 0, 'aggregation': google.visualization.data.count, 'type': 'number',
      'label': 'Annotations'}]
    );
    messagesPerDay.sort({column: 1, desc: true});
    //messagesPerDay.removeRow(0);

        //Adjust Calander Graph div height based on number of years with annotations
    var activeYears = data.getColumnRange(0).max.getFullYear() - data.getColumnRange(0).min.getFullYear();
    if ( activeYears == 4 ){
      graphDivHeight = "750px";
    } else if ( activeYears == 3 ){
      graphDivHeight = "600px";
    } else if ( activeYears == 2 ){
      graphDivHeight = "455px";
    } else if ( activeYears == 1 ){
      graphDivHeight = "350px";
    } else {
      graphDivHeight = "250px";
    }
    $( "#graphCalendar" ).css("height",graphDivHeight);

    //bar_graph.draw(messagesPerUser, opts);
    messageTypeData.sort({column: 1, desc: true});
    viewD = new google.visualization.DataView(messageTypeData);
    viewD.hideColumns([1]);

    bar_graph_contributors.draw(viewD, opts);
    bar_graph_tags.draw(tagData, opts);
    bar_graph_threads.draw(messagesPerThread, opts);
    calendar.draw(messagesPerDay, opts);
    table.draw(view, opts);

    // counter cards 
    $( "#participantCounter" ).text(messagesPerUser.getNumberOfRows());
    $( "#calendarCounter" ).text(messagesPerDay.getNumberOfRows());
    $( "#threadCounter" ).text(messagesPerThread.getNumberOfRows());
    $( "#tagCounter" ).text(Object.keys(tagCounts).length);
    $( "#annotationCounter" ).text(total);

    //create event handler object.
    //to be removed when table is filtered. Then create new event handler object 
    var event = google.visualization.events.addListener(table, 'select', function() {
      var row = table.getSelection()[0].row;
      $('#annotationModalLabel').text(data.getValue(row, 1) + ":");
      $('#annotationModalBody').text(data.getValue(row, 4));
      $('#inContextButton').attr("href", data.getValue(row, 6));
      $('#annotationModal').modal('show');
    });

    google.visualization.events.addListener(bar_graph_contributors, 'select', function() {
      google.visualization.events.removeListener(event);
      view = new google.visualization.DataView(data);
      view.hideColumns([3,4,6]);
      var row = bar_graph_contributors.getSelection()[0].row;
      var name = viewD.getValue(row, 0);
      var r = view.getFilteredRows([{column: 1, value: name}]);
      view.setRows(r);
      table.clearChart();
      table.draw(view, opts);

      var event = google.visualization.events.addListener(table, 'select', function() {
        var row = view.getTableRowIndex(table.getSelection()[0].row);
        $('#annotationModalLabel').text(data.getValue(row, 1) + ":");
        $('#annotationModalBody').text(data.getValue(row, 4));
        $('#inContextButton').attr("href", data.getValue(row, 6));
        $('#annotationModal').modal('show');
      });
    });

    google.visualization.events.addListener(bar_graph_threads, 'select', function() {
      view = new google.visualization.DataView(data);
      var row = bar_graph_threads.getSelection()[0].row;
      var name = messagesPerThread.getValue(row, 0);
      var r = view.getFilteredRows([{column: 3, value: name}]);
      view.hideColumns([3,4,6]);
      view.setRows(r);
      table.draw(view, opts);

      var event = google.visualization.events.addListener(table, 'select', function() {
        var row = view.getTableRowIndex(table.getSelection()[0].row);
        $('#annotationModalLabel').text(data.getValue(row, 1) + ":");
        $('#annotationModalBody').text(data.getValue(row, 4));
        $('#inContextButton').attr("href", data.getValue(row, 6));
        $('#annotationModal').modal('show');
      });
    });

    $( "#calendarClick" ).click(function() {
      //make graph div taller to fit three years
      $( "#graph" ).css("height",graphDivHeight);
      $( "#calendarClick" ).attr("class", "nav-link active");
      $( "#contributorsClick" ).attr("class", "nav-link");
      $( "#threadsClick" ).attr("class", "nav-link");
      $( "#tagsClick" ).attr("class", "nav-link");
      $( "#graphLabel" ).text("Annotations per Day");
      calendar = new google.visualization.Calendar(document.getElementById('graph'));
      calendar.draw(messagesPerDay, opts);

    //TODO Filter by day
    });
    $( "#contributorsClick" ).click(function() {
      $( "#graph" ).css("height","300px");
      $( "#calendarClick" ).attr("class", "nav-link");
      $( "#contributorsClick" ).attr("class", "nav-link active");
      $( "#threadsClick" ).attr("class", "nav-link");
      $( "#tagsClick" ).attr("class", "nav-link");
      $( "#graphLabel" ).text("Annotations per Contributor");
      bar_graph = new google.visualization.ColumnChart(document.getElementById('graph'));
      bar_graph.draw(viewD, opts);

      google.visualization.events.addListener(bar_graph, 'select', function() {
        google.visualization.events.removeListener(event);
        view = new google.visualization.DataView(data);
        var row = bar_graph.getSelection()[0].row;
        var name = viewD.getValue(row, 0);
        var r = view.getFilteredRows([{column: 1, value: name}]);
        view.hideColumns([3,4,6]);
        view.setRows(r);
        table.draw(view, opts);

        var event = google.visualization.events.addListener(table, 'select', function() {
          var row = view.getTableRowIndex(table.getSelection()[0].row);
          $('#annotationModalLabel').text(data.getValue(row, 1) + ":");
          $('#annotationModalBody').text(data.getValue(row, 4));
          $('#inContextButton').attr("href", data.getValue(row, 6));
          $('#annotationModal').modal('show');
        });
      });
    });
    $( "#threadsClick" ).click(function() {
      $( "#graph" ).css("height","300px");
      $( "#calendarClick" ).attr("class", "nav-link");
      $( "#contributorsClick" ).attr("class", "nav-link");
      $( "#threadsClick" ).attr("class", "nav-link active");
      $( "#tagsClick" ).attr("class", "nav-link");
      $( "#graphLabel" ).text("Annotations per Thread");
      bar_graph = new google.visualization.ColumnChart(document.getElementById('graph'));
      bar_graph.draw(messagesPerThread, opts);

      google.visualization.events.addListener(bar_graph, 'select', function() {
        view = new google.visualization.DataView(data);
        var row = bar_graph.getSelection()[0].row;
        var name = messagesPerThread.getValue(row, 0);
        var r = view.getFilteredRows([{column: 3, value: name}]);
        view.hideColumns([3,4,6]);
        view.setRows(r);
        table.draw(view, opts);

        var event = google.visualization.events.addListener(table, 'select', function() {
          var row = view.getTableRowIndex(table.getSelection()[0].row);
          $('#annotationModalLabel').text(data.getValue(row, 1) + ":");
          $('#annotationModalBody').text(data.getValue(row, 4));
          $('#inContextButton').attr("href", data.getValue(row, 6));
          $('#annotationModal').modal('show');
        });
      });
    });
    $( "#tagsClick" ).click(function() {
      $( "#graph" ).css("height","300px");
      $( "#calendarClick" ).attr("class", "nav-link");
      $( "#contributorsClick" ).attr("class", "nav-link");
      $( "#threadsClick" ).attr("class", "nav-link");
      $( "#tagsClick" ).attr("class", "nav-link active");
      $( "#graphLabel" ).text("Tags");
      bar_graph = new google.visualization.ColumnChart(document.getElementById('graph'));
      bar_graph.draw(tagData, opts);

      /* TODO: Filter by contains instead of equals
      google.visualization.events.addListener(bar_graph, 'select', function() {
        view = new google.visualization.DataView(data);
        view.hideColumns([3,4]);
        var row = bar_graph.getSelection()[0].row;
        var name = tagData.getValue(row, 0);
        var r = view.getFilteredRows([{column: 3, value: name}]);
        //var r = view.getFilteredRows([{column: 3, test: 
        //  function(value, row, column, table) {
        //    return data.getValue(row, 0).includes(name)
        //  }
        //}]);

        //view.setRows(r);
        //table.draw(view, opts);
      });
      */
    });

    $( "#resetButton" ).click(function() {
      view = new google.visualization.DataView(data);
      view.hideColumns([3,4,6]);
      table.draw(view, opts);
    });
  }; //end drawtable

  $( ".month-link" ).click(function(event) {
    let m = event.target.id;
    inactivate();
    $( "#" + m  ).attr("class", "nav-link active");
    params.url = syllabus[m]['url'];
    hlib.hApiSearch(params, processSearchResults, '');
    $("#conversation_summary").html(syllabus[m]['summary']);
  });

  $("#urlSearchButton").click(function(){
    inactivate();
    var url = $('#urlBar').val();
    if (url == ""){
      $( "#graph" ).html('<h3>Enter valid URL...</h3>');
      return false;
    };
    params.url = url;
    hlib.hApiSearch(params, processSearchResults, '');
  });

  function processSearchResults(annos, replies) {
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
      drawTable(json);
  };

  $("#groupControlSelect").change(function(){
    inactivate();
    let select = document.getElementById('groupControlSelect');
    let selectedString = select.options[select.selectedIndex].value;
    params.group = selectedString;
    if (params.url == ""){
      $( "#graph" ).html('<h3>Enter valid URL...</h3>');
      return false;
    }
    console.log(params);
    hlib.hApiSearch(params, processSearchResults, '');
  });

  var startURL = new URL(window.location.href);
  if (startURL.searchParams.get("url")){
    $( "#graph" ).html('<h3>Loading...</h3>');
    var u = startURL.searchParams.get("url");
    $('#urlBar').val(u);  //add url param to search bar for sharing 
    params.url = u;
    hlib.hApiSearch(params, processSearchResults, '');
  } 

  if (startURL.href.slice(-21) == "marginalsyllabus.html"){
    $("#conversation_summary").html(syllabus['december2018']['summary']);
    params.url = syllabus['december2018']['url'];
    hlib.hApiSearch(params, processSearchResults, '');
  }

  //Share button adds the url from the search bar as a parameter to the 
  //crowdlaaers search url.
  $( "#urlShare" ).click(function() {
    var baseURL = "https://crowdlaaers.org?url=";
    var searchURL = $('#urlBar').val();
    baseURL.concat(searchURL);
    $('#shareURLModalBody').text(baseURL + searchURL);
    $('#shareURLModal').modal('show');
  });
    
  $(document).keypress(
    function(event){
      if (event.which == '13') {
        event.preventDefault();
      }
  });

});
//hlib
function openSetTokenModal(){
  $('#setTokenModal').modal('show');
};

function inputQuerySelector(query) {
    return document.querySelector(query);
}

function setTokenButton(){
  let _token = inputQuerySelector('#tokenInputBar').value;
  localStorage.setItem('h_token', _token);
  $('#setTokenModal').modal('hide');
  createGroupInputFormModified();
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

var format = 'json';

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
hlib.getById('groupContainer')
function createGroupInputFormModified(e, selectId) {
    var _selectId = selectId ? selectId : 'groupsList';
    function createGroupSelector(groups, selectId) {
        var currentGroup = getGroup();
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
    var token = getToken();
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
function getGroup() {
    var group = getFromUrlParamOrLocalStorage('h_group');
    return group != '' ? group : '__world__';
};
function getToken() {
    return getFromUrlParamOrLocalStorage('h_token');
}

function setLocalStorageFromForm(formId, storageKey) {
    var element = getById(formId);
    localStorage.setItem(storageKey, element.value);
}

function getFromUrlParamOrLocalStorage(key, _default) {
    var value;
    if (value === '') {
        var _value = localStorage.getItem("" + key);
        value = _value ? _value : '';
    }
    if ((!value || value === '') && _default) {
        value = _default;
    }
    if (!value) {
        value = '';
    }
    return value;
}
function httpRequest(opts) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(opts.method, opts.url);
        xhr.onload = function () {
            var r = {
                response: xhr.response,
                status: xhr.status,
                statusText: xhr.statusText,
                headers: parseResponseHeaders(xhr.getAllResponseHeaders())
            };
            if (this.status >= 200 && this.status < 300) {
                resolve(r);              
            }
            else {
                console.log('http', opts.url, this.status);
                reject(r);
            }
        };
        xhr.onerror = function (e) {
            console.log('httpRequest', opts.url, this.status);
            reject({
                error: e,
                status: this.status,
                statusText: xhr.statusText
            });
        };
        if (opts.headers) {
            Object.keys(opts.headers).forEach(function (key) {
                xhr.setRequestHeader(key, opts.headers[key]);
            });
        }
        xhr.send(opts.params);
    });
}
function _search(params, callback, offset, annos, replies, progressId) {
    var max = 2000;
    if (params.max) {
        max = params.max;
    }
    var limit = 200;
    if (max <= limit) {
        limit = max;
    }
    if (progressId) {
        getById(progressId).innerHTML += '.';
    }
    var opts = {
        method: 'get',
        url: "https://hypothes.is/api/search?_separate_replies=true&limit=" + limit + "&offset=" + offset,
        headers: {},
        params: {}
    };
    var facets = ['group', 'user', 'tag', 'url', 'any'];
    facets.forEach(function (facet) {
        if (params[facet]) {
            var encodedValue = encodeURIComponent(params[facet]);
            opts.url += "&" + facet + "=" + encodedValue;
        }
    });
    opts = setApiTokenHeaders(opts);
    httpRequest(opts).then(function (data) {
        var _data = data;
        var response = JSON.parse(_data.response);
        annos = annos.concat(response.rows);
        replies = replies.concat(response.replies);
        if (response.rows.length === 0 || annos.length >= max) {
            callback(annos, replies);
        }
        else {
            _search(params, callback, offset + limit, annos, replies, progressId);
        }
    });
}
function hApiSearch(params, callback, progressId) {
    var offset = 0;
    var annos = [];
    var replies = [];
    _search(params, callback, offset, annos, replies, progressId);
}
function setApiTokenHeaders(opts, token) {
    if (!token) {
        token = getToken();
    }
    if (token) {
        opts.headers = {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json;charset=utf-8'
        };
    }
    return opts;
}
function parseResponseHeaders(headerStr) {
    var headers = {};
    if (!headerStr) {
        return headers;
    }
    var headerPairs = headerStr.split('\u000d\u000a');
    for (var i = 0; i < headerPairs.length; i++) {
        var headerPair = headerPairs[i];
        // Can't use split() here because it does the wrong thing
        // if the header value has the string ": " in it.
        var index = headerPair.indexOf('\u003a\u0020');
        if (index > 0) {
            var key = headerPair.substring(0, index);
            var val = headerPair.substring(index + 2);
            headers[key] = val;
        }
    }
    return headers;
}