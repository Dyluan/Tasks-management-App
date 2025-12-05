import styles from './CardComponent.module.css';
import trashIcon from '../assets/trash_icon.svg';

function CardComponent({card}) {

  const handleTrashClick = () => {
    console.log('Trash called!', card);
  }
  
  return (
    <>
      <div className={styles.main}>
        <div className={styles.left}>
          <p>{card.cardName}</p>
        </div>
        <div className={styles.right}>
          <img src={trashIcon} alt="bin" onClick={handleTrashClick}/>
        </div>
      </div>
    </>
  )
}

export default CardComponent;