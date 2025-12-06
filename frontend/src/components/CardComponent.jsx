import styles from './CardComponent.module.css';
import trashIcon from '../assets/trash_icon.svg';
import editIcon from '../assets/edit_icon.svg';
import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function CardComponent({card, deleteFunction}) {

  const [cardTitle, setCardTitle] = useState(card.cardName);
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef(null);
  const prevTitleRef = useRef(cardTitle);

  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id:card.id});

  useEffect(() => {
    if (editingTitle && titleInputRef.current) titleInputRef.current.focus();
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
      // <div className={styles.main} ref={setNodeRef} {...attributes} {...listeners} style={style} >
      <div className={styles.main} ref={setNodeRef} {...attributes} {...(!editingTitle && listeners)} style={style} >
        <div className={styles.left}>
          {editingTitle ? (
          <input 
            ref={titleInputRef}
            className={styles.titleInput}
            defaultValue={cardTitle}
            onBlur={(e) => saveTitle(e.target.value)}
            onKeyDown={onTitleKeyDown}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label='Edit card title'
          />
        ) : (
          <div className={styles.title}>
            {cardTitle}
          </div>
        )}
        </div>
        <div className={styles.right}>
          <div className={styles.editIcon}>
            <img src={editIcon} alt="edit" onClick={startEdit} onPointerDown={(e) => e.stopPropagation()} />
          </div>
          <div className={styles.trashIcon}>
            <img src={trashIcon} alt="bin" onClick={handleTrashClick} onPointerDown={(e) => e.stopPropagation()} />
          </div>
        </div>
      </div>
  )
}

export default CardComponent;