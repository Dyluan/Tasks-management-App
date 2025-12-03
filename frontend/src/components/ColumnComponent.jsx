import styles from './ColumnComponent.module.css';
import moreHoriz from '../assets/more_horiz.png';
import add from '../assets/add.png';
import featuredLogo from '../assets/featured_play_list.png';
import CardComponent from './CardComponent';

function ColumnComponent() {
  return (
    <div className={styles.main} >
      <div className={styles.titleContainer}>
        <div className={styles.title}>
          Title
        </div>
        <div className="titleImg">
          <img src={moreHoriz} alt="dot image" />
        </div>
      </div>
      <CardComponent cardText='Card Text' />
      <div className={styles.footer}>
        <div className={styles.left}>
          <div className={styles.leftLogo}>
            <img src={add} alt="add image" />
          </div>
          <div className={styles.leftText}>Add a card</div>
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