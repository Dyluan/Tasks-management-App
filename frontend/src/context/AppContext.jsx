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

  // fetches the current user's workspace
  const getCurrentWorkspace = async () => {
    const response = await axios.get(`http://localhost:5500/workspace/current`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const currentWorkspace = response.data;
    setWorkspace(currentWorkspace);
    return currentWorkspace;
  }
  const setCurrentWorkspace = async (workspace_id) => {
    const response = await axios.post(`http://localhost:5500/workspace/current`, {
      workspace_id: workspace_id
    }, 
    {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // gets the user's workspace by workspace id
  const getWorkspace = async (id) => {
    const response = await axios.get(`http://localhost:5500/workspace/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setWorkspace(response.data);
  }

  const editWorkspace = async (id, updates) => {
    const response = await axios.patch(`http://localhost:5500/workspace/${id}`, 
      updates,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedWorkspace = response.data;
    
    // Update the workspace state
    setWorkspace(updatedWorkspace);
    
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
  };

  const updateWorkspaceList = async () => {
    const currentToken = localStorage.getItem('jwt');
    const response = await axios.get('http://localhost:5500/workspace/all', {
      headers: { Authorization: `Bearer ${currentToken}` }
    });
    setWorkspaceList(response.data);
  };

  const fetchWorkspaceBoards = async (workspace_id) => {
    const response = await axios.get(`http://localhost:5500/boards/all?workspace_id=${workspace_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
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
        
        const workspaces = response.data;
        
        setWorkspaceList(workspaces);

        // get current workspace ::
        const currentWorkspace = await getCurrentWorkspace();

        // fetch all the boards linked to that workspace id
        fetchWorkspaceBoards(currentWorkspace.id);
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
        fetchWorkspaceBoards,
        boards,
        updateBoards,
        updateBoard,
        getBoard,
        editWorkspace,
        getWorkspace,
        setCurrentWorkspace,
        updateWorkspaceList
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