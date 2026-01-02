import styles from './LabelComponent.module.css';
import Popover from '@mui/material/Popover';
import DisplayLabelsComponent from '../displayLabels/DisplayLabelsComponent';
import EditLabelComponent from '../editLabel/EditLabelComponent';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

function LabelComponent({ 
  open, 
  anchorEl, 
  onClose, 
  toggleLabel, 
  selectedLabels, 
  colorList, 
  updateColorList,
  openEditLabel,
  toggleEditButton,
  selectedLabelColor,
  updateSelectedLabelColor,
  deleteColorFromList,
  addColorToList
  }) {

  const [shouldEditComponentRenderCreateButton, setShouldEditComponentRenderCreateButton] = useState(false);

  const handleEditClick = (color) => {
    setShouldEditComponentRenderCreateButton(false);
    toggleEditButton();
    updateSelectedLabelColor(color);
  }

  const handleCreateButtonClick = () => {
    const defaultColorForCreateDisplay = {
      id: uuidv4(),
      color: '#bdbdbd',
      text: ''
    }
    setShouldEditComponentRenderCreateButton(true);
    updateSelectedLabelColor(defaultColorForCreateDisplay);
    toggleEditButton();
  }

  const handleColorChange = (newColor) => {
    const updatedColor = { ...selectedLabelColor, color: newColor };
    updateSelectedLabelColor(updatedColor);
    updateColorList(selectedLabelColor, updatedColor);
  }

  const handleSaveLabel = (newText) => {
    const updatedColor = { ...selectedLabelColor, text: newText };
    updateSelectedLabelColor(updatedColor);
    updateColorList(selectedLabelColor, updatedColor);
    toggleEditButton();
  }

  const handleCreateLabel = (newText) => {
    const newColor = { ...selectedLabelColor, text: newText };
    addColorToList(newColor);
    toggleEditButton();
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
        {!openEditLabel ? (
          <DisplayLabelsComponent 
            labels={colorList} 
            toggleLabel={toggleLabel} 
            handleEditClick={handleEditClick} 
            onClose={onClose} 
            selectedLabels={selectedLabels} 
            handleCreateButtonClick={handleCreateButtonClick}
          />
        ) : (
          <EditLabelComponent 
            onClose={onClose} 
            color={selectedLabelColor}
            handleColorChange={handleColorChange}
            toggleEditButton={toggleEditButton}
            handleSaveLabel={handleSaveLabel}
            deleteColorFromList={deleteColorFromList}
            shouldEditComponentRenderCreateButton={shouldEditComponentRenderCreateButton}
            handleCreateLabel={handleCreateLabel}
          />
        )}
      </div>
    </Popover>
  )
}

export default LabelComponent;