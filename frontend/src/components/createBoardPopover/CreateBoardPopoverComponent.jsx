import styles from './CreateBoardPopover.module.css';
import { TextField, Popover, Button } from '@mui/material';
import { useState } from 'react';
import closeIcon from '../../assets/close_icon.png';
import CheckIcon from '@mui/icons-material/Check';

import axios from 'axios';
import { useUser } from '../../context/UserContext';

function CreateBoardPopoverComponent({
  open,
  anchorEl,
  onClose, }) {

  const { user } = useUser();

  const [title, setTitle] = useState('');
  const [titleTouched, setTitleTouched] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [colorSelected, setColorSelected] = useState(null);
  const handleColorClick = (elem) => {
    setColorSelected(elem);
  };
  const handleSaveClick = async () => {
    // TODO: TO BE REMOVED!!
    const response = await axios.get('http://localhost:5500/workspace/all', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      params : {
        id: user.sub
      }
    });
    console.log('Workspaces:', response.data);
    
    // logic here
    setColorSelected(null);
    setTitle('');
    onClose();
  };
  const handleTitleBlur = () => {
    setTitleTouched(true);
    if (!title.trim()) {
      setTitleError('A board title is required');
    } else {
      setTitleError('');
    }
  };
  const boardThemes = [
    {
      board: 'linear-gradient(135deg, #f6b365, #fda085)',
      header: 'linear-gradient(135deg, #f46b45, #eea849)',
    },
    {
      board: 'linear-gradient(to left, #bbd2c5, #536976, #292e49)',
      header: 'linear-gradient(to right, #1f2337, #292e49, #3a475a',
    },
    {
      board: 'linear-gradient(to left, #f7f8f8, #acbb78)',
      header: 'linear-gradient(to right, #7d8f4e, #acbb78, #cfd8b6)',
    },
    {
      board: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
      header: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
    },
    {
      board: 'linear-gradient(135deg, #43cea2, #185a9d)',
      header: 'linear-gradient(135deg, #1d2b64, #f8cdda)',
    },
    {
      board: 'linear-gradient(135deg, #ff512f, #dd2476)',
      header: 'linear-gradient(135deg, #cb2d3e, #ef473a)',
    },
    {
      board: 'linear-gradient(to left, #ffefba, #ffffff)',
      header: 'linear-gradient(to right, #f2d98b, #ffefba, #fff6d8)',
    },
    {
      board: 'linear-gradient(135deg, #56ab2f, #a8e063)',
      header: 'linear-gradient(135deg, #134e5e, #71b280)'
    },
    {
      board: 'linear-gradient(135deg, #e0eafc, #cfdef3)',
      header: 'linear-gradient(135deg, #373b44, #4286f4)'
    },
    {
      board: 'linear-gradient(135deg, #cfd9df, #e2ebf0)',
      header: 'linear-gradient(135deg, #005c97, #363795)'
    },
    {
      board: 'linear-gradient(135deg, #2c3e50, #bdc3c7)',
      header: 'linear-gradient(135deg, #000428, #004e92)'
    },
    {
      board: 'linear-gradient(135deg, #d7d2cc, #304352)',
      header: 'linear-gradient(135deg, #232526, #414345)'
    }
  ];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            Create a new board
          </div>
          <div className={styles.right}>
            <button onClick={onClose}>
              <img src={closeIcon} alt="close" />
            </button>
          </div>
        </div>
        <div className={styles.boardColors}>
          <div className={styles.colorTitle}>
            Background
          </div>
          <ul>
            {boardThemes.map((elem,index) => (
              <li className={styles.boardColor} key={index}>
                <button
                  className={styles.colorButton}
                  style={{
                    background: elem.board
                  }}
                  onClick={() => handleColorClick(elem.board)}
                >
                  {colorSelected && colorSelected === elem.board && (
                    <CheckIcon 
                      sx={{
                        color: 'white'
                      }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.boardInput}>
          <div className={styles.boardInputTitle}>
            Board title
          </div>
          <TextField 
            size='small' 
            variant='outlined'
            sx={{
              width: '100%'
            }}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleTouched && !e.target.value.trim()) {
                setTitleError('A board title is required');
              } else if (titleTouched) {
                setTitleError('');
              }
            }}
            onBlur={handleTitleBlur}
            error={!!titleError}
            helperText={titleError}
          />
        </div>
        <div className={styles.createButtonContainer}>
          <Button 
            variant='contained'
            sx={{
              width: '100%',
              textTransform: 'none'
            }}
            disabled={title.trim().length === 0}
            onClick={handleSaveClick}
          >
            Create
          </Button>
        </div>
      </div>
    </Popover>
  )

}

export default CreateBoardPopoverComponent;