import ColumnListComponent from "../columnListComponent/ColumnListComponent";
import DeleteModalComponent from "../deleteModalComponent/DeleteModalComponent";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Board.module.css";
import add from '../../assets/add_white.png';
import verticalDots from '../../assets/vertical_dots.svg';
import closeIcon from '../../assets/close_icon.png';
import leftArrow from '../../assets/left_arrow.svg';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import { v4 as uuidv4 } from 'uuid';
import { closestCorners, DndContext, PointerSensor, TouchSensor, useSensors, useSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Popover from '@mui/material/Popover';
import Drawer from '@mui/material/Drawer';
import Threads from "../threadsComponent/Threads";
import Balatro from "../balatroComponent/Balatro";
import Iridescence from '../iridescenceComponent/Iridescence';
import Beams from '../beamsComponent/Beams';
import { List } from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useApp } from "../../context/AppContext";
import axios from "axios";

function BoardComponent() {

  const server_url = process.env.REACT_APP_SERVER_URL;

  const { getBoard, updateBoard } = useApp();
  const { id } = useParams();
  const [board, setBoard] = useState({});
  const token = localStorage.getItem('jwt');

  const [nbOfColumns, setNbOfColumns] = useState(0);

  const [columns, setColumns] = useState([]);

  // labels list
  // empty for now as they are fetched from server
  const [colorList, setColorList] = useState([]);

  const newColumn = async() => {
    const response = await axios.post(`${server_url}/boards/${id}/columns/new`, 
      { position: nbOfColumns+1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
     
    // Return the new column data from server
    return response.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${server_url}/boards/${id}/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const boardData = response.data;
      console.log('My BIG DATA:', boardData);
      
      // Set board data
      setBoard({
        id: boardData.id,
        name: boardData.name,
        colors: boardData.colors,
        created_at: boardData.created_at
      });

      // Map columns and cards to the component's expected structure
      const mappedColumns = boardData.columns.map(column => ({
        id: column.id,
        title: column.name,
        columnColor: column.color,
        position: column.position,
        items: column.cards.map(card => ({
          id: card.id,
          cardName: card.title,
          description: card.description || '',
          comments: card.comments || [],
          labels: [], // Initialize with empty labels array
          position: card.position
        }))
      }));

      setColumns(mappedColumns);
      setNbOfColumns(mappedColumns.length);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const getLabels = async() => {
      const response = await axios.get(`${server_url}/boards/${id}/labels`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const labels = response.data;
      setColorList(labels);
    };

    getLabels();
  }, [id])

  // takes 2 args: name and colors, and sends the request with appropriate data
  // allows me to either change the name or the color or both
  const saveChanges = async({name=boardName, colors=boardTheme}) => {
    const response = await axios.patch(`${server_url}/boards/${board.id}`, 
      {
        name: name,
        colors: colors
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      });
    
    // Update the boards state in AppContext
    updateBoard(board.id, { name, colors });
  };

  const updateColumn = async(column_id, updates) => {
    const response = await axios.patch(`${server_url}/boards/column/${column_id}`, 
      updates,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = response.data;
  };

  const deleteColumnFromServer = async(column_id) => {
    await axios.delete(`${server_url}/boards/column/${column_id}`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handlePopoverClose = () => setAnchorEl(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const handleDeleteModalOpen = () => setOpenDeleteModal(true);
  const handleDeleteModalClose = () => setOpenDeleteModal(false);

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
      header: 'linear-gradient(to left, #800080, #ffc0cb)',
    },
    {
      type: 'component',
      name: 'Beams',
      board: 'beams',
      header: 'linear-gradient(135deg, #0a0e27, #1a1a2e)'
    }
  ];
  const [boardTheme, setBoardTheme] = useState(boardThemes[0]);

  useEffect(() => {
    if (board.colors) {
      setBoardTheme(board.colors);
    }
  }, [board.colors]);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => {
    setIsDrawerOpen(newOpen);
  }

  const handleHomeClick = () => {
    const homePath = "/home";
    navigate(homePath);
  }

  const handleLoginClick = () => {
    const loginPath = '/login';
    navigate(loginPath);
  }

  const drawerList = (
    <List>
      <ListItemButton onClick={() => handleHomeClick()}>
        <ListItemIcon>
          <HomeIcon sx={{ color: 'white' }} />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <GroupAddIcon sx={{ color: 'white' }} />
        </ListItemIcon>
        <ListItemText primary="Add members" />
      </ListItemButton>
      <ListItemButton onClick={() => handleLoginClick()}>
        <ListItemIcon>
          <LoginIcon sx={{ color: 'white' }} />
        </ListItemIcon>
        <ListItemText primary="Login" />
      </ListItemButton>
      <ListItemButton onClick={handleDeleteModalOpen}>
        <ListItemIcon>
          <DeleteIcon sx={{ color: 'white' }} />
        </ListItemIcon>
        <ListItemText primary="Delete Board" />
      </ListItemButton>
    </List>
  )

  // update the labels color
  const updateColorList = (selectedColorEdit, updatedColor) => {
    const oldColor = selectedColorEdit.color;
    const newColor = updatedColor.color;
    
    setColorList(prev => prev.map(color => 
      color.id === selectedColorEdit.id ? updatedColor : color
    ));
    
    // Update all cards in all columns that use the old color
    setColumns(prev => 
      prev.map(col => ({
        ...col,
        items: col.items.map(card => ({
          ...card,
          labels: (card.labels ?? []).map(label => 
            label === oldColor ? newColor : label
          )
        }))
      }))
    );
  };

  // delete color from labels
  const deleteColorFromList = async (id) => {
    const colorToDelete = colorList.find(color => color.id === id);

    if (colorToDelete) {
      // Remove the color from colorList
      setColorList(prev => prev.filter(color => color.id !== id));
      
      // Remove the color from all card labels
      setColumns(prev => 
        prev.map(col => ({
          ...col,
          items: col.items.map(card => ({
            ...card,
            labels: (card.labels ?? []).filter(label => label.id !== colorToDelete.id)
          }))
        }))
      );
      // removes the color from the server as well
      await axios.delete(`${server_url}/boards/labels/${id}`, {
        data: { board_id: board.id },
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  };

  // add color to labels
  const addColorToList = async (newColor) => {
    // create label on server first and get the real ID
    const response = await axios.post(`${server_url}/boards/${board.id}/labels`, 
      { text: newColor.text, color: newColor.color },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // use the server-generated label (with real ID) to update state
    const serverLabel = response.data;
    setColorList(prev => [...prev, serverLabel]);
  };
  
  // Ref to track columns for collision detection
  const columnsRef = useRef(columns);
  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);
  
  const [editingTitle, setEditingTitle] = useState(false);
  const [boardName, setBoardName] = useState('My Board');
  const prevBoardNameRef = useRef(boardName);
  const titleInputRef = useRef(null);

  // updates board title with data from backend
  useEffect(() => {
    if (board.name) {
      setBoardName(board.name);
    }
  }, [board.name]);
  
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

  const saveTitle = async (newTitle) => {
    const trimmed = String(newTitle).trim();
    if (trimmed.length === 0) {
      setBoardName(prevBoardNameRef.current);
    } else {
      setBoardName(trimmed);
      // calling server to change the name
      saveChanges({name: trimmed});
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

  const addColumn = async () => {
    // First create the column on the server
    const newColumnData = await newColumn();
    
    // Then add it to state
    setColumns(prev => [...prev, {
      id: newColumnData.id,
      title: newColumnData.name,
      columnColor: newColumnData.color,
      position: newColumnData.position,
      items: []
    }]);
    
    setNbOfColumns(prev => prev + 1);
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

  // TODO:
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
    // updates the column color server side
    updateColumn(columnId, { color: newColor });
  };

  const updateColumnTitle = (columnId, newTitle) => {
    setColumns(prev => 
      prev.map(col => 
        col.id === columnId
          ? { ...col, title: newTitle }
          : col
      )
    );
    // updates the column title server side
    updateColumn(columnId, { name: newTitle });
  };

  const deleteColumn = (idToRemove) => {
    setColumns(prev => prev.filter(column => column.id !== idToRemove));
    deleteColumnFromServer(idToRemove);
  };

  const handleBoardColorChange = (newTheme) => {
    setBoardTheme(newTheme);
    saveChanges({colors: newTheme});
  }

  // this part of the code is relative to the dnd-kit library
  function findContainer(id) {
    // Check if id is a column
    if (columns.some(col => col.id === id)) {
      return id;
    }
    
    // Check if id is a card - return its parent column id
    for (const column of columns) {
      if (column.items.some(item => item.id === id)) {
        return column.id;
      }
    }
    return null;
  }

  // Custom collision detection that handles nested sortables
  // When dragging a column, only detect collisions with other columns
  function customCollisionDetection(args, columnsRef) {
    const { active } = args;
    const columns = columnsRef.current;
    
    // Check if we're dragging a column
    const isColumnDrag = columns.some(col => col.id === active.id);
    
    if (isColumnDrag) {
      // For columns, filter droppableContainers to only include other columns
      const columnIds = new Set(columns.map(col => col.id));
      const filteredArgs = {
        ...args,
        droppableContainers: args.droppableContainers.filter(
          container => columnIds.has(container.id)
        )
      };
      return closestCorners(filteredArgs);
    }
    
    // For cards, use default behavior
    return closestCorners(args);
  }

  function isColumn(id) {
    return columns.some(col => col.id === id);
  }

  const handleDragOver = (event) => {
    const { active, over } = event;
    const overId = over?.id;
    const activeId = active?.id;

    if (!overId || activeId === overId) return;

    // Skip if we're dragging a column - columns are handled in handleDragEnd only
    if (isColumn(activeId)) return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) return;

    // Handle card movement between columns
    setColumns((prev) => {
      const activeCol = prev.find(col => col.id === activeContainer);
      const overCol = prev.find(col => col.id === overContainer);

      if (!activeCol || !overCol) return prev;

      const activeItems = [...activeCol.items];
      const overItems = [...overCol.items];

      const activeIndex = activeItems.findIndex(item => item.id === activeId);
      const overIndex = overItems.findIndex(item => item.id === overId);

      let newIndex;
      if (isColumn(overId)) {
        // Dropping on column itself - add to end
        newIndex = overItems.length;
      } else {
        // Dropping on a card - insert at that position
        newIndex = overIndex >= 0 ? overIndex : overItems.length;
      }

      // Remove from active column and add to over column
      const [movedCard] = activeItems.splice(activeIndex, 1);
      overItems.splice(newIndex, 0, movedCard);

      return prev.map(col => {
        if (col.id === activeContainer) {
          return { ...col, items: activeItems };
        }
        if (col.id === overContainer) {
          return { ...col, items: overItems };
        }
        return col;
      });
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Dragging columns - check this first and handle separately
    if (isColumn(activeId)) {
      // For columns, we need overIndex to be the column index
      // overId could be a column OR a card inside that column
      let overColumnId = overId;
      if (!isColumn(overId)) {
        // If dropping on a card, get its parent column
        overColumnId = findContainer(overId);
      }
      
      const activeIndex = columns.findIndex(col => col.id === activeId);
      const overIndex = columns.findIndex(col => col.id === overColumnId);
      
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const reorderedColumns = arrayMove(columns, activeIndex, overIndex);
        
        // Update local state with new positions
        const updatedColumns = reorderedColumns.map((col, index) => ({
          ...col,
          position: index + 1  // positions are 1-based
        }));
        setColumns(updatedColumns);
        
        // Send updated positions to server for all affected columns
        const minIndex = Math.min(activeIndex, overIndex);
        const maxIndex = Math.max(activeIndex, overIndex);
        for (let i = minIndex; i <= maxIndex; i++) {
          updateColumn(updatedColumns[i].id, { position: updatedColumns[i].position });
        }
      }
      return;
    }

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    // Dragging cards within same column
    if (activeContainer && overContainer && activeContainer === overContainer) {
      setColumns((prev) => {
        return prev.map(col => {
          if (col.id === activeContainer) {
            const activeIndex = col.items.findIndex(item => item.id === activeId);
            const overIndex = col.items.findIndex(item => item.id === overId);
            
            if (activeIndex !== -1 && overIndex !== -1) {
              return {
                ...col,
                items: arrayMove(col.items, activeIndex, overIndex)
              };
            }
          }
          return col;
        });
      });
    }
    // Note: Cross-column moves are already handled in handleDragOver
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
      {/* cool modal to delete board */}
      <DeleteModalComponent 
        open={openDeleteModal}
        onClose={handleDeleteModalClose}
        board={board}
      />
      {boardTheme.type === 'component' && boardTheme.board === 'threads' && (
        <div className={styles.backgroundComponent}>
          <Threads 
            amplitude={2} 
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
        <div className={styles.left}>
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
                                  isRotate={false}
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
        <div className={styles.right}>
          <div className={styles.drawerContainer}>
            <img 
              src={leftArrow} 
              alt="left Icon" 
              onClick={() => toggleDrawer(true)}
            />
          </div>
        </div>
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => toggleDrawer(false)}
          sx={{
            '.MuiPaper-root': {
              background: boardTheme.header,
              color: "white",
              fontFamily: "Noto-Sans"
            }
          }}
        >
          {drawerList}
        </Drawer>
      </div>
      <div className={styles.main}>
        <DndContext 
          sensors={sensors} 
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd} 
          collisionDetection={(args) => customCollisionDetection(args, columnsRef)}
        >
          <ColumnListComponent 
            columns={columns} 
            deleteColumn={deleteColumn} 
            copyColumn={copyColumn}
            updateColumnItems={updateColumnItems}
            updateColumnColor={updateColumnColor}
            updateColumnTitle={updateColumnTitle}
            colorList={colorList}
            updateColorList={updateColorList}
            deleteColorFromList={deleteColorFromList}
            addColorToList={addColorToList}
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