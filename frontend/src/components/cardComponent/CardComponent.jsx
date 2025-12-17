import styles from './CardComponent.module.css';
import trashIcon from '../../assets/trash_icon.svg';
import editIcon from '../../assets/edit_icon.svg';
import closeIcon from '../../assets/close_icon.png';
import labelIcon from '../../assets/label_icon.svg';
import commentIcon from '../../assets/comment_logo.png';
import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LabelComponent from '../labelComponent/LabelComponent';

function CardComponent({card, deleteFunction, columnColor, columnTitle, updateCard}) {

  const [cardTitle, setCardTitle] = useState(card.cardName);
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef(null);
  const prevTitleRef = useRef(cardTitle);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentList, setCommentList] = useState(card.comments ?? []);
  const [tempCardComment, setTempCardComment] = useState('');
  const [cardComment, setCardComment] = useState('');
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const labelButtonRef = useRef(null);
  const [selectedLabels, setSelectedLabels] = useState(card.labels ?? []);
  const [description, setDescription] = useState('');
  
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
  }

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  }

  function toggleLabel(color) {
    setSelectedLabels(prev => {
      const updated =
        prev.includes(color)
          ? prev.filter(c => c !== color)
          : [...prev, color];

      updateCard(card.id, {
        ...card,
        labels: updated
      });

      return updated;
    });
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
      saveCardTitle(trimmed);
    }
    setEditingTitle(false);
  }

  function saveCardTitle(newTitle) {
    updateCard(card.id, {...card, cardName: newTitle});
    setCardTitle(newTitle);
  }

  function updateComments(newComment) {
    const updatedComments = [...commentList, newComment];
    updateCard(card.id, {
      ...card,
      comments: updatedComments
    });
    setCardComment(newComment);
    setCommentList(updatedComments);
    setTempCardComment('');
  }

  // updates the commentList if the parent updates
  useEffect(() => {
    setCommentList(card.comments ?? []);
  }, [card.comments]);
  
  // updates the labels if the parent updates
  useEffect(() => {
    setSelectedLabels(card.labels ?? []);
  }, [card.labels]);

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
            justifyContent: 'center',
            top: '10vh',
            height: 'fit-content'
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
                      onChange={(e) => saveCardTitle(e.target.value)}
                    />
                  </div>
                  <div className={styles.additionalCardsContainer}>
                    <button 
                      className={styles.labelButton}
                      onClick={(e) => setPopoverAnchorEl(e.currentTarget)}
                      ref={labelButtonRef}
                    >
                      <img src={labelIcon} className={styles.modalLabelIcon} alt="label" />
                      Label
                    </button>
                    <LabelComponent 
                      open={Boolean(popoverAnchorEl)} 
                      anchorEl={popoverAnchorEl} 
                      onClose={handlePopoverClose} 
                      toggleLabel={toggleLabel}
                      selectedLabels={selectedLabels}
                    />
                  </div>
                  <div className={styles.labelsContainer}>
                    <div className={styles.labelsTitle}>
                      Labels
                    </div>
                    <ul>
                      {selectedLabels.map((elem, index) => (
                        <li key={index}>
                          <button 
                            className={styles.labelButtons} 
                            style={{backgroundColor: elem}}
                            onClick={() => setPopoverAnchorEl(labelButtonRef.current)}
                          >
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={styles.modalRightMain}>
                  <div className={styles.modalRightTitle}>
                    <b>Comments</b>
                  </div>
                  <div className={styles.cardCommentInput}>
                    <TextField 
                      className={styles.commentInput} 
                      label="write a comment" 
                      variant="outlined" 
                      value={tempCardComment}
                      onChange={(e) => setTempCardComment(e.target.value)}
                    />
                  </div>
                  <div className={styles.saveCommentContainer}>
                    {tempCardComment.length > 0 ? (
                      <Button 
                        variant="outlined" 
                        className={styles.saveCommentButton}
                        onClick={() => updateComments(tempCardComment)}
                        >Save</Button>
                    ) : (
                      <Button variant="outlined" disabled className={styles.saveCommentButton}>Save</Button>
                    )}
                  </div>
                  <div className={styles.cardCommentList}>
                    <ul className={styles.ulComment}>
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
          <div className={styles.titleContainer} onClick={startEdit}>
            <div className={styles.showingLabels}>
              <ul className={styles.labelList}>
                {selectedLabels.map((elem, index) => (
                  <li className={styles.labelElement} key={index}>
                    <span className={styles.showingColor} style={{backgroundColor: elem}}></span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.title}>
              {cardTitle}
            </div>
            {commentList.length > 0 && (
              <div className={styles.showingComments}>
                <img src={commentIcon} alt="comment" /> 
                <div className={styles.commentsNumber}>
                  {commentList.length}
                </div>
              </div>
            )}

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