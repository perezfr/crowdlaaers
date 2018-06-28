$( document ).ready(function() {

  google.charts.load('current', {'packages':['table','corechart','calendar']});
  var response;
  var syllabus = {
    august2016:{
      url:"http://www.commonsense.org/education/privacy/blog/digital-redlining-access-privacy",
      summary:"Starting in August 2016, Marginal Syllabus text-participants read and discussed “Digital Redlining, Access, and Privacy,” a blog post for Common Sense Education written by Chris Gilliard and Hugh Culik. Chris and Hugh’s post discusses how “digital redlining” creates inequitable educational opportunities for learners."
    },
    september2016:{
      url:"http://dmlcentral.net/speculative-design-for-emergent-learning-taking-risks",
      summary:"Starting in September 2016, Marginal Syllabus text-participants read and discussed “Speculative Design for Emergent Learning: Taking Risks,” a blog post for DML Central by Mia Zamora. Mia’s post reflects upon her “Writing Race and Ethnicity” course and shares insight about her instructional decision-making and co-design with students."
    },
    october2016:{
      url:"http://marginalsyllab.us/wp-content/uploads/2016/08/PWFlow-Intro.pdf",
      summary:"Starting in October 2016, Marginal Syllabus text-participants read and discussed “What It Means to Pose, Wobble, and Flow,” the introductory chapter of Pose, Wobble, Flow: A Culturally Proactive Approach to Literacy Instruction by Antero Garcia and Cindy O’Donnell-Allen. Antero and Cindy’s chapter introduces a yoga metaphor to discuss teacher learning about culturally relevant literacy pedagogy and student literacy practices."
    },
    november2016:{
      url:"https://helenbeetham.com/2016/11/14/ed-tech-and-the-circus-of-unreason",
      summary:"Starting in November 2016, Marginal Syllabus text-participants read and discussed “Ed Tech and the Circus of Unreason,” a blog post by Helen Beetham. Helen’s post critically analyzes the state of educational technology, with a focus on higher education contexts, and in response suggests educator responsibilities that include a focus on addressing educational inequalities."
    },
    january2016:{
      url:"http://marginalsyllab.us/the-school-and-social-progress-by-john-dewey",
      summary:"Starting in January 2017, Marginal Syllabus text-participants read and discussed “The School and Social Progress,” the first chapter from John Dewey’s seminal book The School and Society. This conversation was organized in collaboration with Christina Cantrill and teacher education courses at Arcadia University."
    },
    february2016:{
      url:"http://marginalsyllab.us/preface-to-research-writing-rewired-lessons-that-ground-students-digital-learning-by-dawn-reed-and-troy-hicks/",
      summary:"Starting in February 2017, Marginal Syllabus text-participants read and discussed “Reading, Writing, and Inquiry With Adolescents,” the preface to Research Writing Rewired: Lessons that Ground Digital Learning by Dawn Reed and Troy Hicks. Dawn and Troy’s chapter shares principles they employ for research writing, discuss the ubiquity of digital tools for writing and publication, and comment upon the internet as a site for inquiry and research."
    },
    march2016:{
      url:"https://www.colorlines.com/articles/how-can-white-teachers-do-better-urban-kids-color",
      summary:"Starting in March 2017, Marginal Syllabus text-participants read and discussed “How Can White Teachers Do Better by Urban Kids of Color?,” an excerpt from For White Folks Who Teach in the Hood…and the Rest of Y’all Too: Reality Pedagogy and Urban Education by Christopher Emdin. Christopher’s excerpt discusses race in the classroom by contrasting the voices of students of color with those of white educators, while also sharing reflections about pedagogy, asset-based education, and cultural relevance."
    },
    april2016:{
      url:"http://educatorinnovator.org/between-storytelling-and-surveillance-the-precarious-public-of-american-muslim-youth/",
      summary:"Starting in April 2017, and in collaboration with Educator Innovator, Marginal Syllabus text-participants read and discussed “Between Storytelling and Surveillance: The Precarious Public of American Muslim Youth,” a chapter by Sangita Shresthova from By Any Media Necessary (co-authored by Henry Jenkins, Sangita Shresthova, Liana Gamber-Thompson, Neta Kligler-Vilenchik, and Arely Zimmerman). Sangita’s chapter addresses the ways in which American Muslim youth experience islamophobia online, and also how they endure the criticism of older community members who may take issue with some youth’s desire to have expressive and creative online identities."
    },
    may2016:{
      url:"https://via.hypothes.is/http://educatorinnovator.org/wp-content/uploads/2017/05/LaMay-Ch5.pdf",
      summary:"Starting in May 2017, and in collaboration with Educator Innovator, Marginal Syllabus text-participants read and discussed “Revising Narrative Truth,” a chapter from Personal Narrative, Revised by Bronwyn Clare LaMay. Bronwyn’s chapter shares a challenging and inspiring story about how to develop inclusive classroom communities that nurture student risk-taking, expression, and learning."
    },
    october2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2017/10/Critical-Literacy-And-Our-Students-Lives.pdf",
      summary:"Starting in October 2017, Marginal Syllabus text-participants read and discussed “How Young Activists Deploy Digital Tools for Social Change,” a blog post for DML Central by Henry Jenkins. Henry’s post, part of the Writing Our Civic Futures syllabus, discusses how youth from different cultural contexts participate in digital politics and contribute to social movements."
    },
    november2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2017/10/RRE_Chapter-6_Civic-Participation-Remiagined_0091732X17690121.pdf",
      summary:"Starting in November 2017, Marginal Syllabus text-participants read and discussed “Civic Participation Reimagined: Youth Interrogation and Innovation in the Multimodal Public Sphere,” an article in Review of Research in Education by Nicole Mirra and Antero Garcia. Nicole and Antero’s article, part of the Writing Our Civic Futures syllabus, challenges dominant narratives about the civic disengagement of youth from marginalized communities and develops a new conceptual model for civic learning and engagement that pushes past participation into the realms of interrogation and innovation."
    },
    december2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2017/10/Critical-Literacy-And-Our-Students-Lives.pdf",
      summary:"Starting in December 2017, Marginal Syllabus text-participants read and discussed “Critical Literacy and Our Students’ Lives,” an article in Voices From the Middle by Linda Christensen. Linda’s article, part of the Writing Our Civic Futures syllabus, shares pedagogical reflections on the importance of critical literacy, with an emphasis on developing curricula and lessons that center students’ lives and interests."
    },
    january2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2017/12/OurDeclaration_PG31-35.pdf",
      summary:"Starting in January 2018, Marginal Syllabus text-participants read and discussed “Night Teaching,” the second chapter from Our Declaration: A Reading of the Declaration of Independence in Defense of Equality by Danielle Allen. Daniell’s chapter, part of the Writing Our Civic Futures syllabus, recalls her experiences teaching the Declaration of Independence to night students at the University of Chicago, and includes incisive reflections about political equality, freedom, and the power of language."
    },
    february2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2018/02/Educating-for-Democracy-in-a-Partisan-Age.pdf.pdf",
      summary:"Starting in February 2018, Marginal Syllabus text-participants read and discussed “Educating for Democracy in a Partisan Age: Confronting the Challenges of Motivated Reasoning and Misinformation,” an article in American Educational Research Journal by Joseph Kahne and Benjamin Bowyer. Joseph and Benjamin’s article, part of the Writing Our Civic Futures syllabus, presents a study that Investigated youth judgments of the accuracy of truth claims tied to controversial public issues. The authors found that youth’s political knowledge did not improve judgments of accuracy but that media literacy education did."
    },
    march2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2018/02/The-Stories-They-Tell-.pdf",
      summary:"Starting in March 2018, Marginal Syllabus text-participants read and discussed “The Stories They Tell: Mainstream Media, Pedagogies of Healing, and Critical Media Literacy,” an article in English Education by April Baker-Bell, Raven Jones Stanbrough, and Sakeena Everett. April, Raven, and Sakeena’s article, part of the Writing Our Civic Futures syllabus, discusses how pedagogies of healing and critical media literacy are necessary in the wake of racial violence when mainstream media stigmatize, characterize, and marginalize Black youth. The article includes sample lesson plans and a discussion of how English educators have a responsibility to raise awareness about racial injustice."
    },
    april2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2018/03/Educating-Youth-for-Online-Civic-and-Political-Dialogue_-A-Conceptual-Framework-for-the-Digital-Age-_-Journal-of-Digital-and-Media-Literacy.pdf",
      summary:"Starting in April 2018, Marginal Syllabus text-participants read and discussed “Educating Youth for Online Civic and Political Dialogue: A Conceptual Framework for the Digital Age,” an article in the Journal of Digital and Media Literacy by Erica Hodgin. Erica’s article, part of the Writing Our Civic Futures syllabus, reports upon four high school teachers’ work on a participatory academic platform and details five stages of opportunity that built young people’s capacity for civic voice and influence."
    },
    may2017:{
      url:"https://educatorinnovator.org/wp-content/uploads/2018/03/zemelman_websample.pdf",
      summary:"Starting in May 2018, Marginal Syllabus text-participants read and discussed the introduction of From Inquiry to Action: Civic Engagement with Project-Based Learning in All Content Areas by Steven Zemelman. Steve’s chapter, part of the Writing Our Civic Futures syllabus, provides practice-based examples and strategies to engage students in social action projects with a focus on amplifying student choice, strengthening engagement, and addressing injustices in the community."
    },
    june2017:{
      url:"http://marginalsyllab.us/wp-content/uploads/2016/08/PWFlow-Intro.pdf",
      summary:"Starting in June 2018, Marginal Syllabus text-participants read and discussed “The Next Decade of Digital Writing,” an article in Voices from the Middle by Troy Hicks. Troy’s article, an interest-driven addition to the Writing Our Civic Futures syllabus, argues that educators need to provide intellectual and emotional space for students to explore new ideas, gather their own evidence, and present academic arguments through media other than just the printed word."
    }
  }

  $("#conversation_summary").html(syllabus['june2017']['summary']);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      response = JSON.parse(this.responseText);
      drawTable(response);
    }
  };

  xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['june2017']['url'] + "&limit=200", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

  function inactivate() {
    $( "#contributorsClick" ).attr("class", "nav-link active");
    $( "#calendarClick" ).attr("class", "nav-link");
    $( "#threadsClick" ).attr("class", "nav-link");
    $( "#tagsClick" ).attr("class", "nav-link");
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
    $( "#graphLabel" ).text("Annotations per Contributor");
    $( "#graph" ).css("height","300px");
    $( "#graph" ).html('<h3>Loading...</h3>');
    $( "#annotationCounter" ).text("*");
  };

  function drawTable(response) {
    $('[data-toggle="tooltip"]').tooltip();
    var data = new google.visualization.DataTable();
    var tagData = new google.visualization.DataTable();
    //Table columns
    data.addColumn({type: 'date', id: 'Date', label: 'Date'});
    data.addColumn({type: 'string', id: 'user', label: 'Contributor'});
    data.addColumn({type: 'string', id: 'textSummary', label: 'Annotation'});
    data.addColumn({type: 'string', id: 'NodeMsg', label: 'Anchor'});
    data.addColumn({type: 'string', id: 'textComplete', role: 'annotationText'});
    data.addColumn({type: 'string', id: 'tags', label: 'Tags'});
    data.addColumn({type: 'string', id: 'link', label: 'Link'});
    data.addColumn({type: 'number', id: 'level', label: 'Level'});
    //Tag chart columns
    tagData.addColumn({type: 'string', id: 'tag', label: 'Tag'});
    tagData.addColumn({type: 'number', id: 'count', label: 'Count'});

    var rows = response['rows'];
    var total = response['total'];
    var threads = [];
    var tagArray = [];
    var tagCounts = {};
    var level = 0;

    for (ss of rows){
      //create array of annotations with replies as root for threads
      if (ss['references']){
        if (!threads.includes(ss['references'][0])){
          threads.push(ss['references'][0]);
        }
      }
      
      //create array of tags to build tag column graph
      if (ss['tags'].length > 0){
        ss['tags'].forEach(function (t) {
          tagArray.push(t.toLowerCase());
        });
      }
    }
    for (s of rows) {
      //Count the threads
      var nodeMsg = "Document";
      if (threads.includes(s['id'])){
        //if message is anchor annotation in the thread sets anchor ID it to
        //message ID 
        nodeMsg = s['id'];
        level = 0;
      }

      if (s['references']){
        //Sets anchor ID to the first anchor annotation
        nodeMsg = s['references'][0];
        level = s['references'].length;
      }

      //Creates a annotation clip to display in table
      if (s['text'].length > 50){
        var textSummary = s['text'].slice(0, 50) + "...";
      } else {
        var textSummary = s['text'];
      }

      var date = new Date(s['created']);
      var year = date.getYear() + 1900;
      var month = date.getMonth();
      var dateDay = date.getDate();
      var hour = date.getHours();
      var mins = date.getMinutes();
      var second = date.getSeconds();
      var username = s['user'].slice(5,-12);
      var textTotal = s['text'];
      var link = s['links']['incontext'];
      var tags = s['tags'].join().toLowerCase();
      //Add the table graph rows
      data.addRows([
        [new Date(year, month, dateDay), username, textSummary, nodeMsg, textTotal, tags , link , level]
      ]);
    }

    //Count instances of unique tags
    for (var i = 0; i < tagArray.length; i++) {
      tagCounts[tagArray[i]] = 1 + (tagCounts[tagArray[i]] || 0);
    }
    //Build the rows for the tag table/graph
    for (var t in tagCounts) {
      tagData.addRows([
        [ t, tagCounts[t] ]
      ]);
    }
    tagData.sort({column: 1, desc: true});

    var table = new google.visualization.Table(document.getElementById('table_div'));
    /*
    ** use the chartwrapper here **
    **
    */
    var bar_graph = new google.visualization.ColumnChart(document.getElementById('graph'));
    var calendar = new google.visualization.Calendar(document.getElementById('graph'));
    var opts = {
      width: '100%', height: '100%', page: 'enable', pageSize: 25, legend: { position: 'none' },
      vAxis: { format: '#' }
    };
    var view = new google.visualization.DataView(data);
    view.hideColumns([3,4,6]);

    var messagesPerUser = google.visualization.data.group(
      data,
      [1], //aggregate annotations by users
      [{'column': 1, 'aggregation': google.visualization.data.count, 'type': 'number',
      'label': 'Contributions'}]
    );
    messagesPerUser.sort({column: 1, desc: true});

    var messagesPerThread = google.visualization.data.group(
      data,
      [3], //aggregate annotations by thread
      [{'column': 1, 'aggregation': google.visualization.data.count, 'type': 'number',
      'label': 'Annotations'}]
    );
    messagesPerThread.sort({column: 1, desc: true});
    messagesPerThread.removeRow(0);

    var messagesPerDay = google.visualization.data.group(
      data,
      [0], //aggregate annotations by day
      [{'column': 0, 'aggregation': google.visualization.data.count, 'type': 'number',
      'label': 'Annotations'}]
    );
    messagesPerDay.sort({column: 1, desc: true});
    messagesPerDay.removeRow(0);

    bar_graph.draw(messagesPerUser, opts);
    table.draw(view, opts);

    //Left nav pill notifications counter 
    $( "#participantCounter" ).text(messagesPerUser.getNumberOfRows());
    $( "#calendarCounter" ).text(messagesPerDay.getNumberOfRows());
    $( "#threadCounter" ).text(messagesPerThread.getNumberOfRows());
    $( "#tagCounter" ).text(Object.keys(tagCounts).length);
    $( "#annotationCounter" ).text(total);

    //create event handler object.
    //to be removed when table is filtered. Then create new event handler object 
    var event = google.visualization.events.addListener(table, 'select', function() {
      var row = table.getSelection()[0].row;
      $('#annotationModalLabel').text(data.getValue(row, 1) + ":");
      $('#annotationModalBody').text(data.getValue(row, 4));
      $('#inContextButton').attr("href", data.getValue(row, 6));
      $('#annotationModal').modal('show');
    });

    //Adjust Calander Graph div height based on number of years with annotations
    var activeYears = data.getColumnRange(0).max.getFullYear() - data.getColumnRange(0).min.getFullYear();
    if ( activeYears == 2 ){
      graphDivHeight = "455px";
    } else if ( activeYears == 1 ){
      graphDivHeight = "350px";
    } else {
      graphDivHeight = "250px";
    }

    google.visualization.events.addListener(bar_graph, 'select', function() {
      google.visualization.events.removeListener(event);
      view = new google.visualization.DataView(data);
      view.hideColumns([3,4,6]);
      var row = bar_graph.getSelection()[0].row;
      var name = messagesPerUser.getValue(row, 0);
      var r = view.getFilteredRows([{column: 1, value: name}]);
      view.setRows(r);
      table.clearChart();
      table.draw(view, opts);

      var event = google.visualization.events.addListener(table, 'select', function() {
        var row = view.getTableRowIndex(table.getSelection()[0].row);
        $('#annotationModalLabel').text(data.getValue(row, 1) + ":");
        $('#annotationModalBody').text(data.getValue(row, 4));
        $('#inContextButton').attr("href", data.getValue(row, 6));
        $('#annotationModal').modal('show');
      });
    });

    $( "#calendarClick" ).click(function() {
      //make graph div taller to fit three years
      $( "#graph" ).css("height",graphDivHeight);
      $( "#calendarClick" ).attr("class", "nav-link active");
      $( "#contributorsClick" ).attr("class", "nav-link");
      $( "#threadsClick" ).attr("class", "nav-link");
      $( "#tagsClick" ).attr("class", "nav-link");
      $( "#graphLabel" ).text("Annotations per Day");
      calendar = new google.visualization.Calendar(document.getElementById('graph'));
      calendar.draw(messagesPerDay, opts);

    //TODO Filter by day
    });
    $( "#contributorsClick" ).click(function() {
      $( "#graph" ).css("height","300px");
      $( "#calendarClick" ).attr("class", "nav-link");
      $( "#contributorsClick" ).attr("class", "nav-link active");
      $( "#threadsClick" ).attr("class", "nav-link");
      $( "#tagsClick" ).attr("class", "nav-link");
      $( "#graphLabel" ).text("Annotations per Contributor");
      bar_graph = new google.visualization.ColumnChart(document.getElementById('graph'));
      bar_graph.draw(messagesPerUser, opts);

      google.visualization.events.addListener(bar_graph, 'select', function() {
        google.visualization.events.removeListener(event);
        view = new google.visualization.DataView(data);
        var row = bar_graph.getSelection()[0].row;
        var name = messagesPerUser.getValue(row, 0);
        var r = view.getFilteredRows([{column: 1, value: name}]);
        view.hideColumns([3,4,6]);
        view.setRows(r);
        table.draw(view, opts);

        var event = google.visualization.events.addListener(table, 'select', function() {
          var row = view.getTableRowIndex(table.getSelection()[0].row);
          $('#annotationModalLabel').text(data.getValue(row, 1) + ":");
          $('#annotationModalBody').text(data.getValue(row, 4));
          $('#inContextButton').attr("href", data.getValue(row, 6));
          $('#annotationModal').modal('show');
        });
      });
    });
    $( "#threadsClick" ).click(function() {
      $( "#graph" ).css("height","300px");
      $( "#calendarClick" ).attr("class", "nav-link");
      $( "#contributorsClick" ).attr("class", "nav-link");
      $( "#threadsClick" ).attr("class", "nav-link active");
      $( "#tagsClick" ).attr("class", "nav-link");
      $( "#graphLabel" ).text("Annotations per Thread");
      bar_graph = new google.visualization.ColumnChart(document.getElementById('graph'));
      bar_graph.draw(messagesPerThread, opts);

      google.visualization.events.addListener(bar_graph, 'select', function() {
        view = new google.visualization.DataView(data);
        var row = bar_graph.getSelection()[0].row;
        var name = messagesPerThread.getValue(row, 0);
        var r = view.getFilteredRows([{column: 3, value: name}]);
        view.hideColumns([3,4,6]);
        view.setRows(r);
        table.draw(view, opts);

        var event = google.visualization.events.addListener(table, 'select', function() {
          var row = view.getTableRowIndex(table.getSelection()[0].row);
          $('#annotationModalLabel').text(data.getValue(row, 1) + ":");
          $('#annotationModalBody').text(data.getValue(row, 4));
          $('#inContextButton').attr("href", data.getValue(row, 6));
          $('#annotationModal').modal('show');
        });
      });
    });
    $( "#tagsClick" ).click(function() {
      $( "#graph" ).css("height","300px");
      $( "#calendarClick" ).attr("class", "nav-link");
      $( "#contributorsClick" ).attr("class", "nav-link");
      $( "#threadsClick" ).attr("class", "nav-link");
      $( "#tagsClick" ).attr("class", "nav-link active");
      $( "#graphLabel" ).text("Tags");
      bar_graph = new google.visualization.ColumnChart(document.getElementById('graph'));
      bar_graph.draw(tagData, opts);

      /* TODO: Filter by contains instead of equals
      google.visualization.events.addListener(bar_graph, 'select', function() {
        view = new google.visualization.DataView(data);
        view.hideColumns([3,4]);
        var row = bar_graph.getSelection()[0].row;
        var name = tagData.getValue(row, 0);
        var r = view.getFilteredRows([{column: 3, value: name}]);
        //var r = view.getFilteredRows([{column: 3, test: 
        //  function(value, row, column, table) {
        //    return data.getValue(row, 0).includes(name)
        //  }
        //}]);

        //view.setRows(r);
        //table.draw(view, opts);
      });
      */
    });

    $( "#resetButton" ).click(function() {
      view = new google.visualization.DataView(data);
      view.hideColumns([3,4,6]);
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
    $( "#june2017" ).click(function() {
      inactivate();
      $( "#june2017" ).attr("class", "nav-link active");
      xhttp.open("GET", "https://hypothes.is/api/search?url=" + syllabus['june2017']['url'] + "&limit=200", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      $("#conversation_summary").html(syllabus['june2017']['summary']);
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
