import React, { useState, useEffect  } from 'react';
import './Test.css';
import axios from 'axios';

const Test = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const response = await axios.get('http://localhost:4444/teacher');
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    }

    fetchTeachers();
  }, []); // Пустой массив зависимостей гарантирует выполнение useEffect только после первой отрисовки

  return (
    <div>
      <h1>Список учителей</h1>
      <ul>
        {teachers.map((teacher) => (
          <li key={teacher.login}>
            {teacher.login}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Test;