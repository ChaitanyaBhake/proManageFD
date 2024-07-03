import PropTypes from 'prop-types';
import Text from '../../../../components/common/Text/Text';
import styles from './SingleChecklist.module.css';

const SingleCheckList = ({ list, onChangeFxn }) => {
  return (
    // Input / Title
    <div className={styles.singleCheckListWrapper}>
      <input
        type="checkbox"
        name=""
        id=""
        checked={list.checked}
        onChange={(e) => onChangeFxn(list._id,e.target.checked)}
      />
      <Text step={2} weight='500'>{list.title}</Text>
    </div>
  );
};

export default SingleCheckList;

SingleCheckList.propTypes = {
  list: PropTypes.object,
  onChangeFxn: PropTypes.func,
};
