import { useState, useContext, createContext } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {

  const server_url = process.env.REACT_APP_SERVER_URL;
  
  const [user, setUser] = useState(null);

  const updateUser = (userInfo) => {
    setUser(userInfo);
  }

  const clearUser = () => {
    setUser(null);
  }

  const setUserInfo = async () => {
    const response = await fetch(`${server_url}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    });
    const data = await response.json();
    setUser(data);
    return data;
  }

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        updateUser, 
        clearUser, 
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