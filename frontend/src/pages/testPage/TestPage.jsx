import styles from './Test.module.css';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useApp } from '../../context/AppContext';

function TestPage() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`${styles.app} ${darkMode ? styles.dark : styles.light}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <span className="material-icons-round">dashboard</span>
            </div>
            <span className={styles.logoText}>FlowState</span>
          </div>
          <nav className={styles.nav}>
            <button className={styles.navButton}>
              Workspaces <span className="material-icons-round">expand_more</span>
            </button>
            <button className={styles.navButton}>
              Recent <span className="material-icons-round">expand_more</span>
            </button>
            <button className={styles.navButton}>
              Starred <span className="material-icons-round">expand_more</span>
            </button>
            <button className={styles.navButton}>
              Templates <span className="material-icons-round">expand_more</span>
            </button>
            <button className={styles.createButton}>Create</button>
          </nav>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.searchContainer}>
            <span className={`material-icons-round ${styles.searchIcon}`}>search</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search boards, tasks..."
            />
          </div>
          <button className={styles.iconButton}>
            <span className="material-icons-round">notifications</span>
          </button>
          <button className={styles.iconButton} onClick={toggleDarkMode}>
            <span className="material-icons-round">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <div className={styles.avatar}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuACS_hY1i_mHb6rAUvTjRzMoidepVDPNas8ZFV0O5BVhgtZsL_vTWqW39YIbwvsG6hl80mpn08d__RwqCQM7zBlCycmt0OP3dA-9d1XVaGICwTMEUswTOd0KMGaKV9QQlP2KYysqbfh1arlUJBusJn1b8zKz8GOEVc2UdniG-mwzM8V-Ec53uACCC3Vk0rASsxdkq27eU2sy3K4nwguC2OmnmpI8VxWhmJ882_SZ5FG3SKFQAXBEtsjQZ8F7Cr-V7MceX_zYXWOM7A4"
              alt="User Profile"
            />
          </div>
        </div>
      </header>

      <div className={styles.mainContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            {/* Workspaces Section */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sectionTitle}>Your Workspaces</h3>
              <div className={styles.sectionItems}>
                <a href="#" className={`${styles.workspaceItem} ${styles.active}`}>
                  <div className={styles.workspaceItemLeft}>
                    <div className={`${styles.workspaceIcon} ${styles.indigo}`}>E</div>
                    <span>EUHEUEHUEHUE</span>
                  </div>
                  <span className="material-icons-round">settings</span>
                </a>
                <a href="#" className={styles.workspaceItem}>
                  <div className={styles.workspaceItemLeft}>
                    <div className={`${styles.workspaceIcon} ${styles.emerald}`}>P</div>
                    <span>Pioupiu Labs</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Shortcuts Section */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sectionTitle}>Shortcuts</h3>
              <div className={styles.sectionItems}>
                <a href="#" className={styles.shortcutItem}>
                  <span className="material-icons-round">dashboard</span>
                  <span>Boards</span>
                </a>
                <a href="#" className={styles.shortcutItem}>
                  <span className="material-icons-round">auto_awesome_motion</span>
                  <span>Templates</span>
                </a>
                <a href="#" className={styles.shortcutItem}>
                  <span className="material-icons-round">trending_up</span>
                  <span>Activity</span>
                </a>
              </div>
            </div>

            {/* Starred Boards Section */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sectionTitle}>Starred Boards</h3>
              <div className={styles.sectionItems}>
                <a href="#" className={styles.starredItem}>
                  <div className={`${styles.starredDot} ${styles.blue}`}></div>
                  <span>Design System</span>
                </a>
                <a href="#" className={styles.starredItem}>
                  <div className={`${styles.starredDot} ${styles.purple}`}></div>
                  <span>Marketing Q4</span>
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          <div className={styles.mainContent}>
            {/* Workspace Header */}
            <div className={styles.workspaceHeader}>
              <div className={styles.workspaceInfo}>
                <div className={styles.workspaceLogo}>E</div>
                <div className={styles.workspaceDetails}>
                  <div className={styles.workspaceTitleRow}>
                    <h1 className={styles.workspaceTitle}>EUHEUEHUEHUE</h1>
                    <button className={styles.editButton}>
                      <span className="material-icons-round">edit</span>
                    </button>
                  </div>
                  <div className={styles.workspaceMeta}>
                    <span className={styles.metaItem}>
                      <span className="material-icons-round">lock</span> Private Workspace
                    </span>
                    <span className={styles.metaDivider}>•</span>
                    <span>12 Boards</span>
                  </div>
                </div>
              </div>
              <div className={styles.workspaceActions}>
                <button className={styles.actionButton}>
                  <span className="material-icons-round">person_add</span> Invite
                </button>
                <button className={styles.actionButton}>
                  <span className="material-icons-round">settings</span> Settings
                </button>
              </div>
            </div>

            <hr className={styles.divider} />

            {/* Recently Viewed Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className="material-icons-round">history</span>
                <h2>Recently Viewed</h2>
              </div>
              <div className={styles.boardGrid}>
                <div className={styles.recentCard}>
                  <div className={styles.recentCardImage}>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUZfJSjX_Bx_4x6CZaBeNhfdyTNrRAthlFTNs0QC3SC6BCDukSh7CxFxxMFdAOcw8BEM6ajjkSJxzfqWr0xzC6WiGLYs14ySQLAeSs4-TUei0-DaZ_bFWshigpxWmyPrPCTK0QpuG3ybh9iKmy5VZocW-rOwOz2uZpwP3k1u9YKZIg9BsDcFt-WjDG7JuIhF9BeRwhZLC6DJbdJDqcrgJ9dnMlzigseZ8GDYgD1Vliqlc5pVwM2ZgTwnZ6CMJTLdG1WVHEUn_gzG7N"
                      alt="Abstract gradient"
                    />
                    <div className={styles.cardOverlay}></div>
                    <button className={styles.starButton}>
                      <span className="material-icons-round">star_outline</span>
                    </button>
                  </div>
                  <p className={styles.recentCardTitle}>Brand Identity 2024</p>
                  <p className={styles.recentCardSubtitle}>EUHEUEHUEHUE</p>
                </div>
                <div className={styles.recentCard}>
                  <div className={styles.recentCardImage}>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkqJcBPHx3m3cTNhw3IuGdtiOnkQtr2hjbPmZZSsjBzQdXhBqSYwh8X_949U-Hk91xcuFf6e3SdxqUHMfd2S4JJdXcqhqF4c0JX13sk1OM8kTX_ilun2jPOsyDqmYcFY23LenQlof78iAk13qYTBeG5OofnEOk3PP9dGjy5rTIte_XAIyAprIcXDRcZnY0aNvQzccJcLl695T3284U3JjsuC5KqD8xncglO5DKLEEp6P7SVA3esiN1keJxxYl6aZrbKnPGmsCqLaJN"
                      alt="Colorful abstract"
                    />
                    <div className={styles.cardOverlay}></div>
                    <button className={styles.starButton}>
                      <span className="material-icons-round">star_outline</span>
                    </button>
                  </div>
                  <p className={styles.recentCardTitle}>Product Roadmap</p>
                  <p className={styles.recentCardSubtitle}>Pioupiu Labs</p>
                </div>
              </div>
            </section>

            {/* Your Boards Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeaderWithAction}>
                <div className={styles.sectionHeader}>
                  <span className="material-icons-round">grid_view</span>
                  <h2>Your Boards</h2>
                </div>
                <button className={styles.viewAllButton}>View All</button>
              </div>
              <div className={styles.boardGrid}>
                <div className={`${styles.boardCard} ${styles.gradientLime}`}>
                  <div className={styles.boardCardContent}>
                    <h3 className={styles.boardCardTitle}>design</h3>
                    <div className={styles.boardCardFooter}>
                      <span className={styles.taskBadge}>4 tasks active</span>
                      <span className={`material-icons-round ${styles.boardStar}`}>star_outline</span>
                    </div>
                  </div>
                </div>
                <div className={`${styles.boardCard} ${styles.gradientAmber}`}>
                  <div className={`${styles.boardCardContent} ${styles.darkText}`}>
                    <h3 className={styles.boardCardTitle}>oyg</h3>
                    <div className={styles.boardCardFooter}>
                      <span className={`${styles.taskBadge} ${styles.darkBadge}`}>Empty</span>
                      <span className={`material-icons-round ${styles.boardStar}`}>star_outline</span>
                    </div>
                  </div>
                </div>
                <div className={styles.createBoardCard}>
                  <div className={styles.createBoardIcon}>
                    <span className="material-icons-round">add</span>
                  </div>
                  <span className={styles.createBoardText}>Create new board</span>
                </div>
              </div>
            </section>

            {/* Templates Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className="material-icons-round">auto_awesome</span>
                <h2>Start with a template</h2>
              </div>
              <div className={styles.templateGrid}>
                <div className={styles.templateCard}>
                  <div className={`${styles.templateIcon} ${styles.blueIcon}`}>
                    <span className="material-icons-round">event_available</span>
                  </div>
                  <p className={styles.templateTitle}>Project Management</p>
                </div>
                <div className={styles.templateCard}>
                  <div className={`${styles.templateIcon} ${styles.orangeIcon}`}>
                    <span className="material-icons-round">campaign</span>
                  </div>
                  <p className={styles.templateTitle}>Marketing Plan</p>
                </div>
                <div className={styles.templateCard}>
                  <div className={`${styles.templateIcon} ${styles.purpleIcon}`}>
                    <span className="material-icons-round">palette</span>
                  </div>
                  <p className={styles.templateTitle}>Design Sprint</p>
                </div>
                <div className={styles.templateCard}>
                  <div className={`${styles.templateIcon} ${styles.greenIcon}`}>
                    <span className="material-icons-round">code</span>
                  </div>
                  <p className={styles.templateTitle}>Software Dev</p>
                </div>
                <div className={styles.templateCard}>
                  <div className={`${styles.templateIcon} ${styles.roseIcon}`}>
                    <span className="material-icons-round">groups</span>
                  </div>
                  <p className={styles.templateTitle}>HR & Hiring</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TestPage;