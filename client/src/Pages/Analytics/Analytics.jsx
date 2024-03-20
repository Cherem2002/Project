import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
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
  const [checkedOption, setCheckedOption] = useState(null);
  const [isMultiSelect1, setIsMultiSelect1] = useState(true);
  const [isMultiSelect2, setIsMultiSelect2] = useState(true);


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

  const handleCheckboxChange = (option) => {
    setCheckedOption(option);
    setIsMultiSelect2(option !== 'option2');
    setIsMultiSelect1(option !== 'option1');
    setSelectedOption1(null);
    setSelectedOption2(null);
  };

  const handleSelectChange1 = (selectedOptions) => {
    if (checkedOption === 'option1' || checkedOption === 'option2') {
      setSelectedOption1(selectedOptions);
    }
  };

  const handleSelectChange2 = (selectedOptions) => {
    if (checkedOption === 'option1' || checkedOption === 'option2') {
      setSelectedOption2(selectedOptions);
    }
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

      if (checkedOption === 'option2' && Array.isArray(selectedOption1)) {

        const selectedSubjects = Array.isArray(selectedOption2) ? selectedOption2.map(option => option.value) : [selectedOption2.value];
        const selectedGroups = selectedOption1.map(option => option.value);
        console.log('Option 2 - Selected Subjects:', selectedSubjects);
        console.log('Option 2 - Selected Groups:', selectedGroups);

        const response = await axios.get('http://localhost:4444/chart-data', {
          params: {
            Type: 1,
            idTeacher,
            selectedGroups,
            selectedSubjects,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        });

        setChartData(response.data);
        setChartVisibility(true);
      } else if (checkedOption === 'option1' && Array.isArray(selectedOption2)) {

        const selectedSubjects = selectedOption2.map(option => option.value);
        const selectedGroups = Array.isArray(selectedOption1) ? selectedOption1.map(option => option.value) : [selectedOption1.value];
        console.log('Option 1 - Selected Subjects:', selectedSubjects);
        console.log('Option 1 - Selected Groups:', selectedGroups);

        const response = await axios.get('http://localhost:4444/chart-data', {
          params: {
            Type: 2,
            idTeacher,
            selectedGroups,
            selectedSubjects,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        });

        setChartData(response.data);
        setChartVisibility(true);
      } else {
        console.error('Некорректный выбор чекбокса или данные не являются массивом');
      }
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  const handleBuildChart = () => {
    fetchChartData();
  };

  return (
    <div className='elem'>
      <>Сначала выберите галочку!</>
      <div className='Select1'>
        <Select
          value={selectedOption1}
          onChange={handleSelectChange1}
          options={options1}
          isMulti={isMultiSelect1}
          placeholder="Выберите группы"
        />
      </div>

      <Select
        value={selectedOption2}
        onChange={handleSelectChange2}
        options={options2}
        isMulti={isMultiSelect2}
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
      <label className='checkBox'>
        <input
          type="checkbox"
          checked={checkedOption === 'option1'}
          onChange={() => handleCheckboxChange('option1')}
        />
        По группе
      </label>

      <label className='checkBox'>
        <input
          type="checkbox"
          checked={checkedOption === 'option2'}
          onChange={() => handleCheckboxChange('option2')}
        />
        По предмету
      </label>
      <div className='buttondate '>
        <button onClick={handleBuildChart}>Построить диаграмму</button>
      </div>
      <div className='Bar'>
        {isChartVisible && <Bar data={chartData} />}
      </div>
    </div>
  );
};

export default Analytics;
