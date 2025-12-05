import ColumnListComponent from "./ColumnListComponent";
import { useState } from "react";
import styles from "./Board.module.css";
import add from '../assets/add_white.png';

function BoardComponent() {

  const [columns, setColumns] = useState(["Done", "To Do"]);

  const addColumn = () => {
    setColumns(prev => [...prev, "New column"]);
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <p>My Board</p>
      </div>
      <div className={styles.main}>
        <ColumnListComponent columns={columns} />
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