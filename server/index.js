import cors from 'cors';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import pg from 'pg';
import jwt from 'jsonwebtoken';
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

app.post('/presence', (req, res, next) => {
  const data = req.body;
  console.log('Принятые данные:', data);

  // Преобразуйте "UID" из данных ESP32 в строку
  const idCardFromESP32 = data.UID;

  // Получите данные из базы данных и верните Id_Student в случае совпадения
  pool.query('SELECT id_student FROM student WHERE uid_student = $1', [idCardFromESP32])
    .then(result => {
      const matchingStudent = result.rows[0];

      if (matchingStudent) {
        console.log('Студент найден:', matchingStudent);
        // Выполните обновление Presence на 1
        pool.query('UPDATE attendance SET presence = 1 WHERE id_student = $1', [matchingStudent.id_student])
          .then(() => {
            console.log('Значение Presence обновлено на 1');
            res.status(200).send('Attended');
          })
          .catch(error => {
            console.error('Ошибка при обновлении Presence:', error);
            res.status(500).send('Ошибка сервера');
          });
      } else {
        console.log('Студент не найден');
        res.status(404).send('Not found');
      }
    })
    .catch(error => {
      console.error('Произошла ошибка:', error);
      res.status(500).send('Ошибка сервера');
    });
})

app.get('/s', (req, res) => {
  pool.query('SELECT * FROM schedule', (error, result) => {
    if (error) {
      console.error('Ошибка при выполнении запроса:', error);
      res.status(500).send('Ошибка сервера');
    } else {
      // Отправка данных в виде JSON
      res.json(result.rows);
    }
  });
})

app.get('/test', (req, res, next) => {
  pool.query('SELECT * FROM attendance', (error, result) => {
    if (error) {
      console.error('Ошибка при выполнении запроса:', error);
      res.status(500).send('Ошибка сервера');
    } else {
      // Отправка данных в виде JSON
      res.json(result.rows);
    }
  });
})

app.post('/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM teacher WHERE login = $1 AND password = $2', [login, password]);
    console.log('Database query result:', result.rows);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ success: true, user: user });
    } else {
      res.json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.json({ success: false, message: 'Error during login' });
  }
})

app.get('/schedule/:idTeacher', (req, res) => {
  const { idTeacher } = req.params;
  const today = new Date().toISOString().split('T')[0];
  console.log(idTeacher, today);
  pool.query('SELECT schedule.id_schedule,schedule.time, discipline.name_discipline, groups.name_group, office.name_office FROM schedule, discipline, groups, office WHERE schedule.id_teacher = $1 AND schedule.date = $2 and schedule.id_discipline = discipline.id_discipline and schedule.id_group = groups.id_group and schedule.id_office = office.id_office', [idTeacher, today], (error, result) => {
    if (error) {
      console.error('Ошибка при выполнении запроса:', error);
      res.status(500).send('Ошибка сервера');
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/circle-chart-data/:idSchedule', async (req, res) => {
  const { idSchedule } = req.params;
  console.log(idSchedule);
  try {
    const result = await pool.query('SELECT attendance.id_schedule, attendance.presence FROM attendance WHERE attendance.id_schedule = $1', [idSchedule]);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    res.status(500).send('Ошибка сервера');
  }
})

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK!');
});
