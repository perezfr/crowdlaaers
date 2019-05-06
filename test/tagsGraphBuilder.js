function tagsGraphBuilder(tagsData,response) {    
  let tagsDataTable = new google.visualization.DataTable();
  let bar_graph_tags = new google.visualization.ColumnChart(document.getElementById('tags_graph_div'));
  let opts = {
    width: '100%', height: '100%', page: 'enable', pageSize: 20, legend: { position: 'none' },
    vAxis: { format: '#' }, colors: ['#243c68', '#e6693e'], 
  };

  tagsDataTable.addColumn({type: 'string', id: 'tag', label: 'Tag'});
  tagsDataTable.addColumn({type: 'number', id: 'count', label: 'Count'});
  tagsDataTable.addColumn({type: 'date', id: 'Date', label: 'Date'});
  
  for (let t in tagsData){
    tagsDataTable.addRows([
      [ t, tagsData[t]['count'], tagsData[t]['tagDateLatest'] ]
    ]);
  }

  let tagsDataView = new google.visualization.DataView(tagsDataTable);
  tagsDataView.setColumns([0,1]);
  bar_graph_tags.draw(tagsDataView, opts);

  $( "#tagCounter" ).text(tagsDataView.getNumberOfRows());

  google.visualization.events.addListener(bar_graph_tags, 'select', function() {
    google.visualization.events.removeListener(event);
    let row = bar_graph_tags.getSelection()[0].row;
    bar_graph_tags.setSelection(); //needed to prevent graph freezing on 2nd click
    let tag = tagsDataView.getValue(row, 0);
    filter['tag'] = tag;
    dataObjects = groupObjectBuilder(response,filter);

    annotationTableBuilder(response,dataObjects[5],filter);
    participantGraphBuilder(dataObjects[2],response);
    threadGraphBuilder(dataObjects[3],response);
    urlGraphBuilder(dataObjects[0],response);
    daysGraphBuilder(dataObjects[4],response);
    tagsGraphBuilder(dataObjects[1],response);
  });
}