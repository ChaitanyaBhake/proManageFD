import { useContext, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthProvider';
import SideBar from '../SideBar/SideBar';
import styles from './AdminHero.module.css';

const AdminHero = () => {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  return (
    <div>
      {/* 1) Toaster component for toast messages */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#fff',
            color: 'black',
            duration: '3000',
          },
        }}
      />

      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <main className={styles.wrapper}>
          {/* 1) Sidebar */}
          <div className={styles.sideBarWrapper}>
            <SideBar />
          </div>

          {/* 2) If user is present , then show the Board Component */}
          {user && (
            <div className={styles.outletWrapper}>
              <Outlet />
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default AdminHero;
