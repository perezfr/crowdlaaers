function threadGraphBuilder(threadData,response) {   
  let threadDataTable = new google.visualization.DataTable();
  let bar_graph_threads = new google.visualization.ColumnChart(document.getElementById('threads_graph_div'));
  let opts = {
    width: '100%', height: '100%', page: 'enable', pageSize: 20, legend: { position: 'none' },
    vAxis: { format: '#' }, colors: ['#243c68', '#e6693e'], 
  };
  //threads columns
  threadDataTable.addColumn({type: 'string', id: 'users', label: 'Users'});
  threadDataTable.addColumn({type: 'number', id: 'total', label: 'Total'});
  threadDataTable.addColumn({type: 'date', id: 'Date', label: 'Date'});
  threadDataTable.addColumn({type: 'string', id: 'nodeMsg', label: 'Node'});

  for (let t in threadData){
    threadDataTable.addRows([
      [ threadData[t]['names'].toString(), threadData[t]['threadMsgCount'], threadData[t]['threadsDateLatest'], t ]
    ]);
  }

  threadDataTable.sort({column:3, desc:true});
  let threadDataView = new google.visualization.DataView(threadDataTable);
  threadDataView.setColumns([0,1]);
  bar_graph_threads.draw(threadDataView, opts);

  $( "#threadCounter" ).text(threadDataView.getNumberOfRows());

  google.visualization.events.addListener(bar_graph_threads, 'select', function() {
    google.visualization.events.removeListener(event);
    let row = bar_graph_threads.getSelection()[0].row;
    bar_graph_threads.setSelection(); //needed to prevent graph freezing on 2nd click
    let thread = threadDataTable.getValue(row, 3);
    filter = {
      user: "",
      group: "",
      url: "",
      wildcard_uri: "",
      tag: "",
      any: "",
      max: "",
      thread: thread,
      date: ""
    };
    dataObjects = groupObjectBuilder(response,filter);

    annotationTableBuilder(response,dataObjects[5],filter);
    participantGraphBuilder(dataObjects[2],response);
    threadGraphBuilder(dataObjects[3],response);
    urlGraphBuilder(dataObjects[0],response);
    daysGraphBuilder(dataObjects[4],response);
    tagsGraphBuilder(dataObjects[1],response);
  });
}