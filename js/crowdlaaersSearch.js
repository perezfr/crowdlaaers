$( document ).ready(function() {
  google.charts.load('current', {'packages':['table','corechart','calendar']});
  var response;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      response = JSON.parse(this.responseText);
      drawTable(response);
    }
  };

  function inactivate() {
    $( "#contributorsClick" ).attr("class", "nav-link active");
    $( "#calendarClick" ).attr("class", "nav-link");
    $( "#threadsClick" ).attr("class", "nav-link");
    $( "#tagsClick" ).attr("class", "nav-link");
    $( "#graphLabel" ).text("Annotations per Contributor");
    $( "#graph" ).css("height","300px");
    $( "#graph" ).html('<h3>Loading...</h3>');
    $( "#annotationCounter" ).text("*");
  };

  function drawTable(response) {
    $('[data-toggle="tooltip"]').tooltip();
    var data = new google.visualization.DataTable();
    var tagData = new google.visualization.DataTable();
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

    var rows = response['rows'];
    var total = response['total'];
    var threads = [];
    var tagArray = [];
    var tagCounts = {};
    var level = 0;

    for (ss of rows){
      //create array of annotations with replies as root for threads
      if (ss['references']){
        if (!threads.includes(ss['references'][0])){
          threads.push(ss['references'][0]);
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
      var nodeMsg = "Document";
      if (threads.includes(s['id'])){
        //if message is anchor annotation in the thread sets anchor ID it to
        //message ID 
        nodeMsg = s['id'];
        level = 0;
      }

      if (s['references']){
        //Sets anchor ID to the first anchor annotation
        nodeMsg = s['references'][0];
        level = s['references'].length;
      }

      //Creates a annotation clip to display in table
      if (s['text'].length > 50){
        var textSummary = s['text'].slice(0, 50) + "...";
      } else {
        var textSummary = s['text'];
      }

      var date = new Date(s['created']);
      var year = date.getYear() + 1900;
      var month = date.getMonth();
      var dateDay = date.getDate();
      var hour = date.getHours();
      var mins = date.getMinutes();
      var second = date.getSeconds();
      var username = s['user'].slice(5,-12);
      var textTotal = s['text'];
      var link = s['links']['incontext'];
      var tags = s['tags'].join().toLowerCase();
      //Add the table graph rows
      data.addRows([
        [new Date(year, month, dateDay), username, textSummary, nodeMsg, textTotal, tags , link , level]
      ]);
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

    var table = new google.visualization.Table(document.getElementById('table_div'));
    /*
    ** use the chartwrapper here **
    **
    */
    var bar_graph = new google.visualization.ColumnChart(document.getElementById('graph'));
    var calendar = new google.visualization.Calendar(document.getElementById('graph'));
    var opts = {
      width: '100%', height: '100%', page: 'enable', pageSize: 25, legend: { position: 'none' },
      vAxis: { format: '#' }
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
    messagesPerDay.removeRow(0);

    bar_graph.draw(messagesPerUser, opts);
    table.draw(view, opts);

    //Left nav pill notifications counter 
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

    google.visualization.events.addListener(bar_graph, 'select', function() {
      google.visualization.events.removeListener(event);
      view = new google.visualization.DataView(data);
      view.hideColumns([3,4,6]);
      var row = bar_graph.getSelection()[0].row;
      var name = messagesPerUser.getValue(row, 0);
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
      bar_graph.draw(messagesPerUser, opts);

      google.visualization.events.addListener(bar_graph, 'select', function() {
        google.visualization.events.removeListener(event);
        view = new google.visualization.DataView(data);
        var row = bar_graph.getSelection()[0].row;
        var name = messagesPerUser.getValue(row, 0);
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
  };
  var startURL = new URL(window.location.href);
  if (startURL.searchParams.get("url")){
    $( "#graph" ).html('<h3>Loading...</h3>');
    var u = startURL.searchParams.get("url");
    xhttp.open("GET", "https://hypothes.is/api/search?url=" + u + "&limit=200", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  } 

  $( "#urlSearch" ).click(function() {
    inactivate();
    var url = $('#urlBar').val();
    xhttp.open("GET", "https://hypothes.is/api/search?url=" + url + "&limit=200", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  });
});
