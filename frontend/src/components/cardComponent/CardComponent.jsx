import styles from './CardComponent.module.css';
import trashIcon from '../../assets/trash_icon.svg';
import editIcon from '../../assets/edit_icon.svg';
import closeIcon from '../../assets/close_icon.png';
import labelIcon from '../../assets/label_icon.svg';
import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Popover from '@mui/material/Popover';

function CardComponent({card, deleteFunction, columnColor, columnTitle}) {

  const [cardTitle, setCardTitle] = useState(card.cardName);
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef(null);
  const prevTitleRef = useRef(cardTitle);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [cardComment, setCardComment] = useState('');
  
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
  }

  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id:card.id});

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  const handleTrashClick = () => {
    deleteFunction(card.id);
  }

  const style = {
    transition, transform: CSS.Translate.toString(transform),
  }

  function startEdit() {
    prevTitleRef.current = cardTitle;
    setEditingTitle(true);
  }

  function saveTitle(newTitle) {
    const trimmed = String(newTitle).trim();
    if (trimmed.length === 0) {
      setCardTitle(prevTitleRef.current);
    } else {
      setCardTitle(trimmed);
    }
    setEditingTitle(false);
  }

  function cancelEdit() {
    setCardTitle(prevTitleRef.current);
    setEditingTitle(false);
  }

  function onTitleKeyDown(e) {
    if (e.key === 'Enter') saveTitle(e.target.value);
    if (e.key === 'Escape') cancelEdit();
  }

  return (
      <div className={styles.main} ref={setNodeRef} {...attributes} {...listeners} style={style}>
        <Modal 
          open={isModalOpen}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: 'fit-content',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div className={styles.modalContainer}>
              <div className={styles.modalHeader}>
                <div className={styles.modalLeft} style={{backgroundColor: columnColor}}>
                  {columnTitle}
                </div>
                <div className={styles.modalRight}>
                  <button className={styles.modalCloseButton} onClick={handleModalClose}>
                    <img src={closeIcon} alt="close button" />
                  </button>
                </div>
              </div>
              <div className={styles.modalLine}></div>
              <div className={styles.modalMain}>
                <div className={styles.modalLeftMain}>
                  <div className={styles.modalCardInputContainer}>
                    <input 
                      className={styles.modalCardInput} 
                      type="text" 
                      value={cardTitle} 
                      onChange={(e) => setCardTitle(e.target.value)}
                    />
                  </div>
                  <div className="">
                    <button className={styles.labelButton}>
                      <img src={labelIcon} className={styles.modalLabelIcon} alt="label" />
                      Label
                    </button>
                  </div>
                </div>
                <div className={styles.modalRightMain}>
                  <div className={styles.modalRightTitle}>
                    <b>Comments</b>
                  </div>
                  <div className={styles.cardCommentInput}>
                    <TextField 
                      id="commentInput" 
                      label="write a comment" 
                      variant="outlined" 
                      onChange={(e) => setCardComment(e.target.value)}
                      
                    />
                  </div>
                  <div className={styles.cardCommentList}>
                    <ul>
                      {commentList.map((elem, index) => (
                        <li className={styles.comment} key={index}>{elem}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
        <div className={styles.left}>
          {editingTitle ? (
          <input 
            ref={titleInputRef}
            className={styles.titleInput}
            defaultValue={cardTitle}
            onBlur={(e) => saveTitle(e.target.value)}
            onKeyDown={onTitleKeyDown}
            aria-label='Edit card title'
          />
        ) : (
          <div className={styles.title} onClick={startEdit}>
            {cardTitle}
          </div>
        )}
        </div>
        <div className={styles.right}>
          <div className={styles.editIcon}>
            <img src={editIcon} alt="edit" onClick={handleModalOpen} onPointerDown={(e) => e.stopPropagation()} />
          </div>
          <div className={styles.trashIcon}>
            <img src={trashIcon} alt="bin" onClick={handleTrashClick} onPointerDown={(e) => e.stopPropagation()} />
          </div>
        </div>
      </div>
  )
}

export default CardComponent;