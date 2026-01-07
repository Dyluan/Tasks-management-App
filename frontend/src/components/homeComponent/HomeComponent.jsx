import styles from './Home.module.css';
import BoardCardComponent from '../boardCardComponent/BoardCardComponent';
import { useUser } from '../../context/UserContext';
import siteLogo from '../../assets/site_logo.svg';
import Popover from '@mui/material/Popover';
import { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Divider, Collapse } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ContrastIcon from '@mui/icons-material/Contrast';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';

function HomeComponent () {

  const { user } = useUser();

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

  // TODO: make those buttons do something.
  // Themes
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
            src={user.picture} 
            alt="user" 
            style={{
              height:'38px',
              width:'38px',
              borderRadius: '50%'
            }}
          />
        </ListItemIcon>
        <ListItemText primary={user.name} secondary={user.email} />
      </ListItem>
      <ListItemButton>
        <ListItemText primary="Change account" />
      </ListItemButton>
      <ListItemButton>
        <ListItemText primary="Manage account" />
      </ListItemButton>
      <Divider />
      <ListItem>
        <ListItemText secondary="Task Management App" />
      </ListItem>
      <ListItemButton>
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
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText primary="Dark mode" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <LightModeIcon />
            </ListItemIcon>
            <ListItemText primary="Light mode" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />
      <ListItemButton>
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
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>
          <img src={siteLogo} alt="site logo" />
        </div>
        <div className={styles.right}>
          {user != null && user.picture && (
            <img 
              src={user.picture} 
              onClick={(e) => handlePopoverClick(e)}
              alt='user'
            />
          )}
        </div>
      </div>
      <div className={styles.main}> 
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
        <div className={styles.workspaceTitle}>
          My Workspace  
        </div>
        <div className={styles.separatingLine}></div>
        <div className={styles.boardContainer}>
          <div className={styles.boardTitle}>
            Your boards
          </div>
          <div className={styles.boards}>
            {/* need to loop through the user's list of boards */}
            <BoardCardComponent
              title={"My Board"}
              backgroundColor={"linear-gradient(135deg, #f6b365, #fda085)"}
              isDefault={false}
            />
            <BoardCardComponent 
              isDefault={true} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeComponent;