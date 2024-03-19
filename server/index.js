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
  const idSensor = 1;
  const currentTime = new Date();

  // Получите данные из базы данных и верните Id_Student в случае совпадения
  pool.query('SELECT id_student FROM student,sensor WHERE uid_student = $1 and bid_sensor = $2', [idCardFromESP32,idSensor])
    .then(result => {
      const matchingStudent = result.rows[0];
      if (matchingStudent) {
        console.log('Студент найден:', matchingStudent);  
        pool.query(
        `SELECT s.id_group 
        FROM student AS st 
        JOIN schedule AS s ON st.id_group = s.id_group 
        WHERE st.id_student = $1
        AND to_timestamp(s.time, 'HH24:MI') <= current_timestamp 
        AND to_timestamp(s.time, 'HH24:MI') > current_timestamp - interval '1 minute'`,
        [matchingStudent.id_student]
        )
        .then(result => {
          // Обработка результата запроса здесь
          if (result.rows.length > 0) {
            // Студент найден и пришел вовремя или с опозданием до 1 минуты
            console.log('Студент найден и пришел вовремя или с опозданием до 1 минуты');
            // Ваш код для этого случая
        } else {
            // Студент найден и опоздал более, чем на 1 минуту
            console.log('Студент найден и опоздал более, чем на 1 минуту');
            // Ваш код для этого случая
        }
        })     
      } else {
        console.log('Студент не найден');
        res.status(200).send('Not found');
      }
    })
    .catch(error => {
      console.error('Произошла ошибка:', error);
      res.status(500).send('Server mistake');
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
  const { selectedGroups, selectedSubjects, startDate, endDate, idTeacher, Type } = req.query;

  try {
    if (Type == 2) {
      console.log('По группе');
      console.log(idTeacher);
      console.log(selectedGroups);
      console.log(selectedSubjects);
      console.log(startDate);
      console.log(endDate);
      // Построение бар-диаграммы посещаемости одной группы по многим предметам
      const groupColors = generateUniqueColors(selectedGroups.length); // Один цвет для одной группы
      const result = await pool.query(
        `SELECT 
          discipline.name_discipline, 
          COUNT(CASE WHEN attendance.presence = 1 THEN 1 ELSE NULL END) AS attended,
          COUNT(*) AS total,
          (COUNT(CASE WHEN attendance.presence = 1 THEN 1 ELSE NULL END)::float / COUNT(*)) * 100 AS attendance_percentage
        FROM 
          schedule
          LEFT JOIN discipline ON schedule.id_discipline = discipline.id_discipline
          LEFT JOIN attendance ON schedule.id_schedule = attendance.id_schedule
        WHERE 
          schedule.id_teacher = $1
          AND schedule.id_group = (SELECT id_group FROM groups WHERE name_group = $2)
          AND discipline.name_discipline = ANY($3::text[])
          AND schedule.date BETWEEN $4 AND $5
        GROUP BY 
          discipline.name_discipline`,
        [idTeacher, selectedGroups[0], selectedSubjects, startDate, endDate]
      );
      console.log('Labels:', selectedSubjects.map(subject => subject.label));
      console.log('Data:', result.rows.map(item => parseInt(item.attendance_percentage)));
      const barData = {
        labels: selectedSubjects,
        datasets: [
          {
            label: 'Посещаемость',
            data: result.rows.map(item => parseInt(item.attendance_percentage)),
            backgroundColor: groupColors,
            borderColor: groupColors,
            borderWidth: 2,
          },
        ],
      };

      res.json(barData);
      console.log('Result from the database:', result.rows);
    } else if (Type == 1) {
      console.log('По предмету');
      console.log(idTeacher);
      console.log(selectedGroups);
      console.log(selectedSubjects);
      console.log(startDate);
      console.log(endDate);
      // Построение бар-диаграммы посещаемости многих групп по одному предмету
      const groupColors = generateUniqueColors(selectedSubjects.length);
      const result = await pool.query(
        `SELECT 
          groups.name_group, 
          COUNT(CASE WHEN attendance.presence = 1 THEN 1 ELSE NULL END) AS attended,
          COUNT(*) AS total,
          (COUNT(CASE WHEN attendance.presence = 1 THEN 1 ELSE NULL END)::float / COUNT(*)) * 100 AS attendance_percentage
        FROM 
          schedule
          LEFT JOIN groups ON schedule.id_group = groups.id_group
          LEFT JOIN attendance ON schedule.id_schedule = attendance.id_schedule
        WHERE 
          schedule.id_teacher = $1
          AND groups.name_group = ANY($2::text[])
          AND schedule.id_discipline = (SELECT id_discipline FROM discipline WHERE name_discipline = $3)
          AND schedule.date::date BETWEEN $4 AND $5
        GROUP BY 
          groups.name_group`,
        [idTeacher, selectedGroups, selectedSubjects[0], startDate, endDate]
      );

      const barData = {
        labels: selectedGroups,
        datasets: [
          {
            label: 'Посещаемость',
            data: result.rows.map(item => parseInt(item.attendance_percentage)),
            backgroundColor: groupColors,
            borderColor: groupColors,
            borderWidth: 2,
          },
        ],
      };

      res.json(barData);
      console.log('Result from the database:', result.rows);

    } else {
      res.status(400).json({ error: 'Invalid parameters' });
    }
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
