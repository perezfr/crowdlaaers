function threadGraphBuilder(threadData,threadDataTable) {    
  //threads columns
  threadDataTable.addColumn({type: 'string', id: 'users', label: 'Users'});
  threadDataTable.addColumn({type: 'number', id: 'total', label: 'Total'});
  threadDataTable.addColumn({type: 'date', id: 'Date', label: 'Date'});
  threadDataTable.addColumn({type: 'string', id: 'nodeMsg', label: 'Node'});

  for (let t in threadData){
    threadDataTable.addRows([
      [ threadData[t]['names'].toString(), threadData[t]['threadMsgCount'], threadData[t]['threadsDateLatest'], t ]
    ]);
  }
}