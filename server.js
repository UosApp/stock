const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // إضافة حزمة cors
const app = express();
const port = process.env.PORT || 3001; // استخدام متغير PORT للتعامل مع GitHub Pages

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1111',
  database: 'stock_db'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

app.use(cors()); // تفعيل CORS
app.use(bodyParser.json());

// Endpoint to fetch data
app.get('/data', (req, res) => {
  connection.query('SELECT * FROM items', (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    } else {
      res.json(results);
    }
  });
});

// Endpoint to insert data
app.post('/submit', (req, res) => {
  const { item_id, item_nm } = req.body; // Extract data from the request body

  const query = 'INSERT INTO items (item_id, item_nm) VALUES (?, ?)';
  connection.query(query, [item_id, item_nm], (error, results) => {
    if (error) {
      console.error('Failed to insert data:', error);
      res.status(500).json({ error: 'Failed to insert data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
