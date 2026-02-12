import { useState, useContext, createContext, useEffect, useCallback } from "react";
import axios from "axios";

const AppContext = createContext();

export function AppProvider({ children }) {
  
  // We will store our data here: board, workspace,..

  const server_url = process.env.REACT_APP_SERVER_URL;

  const [workspace, setWorkspace] = useState({});
  const [workspaceList, setWorkspaceList] = useState([]);
  const [boards, setBoards] = useState([]);
  const [recentBoards, setRecentBoards] = useState([]);

  // Clear all app state (used on logout or user change)
  const clearApp = () => {
    setWorkspace({});
    setWorkspaceList([]);
    setBoards([]);
  };

  // fetches the current user's workspace
  const getCurrentWorkspace = async () => {
    const currentToken = localStorage.getItem('jwt');
    const response = await axios.get(`${server_url}/workspace/current`, {
      headers: { Authorization: `Bearer ${currentToken}` }
    });
    const currentWorkspace = response.data;
    setWorkspace(currentWorkspace);
    return currentWorkspace;
  }
  const setCurrentWorkspace = async (workspace_id) => {
    const currentToken = localStorage.getItem('jwt');
    const response = await axios.post(`${server_url}/workspace/current`, {
      workspace_id: workspace_id
    }, 
    {
      headers: { Authorization: `Bearer ${currentToken}` }
    });
  }

  // gets the user's workspace by workspace id
  const getWorkspace = async (id) => {
    const currentToken = localStorage.getItem('jwt');
    const response = await axios.get(`${server_url}/workspace/${id}`, {
      headers: { Authorization: `Bearer ${currentToken}` }
    });

    setWorkspace(response.data);
  }

  const editWorkspace = async (id, updates) => {
    const currentToken = localStorage.getItem('jwt');
    const response = await axios.patch(`${server_url}/workspace/${id}`, 
      updates,
      { headers: { Authorization: `Bearer ${currentToken}` } }
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
    const currentToken = localStorage.getItem('jwt');
    const response = await axios.post(`${server_url}/workspace/new`, 
      {
        title: title,
        description: description,
      },
      { headers: { Authorization: `Bearer ${currentToken}` },
    })
    setWorkspaceList(prev => [...prev, response.data]);
  };

  const updateWorkspaceList = async () => {
    const currentToken = localStorage.getItem('jwt');
    const response = await axios.get(`${server_url}/workspace/all`, {
      headers: { Authorization: `Bearer ${currentToken}` }
    });
    setWorkspaceList(response.data);
  };

  const fetchWorkspaceBoards = async (workspace_id) => {
    const currentToken = localStorage.getItem('jwt');
    const response = await axios.get(`${server_url}/boards/all?workspace_id=${workspace_id}`, {
      headers: {
        Authorization: `Bearer ${currentToken}`
      }
    });
    setBoards(response.data);
  };

  const deleteBoard = (board_id) => {
    setBoards(boards => boards.filter(board => board.id !== board_id));
  };

  const updateBoards = (newBoard) => {
    setBoards(prev => [...prev, newBoard]);
  }

  const updateBoard = (boardId, updatedData) => {
    setBoards(prev => prev.map(board => 
      board.id === boardId ? { ...board, ...updatedData } : board
    ));
  }

  const updateRecentBoards = useCallback((board) => {
    setRecentBoards(prev => {
      const boardSnapshot = {
        id: board.id,
        name: board.name,
        colors: board.colors,
        workspace_title: board.workspace_title,
        favorite: board.favorite
      };

      return [
        boardSnapshot,
        ...prev.filter(b => b.id !== board.id)
      ].slice(0, 4);
    });
  }, []);

  const updateRecentBoard = useCallback((boardId, updatedData) => {
    setRecentBoards(prev => prev.map(board =>
      board.id === boardId ? { ...board, ...updatedData } : board
    ));
  }, []);

  const getRecentBoards = async () => {
    const currentToken = localStorage.getItem('jwt');
    const response = await axios.get(`${server_url}/users/recent_boards`, 
      { headers: { Authorization: `Bearer ${currentToken}` } }
    );
    return response.data;
  };

  const postRecentBoards = async (boards) => {
    const currentToken = localStorage.getItem('jwt');
    await axios.post(`${server_url}/users/recent_boards`,
      { boards },
      { headers: { Authorization: `Bearer ${currentToken}` } }
    );
  };

  // sends postRecentBoards request each time an element inside of recentBoards changes
  useEffect(() => {
    if (recentBoards.length > 0) {
      postRecentBoards(recentBoards);
    }
  }, [recentBoards]);

  // Initialize app data - called when component mounts or when explicitly refreshed
  const initializeApp = async () => {
    const currentToken = localStorage.getItem('jwt');
    if (currentToken) {
      try {
        const response = await axios.get(`${server_url}/workspace/all`, {
          headers: {
            Authorization: `Bearer ${currentToken}`
          }
        });
        
        const workspaces = response.data;
        setWorkspaceList(workspaces);

        // get current workspace
        const currentWorkspace = await getCurrentWorkspace();

        // fetch all the boards linked to that workspace id
        if (currentWorkspace?.id) {
          fetchWorkspaceBoards(currentWorkspace.id);
        }

        // fetch recent boards on app load
        const recent = await getRecentBoards();
        setRecentBoards(recent || []);

      } catch (error) {
        console.error('Error initializing app:', error);
      }
    }
  };

  useEffect(() => {
    initializeApp();
  }, [])

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
        updateRecentBoards,
        updateRecentBoard,
        recentBoards,
        editWorkspace,
        getWorkspace,
        setCurrentWorkspace,
        updateWorkspaceList,
        deleteBoard,
        clearApp,
        initializeApp,
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