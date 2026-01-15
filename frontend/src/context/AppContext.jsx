import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";
import { useUser } from "./UserContext";

const AppContext = createContext();

export function AppProvider({ children }) {
  
  // We will store our data here: board, workspace,..

  const { user } = useUser();

  const [workspace, setWorkspace] = useState({});
  const [workspaceList, setWorkspaceList] = useState([]);
  const [boards, setBoards] = useState([]);

  const token = localStorage.getItem('jwt');

  const editWorkspaceTitle = async (title, id) => {
    console.log('edit::', title, id);
    console.log(workspaceList);
    console.log('user::', user);
    const response = await axios.put(`http://localhost:5500/workspace/${id}`,
      {
        title: title,
        id: id,
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log(response.data);
  }

  const createWorkspace = async (title, description) => {
    const response = await axios.post('http://localhost:5500/workspace/new', 
      {
        title: title,
        description: description,
        owner_id: user.sub
      },
      { headers: { Authorization: `Bearer ${token}` },
    })
    setWorkspaceList(prev => [...prev, response.data]);
  }

  const fetchWorkspaceBoards = async (workspace_id) => {
    const response = await axios.get(`http://localhost:5500/boards/all?workspace_id=${workspace_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // console.log(response.data);
    setBoards(response.data);
  }

  const updateBoards = (newBoard) => {
    setBoards(prev => [...prev, newBoard]);
  }

  const getBoard = async (id) => {
    const response = await axios.get(`http://localhost:5500/boards/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('/id: response:', response.data);

  }

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (token) {
        const response = await axios.get('http://localhost:5500/workspace/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWorkspaceList(response.data);
        setWorkspace(response.data[0]);

        fetchWorkspaceBoards(response.data[0].id);
      }
    };
    
    fetchWorkspaces();
  }, [token])

  return (
    <AppContext.Provider 
      value={{
        workspace,
        workspaceList,
        createWorkspace,
        editWorkspaceTitle,
        fetchWorkspaceBoards,
        boards,
        updateBoards,
        getBoard
      }}  
    >
      { children }
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}