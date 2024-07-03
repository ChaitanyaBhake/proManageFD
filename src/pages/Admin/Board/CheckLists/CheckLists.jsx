import { ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';
import Text from '../../../../components/common/Text/Text';
import SingleCheckList from '../SingleCheckList/SingleCheckList';
import styles from './CheckLists.module.css';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { TaskContext } from '../../../../context/TaskProvider';

const CheckLists = ({ isCardOpen, toggleCardShrink, task }) => {
  const checklists = task.checkLists;
  const checkBoxTicked = checklists.filter((list) => list.checked);

  const {smallTaskUpdate} = useContext(TaskContext)

  const checkBoxHandler = async (checkListId, value) => {

    //Find the index of the checklist where the checkbox is clicked
    const index = checklists.findIndex((list) => list._id === checkListId);

    //If the index is -1, it means that the checklistId is not found in the checklists array, so return
    if (index == -1) return;

   
    //Deep Copying checklists array of objects
    const copyOfLists = JSON.parse(JSON.stringify(checklists));

    //Updating the checked field
    copyOfLists[index].checked = value;

    //Api call from taskContext to reflect the changes
    try {
      await smallTaskUpdate(task,{checkLists:copyOfLists})  
    } catch (error) {
      toast.error(error.message)
    }

  };

  return (
    <div>
      <div className={styles.checkListHeading}>
        <Text weight="500">
          Checklist{' '}
          <span style={{ fontSize: '0.8rem' }}>
            ({checkBoxTicked.length} / {checklists.length})
          </span>
        </Text>

        <button className={styles.button}>
          <ChevronDown
            size={20}
            color="grey"
            className={isCardOpen && styles.rotate}
            onClick={toggleCardShrink}
          />
        </button>
      </div>

      {/* If checklist Chevron Arrow is clicked , then render the Single Checklist Component for each checklists of task */}
      {isCardOpen && (
        <div>
          {checklists.map((list) => (
            <SingleCheckList
              key={list._id}
              list={list}
              onChangeFxn={checkBoxHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckLists;

CheckLists.propTypes = {
  task: PropTypes.object,
  isCardOpen: PropTypes.bool,
  toggleCardShrink: PropTypes.func,
};
