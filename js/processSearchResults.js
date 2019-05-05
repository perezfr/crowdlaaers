function processSearchResults(annos, replies) {
  let csv = '';
  let json = [];
  let gathered = hlib.gatherAnnotationsByUrl(annos);
  let reversedUrls = reverseChronUrls(gathered.urlUpdates);
  let counter = 0;
  reversedUrls.forEach(function (url) {
      counter++;
      let perUrlId = counter;
      let perUrlCount = 0;
      let idsForUrl = gathered.ids[url];
      idsForUrl.forEach(function (id) {
          perUrlCount++;
          let _replies = hlib.findRepliesForId(id, replies);
          _replies = _replies.map(r => {
              return hlib.parseAnnotation(r);
          });
          let all = [gathered.annos[id]].concat(_replies.reverse());
          all.forEach(function (anno) {
              let level = 0;
              if (anno.refs) {
                  level = anno.refs.length;
              }
              if (format === 'html') {
                  worker.postMessage({
                      perUrlId: perUrlId,
                      anno: anno,
                      annoId: anno.id,
                      level: level
                  });
              }
              else if (format === 'csv') {
                  let _row = document.createElement('div');
                  _row.innerHTML = hlib.csvRow(level, anno);
                  csv += _row.innerText + '\n';
              }
              else if (format === 'json') {
                  anno.text = anno.text.replace(/</g, '&lt;');
                  json.push(anno);
              }
          });
      });
      if (format === 'html') {
          showUrlResults(counter, 'widget', url, perUrlCount, gathered.titles[url]);
      }
  });
  drawCharts(json);
};