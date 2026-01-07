const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

const app = express();

app.use(express.json());

app.listen(port, () =>  {
    console.log(`Server running on port ${port}`);
});

app.get('/allalbums', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.nirvana');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for nirvana'});
    }
})

app.post('/addalbum', async (req, res) => {
    const { album_name, album_pic} = req.body;
    try {
        let connection = await mysql.createConnection({dbConfig})
        await connection.execute('INSERT INTO nirvana (album_name, album_pic) VALUES (?,?)', [album_name, album_pic]);
        res.status(201).json({message: `Card ${album_name} added successfully.`});
    } catch(err) {
        console.log(err);
        res.status(500).json({message: `Server Error - could not add card ${album_name}`});
    }
});