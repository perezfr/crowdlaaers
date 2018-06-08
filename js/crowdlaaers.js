$( document ).ready(function() {
      google.charts.load('current', {'packages':['table','corechart','calendar']});
      var response;
      //google.charts.setOnLoadCallback(drawTable);
  
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          response = JSON.parse(this.responseText);
          drawTable(response);
        }
      };

      xhttp.open("GET", "https://hypothes.is/api/search?url=http://www.commonsense.org/education/privacy/blog/digital-redlining-access-privacy&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();

      function inactivate() {
        $( "#contributorsClick" ).attr("class", "nav-link active");
        $( "#calendarClick" ).attr("class", "nav-link");
        $( "#threadsClick" ).attr("class", "nav-link");
        $( "#graphLabel" ).text("Messages per Day");
        $( "#august2016" ).attr("class", "nav-link");
        $( "#september2016" ).attr("class", "nav-link");
        $( "#october2016" ).attr("class", "nav-link");
        $( "#november2016" ).attr("class", "nav-link");
        $( "#january2016" ).attr("class", "nav-link");
        $( "#february2016" ).attr("class", "nav-link");
        $( "#march2016" ).attr("class", "nav-link");
        $( "#april2016" ).attr("class", "nav-link");
        $( "#may2016" ).attr("class", "nav-link");
        $( "#october2017" ).attr("class", "nav-link");
        $( "#november2017" ).attr("class", "nav-link");
        $( "#december2017" ).attr("class", "nav-link");
        $( "#january2017" ).attr("class", "nav-link");
        $( "#february2017" ).attr("class", "nav-link");
        $( "#march2017" ).attr("class", "nav-link");
        $( "#april2017" ).attr("class", "nav-link");
        $( "#may2017" ).attr("class", "nav-link");
        $( "#june2017" ).attr("class", "nav-link");
      };

      function drawTable(response) {
        var data = new google.visualization.DataTable();
        data.addColumn({type: 'date', id: 'Date', label: 'Date'});
        data.addColumn({type: 'string', id: 'user', label: 'Participant'});
        data.addColumn({type: 'string', id: 'textSummary', label: 'Annotation'});
        data.addColumn({type: 'string', id: 'NodeMsg', label: 'Anchor'});
        data.addColumn({type: 'string', id: 'textComplete'});

        var rows = response['rows'];
        var threads = [];
        for (ss of rows){
          if (ss['references']){
            if (!threads.includes(ss['references'][0])){
              threads.push(ss['references'][0]);
            }
          }
        }
        for (s of rows) {
          //Count the threads
          var nodeMsg = "Document";
          if (threads.includes(s['id'])){
            nodeMsg = s['id'];
          }

          if (s['references']){
            //if (!threads.includes(s['references'][0])){
              //threads.push(s['references'][0]);
            nodeMsg = s['references'][0];
          }
          var date = new Date(s['created']);
          var year = date.getYear() + 1900;
          var month = date.getMonth();
          var dateDay = date.getDate();
          var hour = date.getHours();
          var mins = date.getMinutes();
          var second = date.getSeconds();
          var username = s['user'].slice(5,-12);
          var textSummary = s['text'].slice(0, 50) + "...";
          var textTotal = s['text'];
          var link = s['links']['incontext'];
          data.addRows([
            //[new Date(year, month, dateDay, hour, mins, second), username, textSummary, textTotal ]
            [new Date(year, month, dateDay), username, textSummary, nodeMsg, textTotal ]
          ]);
        }
        var table = new google.visualization.Table(document.getElementById('table_div'));
        var bar_graph = new google.visualization.ColumnChart(document.getElementById('graph'));
        var calendar = new google.visualization.Calendar(document.getElementById('graph'));
        var opts = {
          width: '100%', height: '100%', page: 'enable', pageSize: 25, legend: { position: 'none' }
        };
        var view = new google.visualization.DataView(data);
        view.hideColumns([4]);

        //*TODO count unique first value IDs in the reference field as a number for threads
        var messagesPerUser = google.visualization.data.group(
          data,
          [1], //Change to 1 to get msgs/user; 0 to get per day
          [{'column': 1, 'aggregation': google.visualization.data.count, 'type': 'number'}]
        );
        messagesPerUser.sort({column: 1, desc: true});

        var messagesPerThread = google.visualization.data.group(
          data,
          [3], //Change to 1 to get msgs/user; 0 to get per day
          [{'column': 1, 'aggregation': google.visualization.data.count, 'type': 'number'}]
        );
        messagesPerThread.sort({column: 1, desc: true});
        messagesPerThread.removeRow(0);

        var messagesPerDay = google.visualization.data.group(
          data,
          [0], //Change to 1 to get msgs/user; 0 to get per day
          [{'column': 0, 'aggregation': google.visualization.data.count, 'type': 'number'}]
        );
        messagesPerDay.sort({column: 1, desc: true});
        messagesPerDay.removeRow(0);

        bar_graph.draw(messagesPerUser, opts);
        table.draw(view, opts);

        google.visualization.events.addListener(bar_graph, 'select', function() {
          view = new google.visualization.DataView(data);
          view.hideColumns([4]);
          var row = bar_graph.getSelection()[0].row;
          var name = messagesPerUser.getValue(row, 0);
          var r = view.getFilteredRows([{column: 1, value: name}]);
          view.setRows(r);
          table.draw(view, opts);
        });

        google.visualization.events.addListener(table, 'select', function() {
          var row = table.getSelection()[0].row;
          alert(data.getValue(row, 2));
        });

        $( "#calendarClick" ).click(function() {
          $( "#calendarClick" ).attr("class", "nav-link active");
          $( "#contributorsClick" ).attr("class", "nav-link");
          $( "#threadsClick" ).attr("class", "nav-link");
          $( "#graphLabel" ).text("Messages per Day");
          calendar = new google.visualization.Calendar(document.getElementById('graph'));
          calendar.draw(messagesPerDay, opts);
        });
        $( "#contributorsClick" ).click(function() {
          $( "#calendarClick" ).attr("class", "nav-link");
          $( "#contributorsClick" ).attr("class", "nav-link active");
          $( "#threadsClick" ).attr("class", "nav-link");
          $( "#graphLabel" ).text("Messages per User");
          bar_graph = new google.visualization.ColumnChart(document.getElementById('graph'));
          bar_graph.draw(messagesPerUser, opts);
        });
        $( "#threadsClick" ).click(function() {
          $( "#calendarClick" ).attr("class", "nav-link");
          $( "#contributorsClick" ).attr("class", "nav-link");
          $( "#threadsClick" ).attr("class", "nav-link active");
          $( "#graphLabel" ).text("Messages per Thread");
          bar_graph = new google.visualization.ColumnChart(document.getElementById('graph'));
          bar_graph.draw(messagesPerThread, opts);

          google.visualization.events.addListener(bar_graph, 'select', function() {
            view = new google.visualization.DataView(data);
            view.hideColumns([4]);
            var row = bar_graph.getSelection()[0].row;
            var name = messagesPerThread.getValue(row, 0);
            console.log(name);
            var r = view.getFilteredRows([{column: 3, value: name}]);
            view.setRows(r);
            table.draw(view, opts);
          });
        });
        $( "#resetButton" ).click(function() {
          view = new google.visualization.DataView(data);
          view.hideColumns([4]);
          table.draw(view, opts);
        });
        $( "#august2016" ).click(function() {
          inactivate();
          $( "#august2016" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=http://www.commonsense.org/education/privacy/blog/digital-redlining-access-privacy&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#september2016" ).click(function() {
          inactivate();
          $( "#september2016" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=http://dmlcentral.net/speculative-design-for-emergent-learning-taking-risks&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#october2016" ).click(function() {
          inactivate();
          $( "#october2016" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=http://marginalsyllab.us/wp-content/uploads/2016/08/PWFlow-Intro.pdf/&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#november2016" ).click(function() {
          inactivate();
          $( "#november2016" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=https://helenbeetham.com/2016/11/14/ed-tech-and-the-circus-of-unreason&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#january2016" ).click(function() {
          inactivate();
          $( "#january2016" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=http://marginalsyllab.us/the-school-and-social-progress-by-john-dewey&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#february2016" ).click(function() {
          inactivate();
          $( "#february2016" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=http://marginalsyllab.us/preface-to-research-writing-rewired-lessons-that-ground-students-digital-learning-by-dawn-reed-and-troy-hicks/&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#march2016" ).click(function() {
          inactivate();
          $( "#march2016" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=https://www.colorlines.com/articles/how-can-white-teachers-do-better-urban-kids-color&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#april2016" ).click(function() {
          inactivate();
          $( "#april2016" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=http://educatorinnovator.org/between-storytelling-and-surveillance-the-precarious-public-of-american-muslim-youth/&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#may2016" ).click(function() {
          inactivate();
          $( "#may2016" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=https://via.hypothes.is/http://educatorinnovator.org/wp-content/uploads/2017/05/LaMay-Ch5.pdf&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        //Marginal Syllabus 2017
        $( "#october2017" ).click(function() {
          inactivate();
          $( "#october2017" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=http://educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#november2017" ).click(function() {
          inactivate();
          $( "#november2017" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=https://educatorinnovator.org/wp-content/uploads/2017/10/RRE_Chapter-6_Civic-Participation-Remiagined_0091732X17690121.pdf&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#december2017" ).click(function() {
          inactivate();
          $( "#december2017" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=https://educatorinnovator.org/wp-content/uploads/2017/10/Critical-Literacy-And-Our-Students-Lives.pdf&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#january2017" ).click(function() {
          inactivate();
          $( "#january2017" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=https://educatorinnovator.org/wp-content/uploads/2017/12/OurDeclaration_PG31-35.pdf&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#february2017" ).click(function() {
          inactivate();
          $( "#february2017" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=https://educatorinnovator.org/wp-content/uploads/2018/02/Educating-for-Democracy-in-a-Partisan-Age.pdf.pdf&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#march2017" ).click(function() {
          inactivate();
          $( "#march2017" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=https://educatorinnovator.org/wp-content/uploads/2018/02/The-Stories-They-Tell-.pdf&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#april2017" ).click(function() {
          inactivate();
          $( "#april2017" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=https://educatorinnovator.org/wp-content/uploads/2018/03/Educating-Youth-for-Online-Civic-and-Political-Dialogue_-A-Conceptual-Framework-for-the-Digital-Age-_-Journal-of-Digital-and-Media-Literacy.pdf&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#may2017" ).click(function() {
          inactivate();
          $( "#may2017" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=https://educatorinnovator.org/wp-content/uploads/2018/03/zemelman_websample.pdf&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#june2016" ).click(function() {
          inactivate();
          $( "#june2017" ).attr("class", "nav-link active");
          xhttp.open("GET", "https://hypothes.is/api/search?url=https://via.hypothes.is/http://educatorinnovator.org/wp-content/uploads/2017/05/LaMay-Ch5.pdf&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
        $( "#urlSearch" ).click(function() {
          inactivate();
          var url = $('#urlBar').val();
          console.log(url);
          xhttp.open("GET", "https://hypothes.is/api/search?url=" + url + "&limit=200", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();
        });
      };
    });