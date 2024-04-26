USE users;

DELIMITER //

DROP PROCEDURE IF EXISTS DeleteUser;
DROP PROCEDURE IF EXISTS InsertUser;
DROP PROCEDURE IF EXISTS AssignRoomToUser;

CREATE PROCEDURE DeleteUser(IN userID INT)
BEGIN
    DECLARE user_room_id INT;
    -- Get the room_id for the user (if any)
    SELECT room_id INTO user_room_id
    FROM users_table
    WHERE user_id = userID;
    
    -- If the user has a room, update the seats
	IF user_room_id IS NOT NULL THEN
        UPDATE rooms_table
        SET seats_taken = seats_taken - 1,
            seats_available = seats_available + 1
        WHERE room_id = user_room_id;
    END IF;
    
    -- Delete the user
    DELETE FROM users_table
    WHERE user_id = userID;
	-- SELECT * FROM users_table WHERE user_id = userID ;
END //
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE InsertUser(
    IN p_first_name VARCHAR(255),
    IN p_last_name VARCHAR(255),
    IN p_username VARCHAR(255),
    IN p_email VARCHAR(255)
)
BEGIN
    IF p_email NOT IN (SELECT email FROM users_table) AND p_username NOT IN (select username FROM users_table) THEN
        INSERT INTO users_table (first_name, last_name, username, email)
        VALUES (p_first_name, p_last_name, p_username, p_email);
    END IF;
END $$
DELIMITER ;

DELIMITER %%
CREATE PROCEDURE AssignRoomToUser(
    IN p_userID INT,
    IN p_roomID INT
)
BEGIN
    DECLARE old_roomID INT;
    DECLARE seats_avail INT;

    -- Get the current room_id for the user
    SELECT room_id INTO old_roomID
    FROM users_table
    WHERE user_id = p_userID;

    -- get the number of seats available for the new room
    SELECT seats_available INTO seats_avail
    FROM rooms_table
    WHERE room_id = p_roomID;

    IF seats_avail > 0 THEN
    -- If the user has a room assigned, update the old room's seats
        IF old_roomID IS NOT NULL THEN
            UPDATE rooms_table
            SET seats_available = seats_available + 1,
                seats_taken = seats_taken - 1
            WHERE room_id = old_roomID;
        END IF;

        -- Decrement the seats_available and increment the seats_taken in the room_table
        UPDATE rooms_table
        SET seats_available = seats_available - 1,
            seats_taken = seats_taken + 1
        WHERE room_id = p_roomID;
        
            -- Update the users_table with the new room_id for the specified user
        UPDATE users_table
        SET room_id = p_roomID
        WHERE user_id = p_userID;
    ELSE
		-- If the new room has no seats available, raise an error
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Room has no seats available';
	END IF;
    
END%%
DELIMITER ;

-- CALL AssignRoomToUser(101, 100)
-- CALL DeleteUser(83);
-- CALL InsertUser('James', 'Hall', 'jameshall', 'jameshall@example.com')
