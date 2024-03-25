USE users;
DROP TABLE IF EXISTS users_table;
DROP TABLE IF EXISTS rooms_table;

CREATE TABLE users_table (
    user_id int PRIMARY KEY AUTO_INCREMENT,
    first_name varchar(255),
    last_name varchar(255),
    username varchar(255),
    email varchar(255),
    room_id int
	);

CREATE TABLE rooms_table (
    room_id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255),
    total_seats int,
    seats_taken int DEFAULT 0,
    seats_available int
	);