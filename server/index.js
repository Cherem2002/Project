import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import bcrypt from 'bcrypt';
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test_db',
    password: '12072002',
    port: 1880,
});

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.json('Hi');
})

app.use(bodyParser.json());

app.get('/teacher', (req, res, next)=>{
    console.log("Данные пользователей");
    pool.query('SELECT login FROM teacher')
    .then(UserData => {
        console.log(UserData);
        res.send(UserData.rows);
    })
})


app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    console.log('Received login:', login);
    console.log('Received password:', password);
    try {
        const result = await pool.query('SELECT * FROM teacher WHERE login = $1 AND password = $2', [login, password]);
        console.log('Database query result:', result.rows);
        if (result.rows.length > 0) {
          res.json({ success: true, message: 'Login successful' });
        } else {
          res.json({ success: false, message: 'Invalid username or password' });
        }
      } catch (error) {
        console.error('Error during login:', error);
        res.json({ success: false, message: 'Error during login' });
      }
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK!');
});