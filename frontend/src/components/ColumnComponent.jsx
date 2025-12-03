import styles from './ColumnComponent.module.css';

function ColumnComponent() {
  return (
    <div className={styles.main} >
      <div className={styles.title}>Title</div>
      <p>I am a column! hello</p>
    </div>
  )
}

export default ColumnComponent;