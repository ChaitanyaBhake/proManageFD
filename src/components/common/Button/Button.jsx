import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({ children, color = 'primary', variant, onClick }) => {
  return (
    <button
      className={`${styles[color]} ${styles[variant]} ${styles.button}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.any,
  toggle: PropTypes.func,
  color: PropTypes.oneOf(['primary', 'error', 'success']),
  variant: PropTypes.oneOf(['outline', 'ghost']),
  onClick: PropTypes.func,
};

export default Button;
