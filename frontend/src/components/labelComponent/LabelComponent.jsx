import styles from './LabelComponent.module.css';
import Popover from '@mui/material/Popover';
import { useState } from 'react';
import DisplayLabelsComponent from '../displayLabels/DisplayLabelsComponent';
import EditLabelComponent from '../editLabel/EditLabelComponent';

function LabelComponent({ open, anchorEl, onClose, toggleLabel, selectedLabels }) {

  // TODO:
  // colorList should live one level higher, in the CardComponent and the updates should take place there
  // as for now, the list of colors is independant of for each card
  const [colorList, setColorList] = useState([
    {id: 0, color: '#d6f5e3', text:''},
    {id: 1, color: '#f0f4b1', text:''},
    {id: 2, color: '#fde8b8', text:''},
    {id: 3, color: '#ffd1c1', text:''},
    {id: 4, color: '#f0d5fa', text:''},
    {id: 5, color: '#d6e4ff', text:''},
    {id: 6, color: '#cdeff7', text:''},
    {id: 7, color: '#e6e6e6', text:''}
  ]);

  const [selectedColorEdit, setSelectedColorEdit] = useState(null);
  const [isEditSelected, setIsEditSelected] = useState(false);

  const toggleEditButton = () => {
    setIsEditSelected(!isEditSelected);
  }

  const handleEditClick = (color) => {
    toggleEditButton();
    setSelectedColorEdit(color);
    console.log('Couleur sélectionnée: ', color);
  }

  const handleColorChange = (newColor) => {
    const updatedColor = { ...selectedColorEdit, color: newColor };
    setSelectedColorEdit(updatedColor);
    setColorList(colorList.map(color => 
      color.id === selectedColorEdit.id ? updatedColor : color
    ));
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      className={styles.mainContainer}
    >
      <div className={styles.main}>
        {!isEditSelected ? (
          <DisplayLabelsComponent 
            labels={colorList} 
            toggleLabel={toggleLabel} 
            handleEditClick={handleEditClick} 
            onClose={onClose} 
            selectedLabels={selectedLabels} 
          />
        ) : (
          <EditLabelComponent 
            onClose={onClose} 
            color={selectedColorEdit}
            handleColorChange={handleColorChange}
            toggleEditButton={toggleEditButton}
          />
        )}
        {/* <div className={styles.header}>
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
                    onClick={() => displayLabelBeingEdited(elem)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div> */}
      </div>
    </Popover>
  )
}

export default LabelComponent;