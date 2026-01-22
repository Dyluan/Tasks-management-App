import styles from './ColumnComponent.module.css';
import moreHoriz from '../../assets/more_horiz.png';
import add from '../../assets/add.png';
import featuredLogo from '../../assets/featured_play_list.png';
import closeIcon from '../../assets/close_icon.png';
import CardListComponent from '../cardListComponent/CardListComponent';
import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import axios from "axios";

function ColumnComponent({
  column, 
  deleteColumn, 
  copyColumn, 
  updateColumnItems, 
  updateColumnColor, 
  updateColumnTitle, 
  colorList, 
  updateColorList,
  deleteColorFromList,
  addColorToList
  }) {

  const items = column.items;
  const [nbOfCards, setNbOfCards] = useState(items.length);
  const columnTitle = column.title;
  const columnColor = column.columnColor;
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef(null);
  const prevTitleRef = useRef(columnTitle);
  const [anchorEl, setAnchorEl] = useState(null);
  const columnColorList = ['#baf3db', '#f5e989', '#fce4a6', '#ffd5d2', '#eed7fc', '#cfe1fd', '#c6edfb', '#F5F5F5'];
  const token = localStorage.getItem('jwt');

  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id:column.id});

  const handlePopoverClose = () => setAnchorEl(null);

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  const newCard = async () => {
    const response = await axios.post('http://localhost:5500/cards/new', 
      { title: 'New Card', column_id: column.id, position: nbOfCards },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  };

  // TODO: make use of that function
  const patchCard = async (id, updates) => {
    const response = await axios.patch(`http://localhost:5500/cards/${id}`, 
      { updates },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = response.data;
    console.log('updated card:', data);
  };

  const addCard = async () => {
    // First, get data from server
    const newCardData = await newCard();

    // Map server response to frontend structure
    const mappedCard = {
      id: newCardData.id,
      cardName: newCardData.title,
      description: newCardData.description || '',
      comments: [],
      labels: [],
      position: newCardData.position
    };

    // Then update local list with newly created data
    updateColumnItems(column.id, [...items, mappedCard]);
    setNbOfCards(nbOfCards+1);
  }

  const deleteItems = async (idToRemove) => {
    //deleting card from column
    updateColumnItems(
      column.id,
      items.filter(item => item.id !== idToRemove)
    );

    // THEN deleting from server
    await axios.delete(`http://localhost:5500/cards/${idToRemove}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };
  
  const style = {
    transition, transform: CSS.Translate.toString(transform),
    background: columnColor
  }

  const addButtonStyle = {
    backgroundColor: columnColor
  }

  const handleColorChange = (newColor) => {
    updateColumnColor(column.id, newColor);
  }

  function startEdit() {
    prevTitleRef.current = columnTitle;
    setEditingTitle(true);
  }

  function saveTitle(newTitle) {
    const trimmed = String(newTitle).trim();
    if (trimmed.length === 0) {
      updateColumnTitle(column.id, prevTitleRef.current);
    } else {
      updateColumnTitle(column.id, trimmed);
    }
    setEditingTitle(false);
  }

  function cancelEdit() {
    updateColumnTitle(column.id, prevTitleRef.current);
    setEditingTitle(false);
  }

  function onTitleKeyDown(e) {
    if (e.key === 'Enter') saveTitle(e.target.value);
    if (e.key === 'Escape') cancelEdit();
  }

  const updateCard = (cardId, updatedCard) => {
    updateColumnItems(
      column.id,
      items.map(card =>
        card.id === cardId ? updatedCard : card
      )
    );
    
  };

  return (
    <div className={styles.main} ref={setNodeRef} {...attributes} {...listeners} style={style} >
      <div className={styles.titleContainer}>
        {editingTitle ? (
          <input 
            ref={titleInputRef}
            className={styles.titleInput}
            defaultValue={columnTitle}
            onBlur={(e) => saveTitle(e.target.value)}
            onKeyDown={onTitleKeyDown}
            aria-label='Edit column title'
          />
        ) : (
          <div
            className={styles.title}
            role='button'
            onClick={startEdit}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEdit(); }}
          >
            {columnTitle}
          </div>
        )}
        <div className={styles.titleImgContainer}>
          <img 
            src={moreHoriz} 
            alt="dot" 
            className={styles.titleImg} 
            onClick={(e) => setAnchorEl(e.currentTarget)} 
            onPointerDown={(e) => e.stopPropagation()}
          />
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Box className={styles.boxInModal}>
              <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitle}>
                    Actions
                  </div>
                  <button className={styles.modalCloseButton} onClick={handlePopoverClose}><img src={closeIcon} alt="close" /></button>
                </div>
                <div className={styles.underline}></div>
                <div className={styles.modalContent}>
                  <div className={styles.modalCards}>
                    <ul>
                      <li><button onClick={addCard} >New card</button></li>
                      <li><button onClick={() => {
                        handlePopoverClose();
                        startEdit();
                      }}>Rename column</button></li>
                      <li><button onClick={() => deleteColumn(column.id)}>Delete column</button></li>
                      <li><button onClick={() => copyColumn(column)}>Copy column</button></li>
                    </ul>
                  </div>
                  <div className={styles.underline}></div>
                  <div className={styles.modalColors}>
                    <div className={styles.modalColorsTitle}>
                      Edit list color
                    </div>
                    <ul className={styles.modalColorsList}>
                      {columnColorList.map((elem, index) => (
                        <li className={styles.modalColorsElem} key={index}>
                          <button 
                            className={styles.modalColorButton} 
                            style={{backgroundColor: elem}}
                            onClick={() => handleColorChange(elem)}
                          >
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Box>
          </Popover>
        </div>
      </div>
      <div className={styles.cardsList}>
        <CardListComponent 
          cards={items} 
          deleteFunction={deleteItems} 
          columnColor={columnColor} 
          columnTitle={columnTitle} 
          updateCard={updateCard}
          colorList={colorList}
          updateColorList={updateColorList}
          deleteColorFromList={deleteColorFromList}
          addColorToList={addColorToList}
        />
      </div>
      <div className={styles.footer}>
        <div className={styles.left}>
          <button 
            onClick={addCard} 
            className={styles.leftButton} 
            onPointerDown={(e) => e.stopPropagation()} 
            style={addButtonStyle}
          >
            <div className={styles.leftLogo}>
              <img src={add} alt="add" />
            </div>
            <div className={styles.leftText}>Add a card</div>
          </button>
        </div>
        <div className={styles.right}>
          <div className={styles.rightLogo}>
            <img src={featuredLogo} alt="feature Logo" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColumnComponent;