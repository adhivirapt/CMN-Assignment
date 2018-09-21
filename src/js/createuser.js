
function postRequest(){
  var xhttp = new XMLHttpRequest();
  // var queryStringParam = search()
  xhttp.onreadystatechange = function () {
       
        alert(xhttp.response)
      // generateTable(xhttp.response)
  
}
  xhttp.open("POST", `http://127.0.0.1:8000/createUser`, true);
  xhttp.setRequestHeader("Content-Type", "application/json","Access-Control-Allow-Origin","*");
  console.log(getValues())
  xhttp.send(JSON.stringify(getValues()));

}

function getValues() {
  var days = document.forms[1];
  var grades = document.forms[2];
  var admin = document.forms[3];
  return param = {
      username : document.getElementById("username").value,
      password : document.getElementById("password").value,
      days : findIndexWhereTrue(days),
      grades : findIndexWhereTrue(grades),
      admin : findIndexWhereTrue(admin)[0]
  }
}

function findIndexWhereTrue(array) {
  var arrayBool = []
  for (i = 0; i < array.length; i++) {
      if (array[i].checked) {
          arrayBool.push(true)
      } else {
          arrayBool.push(false)
      }
  }
  return arrayBool
}