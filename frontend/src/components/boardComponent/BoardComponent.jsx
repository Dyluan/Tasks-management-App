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
import Threads from "../threadsComponent/Threads";
import Balatro from "../balatroComponent/Balatro";
import Iridescence from '../iridescenceComponent/Iridescence';
import Beams from '../beamsComponent/Beams';

function BoardComponent() {

  const [anchorEl, setAnchorEl] = useState(null);
  const handlePopoverClose = () => setAnchorEl(null);
  const boardThemes = [
    {
      type: 'gradient',
      board: 'linear-gradient(135deg, #f6b365, #fda085)',
      header: 'linear-gradient(135deg, #f46b45, #eea849)',
    },
    {
      type: 'gradient',
      board: 'linear-gradient(to left, #bbd2c5, #536976, #292e49)',
      header: 'linear-gradient(to right, #1f2337, #292e49, #3a475a',
    },
    {
      type: 'gradient',
      board: 'linear-gradient(to left, #f7f8f8, #acbb78)',
      header: 'linear-gradient(to right, #7d8f4e, #acbb78, #cfd8b6)',
    },
    {
      type: 'gradient',
      board: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
      header: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
    },
    {
      type: 'gradient',
      board: 'linear-gradient(135deg, #43cea2, #185a9d)',
      header: 'linear-gradient(135deg, #1d2b64, #f8cdda)',
    },
    {
      type: 'gradient',
      board: 'linear-gradient(135deg, #ff512f, #dd2476)',
      header: 'linear-gradient(135deg, #cb2d3e, #ef473a)',
    },
    {
      type: 'gradient',
      board: 'linear-gradient(to left, #ffefba, #ffffff)',
      header: 'linear-gradient(to right, #f2d98b, #ffefba, #fff6d8)',
    },
    {
      type: 'gradient',
      board: 'linear-gradient(135deg, #56ab2f, #a8e063)',
      header: 'linear-gradient(135deg, #134e5e, #71b280)'
    },
    {
      type: 'gradient',
      board: 'linear-gradient(135deg, #e0eafc, #cfdef3)',
      header: 'linear-gradient(135deg, #373b44, #4286f4)'
    },
    {
      type: 'gradient',
      board: 'linear-gradient(135deg, #cfd9df, #e2ebf0)',
      header: 'linear-gradient(135deg, #005c97, #363795)'
    },
    {
      type: 'gradient',
      board: 'linear-gradient(135deg, #2c3e50, #bdc3c7)',
      header: 'linear-gradient(135deg, #000428, #004e92)'
    },
    {
      type: 'gradient',
      board: 'linear-gradient(135deg, #d7d2cc, #304352)',
      header: 'linear-gradient(135deg, #232526, #414345)'
    },
    {
      type: 'component',
      name: 'Threads',
      board: 'threads',
      header: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    },
    {
      type: 'component',
      name: 'Balatro',
      board: 'balatro',
      header: 'linear-gradient(135deg, #0a0e27, #1a1a2e)',
    },
    {
      type: 'component',
      name: 'Iridescence',
      board: 'iridescence',
      header: 'linear-gradient(to left, #bc4e9c, #f80759)',
    },
    {
      type: 'component',
      name: 'Beams',
      board: 'beams',
      header: 'linear-gradient(135deg, #0a0e27, #1a1a2e)'
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
    <div className={styles.container}>
      {boardTheme.type === 'component' && boardTheme.board === 'threads' && (
        <div className={styles.backgroundComponent}>
          <Threads 
            amplitude={3} 
            distance={0}
            enableMouseInteraction={false}
          />
        </div>
      )}
      {boardTheme.type === 'component' && boardTheme.board === 'balatro' && (
        <div className={styles.backgroundComponent}>
          <Balatro 
            color1="#1a1a2e"
            color2="#16213e"
            color3="#0f3460"
            spinRotation={-2.0}
            spinSpeed={7.0}
            contrast={3.5}
            lighting={0.3}
            mouseInteraction={false}
          />
        </div>
      )}
      {boardTheme.type === 'component' && boardTheme.board === 'iridescence' && (
        <div className={styles.backgroundComponent}>
          <Iridescence 
            color={[0.7, 0.6, 0.8]}
            mouseReact={false}
          />
        </div>
      )}
      {boardTheme.type === 'component' && boardTheme.board === 'beams' && (
        <div className={styles.backgroundComponent}>
          <Beams 
            beamWidth={3}
            beamHeight={25}
            beamNumber={12}
            lightColor="#ffffff"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={45}
          />
        </div>
      )}
      <div 
        className={styles.containerContent}
        style={{ 
          background: boardTheme.type === 'gradient' ? boardTheme.board : 'transparent'
        }}
      >
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
                          style={{ 
                            background: elem.type === 'gradient' ? elem.board : '#1a1a2e',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                          onClick={() => handleBoardColorChange(elem)}
                        >
                          {elem.type === 'component' && elem.board === 'threads' && (
                            <div style={{ position: 'absolute', inset: 0 }}>
                              <Threads amplitude={2} distance={0} enableMouseInteraction={false} />
                            </div>
                          )}
                          {elem.type === 'component' && elem.board === 'balatro' && (
                            <div style={{ position: 'absolute', inset: 0 }}>
                              <Balatro 
                                color1="#1a1a2e"
                                color2="#16213e"
                                color3="#0f3460"
                                mouseInteraction={false}
                              />
                            </div>
                          )}
                          {elem.type === 'component' && elem.board === 'iridescence' && (
                            <div style={{ position: 'absolute', inset: 0 }}>
                              <Iridescence color={[0.7, 0.6, 0.8]} mouseReact={false} />
                            </div>
                          )}
                          {elem.type === 'component' && elem.board === 'beams' && (
                            <div style={{ position: 'absolute', inset: 0 }}>
                              <Beams 
                                beamWidth={3}
                                beamHeight={25}
                                beamNumber={8}
                                lightColor="#ffffff"
                                speed={2}
                                noiseIntensity={1.75}
                                scale={0.2}
                                rotation={45}
                              />
                            </div>
                          )}
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
    </div>
  )
}

export default BoardComponent;