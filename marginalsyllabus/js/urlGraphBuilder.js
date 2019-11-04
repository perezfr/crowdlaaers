function urlGraphBuilder(urlData,response,sort) { 
  let urlDataTable = new google.visualization.DataTable();
  let bar_graph_urls = new google.visualization.ColumnChart(document.getElementById('url_graph_div'));  
  let opts = {
    width: '100%', height: '100%', legend: { position: 'none' },
    vAxis: { format: '#' }, colors: ['#243c68', '#e6693e'], tooltip: {isHtml: true}
  };
  //threads columns
  urlDataTable.addColumn({type: 'string', id: 'url', label: 'URL'});
  urlDataTable.addColumn({type: 'number', id: 'count', label: 'Count'});
  urlDataTable.addColumn({type: 'date', id: 'Date', label: 'Date'});
  urlDataTable.addColumn({type: 'string', role: 'tooltip', 'p': {'html':true}});
  urlDataTable.addColumn({type: 'string', id: 'title', label: 'Title'});

  //build data table
  for (let u in urlData){
    let _year = urlData[u]['urlDateLatest'].getYear() + 1900;
    let _month = urlData[u]['urlDateLatest'].getMonth() + 1;
    let _dateDay = urlData[u]['urlDateLatest'].getDate();
    let _dd = _month + "/" + _dateDay + "/" + _year; 
    let titleSummary;
    if (urlData[u]['title'].length > 50){
        titleSummary = urlData[u]['title'].slice(0, 50) + "...";
    } else {
        titleSummary = urlData[u]['title'];
    }
    let _u = urlGraphTooltipHTML(titleSummary, _dd, urlData[u]['names'].slice(0,3).join(', '));
    urlDataTable.addRows([
      [ u, urlData[u]['count'], urlData[u]['urlDateLatest'], _u, urlData[u]['title'] ]
    ]);
  }

  if ( sort == '' ){
    urlDataTable.sort({column:2, desc:true});
  } 
  if ( sort == 'top' ){
    urlDataTable.sort({column:1, desc:true});
  }
  let urlDataView = new google.visualization.DataView(urlDataTable);
  //urlDataView.setColumns([4,1,3]); //keep the index because using the hoverover
  urlDataView.setColumns([0,1,3]);
  bar_graph_urls.draw(urlDataView, opts);

  $( "#documentCounter" ).text(urlDataView.getNumberOfRows());

  google.visualization.events.addListener(bar_graph_urls, 'select', function() {
    google.visualization.events.removeListener(event);
    let row = bar_graph_urls.getSelection()[0].row;
    bar_graph_urls.setSelection(); //needed to prevent graph freezing on 2nd click
    //let url = val2key( urlDataView.getValue(row, 0), urlData ); //need to map title to url
    let url = urlDataView.getValue(row, 0);  //keep the index because using the hoverover
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

function val2key(val,array){
  for (var key in array) {
    if(array[key]['title'] == val){
      return key;
    }
  }
 return false;
}

function urlGraphTooltipHTML(url, recentAnnotationDate, recentContributors){
  let table = `
    <table class='table'>
      <tr> 
        <th colspan='2' align='center'>` + url + `</th>
      </tr>
      <tr>
        <td align='left'>
          <b>Most recent annotation:</b>
        </td>
        <td>` 
          + recentAnnotationDate + `
        </td>
      </tr>
      <tr>
        <td align='left'>
          <b>Recent contributors:</b>
        </td>
        <td>` 
          + recentContributors + `
        </td>
      </tr>
    </table>`;
  return table;
};