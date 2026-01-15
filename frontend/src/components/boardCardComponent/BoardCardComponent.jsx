import styles from './BoardCard.module.css';

function BoardCardComponent({
  backgroundColor='#f0f1f2', 
  title='Create new board', 
  isDefault=false, 
  onClick
  }) {
  return (
    <div className={styles.main} onClick={onClick}>
      {isDefault ? (
        <div 
          className={styles.defaultStyle}
          style={{background: backgroundColor}}
        >
          {title}
        </div>
      ) : (
        <>
          <div className={styles.top} style={{background: backgroundColor}}></div>
          <div className={styles.line}></div>
          <div className={styles.bottom}>
            <div className={styles.title}>
              {title}
            </div>
          </div>
        </>
      )}
      
    </div>
  )
}

export default BoardCardComponent;