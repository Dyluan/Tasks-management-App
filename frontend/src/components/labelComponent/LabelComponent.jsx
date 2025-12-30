import styles from './LabelComponent.module.css';
import Popover from '@mui/material/Popover';
import DisplayLabelsComponent from '../displayLabels/DisplayLabelsComponent';
import EditLabelComponent from '../editLabel/EditLabelComponent';

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
  deleteColorFromList
  }) {

  const handleEditClick = (color) => {
    toggleEditButton();
    updateSelectedLabelColor(color);
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
          />
        ) : (
          <EditLabelComponent 
            onClose={onClose} 
            color={selectedLabelColor}
            handleColorChange={handleColorChange}
            toggleEditButton={toggleEditButton}
            handleSaveLabel={handleSaveLabel}
            deleteColorFromList={deleteColorFromList}
          />
        )}
      </div>
    </Popover>
  )
}

export default LabelComponent;