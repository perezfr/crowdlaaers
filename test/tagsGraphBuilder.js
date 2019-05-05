function tagsGraphBuilder(tagsData,tagsDataTable) {    
  //Tag chart columns
  tagsDataTable.addColumn({type: 'string', id: 'tag', label: 'Tag'});
  tagsDataTable.addColumn({type: 'number', id: 'count', label: 'Count'});
  tagsDataTable.addColumn({type: 'date', id: 'Date', label: 'Date'});

  for (let t in tagsData){
    tagsDataTable.addRows([
      [ t, tagsData[t]['count'], tagsData[t]['tagDateLatest'] ]
    ]);
  }
}