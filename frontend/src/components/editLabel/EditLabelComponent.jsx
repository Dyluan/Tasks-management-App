import styles from './EditLabel.module.css';
import previousIcon from '../../assets/previous_icon.svg';
import closeIcon from '../../assets/close_icon.png';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

function EditLabelComponent({color, onClose, handleColorChange, toggleEditButton}) {

  const colorList = [
  // Rouges
  "#e53935",
  "#b11226",
  "#6d071a",
  // Oranges & jaunes
  "#fb8c00",
  "#ff6f61",
  "#fdd835",
  "#c9a227",
  // Verts
  "#cddc39",
  "#43a047",
  "#2ecc71",
  "#808000",
  // Turquoises & cyans
  "#1abc9c",
  "#00acc1",
  // Bleus
  "#81d4fa",
  "#1e88e5",
  "#4169e1",
  "#0d47a1",
  "#3f51b5",
  // Violets & roses
  "#8e24aa",
  "#6a1b9a",
  "#d81b60",
  "#e91e63",
  "#f48fb1",
  // Bruns & terres
  "#8d6e63",
  "#5d4037",
  "#cc7722",
  "#d2b48c",
  // Gris
  "#bdbdbd",
  "#616161"
  ];

  // TODO:
  // add a function to modify the text of the label after closing/ saving modal
  const [labelText, setLabelText] = useState(color.text);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.previousContainer}>
          <img src={previousIcon} alt="previous" onClick={toggleEditButton} />
        </div>
        <div className={styles.title}>
          Edit Label
        </div>
        <div className={styles.closeContainer}>
          <img src={closeIcon} alt="close" onClick={onClose} />
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.selectedColor}>
          <button 
            className={styles.color} 
            style={{backgroundColor: color.color}}
          >
            {labelText}
          </button>
        </div>
        <div className={styles.titleContainer}>
          <div className={styles.labelTitle}>
            Title
          </div>
          <div className={styles.labelInputContainer}>
            <TextField 
              className={styles.labelInput}
              variant='outlined' 
              size='small' 
              onChange={(e) => setLabelText(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.colorsContainer}>
          <div className={styles.selectColorTitle}>
            Select a color
          </div>
          <div className={styles.colorsContainer}>
            <ul>
              {colorList.map((color) => (
                <li>
                  <button 
                    className={styles.colorButton} 
                    style={{backgroundColor: color}}
                    onClick={() => handleColorChange(color)}
                  >
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditLabelComponent;