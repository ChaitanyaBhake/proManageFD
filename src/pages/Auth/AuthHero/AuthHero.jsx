import { Outlet, useNavigate } from 'react-router-dom';
import astroNaut from '../../../assets/astronaut.png';
import Text from '../../../components/common/Text/Text';
import styles from './AuthHero.module.css';
import {Toaster} from  "react-hot-toast"
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthProvider';
const AuthHero = () => {

  const {user} = useContext(AuthContext);
  
  const navigate = useNavigate();

  useEffect(()=>{
    if(user){
      navigate("/")
    }
  },[user,navigate])


  return (
    <>
      <Toaster  
        position='top-center'
        reverseOrder={false}
        toastOptions={{
          style:{
            background: "#fff",
            color:"black"
          },
          duration:3000,
        }}
      />

      <main className={styles.wrapper}>
        <div className={styles.leftPoster}>
          <div className={styles.imageDiv}>
            <img src={astroNaut} alt="" />
          </div>
          <Text color="white" step={8}>
            Welcome aboard my friend
          </Text>

          <Text color="white" step={4} style={{ marginTop: '0.5rem' }}>
            Just a couple of clicks and we start
          </Text>
        </div>

        {/* Login/Register Component */}
        <div className={styles.outletDiv}>
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AuthHero;
