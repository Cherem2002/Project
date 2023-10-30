import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './Schedule.css';


const Schedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [myChart, setMyChart] = useState(null);
  const [isChartVisible, setChartVisibility] = useState(false);


  useEffect(() => {
    // Получение данных о расписании с сервера
    const idTeacher = localStorage.getItem('id_teacher');
    console.log('ID учителя из localStorage:', idTeacher);
    axios.get(`http://localhost:4444/schedule/${idTeacher}`)
      .then(response => {
        setScheduleData(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных посещаемости:', error);
      });
  }, []); // Пустой массив означает, что эффект будет запущен только один раз после монтирования компонента

  // Функция для обработки выбора строки в расписании
  const handleRowClick = (idSchedule) => {
    // Получение данных о присутствии для выбранной записи расписания с сервера
    axios.get(`http://localhost:4444/circle-chart-data/${idSchedule}`)
      .then(response => {
        setAttendanceData(response.data);
        setSelectedRow(idSchedule);
        setChartVisibility(true);
      })
      .catch(error => {
        console.error('Ошибка при получении данных присуствия', error);
      });
  };

  // Формирование данных для круговой диаграммы
  useEffect(() => {
    // Уничтожение предыдущего графика при смене выбранной строки
    if (myChart) {
      myChart.destroy();
    }
    // Создание нового графика при изменении данных посещаемости
    if (attendanceData.length > 0) {
      const ctx = document.getElementById('attendance-chart');
      const newChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Присутствуют', 'Отсутствуют'],
          datasets: [{
            data: [
              attendanceData.filter(item => item.presence === 1).length,
              attendanceData.filter(item => item.presence === 0).length
            ],
            backgroundColor: ['green', 'red']
          }]
        }
      });
      setMyChart(newChart);
    }
  }, [attendanceData]);

  return (
    <div className="schedule-container">
      <div className="schedule-table">
        <table>
          <thead>
            <tr>
              <th>Время</th>
              <th>Предмет</th>
              <th>Группа</th>
              <th>Кабинет</th>
            </tr>
          </thead>
          <tbody>
            {scheduleData.map(schedule => (
              <tr key={schedule.id_schedule} onClick={() => handleRowClick(schedule.id_schedule)} className={schedule.id_schedule === selectedRow ? 'selected-row' : ''}>
                <td>{schedule.time}</td>
                <td>{schedule.name_discipline}</td>
                <td>{schedule.name_group}</td>
                <td>{schedule.name_office}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`attendance-chart ${isChartVisible ? 'visible' : 'hidden'}`}>
        <h2>Присутствие студентов</h2>
        <canvas id="attendance-chart"></canvas>
      </div>
    </div>
  );
};

export default Schedule;

