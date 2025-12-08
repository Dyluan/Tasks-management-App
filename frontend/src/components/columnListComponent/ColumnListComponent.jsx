import ColumnComponent from "../columnComponent/ColumnComponent";
import styles from './ColumnListComponent.module.css';
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

function ColumnListComponent({columns, deleteColumn}) {

  return (
    <>
      <div className={styles.main}>
        <ul className={styles.list}>
          <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
            {columns.map((elem) => (
              <li className={styles.elem} key={elem.id}>
                <ColumnComponent column={elem} key={elem.id} deleteColumn={deleteColumn} />
              </li>
            ))}
          </SortableContext>
          
        </ul> 
      </div>
    </>
  )
}

export default ColumnListComponent;