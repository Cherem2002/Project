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
  console.log('Принятые данные:', req.body);

  // Преобразуйте "UID" из данных ESP32 в строку
  const idCardFromESP32 = data.uid;
  const idSensor = data.bid;
  //const time = "2024-03-23 12:30:00+08";
  const timestamp = data.timestamp * 1000; // Преобразуем Unix timestamp в миллисекунды
  const date = new Date(timestamp); // Создаем объект Date из полученного времени
  date.setHours(date.getHours() + 8); // Прибавляем 8 часов
  const time = date.toISOString();

  console.log(time);

  // Получите данные из базы данных и верните Id_Student в случае совпадения
  pool.query(`
  SELECT 
    s.id_schedule,
    s.date,
    s.id_group,
    d.name_discipline,
    o.name_office,
    st.id_student
FROM 
    student st
JOIN 
    schedule s ON st.id_group = s.id_group
JOIN 
    office o ON s.id_office = o.id_office
JOIN 
    discipline d ON s.id_discipline = d.id_discipline
WHERE 
    st.uid_student = $1
    AND o.id_office IN (
        SELECT id_office FROM sensor WHERE bid_sensor = $2
    )
    AND $3::timestamp BETWEEN (s.date - INTERVAL '15 minutes') AND (s.date + INTERVAL '1 hour 30 minutes')
ORDER BY 
    s.date DESC
LIMIT 
    1
`,
    [idCardFromESP32, idSensor, time]
  )
    .then(result => {
      const matchingStudent = result.rows[0];
      console.log(matchingStudent);
      if (matchingStudent) {
        console.log('Студент найден:', matchingStudent.id_student,time);
        pool.query(
        `SELECT s.id_group 
        FROM student AS st 
        JOIN schedule AS s ON st.id_group = s.id_group 
        WHERE st.id_student = $1
        AND s.date <= $2::timestamp
        AND s.date > $2::timestamp - interval '1 minute'`,
          [matchingStudent.id_student,time]
        )
          .then(result => {
            // Обработка результата запроса здесь
            if (result.rows.length > 0) {
              // Студент найден и пришел вовремя или с опозданием до 1 минуты
              console.log('Студент найден и пришел вовремя');
              pool.query('UPDATE attendance SET presence = 1 WHERE id_student = $1', [matchingStudent.id_student])
              .then(() => {
                console.log('Значение Presence обновлено на 1');
                res.status(200).send('Attended');
              })
              .catch(error => {
                console.error('Ошибка при обновлении Presence:', error);
                res.status(500).send('Server mistake');
              });
            } else {
              // Студент найден и опоздал более, чем на 1 минуту
              console.log('Студент найден и опоздал более, чем на 1 минуту');
              pool.query('UPDATE attendance SET presence = 2 WHERE id_student = $1', [matchingStudent.id_student])
              .then(() => {
                console.log('Значение Presence обновлено на 2');
                res.status(200).send('Attended');
              })
              .catch(error => {
                console.error('Ошибка при обновлении Presence:', error);
                res.status(500).send('Server mistake');
              });
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

  // Преобразуем дату из строки в формат timestamp
  const formattedDate = new Date(date);

  pool.query('SELECT schedule.id_schedule, schedule.date, discipline.name_discipline, groups.name_group, office.name_office FROM schedule INNER JOIN discipline ON schedule.id_discipline = discipline.id_discipline INNER JOIN groups ON schedule.id_group = groups.id_group INNER JOIN office ON schedule.id_office = office.id_office WHERE schedule.id_teacher = $1 AND schedule.date::date = $2::date', [idTeacher, formattedDate], (error, result) => {
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
