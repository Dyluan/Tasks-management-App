import styles from './AddModal.module.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import closeIcon from '../../assets/close_icon.png';
import { useState, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import { List, ListItemButton, ListItemIcon, ListItemText, TextField, Button } from '@mui/material';

function AddModalComponent({
  open,
  onClose,
  }) {

  const server_url = process.env.REACT_APP_SERVER_URL;

  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [inviteText, setInviteText] = useState('');
  const [defaultUser, setDefaultUser] = useState(null);

  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const token = localStorage.getItem('jwt');

  const handleLinkClick = (event) => {
    setPopoverAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };
  const openPopover = Boolean(popoverAnchorEl);

  const handleCloseClick = () => {
    onClose();
    setUsers([]);
    setSearchValue('');
    setInviteText('');
    setDefaultUser(null);
  }

  const handleSendClick = () => {
    // TODO: create endpoint to send an invite link to someone
    // request must include ::
    // workspace_id - user email - optionnal message
    onClose();
    setUsers([]);
    setSearchValue('');
    setInviteText('');
    setDefaultUser(null);
  }


  // TODO: Write/use a correct invitation link
  // http://websiteName.com/xxxxxx/xxxxxxx
  const copyToClipboard = async() => {
    const text = 'blablabla';
    await navigator.clipboard.writeText(text);
  };

  const searchForUser = async (search) => {
    const response = await axios.get(`${server_url}/users/search`, 
      { 
        params: { query: search },
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log('users:', response.data);
    setUsers(response.data);
  }

  useEffect(() => {
    if (openPopover) {
      const timer = setTimeout(() => {
        handlePopoverClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [openPopover]);

  return(
    <Modal
      open={open}
      onClose={handleCloseClick}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        top: '40vh',
        height: 'fit-content'
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          width: 'fit-content',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.left}>
              Invite to the workspace
            </div>
            <div className={styles.right}>
              <button onClick={handleCloseClick}>
                <img src={closeIcon} alt="close" />
              </button>
            </div>
          </div>
          {/* {!selectedUser ? ( */}
          { !defaultUser ? (
            <>
              <div className={styles.searchSpace}>
                <input 
                  type="text" 
                  placeholder='Email address'
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    searchForUser(e.target.value);
                  }}
                />
              </div>
              {searchValue.length > 0 && (
                <List>
                  {users.map(user => (
                    <ListItemButton
                      sx={{
                        height: '52px',
                        width: '540px',
                      }}
                      // onClick={() => setSelectedUser(user)}
                      onClick={() => setDefaultUser(user)}
                    >
                      <ListItemIcon>
                        <img src={user.image} className={styles.userPicture} alt="user picture" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={user.email}
                        secondary={user.name}
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </>
          ) : (
            <div className={styles.main}>
              <div className={styles.mainHeader}>
                <div className={styles.selectedLeft}>
                  <button className={styles.userContainer}>
                    {defaultUser.email}
                  </button>
                </div>
                <div className={styles.selectedRight}>
                  <Button 
                    variant='contained' 
                    onClick={() => handleSendClick()}
                  >Send invitation</Button>
                </div>
              </div>
              <div className={styles.mainMessage}>
                <TextField 
                  multiline
                  rows={3}
                  placeholder='Join this workspace so we can collaborate together'
                  fullWidth
                  onChange={(e) => setInviteText(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className={styles.bottom}>
            <div className={styles.bottomLeft}>
              Invite to the workspace using a link :
            </div>
            <div className={styles.bottomRight}>
              <button 
                onClick={(e) => {
                  copyToClipboard();
                  handleLinkClick(e);
                }}
              >
                Create a link
              </button>
            </div>
            {/* copy to clipboard popover */}
            <Popover
              open={openPopover}
              anchorEl={popoverAnchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            >
              <div className={styles.popoverContainer}>
                <CheckIcon /> Copied to clipboard!
              </div>
            </Popover>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

export default AddModalComponent;