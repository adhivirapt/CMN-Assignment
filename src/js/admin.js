
function previousPage() {
    window.location.assign("../html/login.html")
  }
  
function bookEmployee() {
    window.location.assign("./login.html")
}

function createEmployee() {
    window.location.assign("./createuser.html")
}

function getRequest() {
    var username = document.getElementById("username")
    var xhttp = new XMLHttpRequest();
    var queryStringParam = search()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            generateTable(xhttp.response)
        };
    }
    xhttp.open("GET", `http://127.0.0.1:8000/listUser?q=${queryStringParam}}`, true);
    xhttp.send();

}

function generateTable(result) {
    var t = {
        '<>': 'h5',
        'html': '${_id} ${name} ${password} ${admin} ${workdays} ${requests} ${grades}'
    };
    var d = result
    var header = `
    id name password admin workdays requests grades <br>
    <input type="submit" value="bookEmployee" onclick="bookEmployee()" />`
    document.write(header.concat(json2html.transform(d,t)))
}

function search() {
    var days = document.forms[1];
    var grades = document.forms[2];
    var jsonquery = {
        days: findIndexWhereTrue(days),
        grades: findIndexWhereTrue(grades),
        startDate: document.getElementById("startdate").value,
        endDate: document.getElementById("enddate").value

    }

    var objJsonStr = JSON.stringify(jsonquery);
    var objJsonB64 = window.btoa(objJsonStr)
    return objJsonB64
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