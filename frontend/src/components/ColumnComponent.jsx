import styles from './ColumnComponent.module.css';
import moreHoriz from '../assets/more_horiz.png';
import add from '../assets/add.png';
import featuredLogo from '../assets/featured_play_list.png';
import CardListComponent from './CardListComponent';
import { useState } from 'react';

function ColumnComponent({title}) {

  const [items, setItems] = useState(["Card Text", "Another text", "Third one"]);

  const addItems = () => {
    setItems(prev => [...prev, "New Card"])
  }

  return (
    <div className={styles.main} >
      <div className={styles.titleContainer}>
        <div className={styles.title}>
          {title}
        </div>
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