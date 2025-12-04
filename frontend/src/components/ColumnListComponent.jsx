import ColumnComponent from "./ColumnComponent";
import styles from './ColumnListComponent.module.css';

function ColumnListComponent({columns}) {

  return (
    <>
      <div className={styles.main}>
        <ul className={styles.list}>
          {columns.map((elem, index) => (
            <li className={styles.elem} key={index}>
              <ColumnComponent title={elem}/>
            </li>
          ))}
        </ul> 
      </div>
    </>
  )
}

export default ColumnListComponent;