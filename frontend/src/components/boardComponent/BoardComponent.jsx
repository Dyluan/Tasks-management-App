import ColumnListComponent from "../columnListComponent/ColumnListComponent";
import { useState, useRef, useEffect } from "react";
import styles from "./Board.module.css";
import add from '../../assets/add_white.png';
import verticalDots from '../../assets/vertical_dots.svg';
import closeIcon from '../../assets/close_icon.png';
import { v4 as uuidv4 } from 'uuid';
import { closestCorners, DndContext, PointerSensor, TouchSensor, useSensors, useSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Popover from '@mui/material/Popover';

function BoardComponent() {

  const [anchorEl, setAnchorEl] = useState(null);
  const handlePopoverClose = () => setAnchorEl(null);
  const boardThemes = [
    {
      board: 'linear-gradient(135deg, #f6b365, #fda085)',
      header: 'linear-gradient(135deg, #f46b45, #eea849)',
    },
    {
      board: 'linear-gradient(135deg, #ff6a88, #ff99ac)',
      header: 'linear-gradient(135deg, #e94057, #f27121)',
    },
    {
      board: 'linear-gradient(135deg, #f7971e, #ffd200)',
      header: 'linear-gradient(135deg, #f12711, #f5af19)',
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
      board: 'linear-gradient(135deg, #fbb034, #ffdd00)',
      header: 'linear-gradient(135deg, #f7971e, #ffd200)',
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
  const [boardTheme, setBoardTheme] = useState(boardThemes[0]);
  const [columns, setColumns] = useState([
    {
      id: uuidv4(), 
      title: "Done", 
      columnColor: '#f5f5f5', 
      items: [
        {id: uuidv4(), cardName: 'Card Text', comments:[], labels:[], description:''}, 
        {id: uuidv4(), cardName: 'Another Card', comments:[], labels:[], description:''}
      ]
    }, 
    {
      id: uuidv4(), 
      title: "To Do", 
      columnColor: '#f5f5f5', 
      items: [
        {id: uuidv4(), cardName: 'Card Text', comments:[], labels:[], description:''}, 
        {id: uuidv4(), cardName: 'Another Card', comments:[], labels:[], description:''}
      ]
    }
  ]);
  const [editingTitle, setEditingTitle] = useState(false);
  const [boardName, setBoardName] = useState('My Board');
  const prevBoardNameRef = useRef(boardName);
  const titleInputRef = useRef(null);
  
  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  const startEdit = () => {
    prevBoardNameRef.current = boardName;
    setEditingTitle(true);
  }

  function saveTitle(newTitle) {
    const trimmed = String(newTitle).trim();
    if (trimmed.length === 0) {
      setBoardName(prevBoardNameRef.current);
    } else {
      setBoardName(trimmed);
    }
    setEditingTitle(false);
  }

  function cancelEdit() {
    setBoardName(prevBoardNameRef.current);
    setEditingTitle(false);
  }

  function onTitleKeyDown(e) {
    if (e.key === 'Enter') saveTitle(e.target.value);
    if (e.key === 'Escape') cancelEdit();
  }

  const addColumn = () => {
    setColumns(prev => [...prev, {
      title: "New column", 
      columnColor: '#f5f5f5', 
      id: uuidv4(), 
      items: [
        {id: uuidv4(), cardName: 'Card Text'}, {id: uuidv4(), cardName: 'Another Card'}]}
      ]);
  }

  const copyColumn = (column) => {
    setColumns(prev => [
      ...prev,
      {
        ...column,
        id: uuidv4(),
        items: column.items.map(card => ({
          ...card,
          id: uuidv4(),
          comments: [...(card.comments ?? [])],
          labels: [...(card.labels ?? [])],
          description: card.description ?? ''
        }))
      }
    ]);
  };

  const updateColumnItems = (columnId, newItems) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === columnId
          ? { ...col, items: newItems }
          : col
      )
    );
  };

  const updateColumnColor = (columnId, newColor) => {
    setColumns(prev => 
      prev.map(col => 
        col.id === columnId
          ? {...col, columnColor: newColor}
          : col
      )
    );
  };

  const updateColumnTitle = (columnId, newTitle) => {
    setColumns(prev => 
      prev.map(col => 
        col.id === columnId
          ? { ...col, title: newTitle }
          : col
      )
    );
  };

  const deleteColumn = (idToRemove) => {
    setColumns(prev => prev.filter(column => column.id !== idToRemove));
  };

  const handleBoardColorChange = (newTheme) => {
    setBoardTheme(newTheme);
  }

  // this part of the code is relative to the dnd-kit library
  const getColumPosition = (id) => columns.findIndex(column => column.id === id);

  const handleDragEnd = (event) => {
    const {active, over} = event;
    if (active.id === over.id) return;

    setColumns((colums) => {
      const originalPos = getColumPosition(active.id);
      const newPos = getColumPosition(over.id);

      return arrayMove(columns, originalPos, newPos);
    })
  }

  // got rid of KeyboardSensor as it interferes with input writing (was not allowing space key to work properly)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      }
    }),
    useSensor(TouchSensor),
  );

  return (
    <div className={styles.container} style={{ background: boardTheme.board }}>
      <div className={styles.header} style={{ background: boardTheme.header }}>
        <div className={styles.edit}>
          <img 
            src={verticalDots} 
            alt="vertical dots" 
            onClick={(e) => setAnchorEl(e.currentTarget)}
          />
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <div className={styles.modalContainer}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>
                  Actions
                </div>
                <button 
                  className={styles.modalCloseButton} 
                  onClick={handlePopoverClose}>
                    <img src={closeIcon} alt="close" />
                </button>
              </div>
              <div className={styles.modalLine}></div>
              <div className={styles.modalMain}>
                <div className={styles.modalCards}>
                  <ul>
                    <li>
                      <button
                        onClick={() => {
                          handlePopoverClose();
                          startEdit();
                        }}
                      >Rename Board</button>
                    </li>
                    <li>
                      <button>
                        Create new Board
                      </button>
                    </li>
                  </ul>
                </div>
                <div className={styles.modalLine}></div>
                <div className={styles.modalColors}>
                  <div className={styles.modalColorsTitle}>
                    Edit Board color
                  </div>
                  <ul className={styles.modalColorsList}>
                    {boardThemes.map((elem, index) => (
                      <li className={styles.modalColorsElem} key={index}>
                        <button 
                          className={styles.modalColorButton} 
                          style={{ background: elem.board }}
                          onClick={() => handleBoardColorChange(elem)}
                        >
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Popover>
        </div>
        <div className={styles.title}>
          {editingTitle ? (
            <input 
              ref={titleInputRef}
              className={styles.titleInput}
              defaultValue={boardName}
              onKeyDown={onTitleKeyDown}
              onBlur={(e) => saveTitle(e.target.value)}
              aria-label='Edit board title'
            />
          ) : (
            <div className={styles.titleText} 
              onClick={startEdit}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEdit(); }}
            >
              {boardName}
            </div>
          )}
        </div>
      </div>
      <div className={styles.main}>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
          <ColumnListComponent 
            columns={columns} 
            deleteColumn={deleteColumn} 
            copyColumn={copyColumn}
            updateColumnItems={updateColumnItems}
            updateColumnColor={updateColumnColor}
            updateColumnTitle={updateColumnTitle}
          />
        </DndContext>
          <button className={styles.addButton} onClick={addColumn}>
            <div className={styles.buttonImg}><img src={add} alt="add" /></div>
            <div className={styles.buttonText}>Add another list</div>
          </button>
      </div>
    </div>
  )
}

export default BoardComponent;