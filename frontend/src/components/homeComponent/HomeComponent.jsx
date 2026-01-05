import styles from './Home.module.css';
import BoardCardComponent from '../boardCardComponent/BoardCardComponent';

function HomeComponent () {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.workspaceTitle}>
          My Workspace  
        </div>
        <div className={styles.separatingLine}></div>
        <div className={styles.boardContainer}>
          <div className={styles.boardTitle}>
            Your boards
          </div>
          <div className={styles.boards}>
            {/* need to loop through the user's list of boards */}
            <BoardCardComponent
              title={"My Board"}
              backgroundColor={"linear-gradient(135deg, #f6b365, #fda085)"}
              isDefault={false}
            />
            <BoardCardComponent 
              isDefault={true} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeComponent;