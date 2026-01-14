import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import BoardComponent from './components/boardComponent/BoardComponent';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from './context/UserContext';
import { AppProvider } from './context/AppContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<BoardComponent />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
