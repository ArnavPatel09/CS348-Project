function usernameCheck() {
    var xhr = new XMLHttpRequest();
    console.log(document.getElementById("username").value);
    var username = document.getElementById("username").value;
    saveUsername(username);
    var url = '' + document.getElementById("username").value;
    xhr.open('GET', url, true);

    xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
        // Handle successful response
        var arr = xhr.responseText.split(",");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].replace(/[^\w\s]/gi, '')
            arr[i] = arr[i].replace(/\s/g, '')
        }
        if (arr[0] == String(userID)) {
            if (arr[4] === 'null') {
                window.location.href = "add3.html";
            }
            else if (arr[4] != 'null'){
                alert("User ID already has a room! Please select another ID")
            }
        } else {
            alert("User ID does not exist");
        }
        } else {
        // Handle error
        console.error('Request failed with status:', xhr.status);
        }
    }
    };
    xhr.send();
}