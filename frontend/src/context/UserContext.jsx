import { useState, useContext, createContext } from "react";
import { v4 as uuidv4 } from 'uuid';

const UserContext = createContext();

export function UserProvider({ children }) {
  
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);

  const updateUser = (userInfo) => {
    setUser(userInfo);
  }

  const clearUser = () => {
    setUser(null);
  }

  const setUserGithubInfo = async () => {
    const response = await fetch('http://localhost:5500/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    });
    const data = await response.json();
    setUser(data);
    console.log(user)
    return data;
  }

  const createWorkspace = (workspaceName, workspaceDescription, userData = null) => {
    const currentUser = userData || user;
    if (!currentUser) {
      console.error('Cannot create workspace: user is not logged in');
      return;
    }
    const newWorkspace = {
      id: uuidv4(),
      name: workspaceName,
      description: workspaceDescription,
      boards: [],
      createdAt: new Date(),
      owner: currentUser.userId
    };
    console.log(`new workspace created! ${JSON.stringify(newWorkspace)}`);
    setWorkspaces(prev => [...prev, newWorkspace]);
  };

  const updateWorkspace = (updatedWorkspace) => {
    setWorkspaces(prev => 
      prev.map(workspace => 
        workspace.id === updatedWorkspace.id ? updatedWorkspace : workspace
      )
    );
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        updateUser, 
        clearUser, 
        createWorkspace, 
        workspaces, 
        updateWorkspace,
        setUserGithubInfo
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