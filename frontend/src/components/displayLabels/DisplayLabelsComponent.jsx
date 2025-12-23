import styles from './DisplayLabels.module.css';
import editIcon from'../../assets/edit_icon.svg';
import closeIcon from '../../assets/close_icon.png';

function DisplayLabelsComponent({labels, toggleLabel, handleEditClick, onClose, selectedLabels}) {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>Labels</div>
        <div className={styles.closeButton}>
          <button className={styles.closeButton} onClick={onClose}>
            <img src={closeIcon} alt="close" />
          </button>
        </div>
      </div>
      <div className={styles.line}></div>
      <div className={styles.labelColors}>
        <ul>
          {labels.map((elem) => (
            <li className={styles.labelElement} key={elem.id}>
              <input 
                type="checkbox" 
                name="elem" 
                id="elemInput" 
                checked={selectedLabels.includes(elem.color)}
                onChange={() => toggleLabel(elem.color)}
              />
              <button 
                style={{backgroundColor: elem.color}} 
                className={styles.colorButton} 
                onClick={() => toggleLabel(elem.color)}
              >
                
              </button>
              <div className={styles.editIconContainer}>
                <img 
                  src={editIcon} 
                  alt="edit" 
                  className={styles.editIcon} 
                  onClick={() => handleEditClick(elem)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default DisplayLabelsComponent;