import axios from "axios";
import { useState, useContext, createContext } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {

  const server_url = process.env.REACT_APP_SERVER_URL;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateUser = (userInfo) => {
    setUser(userInfo);
  }

  const clearUser = () => {
    setUser(null);
    setLoading(false);
  }

  const setUserInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${server_url}/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      const data = await response.json();

      // Get detailed user info using data.sub
      const userInfo = await getUserInfo(data.sub);
      
      setUser(userInfo);
      setLoading(false);
      return data;

    } catch (error) {
      console.error('Error fetching user info:', error);
      setLoading(false);
      return null;
    }
  };

  const getUserInfo = async (id) => {
    const response = await axios.get(`${server_url}/users/${id}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }}
    );
    return response.data;
  }

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        loading,
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