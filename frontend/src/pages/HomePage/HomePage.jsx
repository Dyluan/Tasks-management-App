import styles from './Home.module.css';
import BoardCardComponent from '../../components/boardCardComponent/BoardCardComponent';
import AddModalComponent from '../../components/addMembersModalComponent/AddModalComponent';
import WorkspaceModalComponent from '../../components/workspaceModalComponent/WorkspaceModalComponent';
import CreateBoardPopoverComponent from '../../components/createBoardPopover/CreateBoardPopoverComponent';
import { useUser } from '../../context/UserContext';
import { useApp } from '../../context/AppContext';
import siteLogo from '../../assets/site_logo.svg';
import Popover from '@mui/material/Popover';
import { useRef, useState, useEffect } from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Divider, Collapse } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ContrastIcon from '@mui/icons-material/Contrast';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useNavigate } from 'react-router-dom';

function HomePage () {

  const { user, setUserInfo } = useUser();
  const { 
    workspace,
    createWorkspace, 
    editWorkspaceTitle,
    boards,
    editWorkspace
    } = useApp();
  
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  // useEffect called because login with socials redirects to homePage
  useEffect(() => {
    if(token) {
      localStorage.setItem('jwt', token);
      window.history.replaceState({}, '', '/home');
      // calling /me
      setUserInfo();
    }
  }, [token]);

  // auto-connects the user
  useEffect(() => {
    localStorage.getItem('jwt');
    setUserInfo();
  }, [])

  // const [boards, setBoards] = useState(workspace.boards);

  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const handlePopoverClick = (e) => {
    setPopoverAnchorEl(e.currentTarget);
  };
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };
  const popoverOpen = Boolean(popoverAnchorEl);

  const [secondListOpen, setSecondListOpen] = useState(false);
  const handleSecondListOpening = () => {
    setSecondListOpen(!secondListOpen);
  }

  const [boardPopoverAnchorEl, setBoardPopoverAnchorEl] = useState(null);
  const boardPopoverOpen = Boolean(boardPopoverAnchorEl);
  const handleBoardPopoverClick = (e) => {
    setBoardPopoverAnchorEl(e.currentTarget);
  };
  const handleBoardPopoverClose = () => setBoardPopoverAnchorEl(null);

  const handleBoardCardClick = (id) => {
    navigate(`/board/${id}`);
  }

  const [titleEdit, setTitleEdit] = useState(false);
  const [workspaceTitle, setWorkspaceTitle] = useState(workspace.title);
  const prevWorkspaceTitleRef = useRef(workspaceTitle);
  const titleInputRef = useRef(null);

  // Sync workspaceTitle with workspace.title from context
  useEffect(() => {
    if (workspace.title) {
      setWorkspaceTitle(workspace.title);
    }
  }, [workspace.title]);

  useEffect(() => {
    if (titleEdit && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [titleEdit]);

  const startEditTitle = () => {
    prevWorkspaceTitleRef.current = workspaceTitle;
    setTitleEdit(true);
  };
  const cancelEdit = () => {
    setWorkspaceTitle(prevWorkspaceTitleRef.current);
    setTitleEdit(false);
  };
  const onTitleKeyDown = (e) => {
    if (e.key === 'Enter') saveTitle(e.target.value);
    if (e.key === 'Escape') cancelEdit();
  };
  const saveTitle = (newTitle) => {
    const trimmed = String(newTitle).trim();
    if (trimmed.length === 0) {
      setWorkspaceTitle(prevWorkspaceTitleRef.current);
    } else {
      editWorkspaceTitle(trimmed, workspace.id);
      setWorkspaceTitle(trimmed);
    }
    setTitleEdit(false);
  };

  const themes = [
    {
      theme: 'light',
      backgroundColor: 'rgba(245, 245, 220, 0.575)',
      textColor: 'black'
    },
    {
      theme: 'dark',
      backgroundColor: '#1f2337',
      textColor: 'white'
    }
  ];
  const [theme, setTheme] = useState(themes[0]);

  useEffect(() => {
    if (workspace.theme) {
      setTheme(workspace.theme)
    };
  }, [workspace.theme]);

  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const [openWorkspaceModal, setOpenWorkspaceModal] = useState(false);
  const handleWorkspaceModalOpen = () => setOpenWorkspaceModal(true);
  const handleWorkspaceModalClose = () => setOpenWorkspaceModal(false);

  const navigate = useNavigate();

  // TODO: make those buttons do something.
  // New Workspace
  // Add members
  // manage account?
  // logout
  const popoverContent = (
    <List
      subheader={
        <ListSubheader component='div'>
          Account
        </ListSubheader>
      }
      dense={true}
    >
      <ListItem>
        <ListItemIcon>
          <img 
            src={user?.picture || user?.avatar || ''} 
            alt="user" 
            style={{
              height:'38px',
              width:'38px',
              borderRadius: '50%'
            }}
          />
        </ListItemIcon>
        <ListItemText 
          primary={user?.name || ''} 
          secondary={user?.email || ''} 
        />
      </ListItem>
      <ListItemButton onClick={() => navigate('/login')}>
        <ListItemText primary="Change account" />
      </ListItemButton>
      <ListItemButton>
        <ListItemText primary="Manage account" />
      </ListItemButton>
      <Divider />
      <ListItem>
        <ListItemText secondary="Task Management App" />
      </ListItem>
      <ListItemButton onClick={handleModalOpen}>
        <ListItemIcon>
          <GroupAddIcon />
        </ListItemIcon>
        <ListItemText primary="Add members" />
      </ListItemButton>
      <ListItemButton onClick={handleSecondListOpening}>
        <ListItemIcon>
          <ContrastIcon />
        </ListItemIcon>
        <ListItemText primary="Theme" />
        {secondListOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={secondListOpen} timeout="auto" unmountOnExit>
        <List dense="true">
          <ListItemButton 
            sx={{ pl: 4 }}
            onClick={async () => {
              setTheme(themes[1]);
              editWorkspace(workspace.id, {theme: themes[1]})
            }}
          >
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText primary="Dark mode" />
          </ListItemButton>
          <ListItemButton 
            sx={{ pl: 4 }}
            onClick={async () => {
              setTheme(themes[0]);
              editWorkspace(workspace.id, {theme: themes[0]})
            }}
          >
            <ListItemIcon>
              <LightModeIcon />
            </ListItemIcon>
            <ListItemText primary="Light mode" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />
      <ListItemButton onClick={handleWorkspaceModalOpen}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Create a new workspace" />
      </ListItemButton>
      <Divider />
      <ListItemButton>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Log out" />
      </ListItemButton>
    </List>
  );

  return (
    <div 
      className={styles.container}
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor
      }}
    >
      <AddModalComponent 
        open={openModal}
        onClose={handleModalClose}
      />
      <WorkspaceModalComponent 
        open={openWorkspaceModal}
        onClose={handleWorkspaceModalClose}
        createWorkspace={createWorkspace}
      />
      <div className={styles.header}>
        <div className={styles.left}>
          <img 
            src={siteLogo} 
            alt="site logo" 
            onClick={() => window.location.reload()}  
          />
        </div>
        <div className={styles.right}>
          {(user?.picture || user?.avatar) && (
            <img 
              src={user?.picture || user?.avatar} 
              onClick={(e) => handlePopoverClick(e)}
              alt='user'
            />
          )}
        </div>
      </div>
      <div className={styles.main}> 
        {/* User settings Popover */}
        <Popover
          open={popoverOpen}
          onClose={handlePopoverClose}
          anchorEl={popoverAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {popoverContent}
        </Popover>
        {/* create new Board Popover */}
        <CreateBoardPopoverComponent 
          open={boardPopoverOpen}
          anchorEl={boardPopoverAnchorEl}
          onClose={handleBoardPopoverClose}
          workspace_id={workspace.id}
        />
        <div className={styles.workspaceTitle}>
          {titleEdit ? (
            <input 
              ref={titleInputRef}
              className={styles.titleInput}
              defaultValue={workspaceTitle}
              onKeyDown={onTitleKeyDown}
              onBlur={(e) => saveTitle(e.target.value)}
              aria-label='Edit workspace title'
            />
          ) : (
            <>
            {/* TODO: */}
              {workspaceTitle}
            </>
          )}
          <button 
            onClick={() => startEditTitle(true)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEditTitle(); }}
          >
            <ModeEditIcon 
              sx={{
                height: '16px',
                width: '16px',
                color: theme.theme === 'light'? 'black': 'white'
              }}
            />
          </button>
        </div>
        <div className={styles.separatingLine}></div>
        <div className={styles.boardContainer}>
          <div className={styles.boardTitle}>
            Your boards
          </div>
          <div className={styles.boards}>
            {boards.map(board => (
              <BoardCardComponent 
                title={board.name}
                backgroundColor={board.colors.board}
                onClick={() => {
                  // getBoard(board.id)
                  handleBoardCardClick(board.id);
                }}
              />
            ))}
            <div 
              className={styles.defaultBoardContainer}
              onClick={(e) => handleBoardPopoverClick(e)}
            >
              <BoardCardComponent 
                isDefault={true} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage;