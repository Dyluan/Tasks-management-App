import styles from './LabelComponent.module.css';
import Popover from '@mui/material/Popover';
import { useState } from 'react';
import DisplayLabelsComponent from '../displayLabels/DisplayLabelsComponent';
import EditLabelComponent from '../editLabel/EditLabelComponent';

function LabelComponent({ open, anchorEl, onClose, toggleLabel, selectedLabels, colorList, updateColorList }) {

  const [selectedColorEdit, setSelectedColorEdit] = useState(null);
  const [isEditSelected, setIsEditSelected] = useState(false);

  const toggleEditButton = () => {
    setIsEditSelected(!isEditSelected);
  }

  const handleEditClick = (color) => {
    toggleEditButton();
    setSelectedColorEdit(color);
  }

  const handleColorChange = (newColor) => {
    const updatedColor = { ...selectedColorEdit, color: newColor };
    setSelectedColorEdit(updatedColor);
    updateColorList(selectedColorEdit, updatedColor);
  }

  const handleSaveLabel = (newText) => {
    const updatedColor = { ...selectedColorEdit, text: newText };
    setSelectedColorEdit(updatedColor);
    updateColorList(selectedColorEdit, updatedColor);
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
            handleSaveLabel={handleSaveLabel}
          />
        )}
      </div>
    </Popover>
  )
}

export default LabelComponent;