import styles from './DeleteModal.module.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import closeIcon from '../../assets/close_icon.png';
import WarningIcon from '@mui/icons-material/Warning';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useApp } from '../../context/AppContext';

function DeleteModalComponent({
  open,
  onClose,
  board
}) {

  const { deleteBoard } = useApp();
  const navigate = useNavigate();
  const handleCloseClick = () => {
    onClose();
  };

  // not sure about the /home
  // TODO: refresh the boards in the workspaces since front still holds old value
  const handleDeleteClick = async () => {
    const token = localStorage.getItem('jwt');
    const response = await axios.delete(`http://localhost:5500/boards/${board.id}`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    deleteBoard(board.id);
    onClose();
    navigate('/home');
  }

  return (
    <Modal
      open={open}
      onClose={handleCloseClick}
      aria-labelledby="modal-delete"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        top: '20vh',
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
              <div className={styles.leftIcon}>
                <WarningIcon 
                  sx={{ 
                    verticalAlign: 'middle' ,
                    color: '#C41E3A'
                  }} 
                />
              </div>
              <div className={styles.leftText}>
                Delete Board ?
              </div>
            </div>
            <div className={styles.right}>
              <button onClick={handleCloseClick}>
                <img src={closeIcon} alt="close" />
              </button>
            </div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.main}>
            <div className={styles.warningText}>
              Are you sure you want to delete this Board?
            </div>
            <div className={styles.buttons}>
              <div className={styles.buttonLeft}>
                <Button 
                  variant='contained'
                  sx={{
                    backgroundColor: '#f5f5f5c7',
                    color: 'gray'
                  }}
                  onClick={handleCloseClick}
                >Cancel</Button>
              </div>
              <div className={styles.buttonRight}>
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: '#C41E3A'
                  }}
                  onClick={handleDeleteClick}
                >Delete</Button>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

export default DeleteModalComponent;