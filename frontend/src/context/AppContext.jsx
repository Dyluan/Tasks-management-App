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
  };

  const getWorkspace = async (id) => {
    const response = await axios.get(`http://localhost:5500/workspace/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('My workspace::', response.data);
    setWorkspace(response.data);
  }

  const editWorkspace = async (id, updates) => {
    const response = await axios.patch(`http://localhost:5500/workspace/${id}`, 
      updates,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedWorkspace = response.data;
    
    // Update the workspace state if it's the current workspace
    setWorkspace(prev => prev.id === id ? { ...prev, ...updatedWorkspace } : prev);
    
    // Update the workspace in workspaceList
    setWorkspaceList(prev => prev.map(ws => 
      ws.id === id ? { ...ws, ...updatedWorkspace } : ws
    ));
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

  const updateBoard = (boardId, updatedData) => {
    setBoards(prev => prev.map(board => 
      board.id === boardId ? { ...board, ...updatedData } : board
    ));
  }

  const getBoard = async (id) => {
    const response = await axios.get(`http://localhost:5500/boards/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('/id: response:', response.data);
    return response.data;
  }

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (token) {
        const response = await axios.get('http://localhost:5500/workspace/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Parse theme for each workspace if it's a JSON string
        const workspaces = response.data;
        
        setWorkspaceList(workspaces);
        setWorkspace(workspaces[0]);

        // fetch all the boards linked to that workspace id
        fetchWorkspaceBoards(workspaces[0].id);
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
        updateBoard,
        getBoard,
        editWorkspace,
        getWorkspace
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