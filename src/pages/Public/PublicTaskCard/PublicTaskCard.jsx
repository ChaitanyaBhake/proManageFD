import PropTypes from 'prop-types';
import toast, { Toaster } from 'react-hot-toast';
import Badge2 from '../../../components/common/Badge2/Badge2';
import Text from '../../../components/common/Text/Text';
import { monthAndDateFormatter } from '../../../utils/dateFormatter';
import styles from './PublicTaskCard.module.css';
import { getBadgeVariant } from '../../../utils/bagdeVaraint';


const PublicTaskCard = ({ task }) => {
  const checkboxTicked = task.checkLists.filter((list) => list.checked);
  const checklists = task.checkLists;
  const dueDate = new Date(task.dueDate);

  const changeHandler = () => {
    toast.error('Read Only Cannot Change');
  };

  return (
    <div className={styles.publicCardWrapper}>
      <Toaster />

      {/* 1) Task Priority */}
      <Text
        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        step={1}
        color="#767575"
        weight="500"
      >
        <span className={styles[task.priority]}></span>
        {task.priority.toUpperCase()} PRIORITY
      </Text>

      {/* 2) Task Title*/}
      <Text
        step={7}
        weight="500"
        style={{ marginTop: '0.4rem', marginBottom: '0.5rem' }}
      >
        {task.title}
      </Text>

      {/* 3) Check Lists */}
      <div className={styles.checklists}>
        <Text weight="500" step={3}>
          Checklist{' '}
          <span style={{fontSize:"0.9rem"}}>
            ({checkboxTicked.length}/{checklists.length})
          </span>
        </Text>

        <div className={styles.lists}>
          {task.checkLists.map((list) => (
            <div key={list._id} className={styles.list}>
              <input
                type="checkbox"
                name=""
                id=""
                checked={list.checked}
                onChange={() => changeHandler()}
              />
              <Text>{list.title}</Text>
            </div>
          ))}
        </div>
      </div>

      {/* 4) Due Date    */}
      {task.dueDate && (
        <div className={styles.dueDate}>
          <Text weight="400" style={{ fontSize: '1rem' }}>
            Due Date
          </Text>
          <Badge2 variant={getBadgeVariant(task)}  >
            {monthAndDateFormatter(dueDate)}
          </Badge2>
        </div>
      )}
    </div>
  );
};

export default PublicTaskCard;

PublicTaskCard.propTypes = {
  task: PropTypes.object,
};
