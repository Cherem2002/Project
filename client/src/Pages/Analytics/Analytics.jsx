import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import './Analytics.css';

const Analytics = () => {
  const [options1, setOptions1] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [selectedOption1, setSelectedOption1] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isChartVisible, setChartVisibility] = useState(false);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const idTeacher = localStorage.getItem('id_teacher');
        const response1 = await axios.get(`http://localhost:4444/groups/${idTeacher}`);
        const data1 = response1.data.map(item => ({
          value: item.name_group,
          label: item.name_group,
        }));
        setOptions1(data1);

        const response2 = await axios.get(`http://localhost:4444/discipline/${idTeacher}`);
        const data2 = response2.data.map(item => ({
          value: item.name_discipline,
          label: item.name_discipline,
        }));
        setOptions2(data2);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchOptions();
  }, [localStorage.getItem('id_teacher')]);

  const handleSelectChange1 = (selectedOptions) => {
    setSelectedOption1(selectedOptions);
  };

  const handleSelectChange2 = (selectedOptions) => {
    setSelectedOption2(selectedOptions);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const fetchChartData = async () => {
    try {
      const idTeacher = localStorage.getItem('id_teacher');
      const response = await axios.get('http://localhost:4444/chart-data', {
        params: {
          idTeacher,
          selectedGroups: selectedOption1.map(option => option.value),
          selectedSubjects: selectedOption2.map(option => option.value),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      setChartData(response.data);
      setChartVisibility(true);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  const handleBuildChart = () => {
    fetchChartData();
  };

  return (
    <div className='elem'>
      <Select
        value={selectedOption1}
        onChange={handleSelectChange1}
        options={options1}
        isMulti
        placeholder="Выберите группы"
      />
      <Select
        value={selectedOption2}
        onChange={handleSelectChange2}
        options={options2}
        isMulti
        placeholder="Выберите предметы"
      />
      <DatePicker
        selected={startDate}
        onChange={handleStartDateChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        dateFormat="dd/MM/yyyy"
        placeholderText="Выберите начальную дату"
      />
      <DatePicker
        selected={endDate}
        onChange={handleEndDateChange}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        dateFormat="dd/MM/yyyy"
        placeholderText="Выберите конечную дату"
      />
      <div className='buttondate '>
        <button onClick={handleBuildChart}>Построить диаграмму</button>
      </div>
      {isChartVisible && <Radar data={chartData} />}
    </div>
  );
};

export default Analytics;
