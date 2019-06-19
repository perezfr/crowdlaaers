function redrawCharts(_dataObjects,annotationDataTable,filter){
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
    //$('[data-toggle="tooltip"]').tooltip();
    
    // let annotationDataTable = new google.visualization.DataTable();
    // let tagsDataTable = new google.visualization.DataTable();
    // let participantMessageTypeDataTable = new google.visualization.DataTable();
    // let urlDataTable = new google.visualization.DataTable();
    // let threadDataTable = new google.visualization.DataTable();
    // let daysDataTable = new google.visualization.DataTable();

    // let annotationTable = new google.visualization.Table(document.getElementById('annotation_table_div'));
    // let bar_graph_urls = new google.visualization.ColumnChart(document.getElementById('url_graph_div'));
    // let bar_graph_contributors = new google.visualization.ColumnChart(document.getElementById('participant_graph_div'));
    // let bar_graph_threads = new google.visualization.ColumnChart(document.getElementById('threads_graph_div'));
    // let bar_graph_days = new google.visualization.Calendar(document.getElementById('days_graph_div'));
    // let bar_graph_tags = new google.visualization.ColumnChart(document.getElementById('tags_graph_div'));

    // let opts = {
    //   width: '100%', height: '100%', page: 'enable', pageSize: 20, legend: { position: 'none' },
    //   vAxis: { format: '#' }, isStacked:true, colors: ['#243c68', '#e6693e'], 
    // };
    // let optsURLGraph = {
    //   width: '100%', height: '100%', page: 'enable', pageSize: 20, legend: { position: 'none' },
    //   vAxis: { format: '#' }, colors: ['#243c68', '#e6693e'], tooltip: {isHtml: true}
    // };

    annotationTableBuilder(rows,_dataObjects[5],annotationDataTable,filter);
    // participantGraphBuilder(_dataObjects[2],participantMessageTypeDataTable);
    // threadGraphBuilder(_dataObjects[3],threadDataTable);
    // urlGraphBuilder(_dataObjects[0],urlDataTable);
    // daysGraphBuilder(_dataObjects[4],daysDataTable);
    // tagsGraphBuilder(_dataObjects[1],tagsDataTable);
    console.log(annotationDataTable);
    // annotationDataTable.sort({column:0, desc:true});
    // let annotationDataView = new google.visualization.DataView(annotationDataTable);
    // annotationDataView.setColumns([0,1,2,5,7]);
    // annotationTable.draw(annotationDataView, opts);

    //sort by columns: 1 = amount, 4 is recent
    // participantMessageTypeDataTable.sort({column:4, desc:true});
    // let participantMessageTypeDataView = new google.visualization.DataView(participantMessageTypeDataTable);
    // participantMessageTypeDataView.setColumns([0,2,3]);
    // bar_graph_contributors.draw(participantMessageTypeDataView, opts);

    // threadDataTable.sort({column:3, desc:true});
    // let threadDataView = new google.visualization.DataView(threadDataTable);
    // threadDataView.setColumns([0,1]);
    // bar_graph_threads.draw(threadDataView, opts);

    // urlDataTable.sort({column:3, desc:true});
    // let urlDataView = new google.visualization.DataView(urlDataTable);
    // urlDataView.setColumns([0,1]);
    // bar_graph_urls.draw(urlDataView, optsURLGraph);

    // let daysDataView = new google.visualization.DataView(daysDataTable);
    // daysDataView.setColumns([0,1]);
    //make the calendar div taller based on number of years
    // let activeYears = annotationDataTable.getColumnRange(0).max.getFullYear() - annotationDataTable.getColumnRange(0).min.getFullYear();
    // let graphDivHeight = (activeYears * 150) + 250;
    // $( "#days_graph_div" ).css("height",graphDivHeight + "px");
    // bar_graph_days.draw(daysDataView, opts);

    // let tagsDataView = new google.visualization.DataView(tagsDataTable);
    // tagsDataView.setColumns([0,1]);
    // bar_graph_tags.draw(tagsDataView, opts);

    // counter cards 
    $( "#participantCounter" ).text(participantMessageTypeDataView.getNumberOfRows());
    $( "#calendarCounter" ).text(daysDataView.getNumberOfRows());
    $( "#threadCounter" ).text(threadDataView.getNumberOfRows());
    $( "#tagCounter" ).text(tagsDataView.getNumberOfRows());
    $( "#annotationCounter" ).text(annotationDataView.getNumberOfRows());
}