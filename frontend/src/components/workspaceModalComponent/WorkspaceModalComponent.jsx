import styles from './WorkspaceModal.module.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import closeIcon from '../../assets/close_icon.png';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

function WorkspaceModalComponent( {
  open,
  onClose,
  createWorkspace
}) {

  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');

  const handleSaveClick = () => {
    createWorkspace(modalTitle, modalDescription);

  }

  // TODO: redirect user to newly created workspace
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        top: '10vh',
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
              Create a new workspace
            </div>
            <div className={styles.right}>
              <button onClick={onClose}>
                <img src={closeIcon} alt="close" />
              </button>
            </div>
          </div>
          <div className={styles.name}>
            <div className={styles.nameTitle}>
              Workspace name  
            </div>
            <TextField 
              label='Workspace name' 
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
            />
          </div>
          <div className={styles.description}>
            <div className={styles.descriptionTitle}>
              Enter a short description for your workspace (facultative)  
            </div>
            <TextField 
              label='Description' 
              multiline
              rows={4}
              value={modalDescription}
              onChange={(e) => setModalDescription(e.target.value)}
            />
          </div>
          <div className={styles.save}>
            <Button 
              variant='contained' 
              sx={{  
                textTransform: 'none',
                fontSize: '16px',
              }}
              disabled={modalTitle.length <= 3}
              onClick={handleSaveClick}
            >Continue</Button>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

export default WorkspaceModalComponent;