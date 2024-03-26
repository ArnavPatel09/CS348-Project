function saveUsername(username) {
    globalUsername = username;
    localStorage.setItem("username", username);
}
function saveUserID(uid) {
    globalUserID = uid;
    localStorage.setItem("globalUserID", uid);
}
function saveRoomID(roomID) {
    globalRoomID = roomID;
    localStorage.setItem("globalRoomID", roomID);
}

function saveEmail(email) {
    globalEmail = email;
    localStorage.setItem("email", email);
}

function saveName(first, last) {
    globalName = first + " " + last;
    localStorage.setItem("name", globalName);
}

function usernameCheck(event) {
    event.preventDefault();
    // console.log(document.getElementById("username").value);
    var username = document.getElementById("username").value;
    // console.log(localStorage.getItem("username"));
    var url = 'https://us-central1-cs348-project-418317.cloudfunctions.net/getUser?username=' + username;

    fetch(url, {method: "GET", mode: 'cors'})
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    if (data.length == 0) {
                        //alert("Student does not exist!");
                        getOpenRooms();
                        return;
                    }
                    else {
                        array = data[0];
                        //format: [uid, first, last, username, email, room]
                        saveUserID(array[0]);
                        saveName(array[1], array[2]);
                        saveEmail(array[4]);
                        saveUsername(array[3]);
                        saveRoomID(array[5]); // stores as 'null' if not present
                        //console.log(typeof array[5]); //object type
                        // console.log(localStorage.getItem("globalRoomID") === 'null'); //true //string
                        window.location.href = "Profile.html";
                        return;
                    }    
                });
}

function roomPage() {
    // Add your logic here to handle room picking
    window.location.href = "RoomPicker.html";
}

function getOpenRooms() {
    var url = 'https://us-central1-cs348-project-418317.cloudfunctions.net/getOpenRooms';

    fetch(url, {method: "GET", mode: 'cors'})
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    if (data.length == 0) {
                        alert("No open rooms!");
                        return;
                    }
                    else {
                        console.log(data);
                        console.log(data[0]);
                        //format: [uid, first, last, username, email, room]
                        // saveUserID(array[0]);
                        // saveName(array[1], array[2]);
                        // saveEmail(array[4]);
                        // saveUsername(array[3]);
                        // saveRoomID(array[5]); // stores as 'null' if not present
                        // //console.log(typeof array[5]); //object type
                        // // console.log(localStorage.getItem("globalRoomID") === 'null'); //true //string
                        // window.location.href = "Profile.html";
                        return;
                    }    
                });
}