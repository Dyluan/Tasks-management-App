import { useState } from "react";
import ColumnComponent from "./ColumnComponent";
import styles from './ColumnListComponent.module.css';

function ColumnListComponent() {

  const [columns, setColumns] = useState([]);

  return (
    <>
      <div className={styles.main}>
        <ColumnComponent />
        <ColumnComponent />
        <ColumnComponent />
      </div>
    </>
  )
}

export default ColumnListComponent;