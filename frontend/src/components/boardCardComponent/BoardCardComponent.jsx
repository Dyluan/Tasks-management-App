import styles from './BoardCard.module.css';

function BoardCardComponent({backgroundColor, title}) {
  return (
    <div className={styles.main}>
      <div 
        className={styles.top}
        style={{background: backgroundColor}}  
      ></div>
      <div className={styles.line}></div>
      <div className={styles.bottom}>
        <div className={styles.title}>
          {title}
        </div>
      </div>
    </div>
  )
}

export default BoardCardComponent;