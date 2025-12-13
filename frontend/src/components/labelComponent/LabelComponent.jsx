import styles from './LabelComponent.module.css';
import Popover from '@mui/material/Popover';
import closeIcon from '../../assets/close_icon.png';
import editIcon from'../../assets/edit_icon.svg';

function LabelComponent({ open, anchorEl, onClose }) {

  const colorList = [
    '#d6f5e3',
    '#f0f4b1',
    '#fde8b8',
    '#ffd1c1',
    '#f0d5fa',
    '#d6e4ff',
    '#cdeff7',
    '#e6e6e6'
  ];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      className={styles.mainContainer}
    >
      <div className={styles.main}>
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
            {colorList.map((elem, index) => (
              <li className={styles.labelElement} key={index}>
                <input type="checkbox" name="elem" id="elem" />
                <button style={{backgroundColor: elem}}></button>
                <img src={editIcon} alt="edit" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Popover>
  )
}

export default LabelComponent;