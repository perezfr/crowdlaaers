//message type columns
function participantGraphBuilder(participantData,participantMessageTypeDataTable) {
  participantMessageTypeDataTable.addColumn({type: 'string', id: 'tag', label: 'Tag'});
  participantMessageTypeDataTable.addColumn({type: 'number', id: 'total', label: 'Total'});
  participantMessageTypeDataTable.addColumn({type: 'number', id: 'annotations', label: 'Annotations'});
  participantMessageTypeDataTable.addColumn({type: 'number', id: 'replies', label: 'Replies'});
  participantMessageTypeDataTable.addColumn({type: 'date', id: 'Date', label: 'Date'});

  for (var m in participantData) {
    participantMessageTypeDataTable.addRows([
      [ m,participantData[m]['participantTotalMessages'],participantData[m]['annotations'],participantData[m]['replies'],
      participantData[m]['dateLatest']]
    ]);
  }
}