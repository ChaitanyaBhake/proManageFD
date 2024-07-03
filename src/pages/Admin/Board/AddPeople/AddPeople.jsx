import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import Button2 from '../../../../components/common/Button2/Button2';
import Text from '../../../../components/common/Text/Text';
import { AuthContext } from '../../../../context/AuthProvider';
import styles from './AddPeople.module.css';

const AddPeople = ({ modalToggler }) => {
  const [email, setEmail] = useState('');
  const [successActive, setSuccessActive] = useState(false);
  const { user, fetchLatestUserDetails } = useContext(AuthContext);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const data = { email };
    // console.log(data);

    //APi Call
    try {
      const response = await fetch(`${baseUrl}/user/addToBoard`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error);
      }

      await response.json();
  
      setSuccessActive(true);
      fetchLatestUserDetails();
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      {!successActive ? (
        /* If success is false show show add people form */
        <form onSubmit={handleEmailSubmit}>
          <div className={styles.inputDiv}>
            <label htmlFor="email" style={{ fontWeight: '600' }}>
              Add People To Board <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              placeholder="Enter The Email"
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.ctaBtns}>
            <Button2 color="error" variant="outline" onClick={modalToggler}>
              Cancel
            </Button2>

            <Button2 type="submit">Add Email</Button2>
          </div>
        </form>
      ) : (
        //If email is successfully added to the board , then show this success div
        <div className={styles.successMessage}>
          <Text weight="600">Email successfully added to board</Text>
          <Button2
            onClick={() => {
              modalToggler()
            }}
            style={{ minWidth: '300px' }}
          >
            Okay got tt!
          </Button2>
        </div>
      )}
    </>
  );
};

export default AddPeople;

AddPeople.propTypes = {
  modalToggler: PropTypes.func,
};
