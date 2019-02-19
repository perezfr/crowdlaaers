$( document ).ready(function() {

  google.charts.load('current', {'packages':['table','corechart','calendar']});

  var response;
  var graphsArray = ['table_div','graphContributors','graphThreads','graphTags','graphCalendar'];

  if (hlib.getToken() != ""){
    createGroupInputFormModified();
    params.group = "__world__";
  };

  function inactivate() {
    for (var key in syllabus){
      $( "#" + key ).attr("class", "nav-link");
    };
    for (i = 1; i < 7; i++) {
      $("#collapseCell" + i).collapse('show');
    };
    $( "#annotationCounter" ).html('<h3>Loading...</h3>');
  };

  function drawTable(response) {
    if(response.length == 0){
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

    let data = new google.visualization.DataTable();
    let tagData = new google.visualization.DataTable();
    let messageTypeData = new google.visualization.DataTable();
    let threadsData = new google.visualization.DataTable();

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
    messageTypeData.addColumn({type: 'date', id: 'Date', label: 'Date'});
    //threads columns
    threadsData.addColumn({type: 'string', id: 'users', label: 'Users'});
    threadsData.addColumn({type: 'number', id: 'total', label: 'Total'});
    threadsData.addColumn({type: 'string', id: 'nodeMsg', label: 'Node'});
    threadsData.addColumn({type: 'date', id: 'Date', label: 'Date'});
    threadsData.addColumn({type: 'string', role: 'tooltip', 'p': {'html': true}});
    //var rows = response['rows'];
    //var total = response['total'];
    var rows = response;
    var total = response.length;

    var threads = [];
    var tagArray = [];
    var tagCounts = {};
    var messageTypeCount = {};
    var level = 0;
    var nodeMsg;

    var _threads = {};

    for (ss of rows){
      //create array of annotations with replies as root for threads
      //if (ss['references']){
      //  if (!threads.includes(ss['references'][0])){
      //    threads.push(ss['references'][0]);
      if (ss['refs'].length > 0){
        if (!threads.includes(ss['refs'][0])){
          threads.push(ss['refs'][0]);
        }

        if (!_threads[ss['refs'][0]]){
          _threads[ss['refs'][0]] = {'totalMessages':0, 'names':[], 'dateLatest':null};
        }
      }  
      //create array of tags to build tag column graph
      if (ss['tags'].length > 0){
        ss['tags'].forEach(function (t) {
          tagArray.push(t.toLowerCase());
        });
      }
    }

    for (s of rows){
      //Count the threads
      level = 0;
      nodeMsg = "document";
      if (threads.includes(s['id'])){
        //if message is anchor annotation in the thread sets anchor ID it to
        //message ID 
        nodeMsg = s['id'];
      }

      //if (s['references']){
        //Sets anchor ID to the first anchor annotation
      //  nodeMsg = s['references'][0];
      //  level = s['references'].length;
      if (s['refs'].length > 0){
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
      data.addRows([
        [new Date(year, month, dateDay), username, textSummary, nodeMsg, textTotal, tags , link , level]
      ]);
      
      //count annotations, replies and total messages per user
      if (!messageTypeCount[username]){
        messageTypeCount[username] = {'totalMessages':0, 'replies':0, 'annotations':0, 'dateLatest':null};
        ++messageTypeCount[username]['totalMessages'];
        if (level == 0) {
          ++messageTypeCount[username]['annotations'];
        } else {
          ++messageTypeCount[username]['replies'];
        }
        if(messageTypeCount[username]['dateLatest'] < date){
          messageTypeCount[username]['dateLatest'] = date;
        }
      } else {
        ++messageTypeCount[username]['totalMessages'];
        if (level == 0) {
          ++messageTypeCount[username]['annotations'];
        } else {
          ++messageTypeCount[username]['replies'];
        }
        if(messageTypeCount[username]['dateLatest'] < date){
          messageTypeCount[username]['dateLatest'] = date;
        }
      }

      //build thread object for tables
      if (s['id'] in _threads){
        //add to names list only if name is not present
        if(!_threads[s['id']]['names'].includes(username)) {
          _threads[s['id']]['names'].push(username);  
        }
        //check if date is present add date, or add most recent date to sort by recent 
        if(_threads[s['id']]['dateLatest'] < date){
          _threads[s['id']]['dateLatest'] = date;
        }
      }
      if (nodeMsg in _threads){
        ++_threads[nodeMsg]['totalMessages'];
        if(!_threads[nodeMsg]['names'].includes(username)) {
          _threads[nodeMsg]['names'].push(username);
        }
        if(_threads[nodeMsg]['dateLatest'] < date){
          _threads[nodeMsg]['dateLatest'] = date;
        }
      }
      
    }

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
        [ m, messageTypeCount[m]['totalMessages'], messageTypeCount[m]['annotations'], messageTypeCount[m]['replies'], messageTypeCount[m]['dateLatest']]
      ]);
    }

    //Build thread table for graph with loop instead of group() to keep usernames
    for (let t in _threads){
      let _len = _threads[t]['totalMessages'];
      let _year = _threads[t]['dateLatest'].getYear() + 1900;
      let _month = _threads[t]['dateLatest'].getMonth();
      let _dateDay = _threads[t]['dateLatest'].getDate();
      let _dd = _month + "/" + _dateDay + "/" + _year;
      let _tt = "<b>Participants:</b> " + _threads[t]['names'].toString().replace(/,/g, ", ") + "<br>"
        + "<b>Thread size:</b> " + _len + "<br>" 
        + "<b>Most recent annotation:</b> " + _dd;
      threadsData.addRows([
        [ _threads[t]['names'].toString(), _threads[t]['totalMessages'], t , new Date(_threads[t]['dateLatest']), _tt]
      ]);
    }
    threadsData.sort({column: 3, desc: true});
    //create view for threads graph
    threadsView = new google.visualization.DataView(threadsData);
    threadsView.hideColumns([2, 3]);


    var table = new google.visualization.Table(document.getElementById('table_div'));
    var bar_graph_contributors = new google.visualization.ColumnChart(document.getElementById('graphContributors'));
    var bar_graph_threads = new google.visualization.ColumnChart(document.getElementById('graphThreads'));
    var bar_graph_tags = new google.visualization.ColumnChart(document.getElementById('graphTags'));
    var calendar = new google.visualization.Calendar(document.getElementById('graphCalendar'));
    var opts = {
      width: '100%', height: '100%', page: 'enable', pageSize: 20, legend: { position: 'none' },
      vAxis: { format: '#' }, isStacked: true, colors: ['#243c68', '#e6693e'], tooltip: {isHtml: true}
    };
    data.sort({column: 0, desc: true});
    var view = new google.visualization.DataView(data);
    view.hideColumns([3,4,6]);
    /* Built tables with loops above
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
    if (messagesPerThread.getValue(0,0)=="document"){ //drop document row if exists
      messagesPerThread.removeRow(0);
    };*/

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
    let graphDivHeight = (activeYears * 150) + 250;
    $( "#graphCalendar" ).css("height",graphDivHeight + "px");

    //bar_graph.draw(messagesPerUser, opts);
    messageTypeData.sort({column: 4, desc: true});
    viewD = new google.visualization.DataView(messageTypeData);
    viewD.hideColumns([1,4]);

    bar_graph_contributors.draw(viewD, opts);
    bar_graph_tags.draw(tagData, opts); 
    bar_graph_threads.draw(threadsView, opts);
    calendar.draw(messagesPerDay, opts); 
    table.draw(view, opts);

    // counter cards 
    $( "#participantCounter" ).text(messageTypeData.getNumberOfRows());
    $( "#calendarCounter" ).text(messagesPerDay.getNumberOfRows());
    $( "#threadCounter" ).text(threadsView.getNumberOfRows());
    $( "#tagCounter" ).text(Object.keys(tagCounts).length);
    $( "#annotationCounter" ).text(total);

    //create event handler object.
    //to be removed when table is filtered. Then create new event handler object 
    var event = google.visualization.events.addListener(table, 'select', function() {
      var row = table.getSelection()[0].row;
      let _link = data.getValue(row, 6).substring(15,37);
      $('#annotationModalLabel').text(data.getValue(row, 1) + ":");
      $('#annotationModalBody').text(data.getValue(row, 4));
      $('#inContextButton').attr("href", data.getValue(row, 6));
      $('#threadButton').attr("thread", data.getValue(row, 6));
      $('#annotationModal').modal('show');
    });

    //Filters table by thread of selected annotation
    $( "#threadButton" ).click(function() {
      var _thread = $(this).attr("thread");
      view = new google.visualization.DataView(data);
      var r = view.getFilteredRows([{column: 6, value: _thread}]);
      view.hideColumns([3,4,6]);
      view.setRows(r);
      table.draw(view, opts);

      var event = google.visualization.events.addListener(table, 'select', function() {
        var row = view.getTableRowIndex(table.getSelection()[0].row);
        $('#annotationModalLabel').text(data.getValue(row, 1) + ":");
        $('#annotationModalBody').text(data.getValue(row, 4));
        $('#inContextButton').attr("href", data.getValue(row, 6));
        $('#threadButton').attr("thread", data.getValue(row, 6));
        $('#annotationModal').modal('show');
      });
    });
    //for filtering by user
    google.visualization.events.addListener(bar_graph_contributors, 'select', function() {
      google.visualization.events.removeListener(event);
      view = new google.visualization.DataView(data);
      view.hideColumns([3,4,6]);
      var row = bar_graph_contributors.getSelection()[0].row;
      bar_graph_contributors.setSelection(); //needed to prevent graph freezing on 2nd click
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
        $('#threadButton').attr("thread", data.getValue(row, 6));
        $('#annotationModal').modal('show');
      });
    });
    //filters table by thread
    google.visualization.events.addListener(bar_graph_threads, 'select', function() {
      view = new google.visualization.DataView(data);
      var row = bar_graph_threads.getSelection()[0].row;
      bar_graph_threads.setSelection(); //needed to prevent graph freezing on 2nd click
      var name = threadsData.getValue(row, 2); //use the #2 column where the nodeMsg is
      var r = view.getFilteredRows([{column: 3, value: name}]);
      view.hideColumns([3,4,6]);
      view.setRows(r);
      table.draw(view, opts);

      var event = google.visualization.events.addListener(table, 'select', function() {
        var row = view.getTableRowIndex(table.getSelection()[0].row);
        $('#annotationModalLabel').text(data.getValue(row, 1) + ":");
        $('#annotationModalBody').text(data.getValue(row, 4));
        $('#inContextButton').attr("href", data.getValue(row, 6));
        $('#threadButton').attr("thread", data.getValue(row, 6));
        $('#annotationModal').modal('show');
      });
    });

    //filters table by date
    google.visualization.events.addListener(calendar, 'select', function() {
      view = new google.visualization.DataView(data);
      let _date = new Date(calendar.getSelection()[0].date);
      let _y = _date.getFullYear();
      let _m = _date.getMonth();
      let _d = _date.getDate() + 1;
      var r = view.getFilteredRows([{column: 0, value: new Date(_y, _m, _d)}]); 
      calendar.setSelection();
      view.hideColumns([3,4,6]);
      view.setRows(r);
      table.draw(view, opts);

      var event = google.visualization.events.addListener(table, 'select', function() {
        var row = view.getTableRowIndex(table.getSelection()[0].row);
        $('#annotationModalLabel').text(data.getValue(row, 1) + ":");
        $('#annotationModalBody').text(data.getValue(row, 4));
        $('#inContextButton').attr("href", data.getValue(row, 6));
        $('#threadButton').attr("thread", data.getValue(row, 6));
        $('#annotationModal').modal('show');
      });
    });
    //filter by tag
    google.visualization.events.addListener(bar_graph_tags, 'select', function() {
      view = new google.visualization.DataView(data);
      var row = bar_graph_tags.getSelection()[0].row;
      bar_graph_tags.setSelection(); //needed to prevent graph freezing on 2nd click
      let _tag = tagData.getValue(row, 0);
      var r = view.getFilteredRows([{column: 3, test: function(value, row, column, table) {
        return(table.getValue(row, 5).includes(_tag));
      }}]);
      view.hideColumns([3,4,6]);
      view.setRows(r);
      table.draw(view, opts);

      var event = google.visualization.events.addListener(table, 'select', function() {
        var row = view.getTableRowIndex(table.getSelection()[0].row);
        $('#annotationModalLabel').text(data.getValue(row, 1) + ":");
        $('#annotationModalBody').text(data.getValue(row, 4));
        $('#inContextButton').attr("href", data.getValue(row, 6));
        $('#threadButton').attr("thread", data.getValue(row, 6));
        $('#annotationModal').modal('show');
      });
    });

    $( "#resetButton" ).click(function() {
      view = new google.visualization.DataView(data);
      view.hideColumns([3,4,6]);
      table.draw(view, opts);
    });

    $("#sortParticipantRecentButton").click(function(){
      messageTypeData.sort({column: 4, desc: true});
      bar_graph_contributors.draw(viewD, opts);
      $( "#sortParticipantRecentButton" ).attr("class", "dropdown-item active");
      $( "#sortParticipantHighestButton" ).attr("class", "dropdown-item");
      $( "#sortParticipantLowestButton" ).attr("class", "dropdown-item");
    });
    $("#sortParticipantHighestButton").click(function(){
      messageTypeData.sort({column: 1, desc: true});
      bar_graph_contributors.draw(viewD, opts);
      $( "#sortParticipantRecentButton" ).attr("class", "dropdown-item");
      $( "#sortParticipantHighestButton" ).attr("class", "dropdown-item active");
      $( "#sortParticipantLowestButton" ).attr("class", "dropdown-item");
    });
    $("#sortParticipantLowestButton").click(function(){
      messageTypeData.sort({column: 1, desc: false});
      bar_graph_contributors.draw(viewD, opts);
      $( "#sortParticipantRecentButton" ).attr("class", "dropdown-item");
      $( "#sortParticipantHighestButton" ).attr("class", "dropdown-item");
      $( "#sortParticipantLowestButton" ).attr("class", "dropdown-item active");
    });
    $("#sortThreadRecentButton").click(function(){
      threadsData.sort({column: 3, desc: true});
      bar_graph_threads.draw(threadsView, opts);
      $( "#sortThreadRecentButton" ).attr("class", "dropdown-item active");
      $( "#sortThreadHighestButton" ).attr("class", "dropdown-item");
      $( "#sortThreadLowestButton" ).attr("class", "dropdown-item");
    });
    $("#sortThreadHighestButton").click(function(){
      threadsData.sort({column: 1, desc: true});
      bar_graph_threads.draw(threadsView, opts);
      $( "#sortThreadRecentButton" ).attr("class", "dropdown-item");
      $( "#sortThreadHighestButton" ).attr("class", "dropdown-item active");
      $( "#sortThreadLowestButton" ).attr("class", "dropdown-item");
    });
    $("#sortThreadLowestButton").click(function(){
      threadsData.sort({column: 1, desc: false});
      bar_graph_threads.draw(threadsView, opts);
      $( "#sortThreadRecentButton" ).attr("class", "dropdown-item");
      $( "#sortThreadHighestButton" ).attr("class", "dropdown-item");
      $( "#sortThreadLowestButton" ).attr("class", "dropdown-item active");
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
      $( "#annotationCounter" ).html('<h3>Enter valid URL...</h3>');
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
      $( "#annotationCounter" ).html('<h3>Enter valid URL...</h3>');
      return false;
    }
    hlib.hApiSearch(params, processSearchResults, '');
  });

  var startURL = new URL(window.location.href);
  if (startURL.searchParams.get("url")){
    $( "#annotationCounter" ).html('<h3>Loading...</h3>');
    var u = startURL.searchParams.get("url");
    $('#urlBar').val(u);  //add url param to search bar for sharing 
    params.url = u;
    google.charts.setOnLoadCallback(function() { //waits for graph lib to load before drawing
      hlib.hApiSearch(params, processSearchResults, '');
    });
  } 

  if (startURL.href.includes("marginalsyllabus.html")){
    $("#conversation_summary").html(syllabus['february2018']['summary']);
    params.url = syllabus['february2018']['url'];
    google.charts.setOnLoadCallback(function() { //waits for graph lib to load before drawing
      hlib.hApiSearch(params, processSearchResults, '');
    });
  }

  if (startURL.href.includes("sfupub802sp19.html")){
    $("#conversation_summary").html(syllabus['Mod2018']['summary']);
    params.url = syllabus['Mod2018']['url'];
    google.charts.setOnLoadCallback(function() { //waits for graph lib to load before drawing
      hlib.hApiSearch(params, processSearchResults, '');
    });
  }

  if (startURL.href.includes("equityunbound.html")){
    $("#conversation_summary").html(syllabus['mounzer2016']['summary']);
    params.url = syllabus['mounzer2016']['url'];
    google.charts.setOnLoadCallback(function() { //waits for graph lib to load before drawing
      hlib.hApiSearch(params, processSearchResults, '');
    });
  }

  if (startURL.href.includes("inte5320sp19.html")){
    $("#conversation_summary").html(syllabus['syllabus']['summary']);
    params.url = syllabus['syllabus']['url'];
    google.charts.setOnLoadCallback(function() { //waits for graph lib to load before drawing
      hlib.hApiSearch(params, processSearchResults, '');
    });
  }

  if (startURL.href.includes("inte7130sp19.html")){
    $("#conversation_summary").html(syllabus['Syllabus']['summary']);
    params.url = syllabus['Syllabus']['url'];
    google.charts.setOnLoadCallback(function() { //waits for graph lib to load before drawing
      hlib.hApiSearch(params, processSearchResults, '');
    });
  }

  if (startURL.href.includes("engelbart.html")){
    $("#conversation_summary").html(syllabus['1']['summary']);
    params.url = syllabus['1']['url'];
    google.charts.setOnLoadCallback(function() { //waits for graph lib to load before drawing
      hlib.hApiSearch(params, processSearchResults, '');
    });
  }

  if (startURL.href.includes("r2l.html")){
    $("#conversation_summary").html(syllabus['active']['summary']);
    params.url = syllabus['active']['url'];
    google.charts.setOnLoadCallback(function() { //waits for graph lib to load before drawing
      hlib.hApiSearch(params, processSearchResults, '');
    });
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