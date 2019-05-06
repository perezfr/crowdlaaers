function daysGraphBuilder(daysData) {    
  let daysDataTable = new google.visualization.DataTable();
  let bar_graph_days = new google.visualization.Calendar(document.getElementById('days_graph_div'));
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
  bar_graph_days.draw(daysDataView,opts);

  $( "#calendarCounter" ).text(daysDataView.getNumberOfRows());
}