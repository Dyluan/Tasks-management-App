import styles from './DisplayWorkspaces.module.css';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Divider, Collapse } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import AddModalComponent from '../addMembersModalComponent/AddModalComponent';

function DisplayWorkspacesComponent({
  workspaces,
  theme,
  setCurrentWorkspace
}) {

  const navigate = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [openMembersModal, setOpenMembersModal] = useState(false);
  const handleMembersModalOpen = () => setOpenMembersModal(true);
  const handleMembersModalClose = () => setOpenMembersModal(false);

  const handleOpenClick = (workspaceId) => {
    setOpenSubMenu(openSubMenu === workspaceId ? null : workspaceId);
  }

  const handleDeleteClick = (workspace) => {
    console.log('delete ::', workspace);
  }

  return (
    <div className={styles.main}>

      {/* our add members popup */}
      <AddModalComponent
        open={openMembersModal}
        onClose={handleMembersModalClose}
      />

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
            <ListItemButton>
              <ListItemText 
                primary={workspace.title} 
              />
              <ListItemIcon onClick={() => handleOpenClick(workspace.id)}>
                {openSubMenu === workspace.id ? <ExpandLess sx={{color: theme.textColor}} /> : <ExpandMore sx={{color: theme.textColor}} />}
              </ListItemIcon>
            </ListItemButton>
            <Collapse in={openSubMenu === workspace.id} timeout="auto" unmountOnExit>
              <List component="div" disablePadding dense="true">
                <ListItemButton 
                  sx={{ 
                    pl: 4,
                    borderRadius: '6px'
                  }}
                  onClick={() => {
                    navigate(`/workspace/${workspace.id}`)
                    setCurrentWorkspace(workspace.id)
                  }}  
                >
                  <ListItemIcon>
                    <DashboardIcon 
                      sx={{color: theme.textColor}}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Boards" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => handleMembersModalOpen()}
                >
                  <ListItemIcon>
                    <GroupAddIcon 
                      sx={{color: theme.textColor}}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Add members" />
                </ListItemButton>
                <ListItemButton 
                  sx={{ pl: 4 }}
                  onClick={() => handleDeleteClick(workspace)}  
                >
                  <ListItemIcon>
                    <DeleteIcon 
                      sx={{color: theme.textColor}}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Delete workspace" />
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