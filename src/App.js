import logo from './logo.svg';
import './App.css';
import LandingPage from './Components/Pages/LandingPage';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import HomePage from './Components/Pages/HomePage';

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />}></Route>
          <Route path='/home' element={<HomePage />}></Route>
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
