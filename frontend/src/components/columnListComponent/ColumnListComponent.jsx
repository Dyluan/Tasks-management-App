import ColumnComponent from "../columnComponent/ColumnComponent";
import styles from './ColumnListComponent.module.css';
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

function ColumnListComponent({columns}) {

  return (
    <>
      <div className={styles.main}>
        <ul className={styles.list}>
          <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
            {columns.map((elem) => (
              <li className={styles.elem} key={elem.id}>
                <ColumnComponent column={elem} key={elem.id} />
              </li>
            ))}
          </SortableContext>
          
        </ul> 
      </div>
    </>
  )
}

export default ColumnListComponent;