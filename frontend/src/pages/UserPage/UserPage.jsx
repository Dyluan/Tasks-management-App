import styles from './User.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

function UserPage() {
  const { user, setUserInfo, clearUser } = useUser();
  const { workspace, clearApp } = useApp();
  const navigate = useNavigate();

  const server_url = process.env.REACT_APP_SERVER_URL;
  const token = localStorage.getItem('jwt');

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    clearUser();
    clearApp();
    navigate('/login');
  };

  // auto-connects the user
  useEffect(() => {
    localStorage.getItem('jwt');
    setUserInfo();
  }, []);

  const [darkMode, setDarkMode] = useState(workspace?.darkMode ?? false);

  useEffect(() => {
    setDarkMode(workspace.darkMode);
  }, [workspace.darkMode]);

  const [formData, setFormData] = useState({
    full_name: '',
    name: '',
    bio: '',
    phone_number: ''
  });

  // Update formData when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        name: user.name || '',
        bio: user.bio || '',
        phone_number: user.phone_number || ''
      });
    }
  }, [user]);

  const saveProfile = async () => {
    if (!user?.id) {
      console.error('User not loaded yet');
      return;
    }
    const response = await axios.patch(`${server_url}/users/${user.id}/edit`, 
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('profile update:', response.data);
    navigate(-1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`${styles.app} ${darkMode ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        {/* Sidebar Navigation */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo} onClick={() => navigate('/home')}>
              <div className={styles.logoIcon}>
                <span className="material-icons-round">dashboard</span>
              </div>
            </div>
            <h2 className={styles.sidebarTitle} onClick={() => navigate('/home')}>Plannr</h2>
          </div>

          <nav className={styles.nav}>
            <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>
              <span className="material-symbols-outlined">person</span>
              <span>Profile</span>
            </a>
            <a href="#" className={styles.navLink}>
              <span className="material-symbols-outlined">settings</span>
              <span>Account Settings</span>
            </a>
            <a href="#" className={styles.navLink}>
              <span className="material-symbols-outlined">security</span>
              <span>Security</span>
            </a>
            <a href="#" className={styles.navLink}>
              <span className="material-symbols-outlined">notifications</span>
              <span>Notifications</span>
            </a>
            <a href="#" className={styles.navLink}>
              <span className="material-symbols-outlined">palette</span>
              <span>Appearance</span>
            </a>
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.userInfo}>
              <div
                className={styles.userAvatarSmall}
                style={{
                  backgroundImage: `url('${user?.picture || user?.image || user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpVZJ3Bi3AtLQcCJ8ZKVV3S_zhK7KPZT7EEXKpWxPUSs1X0n1r11Ybg84VLoZJgzCPJvjF6M1gRsg9T3RH2l0vz4w0W_nljrGOhw8d3G0WVgzbZZ3SqAriL11pMF_2CHGSujzJsjW2ZKC6Q_RKYnQdVTvLzTPJS086PDLdGJYHjhTwjDVeEfu7QiLm5M-pC3LkMW2E2fmcNRiO0_4FOHGeuRdkEgFtnroMLeNQLDb8olshaWbR2DX66sfgJwd_0WJbauGWkOxTc6yF'}')`
                }}
              ></div>
              <div className={styles.userDetails}>
                <p className={styles.userName}>{user?.name || ''}</p>
                <p className={styles.userPlan}>Pro Plan</p>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={styles.main}>
          {/* Header */}
          <header className={styles.header}>
            <h1 className={styles.headerTitle}>Profile Settings</h1>
            <div className={styles.headerActions}>
              <button className={styles.iconBtn}>
                <span className="material-symbols-outlined">search</span>
              </button>
              <button className={styles.iconBtn}>
                <span className="material-symbols-outlined">notifications</span>
                <span className={styles.notificationDot}></span>
              </button>
              <div className={styles.divider}></div>
              <button className={styles.saveBtn} onClick={saveProfile}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>save</span>
                Save Changes
              </button>
            </div>
          </header>

          <div className={styles.content}>
            {/* Avatar Section */}
            <section className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                <div
                  className={styles.avatarLarge}
                  style={{
                    backgroundImage: `url('${user?.picture || user?.avatar || user?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKiY9Br77NKum1vEYlmZZKGfnUnwK_K4m5Brrm_SUxWMZfRBB1ky-dndlja8W1Xi1qarN3zY2BkiVfru3upzzDpZx5q-CWCSU43EawiblwfKgZoCnpxBhLk2H5DMRmrN5NOd31tFc98jhz29ugzgGX7deM9l5RnC0F206h2NlftLqRHfJ37QNAx5RBielXNkfiq4k6p2fd53NJrUmEQcFQa2fQ7wj7t5CZPjsMUvmlfw70IfHPrDt3Dv-StiRcdrOWToNYIN-yz1nV'}')`
                  }}
                ></div>
                <button className={styles.avatarEditBtn}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>camera_alt</span>
                </button>
              </div>
              <div className={styles.avatarInfo}>
                <h3 className={styles.avatarTitle}>Profile Photo</h3>
                <p className={styles.avatarDescription}>
                  Upload a new avatar. Recommended size is 256x256px. Max size 2MB.
                </p>
                <div className={styles.avatarActions}>
                  <button className={styles.uploadBtn}>Upload New</button>
                  <button className={styles.removeBtn}>Remove</button>
                </div>
              </div>
            </section>

            {/* General Information */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={`material-symbols-outlined ${styles.sectionIcon}`}>badge</span>
                <h3 className={styles.sectionTitle}>General Information</h3>
              </div>
              <div className={styles.sectionContent}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    className={styles.input}
                    placeholder="Enter full name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Username</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.inputIconText}>@</span>
                    <input
                      type="text"
                      name="name"
                      className={`${styles.input} ${styles.inputWithPaddingSmall} ${styles.inputFix}`}
                      placeholder="username"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Bio</label>
                  <textarea
                    name="bio"
                    className={styles.textarea}
                    placeholder="Tell us about yourself..."
                    rows="3"
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </section>

            {/* Contact Details */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={`material-symbols-outlined ${styles.sectionIcon}`}>contact_mail</span>
                <h3 className={styles.sectionTitle}>Contact Details</h3>
              </div>
              <div className={styles.sectionContent}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address</label>
                  <div className={styles.inputWithIcon}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>mail</span>
                    <input
                      type="email"
                      name="email"
                      className={`${styles.input} ${styles.inputWithPadding} ${styles.inputFix}`}
                      value={user?.email ? user.email : ''}
                      readOnly
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <div className={styles.inputWithIcon}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>call</span>
                    <input
                      type="tel"
                      name="phone_number"
                      className={`${styles.input} ${styles.inputWithPadding} ${styles.inputFix}`}
                      value={formData.phone_number}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Actions */}
            <footer className={styles.footer}>
              <button className={styles.cancelBtn} onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button className={styles.saveProfileBtn} onClick={saveProfile}>
                Save Profile
              </button>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default UserPage;