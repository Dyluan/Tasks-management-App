import styles from './DisplayWorkspaces.module.css';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Divider, Collapse } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

function DisplayWorkspacesComponent({
  workspaces,
  theme
}) {

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
          <ListItemButton>
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary={workspace.title} />
          </ListItemButton>
        ))}
      </List>
    </div>
  )
}

export default DisplayWorkspacesComponent;