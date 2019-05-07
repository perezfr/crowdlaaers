function daysGraphBuilder(daysData,response) {    
  let daysDataTable = new google.visualization.DataTable();
  let calendar_graph_days = new google.visualization.Calendar(document.getElementById('days_graph_div'));
  let opts = {
    width: '100%', height: '100%', page: 'enable', pageSize: 20, legend: { position: 'none' },
    vAxis: { format: '#' }, colors: ['#243c68', '#e6693e'], 
  };

  //threads columns
  daysDataTable.addColumn({type: 'date', id: 'Date', label: 'Date'});
  daysDataTable.addColumn({type: 'number', id: 'count', label: 'Count'});

  for (let d in daysData){
    // let year = d.getYear() + 1900;
    // let month = d.getMonth() + 1;
    // let dateDay = d.getDate();
    daysDataTable.addRows([
      [ new Date(d), daysData[d] ]
    ]);
  }

  let daysDataView = new google.visualization.DataView(daysDataTable);
  daysDataView.setColumns([0,1]);
  calendar_graph_days.draw(daysDataView,opts);

  $( "#calendarCounter" ).text(daysDataView.getNumberOfRows());

  google.visualization.events.addListener(calendar_graph_days, 'select', function() {
    google.visualization.events.removeListener(event);
    let _date = new Date(calendar_graph_days.getSelection()[0].date);
    let _y = _date.getFullYear();
    let _m = _date.getMonth();
    let _d = _date.getDate() + 1;
    calendar_graph_days.setSelection(); //needed to prevent graph freezing on 2nd click 
    console.log(_date);
    
    filter = {
      user: "",
      group: "",
      url: "",
      wildcard_uri: "",
      tag: "",
      any: "",
      max: "",
      thread: "",
      date: _date
    };
    // dataObjects = groupObjectBuilder(response,filter);

    // annotationTableBuilder(response,dataObjects[5],filter);
    // participantGraphBuilder(dataObjects[2],response);
    // threadGraphBuilder(dataObjects[3],response);
    // urlGraphBuilder(dataObjects[0],response);
    // daysGraphBuilder(dataObjects[4],response);
    // tagsGraphBuilder(dataObjects[1],response);
  });
}