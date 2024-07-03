import PropTypes from 'prop-types';
import { useState } from 'react';
import Text from '../common/Text/Text';
import styles from './FromInput.module.css';

// Function to check the input type and determine if password should be hidden by default
const checkType = (type) => {
  if (type === 'password') {
    return false;
  }
  return true;
};

const FormInput = ({
  register,
  error,
  label,
  placeholder,
  mainIcon,
  secondaryIcon,
  type = 'text',
}) => {
  // State to control password visibility
  const [showPassword, setShowPassword] = useState(() => checkType(type));

  // Function to toggle password visibility
  const passwordToggler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.wrapperDiv}>
      <div className={styles.inputDiv}>
        <div className={styles.iconDiv}>{mainIcon}</div>

        <input
          {...register(label)} // Register the input with react-hook-form using the label
          type={showPassword ? 'text' : 'password'} // Toggle between text and password types based on showPassword state
          placeholder={placeholder}
          className={styles.input}
        />

        {/* Eye Icon */}
        <div
          onClick={passwordToggler}
          style={{ cursor: 'pointer' }}
          className={styles.iconDiv}
        >
          {secondaryIcon}
        </div>
      </div>

      {/* Show error if present */}
      <Text color="red"> {error?.message}</Text>
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.object,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  mainIcon: PropTypes.element,
  secondaryIcon: PropTypes.element,
  register: PropTypes.any,
};

export default FormInput;
