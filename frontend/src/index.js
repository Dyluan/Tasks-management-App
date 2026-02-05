import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import BoardComponent from './components/boardComponent/BoardComponent';
import LoginPage from './pages/LoginPage/LoginPage';
import NewHomePage from './pages/newHomePage/NewHomePage';
import UserPage from './pages/UserPage/UserPage';
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
            <Route path='/board/:id' element={<BoardComponent />} />
            <Route path='/home' element={<NewHomePage />} />
            <Route path='/workspace/:id' element={<NewHomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/user' element={<UserPage />} />
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
