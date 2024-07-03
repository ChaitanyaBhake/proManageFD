import PropTypes from 'prop-types';
import styles from './Button2.module.css';

const Button2 = ({ children, color = 'primary', variant, onClick, style }) => {
  return (
    <button
      className={`${styles[color]} ${styles[variant]} ${styles.button}`}
      onClick={onClick}
      style={{ ...style }}
    >
      {children}
    </button>
  );
};

export default Button2;

Button2.propTypes = {
  children: PropTypes.any,
  toggle: PropTypes.func,
  color: PropTypes.oneOf(['primary', 'error', 'success']),
  variant: PropTypes.oneOf(['outline', 'ghost']),
  onClick: PropTypes.func,
  style: PropTypes.object,
};
