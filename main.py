import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

def deleteUser(request):
    userID = request.args.get('uid')
    conn = mysql.connector.connect(host='35.238.112.0',
                                    user='code',
                                    password='pate1483',
                                    #user='root',
                                    database='users')
    cursor = conn.cursor()
    #check if user exists
    check_query = "SELECT COUNT(*) FROM users_table WHERE userID = %s"
    cursor.execute(check_query, (userID,))
    count = cursor.fetchone()[0]
    if count > 0:
        # User exists, proceed with deletion
        cursor.callproc('DeleteUser', (userID,))
        conn.commit()
        cursor.close()
        conn.close()
    result = {"message": "User deleted successfully!"}
    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response
    

def addUser(request): 
    first_name = request.args.get('first_name')
    last_name = request.args.get('last_name')
    email = request.args.get('email')
    username = request.args.get('username')

    # Connect to the MySQL database.
    conn = mysql.connector.connect(host='35.238.112.0', user='code', password='pate1483', database='users')
    cursor = conn.cursor()

    # Check if the email or username already exists
    check_query = "SELECT COUNT(*) FROM users_table WHERE email = %s OR username = %s"
    cursor.execute(check_query, (email, username))
    count = cursor.fetchone()[0]

    if count > 0:
        # Email or username already exists, send a failure response
        result = {"message": "Email or username already registered."}
        response = jsonify(result)
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        cursor.close()
        conn.close()
        return response
    else:
        # Email and username are unique, proceed with user registration
        cursor.callproc('InsertUser', (first_name, last_name, username, email,))
        conn.commit()
        cursor.close()
        conn.close()

        result = {"message": "User added successfully!"}
        response = jsonify(result)
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

def getOpenRooms(request):
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

    response = jsonify(results)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

def getAllRooms(request):
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

    result = {"message": "Room added successfully!"}
    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response
    
def getUser(request):
    username = request.args.get('username')
    # Connect to the MySQL database.
    conn = mysql.connector.connect(
        host='35.238.112.0',
        user='code',
        password='pate1483',
        database='users'
    )
    # Create a cursor.
    cursor = conn.cursor(prepared=True)

    # Execute the prepared statement.
    cursor.execute("SELECT * FROM users_table WHERE username = %s;", (username,))

    # Get the results of the stored procedure.
    results = cursor.fetchall()

    # Close the cursor and connection.
    cursor.close()
    conn.close()

    response = jsonify(results)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

def test():
    # # Testing for getUser
    # request = type('Request', (object,), {'args': {'username':'jameshall'}, 'method': 'GET'})()
    # print(getUser(request))

    # # TESTING FOR deleteUser
    # request = type('Request', (object,), {'args': {'userID': 102}, 'method': 'POST'})()
    # print("starting")
    # deleteUser(request)
    # print("done")


    # Testing for addUser
    request = type('Request', (object,), {'args': {'firstname':'test', 'lastname':'function', 'email':'a@example.com', 'username':'a'}, 'method': 'POST'})()
    addUser(request)
    print("done")

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