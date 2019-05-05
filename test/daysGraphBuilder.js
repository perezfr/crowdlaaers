function daysGraphBuilder(daysData,daysDataTable) {    
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
}