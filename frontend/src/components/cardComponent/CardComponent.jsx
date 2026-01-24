import styles from './CardComponent.module.css';
import trashIcon from '../../assets/trash_icon.svg';
import editIcon from '../../assets/edit_icon.svg';
import closeIcon from '../../assets/close_icon.png';
import labelIcon from '../../assets/label_icon.svg';
import commentIcon from '../../assets/comment_logo.png';
import addIcon from '../../assets/add.png';
import descriptionIcon from '../../assets/description_icon.svg';
import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LabelComponent from '../labelComponent/LabelComponent';
import axios from 'axios';

function CardComponent({
  card, 
  deleteFunction, 
  columnColor, 
  columnTitle, 
  updateCard, 
  colorList, 
  updateColorList,
  deleteColorFromList,
  addColorToList
  }) {

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
  const [tempDescription, setTempDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const descriptionInputRef = useRef(null);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const commentInputRef = useRef(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [tempEditComment, setTempEditComment] = useState('');
  const editCommentInputRef = useRef(null);
  const token = localStorage.getItem('jwt');

  // bool variable responsible for the display of EditLabel/ DisplayLabel Component
  const [openEditLabel, setOpenEditLabel] = useState(false);

  const [selectedLabelColor, setSelectedLabelColor] = useState(null);
  const updateSelectedLabelColor = (color) => {
    setSelectedLabelColor(color);
  };

  const patchCard = async (id, updates) => {
    const response = await axios.patch(`http://localhost:5500/cards/${id}`, 
      updates,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const updatedCard = response.data;
  };

  // loads card labels on page load
  // TODO: weird bug where labels are loaded 1/2 times
  useEffect(() => {
    const getCardLabelsFromServer = async () => {
      const response = await axios.get(`http://localhost:5500/cards/${card.id}/labels`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const labelsLoadedFromServer = response.data;

      setSelectedLabels(labelsLoadedFromServer);
      // Also update parent to keep in sync and prevent the card.labels useEffect from overwriting
      updateCard(card.id, { ...card, labels: labelsLoadedFromServer });
    };

    getCardLabelsFromServer();
  }, []);

  const openLabelPopOver = (color) => {
    setOpenEditLabel(true);
    setSelectedLabelColor(color);
    setPopoverAnchorEl(labelButtonRef.current);
  }

  const toggleOpenEditLabelButton = () => {
    setOpenEditLabel(!openEditLabel);
  }
  
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
  }

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setOpenEditLabel(false);
  }

  const toggleLabel = async (label) => {
    const exists = selectedLabels.some(l => l.id === label.id);
    const updated = exists
      ? selectedLabels.filter(l => l.id !== label.id)
      : [...selectedLabels, label];

    setSelectedLabels(updated);

    updateCard(card.id, {
      ...card,
      labels: updated
    });

    const label_ids = updated.map(l => l.id);
    console.log('ToggleLabel CALLED. My current labels::', label_ids);
    const response = await axios.post(`http://localhost:5500/cards/${card.id}/labels`,
      { label_ids: label_ids},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('response::', response.data);
  };

  const deleteComment = async (commentId) => {
    // since the set function from usestate is async, I have to create a temp var at the moment
    // to sync the component with the parent. Otherwise, last change is not taken into account
    const updatedCommentList = commentList.filter(
      comment => comment.id !== commentId
    );

    setCommentList(updatedCommentList);

    updateCard(card.id, {
      ...card,
      comments: updatedCommentList
    });

    const response = await axios.delete(`http://localhost:5500/cards/comment/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const responseData = response.data;
    console.log('Deleted comment!', responseData);

  }

  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id:card.id});

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  // useEffect allowing to focus on description + place cursor at the end of 
  // description text on Edit click
  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      const el = descriptionInputRef.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [isEditingDescription]);

  // same idea here but for the comments
  useEffect(() => {
    if (editingCommentId && editCommentInputRef.current) {
      editCommentInputRef.current.focus();
      editCommentInputRef.current.setSelectionRange(
        editCommentInputRef.current.value.length,
        editCommentInputRef.current.value.length
      );
    }
  }, [editingCommentId]);

  useEffect(() => {
    setDescription(card.description ?? '');
  }, [card.description]);

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

  const saveTitle = async (newTitle) => {
    const trimmed = String(newTitle).trim();
    if (trimmed.length === 0) {
      setCardTitle(prevTitleRef.current);
    } else {
      saveCardTitle(trimmed);
      patchCard(card.id, { title: newTitle });
    }
    setEditingTitle(false);
  }

  const saveCardTitle = async (newTitle) => {
    updateCard(card.id, {...card, cardName: newTitle});
    setCardTitle(newTitle);

    // TODO:
    // This function triggers EACH TIME a letter changes
    // Too many server calls. Needs fixing
    patchCard(card.id, { title: newTitle });
  }

  const updateComments = async (newComment) => {
    const response = await axios.post(`http://localhost:5500/cards/${card.id}/comment`,
      { title: newComment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const responseData = response.data;
    console.log('Added a new comment:', responseData);

    const updatedComments = [responseData, ...commentList];
    updateCard(card.id, {
      ...card,
      comments: updatedComments
    });
    setCardComment(newComment);
    setCommentList(updatedComments);
    setTempCardComment('');
  };

  // updates the commentList if the parent updates
  useEffect(() => {
    setCommentList(card.comments ?? []);
  }, [card.comments]);
  
  // updates the labels if the parent updates
  useEffect(() => {
    setSelectedLabels(card.labels ?? []);
  }, [card.labels]);

  // sync selectedLabels when colorList changes (e.g., label color/text edited)
  useEffect(() => {
    setSelectedLabels(prev => 
      prev.map(selectedLabel => {
        const updatedLabel = colorList.find(c => c.id === selectedLabel.id);
        return updatedLabel ? { ...selectedLabel, ...updatedLabel } : selectedLabel;
      })
    );
  }, [colorList]);

  function cancelEdit() {
    setCardTitle(prevTitleRef.current);
    setEditingTitle(false);
  }

  const saveEditedComment = async (commentId) => {
    const updatedComments = commentList.map(comment =>
      comment.id === commentId
        ? { ...comment, title: tempEditComment }
        : comment
    );

    setCommentList(updatedComments);
    updateCard(card.id, {
      ...card,
      comments: updatedComments
    });

    setEditingCommentId(null);

    const response = await axios.patch(`http://localhost:5500/cards/comment/${commentId}`,
      { title: tempEditComment },
      { headers: {Authorization: `Bearer ${token}`} }
    );
    console.log('edited comment: ', response.data);

    setTempEditComment('');
  }

  function cancelEditComment() {
    setEditingCommentId(null);
    setTempEditComment('');
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
                      colorList={colorList}
                      updateColorList={updateColorList}
                      openEditLabel={openEditLabel}
                      toggleEditButton={toggleOpenEditLabelButton}
                      selectedLabelColor={selectedLabelColor}
                      updateSelectedLabelColor={updateSelectedLabelColor}
                      deleteColorFromList={deleteColorFromList}
                      addColorToList={addColorToList}
                    />
                  </div>
                  <div className={styles.labelsContainer}>
                    {selectedLabels.length > 0 && (
                      <div className={styles.labelsTitle}>
                        Labels
                      </div>
                    )}
                    <ul>
                      {selectedLabels.map((label) => (
                        <li key={label.id}>
                          <button 
                            className={styles.labelButtons} 
                            style={{backgroundColor: label.color}}
                            onClick={() => openLabelPopOver(label)}
                          >
                            {label.text}
                          </button>
                        </li>
                      ))}
                      {selectedLabels.length > 0 && (
                        <li>
                          <button
                            className={styles.addLabelButton}
                            onClick={() => setPopoverAnchorEl(labelButtonRef.current)}
                          >
                            <img src={addIcon} alt="add" />
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className={styles.descriptionContainer}>
                    <div className={styles.descriptionHeader}>
                      <div className={styles.descriptionLeft}>
                        <img src={descriptionIcon} alt="description" />
                        Description
                      </div>
                      <div className={styles.descriptionRight}>
                        <button 
                          className={styles.editDescriptionButton}
                          onClick={() => {
                            setTempDescription(description);
                            setIsEditingDescription(true);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className={styles.descriptionMain}>
                      {!isEditingDescription ? (
                        description.length > 0 ? (
                          <div className={styles.descriptionText}>
                            {description}
                          </div>
                        ) : (
                          <div className={styles.descriptionPlaceholder}>
                            No description yet
                          </div>
                        )
                      ) : (
                        <>
                          <TextField 
                            fullWidth
                            label="Task description"
                            multiline
                            rows={4}
                            value={tempDescription}
                            onChange={(e) => setTempDescription(e.target.value)}
                            inputRef={descriptionInputRef}
                          />
                          <div className={styles.descriptionFooter}>
                            <div className={styles.footerButton}>
                              <Button 
                                variant="contained"
                                size="small"
                                onClick={() => {
                                  setDescription(tempDescription);
                                  updateCard(card.id, {
                                    ...card,
                                    description: tempDescription
                                  });
                                  setIsEditingDescription(false);
                                  patchCard(card.id, { description: tempDescription })
                                }}
                              >
                                Save
                              </Button>
                            </div>

                            <div className={styles.footerButton}>
                              <Button 
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  setTempDescription('');
                                  setIsEditingDescription(false);
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
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
                      size='small'
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
                      {/* TODO: change this part of the code. Buttons are ugly right now */}
                      {commentList.map((elem) => (
                        <div className={styles.commentContainer} key={elem.id}>
                          {editingCommentId === elem.id ? (
                            <li className={styles.comment}>
                              <TextField
                                size="small"
                                fullWidth
                                value={tempEditComment}
                                onChange={(e) => setTempEditComment(e.target.value)}
                                inputRef={editCommentInputRef}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEditedComment(elem.id);
                                  if (e.key === 'Escape') cancelEditComment();
                                }}
                                />
                              <div className={styles.editActions}>
                                <Button size="small" onClick={() => saveEditedComment(elem.id)}>
                                  Save
                                </Button>
                                <Button size="small" onClick={cancelEditComment}>
                                  Cancel
                                </Button>
                              </div>
                            </li>
                          ) : (
                            <>
                              <li className={styles.comment} key={elem.id}>
                                {/* {elem.text} */}
                                {elem.title}
                              </li>
                              <span className={styles.editComment}>
                                <div className={styles.editCommentButton}>
                                  <img 
                                    src={editIcon} 
                                    alt="edit" 
                                    onClick={() => {
                                      setEditingCommentId(elem.id);
                                      setTempEditComment(elem.title);
                                    }}
                                  />
                                </div>
                                <div className={styles.editCommentButton}>
                                  <img src={trashIcon} alt="trash" onClick={() => deleteComment(elem.id)}/>
                                </div>
                              </span>
                            </>
                            )}
                        </div>
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
                {selectedLabels.map((label) => (
                  <li className={styles.labelElement} key={label.id}>
                    <span className={styles.showingColor} style={{backgroundColor: label.color}}></span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.title}>
              {cardTitle}
            </div>
            {/* TODO, the cardInformation holds a padding that displays 
              even if there's no content inside */}
            <div className={styles.cardInformation}>
              {description.length > 0 && (
                <div className={styles.showingDescription}>
                  <img src={descriptionIcon} alt="description" />
                </div>
              )}
              {commentList.length > 0 && (
                <div className={styles.showingComments}>
                  <img src={commentIcon} alt="comment" /> 
                  <div className={styles.commentsNumber}>
                    {commentList.length}
                  </div>
                </div>
              )}
            </div>
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