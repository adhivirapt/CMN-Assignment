// current version only support one ID. Further work has to be done her
var id = "CROY9CVFN"
getEvents().then(function (result) {
  $(".responsive-calendar").responsiveCalendar({
    time: '2018-10',
    events: result,
    onActiveDayClick: function (events) {
      var thisDayEvent, key;

      key = $(this).data('year') + '-' + addLeadingZero($(this).data('month')) + '-' + addLeadingZero($(
        this).data('day'));
      thisDayEvent = events[key];
      acceptSchedule(key).then(function(result){
        $('#calendar').responsiveCalendar('clear', key)
      })
      
    }
  })

});

function addLeadingZero(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return "" + num;
  }
}
// get schedule for an employee
function getEvents() {
  return new Promise((resolve, reject) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

      if (this.readyState == 4) {
        resolve(generateEvents(JSON.parse(xhttp.response)))
      }
    }
    xhttp.open("GET", `http://127.0.0.1:8000/getSchedule?id=${id}`, true);
    xhttp.send();
  })

}
//employee accept requested assignment
function acceptSchedule(date) {
  return new Promise((resolve, reject) => {
    var xhttp = new XMLHttpRequest();
    var body = {
      acceptedDate: date,
      id: id
    }
    xhttp.onreadystatechange = function () {

      if (this.readyState == 4) {
        resolve()
      }
    }
    xhttp.open("POST", `http://127.0.0.1:8000/acceptRequest`, true);
    xhttp.setRequestHeader("Content-Type", "application/json", "Access-Control-Allow-Origin", "*");
    xhttp.send(JSON.stringify(body));
  })

}
// generate events to mark employee's calendar
function generateEvents(res) {
  requestArray = res.requests
  assignmentArray = res.assignments
  assignment = {
  }
  clear = {}
  event = {}
  request = {
    "number": 1,
    "badgeClass": "badge badge-success",
    "url": ""
  }
  for (i = 0; i < requestArray.length; i++) {
    var date = new Date(requestArray[i])
    event[`${formatDate(date)}`] = request
  }
  for (i = 0; i < assignmentArray.length; i++) {
    var date1 = new Date(assignmentArray[i])
    assignment[`${formatDate(date1)}`] = clear
  }
  result = Object.assign(assignment,event)
  return result
}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}