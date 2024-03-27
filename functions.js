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

function signUp(event) {
    event.preventDefault();
    console.log("signing up");
    var first_name = document.getElementById("first_name").value;
    var last_name = document.getElementById("last_name").value;
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;

    var url = 'https://us-central1-cs348-project-418317.cloudfunctions.net/addUser?firstname=' + first_name + '&lastname=' + last_name + '&username=' + username + '&email=' + email;
    console.log("fetching..");
    fetch(url, {method: "POST", mode: 'cors'})
                .then((response) => response.json())
                .then((data) => {
                    console.log("data");
                    console.log(data);
                    console.log(data.message);
                    if (data.message == "Email or username already registered.") {
                        alert("Email or username already registered.");
                        //return;
                    } else {
                        alert("User added!");
                        saveName(first_name, last_name);
                        saveEmail(email);
                        saveUsername(username);
                        saveRoomID('Null');
                        window.location.href = "Profile.html";
                    }
                    //window.location.href = "Profile.html";
                    //return;
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
                        for (let i = 0; i < data.length; i++) {
                           console.log(data[i][0] + ":" + data[i][1]); // roomID:roomName
                        }
                        return;
                    }    
                });
}

function signOut() {
    localStorage.clear();
    window.location.href = "login.html";
}

function deleteAccount() {
    var url = 'https://us-central1-cs348-project-418317.cloudfunctions.net/deleteUser?uid=' + globalUserID;

    fetch(url, {method: "DELETE", mode: 'cors'})
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    if (data.message == "User deleted.") {
                        alert("User deleted!");
                    } else {
                        alert("User not found.");
                    }
                    localStorage.clear();
                    window.location.href = "login.html";
                });
}