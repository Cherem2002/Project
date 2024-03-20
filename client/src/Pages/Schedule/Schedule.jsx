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
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [totalStudents, setTotalStudents] = useState(0);
  const [isActive, setIsActive] = useState(true);


  const fetchScheduleData = () => {
    const idTeacher = localStorage.getItem('id_teacher');
    axios.get(`http://localhost:4444/schedule/${idTeacher}?date=${currentDate.toISOString().split('T')[0]}`)
      .then(response => {
        setScheduleData(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных расписания:', error);
      });
  };

  const fetchAttendanceData = (idSchedule) => {
    axios.get(`http://localhost:4444/circle-chart-data/${idSchedule}`)
      .then(response => {
        setAttendanceData(response.data);
        setTotalStudents(response.data.length); // Обновляем общее количество студентов
      })
      .catch(error => {
        console.error('Ошибка при получении данных присутствия', error);
      });
  };

  const updateChart = () => {
    if (myChart) {
      myChart.destroy();
    }
    if (attendanceData.length > 0) {
      const ctx = document.getElementById('attendance-chart');
      const newChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Присутствуют','Опоздали', 'Отсутствуют'],
          datasets: [{
            data: [
              attendanceData.filter(item => item.presence === 1).length,
              attendanceData.filter(item => item.presence === 2).length,
              attendanceData.filter(item => item.presence === 0).length
            ],
            backgroundColor: ['green','yellow', 'red']
          }]
        },
        options: {
          animation: false,
          plugins: {
            datalabels: {
              color: 'black',
              display: true,
              formatter: (value, context) => {
                return context.datasetIndex === 0 ? `${value} / ${totalStudents}` : '';
              }
            }
          }
        }
      });
      setMyChart(newChart);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, [currentDate]);

  useEffect(() => {
    if (selectedRow) {
      fetchAttendanceData(selectedRow);
    }
  }, [selectedRow]);

  useEffect(() => {
    updateChart();
  }, [attendanceData]);

  const handlePrevDay = () => {
    setCurrentDate(prevDate => {
      const prevDay = new Date(prevDate);
      prevDay.setDate(prevDay.getDate() - 1);
      if (myChart) {
        myChart.destroy();
      }
      setIsChartVisible(false);
      return prevDay;
    });
  };

  const handleNextDay = () => {
    setCurrentDate(nextDate => {
      const nextDay = new Date(nextDate);
      nextDay.setDate(nextDay.getDate() + 1);
      if (myChart) {
        myChart.destroy();
      }
      setIsChartVisible(false);
      return nextDay;
    });
  };

  const handleRowClick = (idSchedule) => {
    axios.get(`http://localhost:4444/circle-chart-data/${idSchedule}`)
      .then(response => {
        setAttendanceData(response.data);
        setSelectedRow(idSchedule);
        const total = response.data.length;
        setTotalStudents(total);
        setIsChartVisible(true);
        // Обновление графика
      })
      .catch(error => {
        console.error('Ошибка при получении данных присутствия', error);
      });
  };

  const updateChartPeriodically = () => {
    const interval = setInterval(() => {
      if (selectedRow) {
        fetchAttendanceData(selectedRow);
      }
    }, 5000);
  
    return () => clearInterval(interval);
  };
  
  useEffect(() => {
    if (isActive) {
      updateChartPeriodically();
    }
  }, [isActive, selectedRow]);

  return (
    <div className="schedule-container">
      <div className="schedule-table">
        <div className="date-navigation">
          <button className='buttontable' onClick={handlePrevDay}>&lt;</button>
          <div>{currentDate.toLocaleDateString()}</div>
          <button className='buttontable' onClick={handleNextDay}>&gt;</button>
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
                <td>{new Date(schedule.date).toLocaleTimeString()}</td>
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

