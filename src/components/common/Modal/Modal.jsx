import PropTypes from 'prop-types';
import styles from './Modal.module.css';

const Modal = ({ children, modalToggler }) => {
  return (
    <div className={styles.wrapper}>
      <div onClick={modalToggler} className={styles.backBlur}></div>
      <div className={styles.modalContent}>{children}</div>
    </div>
  );
};

export default Modal;

Modal.propTypes = {
  children: PropTypes.node,
  modalToggler: PropTypes.func,
};
