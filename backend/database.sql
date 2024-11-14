-- Users Table
-- CREATE TABLE users (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     username TEXT UNIQUE NOT NULL,
--     email TEXT UNIQUE NOT NULL,
--     password TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Cars Table
-- CREATE TABLE cars (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER,
--     title TEXT NOT NULL,
--     description TEXT,
--     car_type TEXT,
--     company TEXT,
--     dealer TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users (id)
-- );

-- -- Car Images Table
-- CREATE TABLE car_images (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     car_id INTEGER,
--     image_url TEXT NOT NULL,
--     uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (car_id) REFERENCES cars (id)
-- );

-- -- Car Tags Table (Optional)
-- CREATE TABLE car_tags (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     car_id INTEGER,
--     tag TEXT,
--     FOREIGN KEY (car_id) REFERENCES cars (id)
-- );

-- delete from car_images;

select * from cars;