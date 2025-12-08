import ColumnListComponent from "../columnListComponent/ColumnListComponent";
import { useState } from "react";
import styles from "./Board.module.css";
import add from '../../assets/add_white.png';
import { v4 as uuidv4 } from 'uuid';
import { closestCorners, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensors, useSensor } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

function BoardComponent() {

  const [columns, setColumns] = useState([
    {id: uuidv4(), title: "Done"}, 
    {id: uuidv4(), title: "To Do"}
    ]);

  const addColumn = () => {
    setColumns(prev => [...prev, {title: "New column", id: uuidv4()}]);
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      }
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <p>My Board</p>
      </div>
      <div className={styles.main}>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
          <ColumnListComponent columns={columns} deleteColumn={deleteColumn} />
        </DndContext>
        <p>
          <button className={styles.addButton} onClick={addColumn}>
            <div className={styles.buttonImg}><img src={add} alt="add" /></div>
            <div className={styles.buttonText}>Add another list</div>
          </button>
        </p>
      </div>
    </div>
  )
}

export default BoardComponent;