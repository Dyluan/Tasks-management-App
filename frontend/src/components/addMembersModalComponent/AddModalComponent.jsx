import styles from './AddModal.module.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import closeIcon from '../../assets/close_icon.png';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Popover from '@mui/material/Popover';
import CheckIcon from '@mui/icons-material/Check';

function AddModalComponent({
  open,
  onClose,}) {

  // TODO: add a search Function
  // Will do when I be backend ready
  const [searchValue, setSearchValue] = useState('');

  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);

  const handleLinkClick = (event) => {
    setPopoverAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };
  const openPopover = Boolean(popoverAnchorEl);

  // TODO: Write/use a correct invitation link
  // http://websiteName.com/xxxxxx/xxxxxxx
  const copyToClipboard = async() => {
    const text = 'blablabla';
    await navigator.clipboard.writeText(text);
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
      onClose={onClose}
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
              <button onClick={onClose}>
                <img src={closeIcon} alt="close" />
              </button>
            </div>
          </div>
          <div className={styles.searchSpace}>
            <input 
              type="text" 
              placeholder='Email address or username' 
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
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