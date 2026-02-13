import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import BoardComponent from './components/boardComponent/BoardComponent';
import LoginPage from './pages/LoginPage/LoginPage';
import NewHomePage from './pages/newHomePage/NewHomePage';
import UserPage from './pages/UserPage/UserPage';
import AllBoardsPage from './pages/allBoardsPage/AllBoardsPage';
import PageTransition from './components/PageTransition/PageTransition';
import { AnimatePresence } from 'motion/react';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { UserProvider } from './context/UserContext';
import { AppProvider } from './context/AppContext';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path='/board/:id' element={
          <PageTransition>
            <BoardComponent />
          </PageTransition>} 
        />
        <Route path='/home' element={
          <PageTransition>
            <NewHomePage />
          </PageTransition>} 
        />
        <Route path='/workspace/:id' element={
          <PageTransition>
            <NewHomePage />
          </PageTransition>} 
        />
        <Route path='/boards/all' element={
          <PageTransition>
            <AllBoardsPage />
          </PageTransition>} 
        />
        <Route path='/login' element={
          <PageTransition>
            <LoginPage />
          </PageTransition>} 
        />
        <Route path='/user' element={
          <PageTransition>
            <UserPage />
          </PageTransition>} 
        />
      </Routes>
    </AnimatePresence>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <AppProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </AppProvider>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
