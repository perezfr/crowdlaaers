function urlGraphBuilder(threadData,urlDataTable) {    
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
}