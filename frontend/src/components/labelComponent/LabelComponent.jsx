import styles from './LabelComponent.module.css';
import Popover from '@mui/material/Popover';
import closeIcon from '../../assets/close_icon.png';
import editIcon from'../../assets/edit_icon.svg';
import { useState } from 'react';

function LabelComponent({ open, anchorEl, onClose, addLabel }) {

  const [colorList, setColorList] = useState([
    {id: 0, color: '#d6f5e3'},
    {id: 1, color: '#f0f4b1'},
    {id: 2, color: '#fde8b8'},
    {id: 3, color: '#ffd1c1'},
    {id: 4, color: '#f0d5fa'},
    {id: 5, color: '#d6e4ff'},
    {id: 6, color: '#cdeff7'},
    {id: 7, color: '#e6e6e6'}
  ]);
  const [editingColorId, setEditingColorId] = useState(null);
  const [newColor, setNewColor] = useState('');

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
            {colorList.map((elem) => (
              <li className={styles.labelElement} key={elem.id}>
                <input type="checkbox" name="elem" id="elemInput" onClick={() => addLabel(elem.color)}/>
                <button 
                  style={{backgroundColor: elem.color}} 
                  className={styles.colorButton} 
                  onClick={() => addLabel(elem.color)}
                ></button>
                <div className={styles.editIconContainer}>
                  <img 
                    src={editIcon} 
                    alt="edit" 
                    className={styles.editIcon} 
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Popover>
  )
}

export default LabelComponent;