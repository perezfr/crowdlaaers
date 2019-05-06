function urlGraphBuilder(threadData,response) {  
  let urlDataTable = new google.visualization.DataTable();
  let bar_graph_urls = new google.visualization.ColumnChart(document.getElementById('url_graph_div'));  
  let optsURLGraph = {
    width: '100%', height: '100%', page: 'enable', pageSize: 20, legend: { position: 'none' },
    vAxis: { format: '#' }, colors: ['#243c68', '#e6693e'], tooltip: {isHtml: true}
  };
  //threads columns
  urlDataTable.addColumn({type: 'string', id: 'url', label: 'URL'});
  urlDataTable.addColumn({type: 'number', id: 'count', label: 'Count'});
  urlDataTable.addColumn({type: 'date', id: 'Date', label: 'Date'});
  urlDataTable.addColumn({type: 'string', role: 'tooltip', 'p': {'html':true}});

  for (let u in threadData){
    let _year = threadData[u]['urlDateLatest'].getYear() + 1900;
    let _month = threadData[u]['urlDateLatest'].getMonth() + 1;
    let _dateDay = threadData[u]['urlDateLatest'].getDate();
    let _dd = _month + "/" + _dateDay + "/" + _year;
    let _u = "<table class='table'><tr><th colspan='2' align='center'>" + u +
      "</th></tr><tr><td align='right' width='30px'><b>Participants:</b></td><td>" + 
      "<tr><td align='right'><b>Most recent annotation:</b></td><td>" + _dd + "</td></tr></table>";
    urlDataTable.addRows([
      [ u, threadData[u]['count'], threadData[u]['urlDateLatest'], _u  ]
    ]);
  }

  urlDataTable.sort({column:3, desc:true});
  let urlDataView = new google.visualization.DataView(urlDataTable);
  urlDataView.setColumns([0,1]);
  bar_graph_urls.draw(urlDataView, optsURLGraph);

  google.visualization.events.addListener(bar_graph_urls, 'select', function() {
    google.visualization.events.removeListener(event);
    let row = bar_graph_urls.getSelection()[0].row;
    bar_graph_urls.setSelection(); //needed to prevent graph freezing on 2nd click
    let url = urlDataView.getValue(row, 0);
    filter = {
      user: "",
      group: "",
      url: url,
      wildcard_uri: "",
      tag: "",
      any: "",
      max: "",
      thread: "",
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