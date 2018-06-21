$( document ).ready(function() {

  google.charts.load('current', {'packages':['table','corechart','calendar']});
  var response;
  var syllabus = {
    august2016:{
      url:"http://www.commonsense.org/education/privacy/blog/digital-redlining-access-privacy",
      summary:"In August 2016, Marginal Syllabus text-participants read and discussed Digital Redlining, Access, and Privacy, a blog post for Common Sense Education written by Chris Gilliard and Hugh Culik. The authors explain how “digital redlining” creates inequitable educational opportunities for learners."
    },
    september2016:{
      url:"http://dmlcentral.net/speculative-design-for-emergent-learning-taking-risks",
      summary:""
    },
    october2016:{
      url:"http://marginalsyllab.us/wp-content/uploads/2016/08/PWFlow-Intro.pdf",
      summary:""
    },
    november2016:{
      url:"https://helenbeetham.com/2016/11/14/ed-tech-and-the-circus-of-unreason",
      summary:""
    },
    january2016:{
      url:"http://marginalsyllab.us/the-school-and-social-progress-by-john-dewey",
      summary:""
    },
    february2016:{
      url:"http://marginalsyllab.us/preface-to-research-writing-rewired-lessons-that-ground-students-digital-learning-by-dawn-reed-and-troy-hicks/",
      summary:""
    },
    march2016:{
      url:"https://www.colorlines.com/articles/how-can-white-teachers-do-better-urban-kids-color",
      summary:""
    },
    april2016:{
      url:"http://educatorinnovator.org/between-storytelling-and-surveillance-the-precarious-public-of-american-muslim-youth/",
      summary:""
    },
    may2016:{
      url:"https://via.hypothes.is/http://educatorinnovator.org/wp-content/uploads/2017/05/LaMay-Ch5.pdf",
      summary:""
    },
    october2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2017/10/Critical-Literacy-And-Our-Students-Lives.pdf",
      summary:""
    },
    november2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2017/10/RRE_Chapter-6_Civic-Participation-Remiagined_0091732X17690121.pdf",
      summary:""
    },
    december2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2017/10/Critical-Literacy-And-Our-Students-Lives.pdf",
      summary:""
    },
    january2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2017/12/OurDeclaration_PG31-35.pdf",
      summary:""
    },
    february2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2018/02/Educating-for-Democracy-in-a-Partisan-Age.pdf",
      summary:""
    },
    march2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2018/02/The-Stories-They-Tell-.pdf",
      summary:""
    },
    april2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2018/03/Educating-Youth-for-Online-Civic-and-Political-Dialogue_-A-Conceptual-Framework-for-the-Digital-Age-_-Journal-of-Digital-and-Media-Literacy.pd",
      summary:""
    },
    may2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2018/03/zemelman_websample.pdf",
      summary:""
    },
    june2017:{
      url:"http://marginalsyllab.us/wp-content/uploads/2016/08/PWFlow-Intro.pdf",
      summary:""
    }
  }

  $("#conversation_summary").html(syllabus['august2016']['summary']);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      response = JSON.parse(this.responseText);
      drawTable(response);
    }
  };

  xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['august2016']['url'] + "&limit=200", true);
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
      $( "#graphLabel" ).text(syllabus['august2016']['url']);
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
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['august2016']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['august2016']['summary']);
    });
    $( "#september2016" ).click(function() {
      inactivate();
      $( "#september2016" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['september2016']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['september2016']['summary']);
    });
    $( "#october2016" ).click(function() {
      inactivate();
      $( "#october2016" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['october2016']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['october2016']['summary']);
    });
    $( "#november2016" ).click(function() {
      inactivate();
      $( "#november2016" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['november2016']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['november2016']['summary']);
    });
    $( "#january2016" ).click(function() {
      inactivate();
      $( "#january2016" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['january2016']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['january2016']['summary']);
    });
    $( "#february2016" ).click(function() {
      inactivate();
      $( "#february2016" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['february2016']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['february2016']['summary']);
    });
    $( "#march2016" ).click(function() {
      inactivate();
      $( "#march2016" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['march2016']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['march2016']['summary']);
    });
    $( "#april2016" ).click(function() {
      inactivate();
      $( "#april2016" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['april2016']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['april2016']['summary']);
    });
    $( "#may2016" ).click(function() {
      inactivate();
      $( "#may2016" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['may2016']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['may2016']['summary']);
    });
    //Marginal Syllabus 2017
    $( "#october2017" ).click(function() {
      inactivate();
      $( "#october2017" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['october2017']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['october2017']['summary']);
    });
    $( "#november2017" ).click(function() {
      inactivate();
      $( "#november2017" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['november2017']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['november2017']['summary']);
    });
    $( "#december2017" ).click(function() {
      inactivate();
      $( "#december2017" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['december2017']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['december2017']['summary']);
    });
    $( "#january2017" ).click(function() {
      inactivate();
      $( "#january2017" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['january2017']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['january2017']['summary']);
    });
    $( "#february2017" ).click(function() {
      inactivate();
      $( "#february2017" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['february2017']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['february2017']['summary']);
    });
    $( "#march2017" ).click(function() {
      inactivate();
      $( "#march2017" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['march2017']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['march2017']['summary']);
    });
    $( "#april2017" ).click(function() {
      inactivate();
      $( "#april2017" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['april2017']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['april2017']['summary']);
    });
    $( "#may2017" ).click(function() {
      inactivate();
      $( "#may2017" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['may2017']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['may2017']['summary']);
    });
    $( "#june2016" ).click(function() {
      inactivate();
      $( "#june2017" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['june2016']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['june2016']['summary']);
    });
    $( "#urlSearch" ).click(function() {
      inactivate();
      var url = $('#urlBar').val();
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + url + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html("");
    });
  };
});
