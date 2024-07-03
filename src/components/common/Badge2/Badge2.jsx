import PropTypes from 'prop-types';
import Text from '../Text/Text';
import styles from "./Badge2.module.css"

const Badge2 = ({ children, onClick, variant = 'default', style }) => {
  return (
    <div
      className={`${styles[variant]} ${styles.badge} ${
        onClick ? styles.clickable : ''
      } `}
      onClick={onClick}
      style={{...style}}
    >
      <Text style={{ fontSize: '0.8rem' }} weight="600">
        {children}
      </Text>
    </div>
  )
}

export default Badge2


Badge2.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.string,
    onClick: PropTypes.func,
    style : PropTypes.object
  };
  