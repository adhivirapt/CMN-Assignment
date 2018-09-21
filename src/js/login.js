function authenticate() {
  var username = document.getElementById("username")
  var password = document.getElementById("password")
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 ) {
      var response = JSON.parse(xhttp.response)
      if(response.login == 'success' && response.admin){
         window.location.assign("./admin.html")
      } else if (response.login == 'success' && response.admin === false) {
          window.location.assign("./calendar.html")
      } else {
        window.location.assign("./login.html")
      }
    }
  };
  xhttp.open("GET", `http://127.0.0.1:8000/login?username=${username.value}&password=${password.value}`, true);
  xhttp.send();
}