USE users;

DELIMITER //

DROP PROCEDURE IF EXISTS DeleteUser;
DROP PROCEDURE IF EXISTS InsertUser;

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
    INSERT INTO users_table (first_name, last_name, username, email)
    VALUES (p_first_name, p_last_name, p_username, p_email);
END $$
DELIMITER ;



-- CALL DeleteUser(98);
CALL InsertUser('Isabella', 'Clark', 'isabellaclark', 'isabellaclark@example.com')
