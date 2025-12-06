import styles from './ColumnComponent.module.css';
import moreHoriz from '../assets/more_horiz.png';
import add from '../assets/add.png';
import featuredLogo from '../assets/featured_play_list.png';
import CardListComponent from './CardListComponent';
import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { closestCorners, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensors, useSensor } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

function ColumnComponent({column}) {

  const [items, setItems] = useState([
    {cardName: "Card Text", id: uuidv4()}, 
    {cardName: "Another text", id: uuidv4()}, 
    {cardName: "Third one", id: uuidv4()}
  ]);
  const [columnTitle, setColumnTitle] = useState(column.title);
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef(null);
  const prevTitleRef = useRef(columnTitle);

  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id:column.id});

  useEffect(() => {
    if (editingTitle && titleInputRef.current) titleInputRef.current.focus();
  }, [editingTitle]);

  const addItems = () => {
    setItems(prev => [...prev, {cardName: "New Card", id: uuidv4()}])
  }
  const deleteItems = (idToRemove) => {
    setItems(prev => prev.filter(item => item.id !== idToRemove));
  };

  const style = {
    transition, transform: CSS.Translate.toString(transform),
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  return (
    // <div className={styles.main} ref={setNodeRef} {...attributes} {...(!editingTitle && listeners)} style={style} >
    <div className={styles.main} ref={setNodeRef} {...attributes} {...listeners} style={style} >
      <div className={styles.titleContainer}>
        {editingTitle ? (
          <input 
            ref={titleInputRef}
            className={styles.titleInput}
            defaultValue={columnTitle}
            onBlur={(e) => saveTitle(e.target.value)}
            onKeyDown={onTitleKeyDown}
            onPointerDown={(e) => e.stopPropagation()}
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
        <div className="titleImg">
          <img src={moreHoriz} alt="dot" />
        </div>
      </div>
      <div className={styles.cardsList}>
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners} sensors={sensors}>
          <CardListComponent cards={items} deleteFunction={deleteItems} />
        </DndContext>
      </div>
      <div className={styles.footer}>
        <div className={styles.left}>
          <button onClick={addItems} className={styles.leftButton} onPointerDown={(e) => e.stopPropagation()}>
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