import styles from './DisplayWorkspaces.module.css';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Divider, Collapse } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';

function DisplayWorkspacesComponent({
  workspaces,
  theme
}) {

  const navigate = useNavigate();

  return (
    <div className={styles.main}>
      <List
        subheader = {
          <ListSubheader
          sx={{
            backgroundColor: 'transparent',
            color: theme.textColor
          }}
          >
            Workspaces
          </ListSubheader>
        }
        
      >
        {workspaces.map(workspace => (
          <ListItemButton
            onClick={() => navigate(`/workspace/${workspace.id}`)}
          >
            <ListItemIcon>
              <WorkIcon 
                sx={{color: theme.textColor}}
              />
            </ListItemIcon>
            <ListItemText primary={workspace.title} />
          </ListItemButton>
        ))}
      </List>
    </div>
  )
}

export default DisplayWorkspacesComponent;