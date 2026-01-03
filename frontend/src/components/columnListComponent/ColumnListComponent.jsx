import ColumnComponent from "../columnComponent/ColumnComponent";
import styles from './ColumnListComponent.module.css';
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useMemo } from "react";

function ColumnListComponent({
  columns, 
  deleteColumn, 
  copyColumn, 
  updateColumnItems, 
  updateColumnColor, 
  updateColumnTitle, 
  colorList, 
  updateColorList,
  deleteColorFromList,
  addColorToList
  }) {

  // Memoize the items array to prevent unnecessary re-renders
  const columnIds = useMemo(() => columns.map(col => col.id), [columns]);

  return (
    <>
      <div className={styles.main}>
        <ul className={styles.list}>
          <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
            {columns.map((elem) => (
              <li className={styles.elem} key={elem.id}>
                <ColumnComponent 
                  column={elem} 
                  key={elem.id} 
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
              </li>
            ))}
          </SortableContext>
          
        </ul> 
      </div>
    </>
  )
}

export default ColumnListComponent;