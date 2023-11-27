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
  const { date } = req.query;
  console.log(idTeacher, date);
  pool.query('SELECT schedule.id_schedule,schedule.time, discipline.name_discipline, groups.name_group, office.name_office FROM schedule, discipline, groups, office WHERE schedule.id_teacher = $1 AND schedule.date = $2 and schedule.id_discipline = discipline.id_discipline and schedule.id_group = groups.id_group and schedule.id_office = office.id_office', [idTeacher, date], (error, result) => {
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

app.get('/groups/:idTeacher', async (req, res) => {
  const { idTeacher } = req.params;
  console.log(idTeacher);
  pool.query('SELECT DISTINCT groups.name_group FROM schedule, groups WHERE schedule.id_teacher = $1', [idTeacher], (error, result) => {
    if (error) {
      console.error('Ошибка при выполнении запроса:', error);
      res.status(500).send('Ошибка сервера');
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/discipline/:idTeacher', async (req, res) => {
  const { idTeacher } = req.params;
  console.log(idTeacher);
  pool.query('SELECT DISTINCT discipline.name_discipline FROM schedule, discipline WHERE schedule.id_teacher = $1', [idTeacher], (error, result) => {
    if (error) {
      console.error('Ошибка при выполнении запроса:', error);
      res.status(500).send('Ошибка сервера');
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/chart-data', async (req, res) => {
  const { selectedGroups, selectedSubjects, startDate, endDate,idTeacher } = req.query;

  try {
    const groupColors = generateUniqueColors(selectedGroups.length);
    const result = await pool.query(
      `SELECT 
        schedule.id_schedule, 
        groups.name_group, 
        discipline.name_discipline, 
        COUNT(attendance.id_attendance) AS attendance
      FROM 
        schedule
        LEFT JOIN groups ON schedule.id_group = groups.id_group
        LEFT JOIN discipline ON schedule.id_discipline = discipline.id_discipline
        LEFT JOIN attendance ON schedule.id_schedule = attendance.id_schedule
      WHERE 
        schedule.id_teacher = $1
        AND groups.name_group = ANY($2::text[])
        AND discipline.name_discipline = ANY($3::text[])
        AND schedule.date BETWEEN $4 AND $5
      GROUP BY 
        schedule.id_schedule, 
        groups.name_group, 
        discipline.name_discipline`,
      [idTeacher, selectedGroups, selectedSubjects, startDate, endDate]
    );

    const radarData = {
      labels: selectedSubjects,
      datasets: result.rows.map(item => {
        const color = groupColors[selectedGroups.indexOf(item.name_group)];
        return {
          label: item.name_group,
          data: [item.attendance],
          backgroundColor: color,
          borderColor: color,
          borderWidth: 2,
        };
      }),
    };

    res.json(radarData);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function generateUniqueColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(getRandomColor());
  }
  return colors;
}

// Генерация случайного цвета в формате HEX
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK!');
});
