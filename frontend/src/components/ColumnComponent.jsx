import styles from './ColumnComponent.module.css';
import moreHoriz from '../assets/more_horiz.png';
import add from '../assets/add.png';
import featuredLogo from '../assets/featured_play_list.png';
import CardListComponent from './CardListComponent';
import { useState, useRef, useEffect } from 'react';

function ColumnComponent({title}) {

  const [items, setItems] = useState(["Card Text", "Another text", "Third one"]);
  const [columnTitle, setColumnTitle] = useState(title);
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef(null);
  const prevTitleRef = useRef(columnTitle);

  useEffect(() => {
    if (editingTitle && titleInputRef.current) titleInputRef.current.focus();
  }, [editingTitle]);

  const addItems = () => {
    setItems(prev => [...prev, "New Card"])
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

  return (
    <div className={styles.main} >
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
        <div className="titleImg">
          <img src={moreHoriz} alt="dot image" />
        </div>
      </div>
      <div className={styles.cardsList}>
        <CardListComponent cards={items}/>
      </div>
      <div className={styles.footer}>
        <div className={styles.left}>
          <button onClick={addItems} className={styles.leftButton}>
            <div className={styles.leftLogo}>
              <img src={add} alt="add image" />
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