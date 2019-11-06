function tagsGraphBuilder(tagsData,response) {    
  let tagsDataTable = new google.visualization.DataTable();
  let bar_graph_tags = new google.visualization.ColumnChart(document.getElementById('tags_graph_div'));
  let opts = {
    width: '100%', height: '100%', legend: { position: 'none' },
    vAxis: { format: '#' }, colors: ['#243c68', '#e6693e'], tooltip: {isHtml: true}
  };

  tagsDataTable.addColumn({type: 'string', id: 'tag', label: 'Tag'});
  tagsDataTable.addColumn({type: 'number', id: 'count', label: 'Count'});
  tagsDataTable.addColumn({type: 'date', id: 'Date', label: 'Date'});
  tagsDataTable.addColumn({type: 'string', role: 'tooltip', 'p': {'html':true}});
  
  for (let t in tagsData){
    let _year = tagsData[t]['tagDateLatest'].getYear() + 1900;
    let _month = tagsData[t]['tagDateLatest'].getMonth() + 1;
    let _dateDay = tagsData[t]['tagDateLatest'].getDate();
    let _dd = _month + "/" + _dateDay + "/" + _year;
    let _t = tagGraphTooltipHTML(t, _dd);
    tagsDataTable.addRows([
      [ t, tagsData[t]['count'], tagsData[t]['tagDateLatest'], _t ]
    ]);
  }

  let tagsDataView = new google.visualization.DataView(tagsDataTable);
  tagsDataView.setColumns([0,1,3]);
  bar_graph_tags.draw(tagsDataView, opts);

  $( "#tagCounter" ).text(tagsDataView.getNumberOfRows());

  google.visualization.events.addListener(bar_graph_tags, 'select', function() {
    google.visualization.events.removeListener(event);
    let row = bar_graph_tags.getSelection()[0].row;
    bar_graph_tags.setSelection(); //needed to prevent graph freezing on 2nd click
    let tag = tagsDataView.getValue(row, 0);
    filter = {
      user: "",
      group: "",
      url: "",
      wildcard_uri: "",
      tag: tag,
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
};

function tagGraphTooltipHTML(tag, recentAnnotationDate){
  let table = `
    <table class='table'>
      <tr> 
        <th colspan='2' align='center'>` + tag + `</th>
      </tr>
      <tr>
        <td align='left'>
          <b>Most recent:</b>
        </td>
        <td>` 
          + recentAnnotationDate + `
        </td>
      </tr>
    </table>`;
  return table;
};