import styles from './CardComponent.module.css';
import trashIcon from '../assets/trash_icon.svg';

function CardComponent({cardText = "Add some things", index}) {

  const handleTrashClick = () => {
    console.log('Trash called!', index);
  }
  return (
    <>
      <div className={styles.main}>
        <div className={styles.left}>
          <p>{cardText}</p>
        </div>
        <div className={styles.right}>
          <img src={trashIcon} alt="bin image" onClick={handleTrashClick}/>
        </div>
      </div>
    </>
  )
}

export default CardComponent;