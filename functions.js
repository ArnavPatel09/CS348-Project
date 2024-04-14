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

function saveNewRoomID(roomID) {
    localStorage.setItem("newRoomID", roomID);
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
                    if (data.length == 0) {
                        alert("Student does not exist!");
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
    console.log(first_name);
    var last_name = document.getElementById("last_name").value;
    console.log(last_name);
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;

    var url = 'https://us-central1-cs348-project-418317.cloudfunctions.net/addUser?firstname=' + first_name + '&lastname=' + last_name  + '&email=' + email + '&username=' + username;
    console.log("fetching..");
    fetch(url, {method: "POST", mode: 'cors'})
                .then((response) => response.json())
                .then((data) => {
                    console.log("data");
                    console.log(data);
                    console.log(data.message);
                    if (data.message == "Email or username already registered.") {
                        alert("Email or username already registered.");
                        window.reload();
                        //return;
                    } else {
                        alert("User added!");
                        // usernameCheck();
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

function addRoom(event) {
    event.preventDefault();
    console.log("adding room");
    var id = localStorage.getItem("globalUserID");
    var roomID = localStorage.getItem("newRoomID");

    var url = 'https://us-central1-cs348-project-418317.cloudfunctions.net/addRoom?roomID=' + roomID + '&userID=' + id;
    console.log("fetching..");
    fetch(url, {method: "POST", mode: 'cors'})
                .then((response) => response.json())
                .then((data) => {
                    console.log("data");
                    console.log(data);
                    if (data.message == "Room added successfully!") {
                        saveRoomID(roomID);
                        localStorage.removeItem("newRoomID");
                    }
                    alert(data.message);
                    location.reload();
                    return;
                    // if (data.message == "Email or username already registered.") {
                    //     alert("Email or username already registered.");
                    //     //return;
                    // } else {
                    //     alert("User added!");
                    //     saveName(first_name, last_name);
                    //     saveEmail(email);
                    //     saveUsername(username);
                    //     saveRoomID('Null');
                    //     window.location.href = "Profile.html";
                    // }
                    //window.location.href = "Profile.html";
                    //return;
                });
}

function roomPage() {
    window.location.href = "RoomPicker.html";
}

function profilePage() {
    window.location.href = "Profile.html";
}

function getOpenRooms() {
    var url = 'https://us-central1-cs348-project-418317.cloudfunctions.net/getOpenRooms';
    fetch(url, { method: "GET", mode: 'cors' })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        if (data.length == 0) {
          alert("No open rooms!");
          return;
        } else {
          const dropdownList = document.querySelector('.list');
          dropdownList.innerHTML = ''; // Clear existing entries
  
          data.forEach((room, index) => {
            const roomId = room[0];
            const roomName = room[1];
  
            // Create HTML elements for each room entry
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'drop1';
            radioInput.id = `id${index + 11}`;
            radioInput.classList.add('radio');
  
            const label = document.createElement('label');
            label.htmlFor = `id${index + 11}`;
  
            const nameSpan = document.createElement('span');
            nameSpan.classList.add('name');
            nameSpan.textContent = roomName;
  
            label.appendChild(nameSpan);
            dropdownList.appendChild(radioInput);
            dropdownList.appendChild(label);

            radioInput.addEventListener('click', () => {
                input.innerHTML = roomName;
                input.click();
                saveNewRoomID(roomId);
            });
          });
        }
    });
}

// function search(searchin) {
//     let searchVal = searchin.value;
//     searchVal = searchVal.toUpperCase();
//     label.forEach((item) => {
//         let checkVal = item.querySelector(".name").innerHTML;
//         checkVal = checkVal.toUpperCase();
//         if (checkVal.indexOf(searchVal) > -1) {
//             item.style.display = "flex"; // Show the item if it matches the search value
//         } else {
//             item.style.display = "none"; // Hide the item if it doesn't match the search value
//         }
//     });
//     let list = input.nextElementSibling;
//     list.style.maxHeight = list.scrollHeight + "px";
// }

function signOut() {
    localStorage.clear();
    window.location.href = "login.html";
}

function deleteAccount() {
    var url = 'https://us-central1-cs348-project-418317.cloudfunctions.net/deleteUser?uid=' + localStorage.getItem("globalUserID");

    fetch(url, {method: "DELETE", mode: 'cors'})
                .then((response) => response.json())
                .then((data) => {
                    console.log("here is data: ");
                    console.log(data);
                    if (data.message == "User deleted successfully!") {
                        alert("User deleted!");
                    } else {
                        alert("User not found");
                    }
                    localStorage.clear();
                    window.location.href = "login.html";
                });
}
function signUpPage() {
    window.location.href = "Signup.html";
}

function loginPage() {
    window.location.href = "login.html";
}


function getUserID(event) {
    //event.preventDefault();
    // console.log(document.getElementById("username").value);
    var username = localStorage.getItem("username");
    // console.log(localStorage.getItem("username"));
    var url = 'https://us-central1-cs348-project-418317.cloudfunctions.net/getUser?username=' + username;

    fetch(url, {method: "GET", mode: 'cors'})
                .then((response) => response.json())
                .then((data) => {
                    if (data.length == 0) {
                        alert("Student does not exist!");
                        return;
                    }
                    else {
                        array = data[0];
                        //format: [uid, first, last, username, email, room]
                        saveUserID(array[0]);
                        // saveName(array[1], array[2]);
                        // saveEmail(array[4]);
                        // saveUsername(array[3]);
                        // saveRoomID(array[5]); // stores as 'null' if not present
                        //console.log(typeof array[5]); //object type
                        // console.log(localStorage.getItem("globalRoomID") === 'null'); //true //string
                        // window.location.href = "Profile.html";
                        return;
                    }    
                });
}