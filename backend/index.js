const express = require('express');
const app = express();
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbPath = path.join(__dirname, 'database.db');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
}));
let db = null;

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (e) {
        console.log(`Database error: ${e.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();
app.use(express.json());

// Register User
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const getUserQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
    const existingUser = await db.get(getUserQuery, [username, email]);

    if (existingUser) {
        res.status(400).send('User already exists');
    } else {
        const createUserQuery = `
            INSERT INTO users (username, email, password) VALUES (?, ?, ?);
        `;
        await db.run(createUserQuery, [username, email, hashedPassword]);
        res.send({message: 'User created successfully'});
    }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const getUserQuery = `SELECT * FROM users WHERE username = ?`;
    const user = await db.get(getUserQuery, [username]);

    if (!user) {
        res.status(400).send({message:'User not found'});
    } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            const token = jwt.sign({ username: user.username, userId: user.id }, 'MY_SECRET_TOKEN');
            res.send({ token });
        } else {
            res.status(400).send({message:'Invalid password'});
        }
    }
});

// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Invalid JWT token');
    }

    jwt.verify(token, 'MY_SECRET_TOKEN', (error, user) => {
        if (error) {
            return res.status(401).send('Invalid JWT token');
        }
        req.user = user;
        next();
    });
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add Car
app.post('/api/cars', authenticateToken, upload.array('images', 10), async (req, res) => {
    const { title, description, car_type, company, dealer } = req.body;
    const userId = req.user.userId;

    try {
        const addCarQuery = `
            INSERT INTO cars (user_id, title, description, car_type, company, dealer)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const carResult = await db.run(addCarQuery, [userId, title, description, car_type, company, dealer]);
        const carId = carResult.lastID;

        if (req.files && req.files.length > 0) {
            const imageInsertQuery = `
                INSERT INTO car_images (car_id, image_url)
                VALUES (?, ?);
            `;
            req.files.forEach(async (file) => {
                const imageUrl = path.join('uploads', file.filename);
                await db.run(imageInsertQuery, [carId, imageUrl]);
            });
        }

        res.send({ message: "Car added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Failed to add car. Please try again."});
    }
});

// List All Cars for User
app.get('/api/cars', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    const getCarsQuery = `
        SELECT cars.*, GROUP_CONCAT(car_images.image_url) AS images
        FROM cars
        LEFT JOIN car_images ON cars.id = car_images.car_id
        WHERE cars.user_id = ?
        GROUP BY cars.id;
    `;
    const cars = await db.all(getCarsQuery, [userId]);

    res.json({ cars});
});

// Global Search Through User’s Cars
app.get('/api/cars/search', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { keyword } = req.query;

    const searchQuery = `
        SELECT cars.*, GROUP_CONCAT(car_images.image_url) AS images
        FROM cars
        LEFT JOIN car_images ON cars.id = car_images.car_id
        WHERE cars.user_id = ? AND (
            cars.title LIKE '%' || ? || '%' OR
            cars.description LIKE '%' || ? || '%' OR
            cars.car_type LIKE '%' || ? || '%' OR
            cars.company LIKE '%' || ? || '%' OR
            cars.dealer LIKE '%' || ? || '%'
        )
        GROUP BY cars.id;
    `;
    const cars = await db.all(searchQuery, [userId, keyword, keyword, keyword, keyword, keyword]);

    res.send(cars);
});

// Get Car Details
app.get('/api/cars/:carId', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { carId } = req.params;

    const getCarQuery = `
        SELECT cars.*, GROUP_CONCAT(car_images.image_url) AS images
        FROM cars
        LEFT JOIN car_images ON cars.id = car_images.car_id
        WHERE cars.user_id = ? AND cars.id = ?
        GROUP BY cars.id;
    `;
    const car = await db.get(getCarQuery, [userId, carId]);

    if (car) {
        res.send({car});
    } else {
        res.status(404).send("Car not found");
    }
});

// Update Car
app.put('/api/cars/:carId', authenticateToken, upload.array('images', 10), async (req, res) => {
    const userId = req.user.userId;
    const { carId } = req.params;
    const { title, description, car_type, company, dealer } = req.body;
    
    try {
        // Update car details in `cars` table
        const updateCarQuery = `
            UPDATE cars
            SET title = ?, description = ?, car_type = ?, company = ?, dealer = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?;
        `;
        await db.run(updateCarQuery, [title, description, car_type, company, dealer, carId, userId]);

        // Handle images if provided in the request
        if (req.files && req.files.length > 0) {
            // Insert new images into `car_images` table
            const insertImageQuery = `INSERT INTO car_images (car_id, image_url) VALUES (?, ?)`;
            req.files.forEach(async (file) => {
                const imageUrl = path.join('uploads', file.filename); // Store file path
                await db.run(insertImageQuery, [carId, imageUrl]);
            });
        }

        res.send({ message: "Car updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to update car. Please try again." });
    }
});

// Delete Car
app.delete('/api/cars/:carId', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { carId } = req.params;

    const deleteCarQuery = `DELETE FROM cars WHERE id = ? AND user_id = ?`;
    const deleteImagesQuery = `DELETE FROM car_images WHERE car_id = ?`;
    
    await db.run(deleteCarQuery, [carId, userId]);
    await db.run(deleteImagesQuery, [carId]);

    res.send("Car deleted successfully");
});

// API Documentation Route (using Swagger)
app.get('/api/docs', (req, res) => {
    res.send("API documentation can be found here. Use Swagger or Postman for detailed API docs.");
});
