import Header from './Components/Header/Header';
import Authorization from './Pages/Authorization/Authorization';
import Test from './Pages/Test/Test';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className='App'>
      <Header />
        <Routes>
          <Route path="/test" element={<Test />} />
          <Route path="/login" element={<Authorization />} />
        </Routes>
    </div>
  );
}

export default App;
