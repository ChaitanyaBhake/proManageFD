import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button/Button';
import Text from '../../../components/common/Text/Text';
import styles from './Form.module.css';

const Form = ({ title, children }) => {
  return (
    <div className={styles.wrapperDiv}>
      {/* Form Title */}
      <Text step={7} weight="500">
        {title}
      </Text>

      {/* From Children (Whatever inside Form Component) */}

      <div>{children}</div>

      {/* Login/Register Button */}
      <div className={styles.loginRegisterDiv}>
        <Text color="#828282">
          {title === 'Register' ? 'Have an account ?' : 'Have no account yet?'}
        </Text>

        <Link to={title === 'Register' ? '..' : 'register'}>
          <Button variant="outline">
            {title === 'Register' ? 'Login' : 'Register'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

Form.propTypes = {
  title: PropTypes.oneOf(['Login', 'Register']).isRequired,
  children: PropTypes.node,
};

export default Form;
