import { CopyMinus, Plus } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Modal from '../../../../components/common/Modal/Modal';
import Text from '../../../../components/common/Text/Text';
import useModal from '../../../../hooks/useModal';
import CreateTaskForm from '../CreateTaskForm/CreateTaskForm';
import TaskCard from '../TaskCard/TaskCard';
import styles from './CategoryContainer.module.css';

// CategoryContainer component to display tasks under a specific category
const CategoryContainer = ({ category, tasks }) => {
  // Custom hook to manage modal state
  const { isModalActive: createModalActive, modalToggler: createModalToggler } =
    useModal();

  // State to keep track of expanded checklists (task cards)
  const [expandedCheckList, setExpandedCheckList] = useState([]);

  // Function to open a checklist (task card)
  const openChecklist = (id) => {
    const updatedCheckList = [...expandedCheckList, id];
    setExpandedCheckList(updatedCheckList);
  };

  // Function to close a checklist (task card)
  const closeChecklist = (id) => {
    setExpandedCheckList(
      expandedCheckList.filter((checklistId) => checklistId !== id)
    );
  };

  // Function to toggle a checklist (task card) between open and closed
  const toggleChecklist = (id) => {
    if (expandedCheckList.includes(id)) {
      closeChecklist(id);
    } else {
      openChecklist(id);
    }
  };

  // Function to close all checklists (task cards)
  const closeAllChecklists = () => {
    setExpandedCheckList([]);
  };

  return (
    <>
      {/* For every iteration render 4 wrapperDiv with category title :- Backlog, Todo , Inprogress , Done  */}
      <div className={styles.wrapper}>
        <div className={styles.headingDiv}>
          <Text step={4} weight="500">
            {category.title}
          </Text>
          <div className={styles.iconsDiv}>
            {category.title == 'To do' && (
              <Plus size={20} color="#767575" onClick={createModalToggler} />
            )}
            <CopyMinus
              size={20}
              color={expandedCheckList.length ? '#17a2b8' : '#767575'}
              onClick={closeAllChecklists}
            />
          </div>
        </div>
        {/* Inside the Category Container Div , render Task Card Component for the particular category */}
        <div className={styles.tasksDiv}>
          {tasks.map((task) => {
            if (task.status === category.value) {
              return (
                <TaskCard
                  key={task._id}
                  task={task}
                  isCardOpen={expandedCheckList?.includes(task._id)}
                  toggleCardShrink={() => toggleChecklist(task._id)}
                />
              );
            }
          })}
        </div>
      </div>

      {/* If user clicks on  " + "   button then render CreateTaskForm Component in Modal */}
      {createModalActive && (
        <Modal modalToggler={createModalToggler}>
          <CreateTaskForm modalToggler={createModalToggler} />
        </Modal>
      )}
    </>
  );
};

export default CategoryContainer;

CategoryContainer.propTypes = {
  category: PropTypes.object,
  tasks: PropTypes.array,
};
