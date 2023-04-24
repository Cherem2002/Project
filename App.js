import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
//Importing axios service
import axios from 'axios';
class App extends React.Component {
  //initialize array variable
  constructor() {
    //super is used to access the variables
    super();
    this.state = {
       data: []
    }
 }
 componentDidMount() {
 //API request
 axios.get("http://localhost:3000/users").then(response => {
  
  //getting and setting api data into variable
  this.setState({ data : response.data });
 
})
}
  
//Final output
render() {
  return (
    <div className="container p-5 App">
      
        <h1 className="text-center pb-5 border-bottom mb-5">Тестовый ввывод данных</h1>
      
         <table className="table table-hover table-bordered">
         <thead>
            <tr>
                <th scope="col">ФИО</th>
                <th scope="col">Группа</th>
                <th scope="col">Предмет</th>
                <th scope="col">Присуствие</th>
            </tr>
            </thead>
          <tbody>
          {this.state.data.map((result) => {
            return (
            <tr>
                <td>{result.NAME}</td>
                <td>{result.NAME_GROUP}</td>
                <td>{result.NAME_SUBJECT}</td>
                <td><input type="checkbox" /> </td>
            </tr>
            )})}
           
          </tbody>
        </table>
    </div>
  );
  
}
}
export default App;