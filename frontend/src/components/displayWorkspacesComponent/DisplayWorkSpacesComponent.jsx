import styles from './DisplayWorkspaces.module.css';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Divider, Collapse } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

function DisplayWorkspacesComponent({
  workspaces,
  theme,
  setCurrentWorkspace
}) {

  const navigate = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState(true);

  const handleOpenClick = () => {
    setOpenSubMenu(!openSubMenu);
  }

  return (
    <div className={styles.main}>
      <List
        subheader = {
          <ListSubheader
          sx={{
            backgroundColor: 'transparent',
            color: theme.textColor,
            fontFamily: 'Noto Sans'
          }}
          >
            Your workspaces
          </ListSubheader>
        }
        dense='true'
      >
        {workspaces.map(workspace => (
          <>
            <ListItemButton
              sx={{
                borderRadius: '6px'
              }}  
              onClick={() => {
                navigate(`/workspace/${workspace.id}`)
                setCurrentWorkspace(workspace.id)
              }}
            >
              <ListItemIcon>
                <WorkIcon 
                  sx={{color: theme.textColor}}
                />
              </ListItemIcon>
              <ListItemText 
                primary={workspace.title} 
              />
              <ListItemIcon onClick={() => handleOpenClick()}>
                {openSubMenu ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
            </ListItemButton>
            <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding dense="true">
                <ListItemButton>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText primary="delete workspace" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        ))}
      </List>
    </div>
  )
}

export default DisplayWorkspacesComponent;