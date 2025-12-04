import styles from './CardComponent.module.css';

function CardComponent({cardText = "Add some things"}) {
  return (
    <>
      <div className={styles.main}>
        <p>{cardText}</p>
      </div>
    </>
  )
}

export default CardComponent;