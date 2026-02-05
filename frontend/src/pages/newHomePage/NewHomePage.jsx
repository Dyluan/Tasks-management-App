import styles from './NewHome.module.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useApp } from '../../context/AppContext';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Divider, Collapse } from '@mui/material';
import Popover from '@mui/material/Popover';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ContrastIcon from '@mui/icons-material/Contrast';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkspaceModalComponent from '../../components/workspaceModalComponent/WorkspaceModalComponent';
import AddModalComponent from '../../components/addMembersModalComponent/AddModalComponent';
import CreateBoardPopoverComponent from '../../components/createBoardPopover/CreateBoardPopoverComponent';
import axios from "axios";

function NewHomePage() {

  const { user, setUserInfo, clearUser } = useUser();
  const {
    workspace,
    workspaceList,
    createWorkspace,
    boards,
    editWorkspace,
    getWorkspace,
    fetchWorkspaceBoards,
    setCurrentWorkspace,
    updateWorkspaceList,
    clearApp,
    initializeApp,
  } = useApp();

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const server_url = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();

  // parses the workspace's id from the url and calls a function to update workspace infos
  // to match with workspace url
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      getWorkspace(id);
      fetchWorkspaceBoards(id);
    }
  }, [id]);

  // useEffect called because login with socials redirects to homePage
  useEffect(() => {
    if (token) {
      // Clear old user/workspace data before setting up new session
      clearUser();
      clearApp();

      localStorage.setItem('jwt', token);
      window.history.replaceState({}, '', '/home');
      // calling /me
      setUserInfo();
      // Reinitialize app data for the new user
      initializeApp();
    }
  }, [token]);

  // auto-connects the user
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      setUserInfo();
    }
  }, []);

  // logout handler
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    clearUser();
    clearApp();
    navigate('/login');
  };

  const handleDeleteClick = async () => {
    const currentToken = localStorage.getItem('jwt');
    const response = await axios.delete(`${server_url}/workspace/${workspace.id}`, 
      { headers: { Authorization: `Bearer ${currentToken}` } }
    );
    const data = response.data;
    handleSettingsPopoverClose();
    await updateWorkspaceList();
    navigate(`/workspace/${data.currentWorkspace}`);
  };

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(workspace.darkMode);
  }, [workspace.darkMode]);

  const toggleDarkMode = async () => {
    editWorkspace(workspace.id, { darkMode: !workspace.darkMode });
  };

  const [titleEdit, setTitleEdit] = useState(false);
  const [workspaceTitle, setWorkspaceTitle] = useState(workspace.title);
  const prevWorkspaceTitleRef = useRef(workspaceTitle);
  const titleInputRef = useRef(null);

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
    handleSettingsPopoverClose();
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
      // editWorkspaceTitle(trimmed, workspace.id);
      editWorkspace(workspace.id, { title: trimmed })
      setWorkspaceTitle(trimmed);
    }
    setTitleEdit(false);
  };

  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const handlePopoverClick = (e) => {
    setPopoverAnchorEl(e.currentTarget);
  };
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };
  const popoverOpen = Boolean(popoverAnchorEl);

  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const handleSettingsPopoverClick = (e) => {
    setSettingsAnchorEl(e.currentTarget);
  };
  const handleSettingsPopoverClose = () => {
    setSettingsAnchorEl(null);
  };
  const settingsPopoverOpen = Boolean(settingsAnchorEl);

  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const [openWorkspaceModal, setOpenWorkspaceModal] = useState(false);
  const handleWorkspaceModalOpen = () => setOpenWorkspaceModal(true);
  const handleWorkspaceModalClose = () => setOpenWorkspaceModal(false);

  const [secondListOpen, setSecondListOpen] = useState(false);
  const handleSecondListOpening = () => {
    setSecondListOpen(!secondListOpen);
  };

  const [boardPopoverAnchorEl, setBoardPopoverAnchorEl] = useState(null);
  const boardPopoverOpen = Boolean(boardPopoverAnchorEl);
  const handleBoardPopoverClick = (e) => {
    setBoardPopoverAnchorEl(e.currentTarget);
  };
  const handleBoardPopoverClose = () => setBoardPopoverAnchorEl(null);

  const settingsPopoverContent = (
    <List dense={true}>
      <ListItemButton onClick={() => startEditTitle()}>
        <ListItemIcon sx={{ padding: '0', margin: '0' }}>
          <span className="material-icons-round">edit</span>
        </ListItemIcon>
        <ListItemText primary="Rename workspace" />
      </ListItemButton>
      <ListItemButton onClick={() => handleWorkspaceModalOpen()}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Create new workspace" />
      </ListItemButton>
      <ListItemButton onClick={() => handleDeleteClick()} >
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary="Delete workspace" />
      </ListItemButton>
    </List>
  )

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
            src={user?.picture || user?.avatar || user?.image || ''}
            alt="user"
            style={{
              height: '38px',
              width: '38px',
              borderRadius: '50%'
            }}
          />
        </ListItemIcon>
        <ListItemText
          primary={user?.name || ''}
          secondary={user?.email || ''}
        />
      </ListItem>
      <ListItemButton onClick={handleLogout}>
        <ListItemText primary="Change account" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/user')}>
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
              editWorkspace(workspace.id, { darkMode: true })
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
              editWorkspace(workspace.id, { darkMode: false })
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
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Log out" />
      </ListItemButton>
    </List>
  );

  return (
    <div className={`${styles.app} ${workspace.darkMode ? styles.dark : styles.light}`}>
      {/* Workspace settings Popover */}
      <Popover
        open={settingsPopoverOpen}
        onClose={handleSettingsPopoverClose}
        anchorEl={settingsAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {settingsPopoverContent}
      </Popover>

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
      {/* Create new workspace modal */}
      <WorkspaceModalComponent
        open={openWorkspaceModal}
        onClose={handleWorkspaceModalClose}
        createWorkspace={createWorkspace}
      />
      {/* Add members to workspace modal */}
      <AddModalComponent
        open={openModal}
        onClose={handleModalClose}
      />
      {/* create new Board Popover */}
      <CreateBoardPopoverComponent
        open={boardPopoverOpen}
        anchorEl={boardPopoverAnchorEl}
        onClose={handleBoardPopoverClose}
        workspace_id={workspace.id}
      />
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <span className="material-icons-round">dashboard</span>
            </div>
            <span className={styles.logoText}>Plannr</span>
          </div>
          <nav className={styles.nav}>
            <button className={styles.navButton}>
              Workspaces <span className="material-icons-round">expand_more</span>
            </button>
            <button className={styles.navButton}>
              Recent <span className="material-icons-round">expand_more</span>
            </button>
            <button className={styles.navButton}>
              Starred <span className="material-icons-round">expand_more</span>
            </button>
            <button className={styles.navButton}>
              Templates <span className="material-icons-round">expand_more</span>
            </button>
            <button
              className={styles.createButton}
              onClick={handleWorkspaceModalOpen}
            >Create</button>
          </nav>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.searchContainer}>
            <span className={`material-icons-round ${styles.searchIcon}`}>search</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search boards, tasks..."
            />
          </div>
          <button className={styles.iconButton}>
            <span className="material-icons-round">notifications</span>
          </button>
          <button className={styles.iconButton} onClick={toggleDarkMode}>
            <span className="material-icons-round">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <div className={styles.avatar}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuACS_hY1i_mHb6rAUvTjRzMoidepVDPNas8ZFV0O5BVhgtZsL_vTWqW39YIbwvsG6hl80mpn08d__RwqCQM7zBlCycmt0OP3dA-9d1XVaGICwTMEUswTOd0KMGaKV9QQlP2KYysqbfh1arlUJBusJn1b8zKz8GOEVc2UdniG-mwzM8V-Ec53uACCC3Vk0rASsxdkq27eU2sy3K4nwguC2OmnmpI8VxWhmJ882_SZ5FG3SKFQAXBEtsjQZ8F7Cr-V7MceX_zYXWOM7A4"
              alt="User Profile"
              onClick={(e) => handlePopoverClick(e)}
            />
          </div>
        </div>
      </header>

      <div className={styles.mainContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            {/* Workspaces Section */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sectionTitle}>Your Workspaces</h3>
              <div className={styles.sectionItems}>
                {workspaceList.map(ws => (
                  <a className={
                    workspace.id === ws.id ? `${styles.workspaceItem} ${styles.active}` : `${styles.workspaceItem}`}
                    onClick={() => {
                      setCurrentWorkspace(ws.id)
                      navigate(`/workspace/${ws.id}`);
                    }}
                  >
                    <div className={styles.workspaceItemLeft}>
                      <div className={`${styles.workspaceIcon} ${workspace.id === ws.id ? styles.indigo : styles.emerald
                        }`}>E</div>
                      <span>{ws.title}</span>
                    </div>
                    <span className="material-icons-round">settings</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Shortcuts Section */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sectionTitle}>Shortcuts</h3>
              <div className={styles.sectionItems}>
                <a href="#" className={styles.shortcutItem}>
                  <span className="material-icons-round">dashboard</span>
                  <span>Boards</span>
                </a>
                <a href="#" className={styles.shortcutItem}>
                  <span className="material-icons-round">auto_awesome_motion</span>
                  <span>Templates</span>
                </a>
                <a href="#" className={styles.shortcutItem}>
                  <span className="material-icons-round">trending_up</span>
                  <span>Activity</span>
                </a>
              </div>
            </div>

            {/* Starred Boards Section */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sectionTitle}>Starred Boards</h3>
              <div className={styles.sectionItems}>
                <a href="#" className={styles.starredItem}>
                  <div className={`${styles.starredDot} ${styles.blue}`}></div>
                  <span>Design System</span>
                </a>
                <a href="#" className={styles.starredItem}>
                  <div className={`${styles.starredDot} ${styles.purple}`}></div>
                  <span>Marketing Q4</span>
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          <div className={styles.mainContent}>
            {/* Workspace Header */}
            <div className={styles.workspaceHeader}>
              <div className={styles.workspaceInfo}>
                <div className={styles.workspaceLogo}>E</div>
                <div className={styles.workspaceDetails}>
                  <div className={styles.workspaceTitleRow}>
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
                      <h1 className={styles.workspaceTitle}>{workspaceTitle}</h1>
                    )}
                    <button className={styles.editButton} onClick={() => startEditTitle()}>
                      <span className="material-icons-round">edit</span>
                    </button>
                  </div>
                  <div className={styles.workspaceMeta}>
                    <span className={styles.metaItem}>
                      <span className="material-icons-round">lock</span> Private Workspace
                    </span>
                    <span className={styles.metaDivider}>•</span>
                    <span>{boards.length} Boards</span>
                  </div>
                </div>
              </div>
              <div className={styles.workspaceActions}>
                <button
                  className={styles.actionButton}
                  onClick={handleModalOpen}
                >
                  <span className="material-icons-round">person_add</span> Invite
                </button>
                <button
                  className={styles.actionButton}
                  onClick={(e) => handleSettingsPopoverClick(e)}
                >
                  <span className="material-icons-round">settings</span> Settings
                </button>
              </div>
            </div>

            <hr className={styles.divider} />

            {/* Recently Viewed Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className="material-icons-round">history</span>
                <h2>Recently Viewed</h2>
              </div>
              <div className={styles.boardGrid}>
                <div className={styles.recentCard}>
                  <div className={styles.recentCardImage}>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUZfJSjX_Bx_4x6CZaBeNhfdyTNrRAthlFTNs0QC3SC6BCDukSh7CxFxxMFdAOcw8BEM6ajjkSJxzfqWr0xzC6WiGLYs14ySQLAeSs4-TUei0-DaZ_bFWshigpxWmyPrPCTK0QpuG3ybh9iKmy5VZocW-rOwOz2uZpwP3k1u9YKZIg9BsDcFt-WjDG7JuIhF9BeRwhZLC6DJbdJDqcrgJ9dnMlzigseZ8GDYgD1Vliqlc5pVwM2ZgTwnZ6CMJTLdG1WVHEUn_gzG7N"
                      alt="Abstract gradient"
                    />
                    <div className={styles.cardOverlay}></div>
                    <button className={styles.starButton}>
                      <span className="material-icons-round">star_outline</span>
                    </button>
                  </div>
                  <p className={styles.recentCardTitle}>Brand Identity 2024</p>
                  <p className={styles.recentCardSubtitle}>{workspace.title}</p>
                </div>
                <div className={styles.recentCard}>
                  <div className={styles.recentCardImage}>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkqJcBPHx3m3cTNhw3IuGdtiOnkQtr2hjbPmZZSsjBzQdXhBqSYwh8X_949U-Hk91xcuFf6e3SdxqUHMfd2S4JJdXcqhqF4c0JX13sk1OM8kTX_ilun2jPOsyDqmYcFY23LenQlof78iAk13qYTBeG5OofnEOk3PP9dGjy5rTIte_XAIyAprIcXDRcZnY0aNvQzccJcLl695T3284U3JjsuC5KqD8xncglO5DKLEEp6P7SVA3esiN1keJxxYl6aZrbKnPGmsCqLaJN"
                      alt="Colorful abstract"
                    />
                    <div className={styles.cardOverlay}></div>
                    <button className={styles.starButton}>
                      <span className="material-icons-round">star_outline</span>
                    </button>
                  </div>
                  <p className={styles.recentCardTitle}>Product Roadmap</p>
                  <p className={styles.recentCardSubtitle}>Pioupiu Labs</p>
                </div>
              </div>
            </section>

            {/* Your Boards Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeaderWithAction}>
                <div className={styles.sectionHeader}>
                  <span className="material-icons-round">grid_view</span>
                  <h2>Your Boards</h2>
                </div>
                <button className={styles.viewAllButton}>View All</button>
              </div>
              <div className={styles.boardGrid}>
                {/* dynamic */}
                {boards.map(board => (
                  <div
                    className={`${styles.boardCard}`}
                    style={{ background: board.colors.board }}
                    onClick={() => navigate(`/board/${board.id}`)}
                    key={board.id}
                  >
                    <div className={styles.boardCardContent}>
                      <h3 className={styles.boardCardTitle}>{board.name}</h3>
                    </div>
                  </div>
                ))}
                <div
                  className={styles.createBoardCard}
                  onClick={handleBoardPopoverClick}
                >
                  <div className={styles.createBoardIcon}>
                    <span className="material-icons-round">add</span>
                  </div>
                  <span className={styles.createBoardText}>Create new board</span>
                </div>
              </div>
            </section>

            {/* Templates Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className="material-icons-round">auto_awesome</span>
                <h2>Start with a template</h2>
              </div>
              <div className={styles.templateGrid}>
                <div className={styles.templateCard}>
                  <div className={`${styles.templateIcon} ${styles.blueIcon}`}>
                    <span className="material-icons-round">event_available</span>
                  </div>
                  <p className={styles.templateTitle}>Project Management</p>
                </div>
                <div className={styles.templateCard}>
                  <div className={`${styles.templateIcon} ${styles.orangeIcon}`}>
                    <span className="material-icons-round">campaign</span>
                  </div>
                  <p className={styles.templateTitle}>Marketing Plan</p>
                </div>
                <div className={styles.templateCard}>
                  <div className={`${styles.templateIcon} ${styles.purpleIcon}`}>
                    <span className="material-icons-round">palette</span>
                  </div>
                  <p className={styles.templateTitle}>Design Sprint</p>
                </div>
                <div className={styles.templateCard}>
                  <div className={`${styles.templateIcon} ${styles.greenIcon}`}>
                    <span className="material-icons-round">code</span>
                  </div>
                  <p className={styles.templateTitle}>Software Dev</p>
                </div>
                <div className={styles.templateCard}>
                  <div className={`${styles.templateIcon} ${styles.roseIcon}`}>
                    <span className="material-icons-round">groups</span>
                  </div>
                  <p className={styles.templateTitle}>HR & Hiring</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default NewHomePage;