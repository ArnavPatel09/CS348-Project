import mysql.connector;
import json;

def deleteUser(request):
    userID = request.args.get('userID')
    #print(type(userID))
    #userID = request
    #print("userID: ", userID)
    headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    if request.method == 'OPTIONS':
            return ('', 204, headers)

    # Connect to the MySQL database.
    #print("connecting")
    conn = mysql.connector.connect(host='35.238.112.0',
                                    user='code',
                                    password='pate1483',
                                    #user='root',
                                    database='users')
    #print("connected")
    # Create a cursor.
    cursor = conn.cursor()
    # Execute the stored procedure.
    #print("calling stored procedure")
    cursor.callproc('DeleteUser', (userID,))
    #print("stored procedure called")

    conn.commit()
    cursor.close()
    conn.close()

    # Return the results of the stored procedure.
    #print("returning...")
    return (800, 200, headers)

def addUser(request):
    #userID = request.args.get('userID')
    firstname = request.args.get('firstname')
    lastname = request.args.get('lastname')
    email = request.args.get('email')
    username = request.args.get('username')
    
    headers = {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    
    if request.method == 'OPTIONS':
        return ('', 204, headers)

    # Connect to the MySQL database.
    conn = mysql.connector.connect(host='35.238.112.0',
                                    user='code',
                                    password='pate1483',
                                    #user='root',
                                    database='users')
    cursor = conn.cursor()
    
    cursor.callproc('InsertUser', (firstname, lastname, username, email,))
    
    conn.commit()
    cursor.close()
    conn.close()

    # Return the results of the stored procedure.
    return (username, 200, headers)

def getOpenRooms(request):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    if request.method == 'OPTIONS':
        return ('', 204, headers)

    # Connect to the MySQL database.
    conn = mysql.connector.connect(host='35.238.112.0',
                                    user='code',
                                    password='pate1483',
                                    #user='root',
                                    database='users')
    # Create a cursor.
    cursor = conn.cursor(prepared=True)
    # cursor.callproc('getAllRooms', (bID,))
    # Execute the prepared statement.
    cursor.execute(" SELECT * FROM rooms_table WHERE seats_available > 0",)

    # Get the results of the stored procedure.
    results = cursor.fetchall()
    # Close the cursor and connection.
    cursor.close()
    conn.close()

    # Return the results of the stored procedure.
    return (results, 200, headers)

def getAllRooms(request):
    #bID = request.args.get('bID')
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    if request.method == 'OPTIONS':
        return ('', 204, headers)

    # Connect to the MySQL database.
    conn = mysql.connector.connect(host='35.238.112.0',
                                    user='code',
                                    password='pate1483',
                                    #user='root',
                                    database='users')
    # Create a cursor.
    cursor = conn.cursor(prepared=True)
    # cursor.callproc('getAllRooms', (bID,))
    # Execute the prepared statement.
    cursor.execute(" SELECT * FROM rooms_table",)

    # Get the results of the stored procedure.
    results = cursor.fetchall()
    # Close the cursor and connection.
    cursor.close()
    conn.close()

    # Return the results of the stored procedure.
    return (results, 200, headers)

def addRoom(request):
    roomID = request.args.get('roomID')
    userID = request.args.get('userID')
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    if request.method == 'OPTIONS':
        return ('', 204, headers)

    # Connect to the MySQL database.
    conn = mysql.connector.connect(host='35.238.112.0',
                                    user='code',
                                    password='pate1483',
                                    #user='root',
                                    database='users')
    #add room to the user, and update the room table
    cursor = conn.cursor()
    
    cursor.callproc('AssignRoomToUser', (userID, roomID,))
    
    conn.commit()
    cursor.close()
    conn.close()

    # Return the results of the stored procedure.
    return (userID, 200, headers)
    
def getUser(request):
    username = request.args.get('username')
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    if request.method == 'OPTIONS':
        return ('', 204, headers)

    # Connect to the MySQL database.
    conn = mysql.connector.connect(host='35.238.112.0',
                                    user='code',
                                    password='pate1483',
                                    database='users'
                                )
    # Create a cursor.
    cursor = conn.cursor(prepared=True)
    # Execute the prepared statement.
    cursor.execute(" SELECT * FROM users_table WHERE username = %s;", (username,))

    # Get the results of the stored procedure.
    results = cursor.fetchall()
    # Close the cursor and connection.
    cursor.close()
    conn.close()

    # Return the results of the stored procedure.
    return (results, 200, headers)

def test():
    # # Testing for getUser
    # request = type('Request', (object,), {'args': {'username':'jameshall'}, 'method': 'GET'})()
    # print(getUser(request))

    # # TESTING FOR deleteUser
    # request = type('Request', (object,), {'args': {'userID': 102}, 'method': 'POST'})()
    # print("starting")
    # deleteUser(request)
    # print("done")


    # # Testing for addUser
    # request = type('Request', (object,), {'args': {'firstname':'John', 'lastname':'Doe', 'email':'john.doe@example.com', 'username':'johndoe'}, 'method': 'POST'})()
    # addUser(request)
    # print("done")

    # Testing for getOpenRooms
    # request = type('Request', (object,), {'args': {}, 'method': 'GET'})()
    # print(getOpenRooms(request))

    # # Testing for getAllRooms
    # request = type('Request', (object,), {'args': {}, 'method': 'GET'})()
    # print(getOpenRooms(request))

    # # Testing for addRoom
    # request = type('Request', (object,), {'args': {'userID': 97, 'roomID': 100}, 'method': 'POST'})()
    # print(addRoom(request))

    # # Testing for getProfile
    # request = type('Request', (object,), {'args': {'userID': 97}, 'method': 'GET'})()
    # print(getProfile(request))
    return

test()