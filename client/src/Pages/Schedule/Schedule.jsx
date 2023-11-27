import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-datalabels';
import './Schedule.css';

const Schedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [myChart, setMyChart] = useState(null);
  const [isChartVisible, setIsChartVisible] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isActive, setIsActive] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    fetchScheduleData();
  }, [currentDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        fetchScheduleData();
        if (selectedRow) {
          fetchAttendanceData(selectedRow);
        }
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      setIsActive(false);
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [selectedRow, myChart, isActive]);

  useEffect(() => {
    setIsChartVisible(false);
  }, [currentDate]);

  const handleRowClick = (idSchedule) => {
    axios.get(`http://localhost:4444/circle-chart-data/${idSchedule}`)
      .then(response => {
        setAttendanceData(response.data);
        setSelectedRow(idSchedule);
        const total = response.data.length;
        setTotalStudents(total);
        setIsChartVisible(true);
      })
      .catch(error => {
        console.error('Ошибка при получении данных присутствия', error);
      });
  };

  const handlePrevDay = () => {
    if (myChart) {
      myChart.destroy();
    }
    setIsChartVisible(false);
    const prevDay = new Date(currentDate);
    prevDay.setDate(currentDate.getDate() - 1);
    setCurrentDate(prevDay);
  };

  const handleNextDay = () => {
    if (myChart) {
      myChart.destroy();
    }
    setIsChartVisible(false);
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const fetchScheduleData = () => {
    const idTeacher = localStorage.getItem('id_teacher');
    axios.get(`http://localhost:4444/schedule/${idTeacher}?date=${currentDate.toISOString().split('T')[0]}`)
      .then(response => {
        setScheduleData(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных посещаемости:', error);
      });
  };

  const fetchAttendanceData = (idSchedule) => {
    axios.get(`http://localhost:4444/circle-chart-data/${idSchedule}`)
      .then(response => {
        setAttendanceData(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных присутствия', error);
      });
  };

  useEffect(() => {
    if (myChart) {
      myChart.destroy();
    }
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
        },
        options: {
          animation: false,
          plugins: {
            datalabels: {
              color: 'black',
              display: true,
              formatter: (value, context) => {
                if (context.datasetIndex === 0) {
                  return context.dataIndex === 0 ? totalStudents.toString() : ''; 
                }
                return ''; 
              }
            }
          }
        }
      });
      setMyChart(newChart);
    }
  }, [attendanceData, totalStudents]);

  return (
    <div className="schedule-container">
      <div className="schedule-table">
        <div className="date-navigation">
          <button onClick={handlePrevDay}>&lt;</button>
          <div>{currentDate.toLocaleDateString()}</div>
          <button onClick={handleNextDay}>&gt;</button>
        </div>
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
        {isChartVisible && (
          <>
            <canvas id="attendance-chart"></canvas>
            <div className='totalStudents'>Всего студентов: {totalStudents}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Schedule;

