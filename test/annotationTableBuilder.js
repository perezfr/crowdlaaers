function drawAnnotationTable(rows,threadsID,annotationDataTable) {
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

    //Table columns


    for (s of rows){
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
        let tags = s['tags'].join().toLowerCase();
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

}; //end drawtable