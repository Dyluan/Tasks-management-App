import styles from './ColumnComponent.module.css';
import moreHoriz from '../../assets/more_horiz.png';
import add from '../../assets/add.png';
import featuredLogo from '../../assets/featured_play_list.png';
import closeIcon from '../../assets/close_icon.png';
import CardListComponent from '../cardListComponent/CardListComponent';
import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { closestCorners, DndContext, PointerSensor, TouchSensor, useSensors, useSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';

function ColumnComponent({column, deleteColumn, copyColumn}) {

  const [items, setItems] = useState(() => {
  // If the column already has items, use them
    if (column.items && column.items.length > 0) {
      return column.items;
    }
    // Otherwise use fallback defaults
    return [
      { cardName: "Card Text", id: uuidv4(), comments: [], labels:[] },
      { cardName: "Another text", id: uuidv4(), comments: [], labels:[] },
      { cardName: "Third one", id: uuidv4(), comments: [], labels:[] }
    ];
  });
  const [columnTitle, setColumnTitle] = useState(column.title);
  const [columnColor, setcolumnColor] = useState(column.columnColor);
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef(null);
  const prevTitleRef = useRef(columnTitle);
  const [anchorEl, setAnchorEl] = useState(null);
  const colorList = ['#baf3db', '#f5e989', '#fce4a6', '#ffd5d2', '#eed7fc', '#cfe1fd', '#c6edfb', '#F5F5F5'];

  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id:column.id});

  const handlePopoverClose = () => setAnchorEl(null);

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  const addItems = () => {
    setItems(prev => [...prev, {cardName: "New Card", id: uuidv4(), labels: [], comments: []}])
  }
  const deleteItems = (idToRemove) => {
    setItems(prev => prev.filter(item => item.id !== idToRemove));
  };

  const style = {
    transition, transform: CSS.Translate.toString(transform),
    background: columnColor
  }

  const addButtonStyle = {
    backgroundColor: columnColor
  }

  const handleColorChange = (newColor) => {
    setcolumnColor(newColor);
  }

  function startEdit() {
    prevTitleRef.current = columnTitle;
    setEditingTitle(true);
  }

  function saveTitle(newTitle) {
    const trimmed = String(newTitle).trim();
    if (trimmed.length === 0) {
      setColumnTitle(prevTitleRef.current);
    } else {
      setColumnTitle(trimmed);
    }
    setEditingTitle(false);
  }

  function cancelEdit() {
    setColumnTitle(prevTitleRef.current);
    setEditingTitle(false);
  }

  function onTitleKeyDown(e) {
    if (e.key === 'Enter') saveTitle(e.target.value);
    if (e.key === 'Escape') cancelEdit();
  }

  function updateCard(cardId, updatedCard) {
    setItems(prev =>
      prev.map(card => 
        card.id === cardId ? updatedCard : card
      )
    );
  }

  // this part of the code is relative to the dnd-kit library
  const getCardPosition = (id) => items.findIndex(item => item.id === id);

  const handleDragEnd = (event) => {
    const {active, over} = event;
    if (active.id === over.id) return;

    setItems((items) => {
      const originalPos = getCardPosition(active.id);
      const newPos = getCardPosition(over.id);

      return arrayMove(items, originalPos, newPos);
    })
  }

  // got rid of KeyboardSensor as it interferes with input writing (was not allowing space key to work properly)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      }
    }),
    useSensor(TouchSensor),
  );

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
                      <li><button>New card</button></li>
                      <li><button onClick={() => {
                        handlePopoverClose();
                        startEdit();
                      }}>Rename column</button></li>
                      <li><button onClick={() => deleteColumn(column.id)}>Delete column</button></li>
                      <li><button onClick={() => copyColumn(columnTitle, items, columnColor)}>Copy column</button></li>
                    </ul>
                  </div>
                  <div className={styles.underline}></div>
                  <div className={styles.modalColors}>
                    <div className={styles.modalColorsTitle}>
                      Edit list color
                    </div>
                    <ul className={styles.modalColorsList}>
                      {colorList.map((elem, index) => (
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
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners} sensors={sensors}>
          <CardListComponent 
            cards={items} 
            deleteFunction={deleteItems} 
            columnColor={columnColor} 
            columnTitle={columnTitle} 
            updateCard={updateCard}
          />
        </DndContext>
      </div>
      <div className={styles.footer}>
        <div className={styles.left}>
          <button 
            onClick={addItems} 
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