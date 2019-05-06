function annotationTableBuilder(rows,threadsID,filter) {
    let _url;
    let annotationDataTable = new google.visualization.DataTable();
    let annotationTable = new google.visualization.Table(document.getElementById('annotation_table_div'));
    let opts = {
      width: '100%', height: '100%', page: 'enable', pageSize: 20, legend: { position: 'none' },
      vAxis: { format: '#' }, colors: ['#243c68', '#e6693e'], 
    };

    annotationDataTable.addColumn({type: 'date', id: 'Date', label: 'Date'});
    annotationDataTable.addColumn({type: 'string', id: 'user', label: 'Contributor'});
    annotationDataTable.addColumn({type: 'string', id: 'textSummary', label: 'Annotation'});
    annotationDataTable.addColumn({type: 'string', id: 'NodeMsg', label: 'Anchor'});
    annotationDataTable.addColumn({type: 'string', id: 'textComplete', role: 'annotationText'});
    annotationDataTable.addColumn({type: 'string', id: 'tags', label: 'Tags'});
    annotationDataTable.addColumn({type: 'string', id: 'link', label: 'Link'});
    annotationDataTable.addColumn({type: 'number', id: 'level', label: 'Level'});
    annotationDataTable.addColumn({type: 'string', id: 'url', label: 'URL'});
    //let rows = response['rows'];
    //let total = response['total'];

    if ( filter['url'] != "" ){
        if ( filter['url'].includes('https://via.hypothes.is/') ) { 
            _url = filter['url'].substring(24)
        } else {
            _url = filter['url'];
        }
    }

    for (s of rows){
        let tags = s['tags'].join().toLowerCase();
        let inThread = false;
        if ( filter['group'] != "" ){
            if( s['group'] != filter['group'] ) { continue; }
        }
        if ( filter['url'] != "" ){
            if ( s['url'] != _url ) { continue; } 
        }
        if ( filter['user'] != "" ){
          if ( s['user'] != filter['user'] ) { continue; }
        }
        if ( filter['thread'] != "" ){
          if ( s['id'] == filter['thread'] ) { 
            inThread = true; 
          }
          if ( s['refs'].length > 0 ){
            if ( s['refs'][0] == filter['thread'] ) {
              inThread = true;
            }
          }
          if ( !inThread ) { continue; }
        }
        if ( filter['tag'] != "" ){
            if ( !tags ) { continue; }
            if ( !tags.includes(filter['tag']) ) { continue; }
        }
        let nodeMsg;
        let urlString;
        let offset = new Date().getTimezoneOffset()*60;
        //console.log(offset);
        let date = new Date(s['updated']);
        let newdate = new Date(date.getTime() + offset);
        //console.log(date.getTime() + offset);
        let year = date.getYear() + 1900;
        let month = date.getMonth();
        let dateDay = date.getDate();
        //console.log(dateDay + " and " + newdate.getDate());
        let hour = date.getHours();
        let mins = date.getMinutes();
        let second = date.getSeconds();
        //var username = s['user'].slice(5,-12);
        let username = s['user'];
        let textTotal = s['text'];
        let link, textSummary;
      //Count the threads
        level = 0;
        nodeMsg = "document";
        if (threadsID.includes(s['id'])){
        //if message is anchor annotation in the thread sets anchor ID it to
        //message ID 
            nodeMsg = s['id'];
        }

        if (s['refs'].length > 0){
        //Sets anchor ID to the first anchor annotation
            nodeMsg = s['refs'][0];
            level = s['refs'].length;
        }

        //Creates a annotation clip to display in table
        if (s['text'].length > 50){
            textSummary = s['text'].slice(0, 50) + "...";
        } else {
            textSummary = s['text'];
        }

        //var link = s['links']['incontext'];
        //HLIB doesn't return 'incontext' field. so...
        if (nodeMsg == 'document'){
            link = "https://hyp.is/" + s['id'];
        } else {
            link = "https://hyp.is/" + nodeMsg;
        }     
        //Add the table graph rows
        annotationDataTable.addRows([
            [new Date(year, month, dateDay), username, textSummary, nodeMsg, textTotal, tags , link , level, s['url']]
        ]);
    } // end rows loop
    annotationDataTable.sort({column:0, desc:true});
    let annotationDataView = new google.visualization.DataView(annotationDataTable);
    annotationDataView.setColumns([0,1,2,5,7]);
    annotationTable.draw(annotationDataView, opts);

    $( "#annotationCounter" ).text(annotationDataView.getNumberOfRows());
    //make the calendar div taller based on number of years
    if (annotationDataView.getNumberOfRows() > 0){
        let activeYears = annotationDataTable.getColumnRange(0).max.getFullYear() - 
        annotationDataTable.getColumnRange(0).min.getFullYear();
        let graphDivHeight = (activeYears * 150) + 250;
        $( "#days_graph_div" ).css("height",graphDivHeight + "px");
    }

    var event = google.visualization.events.addListener(annotationTable, 'select', function() {
        var row = annotationTable.getSelection()[0].row;
        let _link = annotationDataTable.getValue(row, 6).substring(15,37);
        $('#annotationModalLabel').text(annotationDataTable.getValue(row, 1) + ":");
        $('#annotationModalBody').text(annotationDataTable.getValue(row, 4));
        $('#inContextButton').attr("href", annotationDataTable.getValue(row, 6));
        $('#threadButton').attr("thread", annotationDataTable.getValue(row, 6));
        $('#annotationModal').modal('show');
    });
}; //end drawtable