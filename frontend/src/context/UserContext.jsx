import { useState, useContext, createContext } from "react";
import { v4 as uuidv4 } from 'uuid';

const UserContext = createContext();

export function UserProvider({ children }) {
  
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);

  const updateUser = (userInfo) => {
    console.log('updateUser here. Heres yuour info:');
    console.log(userInfo);
    setUser(userInfo);
  }

  const clearUser = () => {
    setUser(null);
  }

  const setUserInfo = async () => {
    const response = await fetch('http://localhost:5500/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    });
    const data = await response.json();
    console.log('mys user:', data);
    setUser(data);
    return data;
  }

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        updateUser, 
        clearUser, 
        workspaces, 
        setUserInfo
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}