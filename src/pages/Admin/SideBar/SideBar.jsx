import { Database, LogOut, PanelsTopLeft, Settings } from 'lucide-react';
import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import Button from '../../../components/common/Button/Button';
import Modal from '../../../components/common/Modal/Modal';
import Text from '../../../components/common/Text/Text';
import { AuthContext } from '../../../context/AuthProvider';
import useModal from '../../../hooks/useModal';
import styles from "./SideBar.module.css"

const SideBar = () => {
  const { logout } = useContext(AuthContext);
  const { isModalActive, modalToggler } = useModal();

  return (
    <>
      <div className={styles.wrapper}>

        {/*1) Logo and Title */}
        <div className={styles.logoImgWrapper}>
          <div className={styles.logoImage}>
            <img src={logo} alt="" />
          </div>
          <Link to="/">
            <Text step={5} weight="700">
              Pro Manage
            </Text>
          </Link>
        </div>

        {/*2) Navigation Links */}
        <nav className={`${styles.linksWrapper} ${styles.linksWrapper2}`}>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.activeLink : '') }>
            <div>
              <PanelsTopLeft color="#767575" />
            </div>
            <Text weight="600">Board</Text>
          </NavLink>

          <NavLink to={"analytics"} className={({ isActive }) => (isActive ? styles.activeLink : '')}>
            <div>
              <Database color="#767575" />
            </div>
            <Text weight="600">Analytics</Text>
          </NavLink>

          <NavLink to= {"settings"} className={({ isActive }) => (isActive ? styles.activeLink : '')}>
            <div>
              <Settings color="#767575" />
            </div>
            <Text weight="600">Settings</Text>
          </NavLink>
        </nav>

        {/*3) Logout Button */} 
        <div onClick={modalToggler} className={styles.logoutWrapper}>
          <div>
            <LogOut />
          </div>
          <Text color='rgb(197, 24, 24)' weight='600'>Logout</Text>
        </div>
      </div>

      {/* Show modal if user clicks on Logout  */}
      {isModalActive && (
        <Modal modalToggler={modalToggler}>
          <Text step={4} weight="500" style={{ textAlign: 'center' }}>
            Are you sure you want to logout?
          </Text>

          <div className={styles.confirmLogoutWrapper}>
            <Button onClick={logout}>Yes, Logout</Button>
            <Button variant="outline" color="error" onClick={modalToggler}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SideBar;
