import ColumnListComponent from "../columnListComponent/ColumnListComponent";
import { useState, useRef, useEffect } from "react";
import styles from "./Board.module.css";
import add from '../../assets/add_white.png';
import { v4 as uuidv4 } from 'uuid';
import { closestCorners, DndContext, PointerSensor, TouchSensor, useSensors, useSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

function BoardComponent() {

  const [columns, setColumns] = useState([
    {
      id: uuidv4(), 
      title: "Done", 
      columnColor: '#f5f5f5', 
      items: [
        {id: uuidv4(), cardName: 'Card Text', comments:[], labels:[]}, 
        {id: uuidv4(), cardName: 'Another Card', comments:[], labels:[]}
      ]
    }, 
    {
      id: uuidv4(), 
      title: "To Do", 
      columnColor: '#f5f5f5', 
      items: [
        {id: uuidv4(), cardName: 'Card Text', comments:[], labels:[]}, 
        {id: uuidv4(), cardName: 'Another Card', comments:[], labels:[]}
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
    setColumns(prev => [...prev, {title: "New column", columnColor: '#f5f5f5', id: uuidv4(), items: [{id: uuidv4(), cardName: 'Card Text'}, {id: uuidv4(), cardName: 'Another Card'}]}]);
  }

  const copyColumn = (newTitle, newCardList, newColor) => {
    setColumns(prev => [...prev, {
      title: newTitle, 
      items: newCardList,
      columnColor: newColor,
      id: uuidv4()
    }]);
  }

  const deleteColumn = (idToRemove) => {
    setColumns(prev => prev.filter(column => column.id !== idToRemove));
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
      <div className={styles.header}>
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
          <ColumnListComponent columns={columns} deleteColumn={deleteColumn} copyColumn={copyColumn} />
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