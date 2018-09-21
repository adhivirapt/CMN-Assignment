function previousPage() {
    window.location.assign("../html/admin.html")
}

function bookRequest() {
    var xhttp = new XMLHttpRequest();
    // var queryStringParam = search()
    xhttp.onreadystatechange = function () {

        alert(xhttp.response)
    }
    xhttp.open("PUT", `http://127.0.0.1:8000/bookUser`, true);
    xhttp.setRequestHeader("Content-Type", "application/json", "Access-Control-Allow-Origin", "*");
    xhttp.send(JSON.stringify(getValues()));

}

function getValues() {
    var days = document.forms[1];
    var grades = document.forms[2];
    return param = {
        id: document.getElementById("id").value,
        days: findIndexWhereTrue(days),
        grades: findIndexWhereTrue(grades),
        startDate: document.getElementById("startdate").value,
        endDate: document.getElementById("enddate").value
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