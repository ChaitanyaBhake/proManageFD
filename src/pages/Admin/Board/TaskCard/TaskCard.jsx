import { MoreHorizontal } from 'lucide-react';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import Badge from '../../../../components/common/Badge/Badge';
import Button2 from '../../../../components/common/Button2/Button2';
import Modal from '../../../../components/common/Modal/Modal';
import TaskCardShimmer from '../../../../components/common/ShimmerUI/TaskCardShimmer/TaskCardShimmer';
import Text from '../../../../components/common/Text/Text';
import { categories } from '../../../../constants/data';
import { AuthContext } from '../../../../context/AuthProvider';
import { TaskContext } from '../../../../context/TaskProvider';
import useModal from '../../../../hooks/useModal';
import { getBadgeVariant } from '../../../../utils/bagdeVaraint';
import { monthAndDateFormatter } from '../../../../utils/dateFormatter';
import { truncateTitle } from '../../../../utils/titleTruncator';
import CheckLists from '../CheckLists/CheckLists';
import CreateTaskForm from '../CreateTaskForm/CreateTaskForm';
import styles from './TaskCard.module.css';

const TaskCard = ({ task, isCardOpen, toggleCardShrink }) => {
  const { isModalActive: deleteActiveModal, modalToggler: deleteModalToggler } =
    useModal();

  const { isModalActive: editActiveModal, modalToggler: editModalToggler } =
    useModal();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);

  // Change the state of Task Title
  const handleTitleToggle = () => {
    setIsTitleExpanded(!isTitleExpanded);
  };

  //Show ... if title has more than 6 words
  const displayedTitle = isTitleExpanded
    ? task.title
    : truncateTitle(task.title);

  const { isLoading, smallTaskUpdate, deleteTask } = useContext(TaskContext);
  const { user } = useContext(AuthContext);

  const dueDate = new Date(task.dueDate);
  const isAssignedBySomeOneElse = user.data.email !== task.assignedBy.email;

  // Edit,Share,Delete Menu Toggler
  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  // Update Task based on Badge Status (Todo, Backlog, InProgress , Done)
  const handleBadgeUpdate = (updates) => {
    try {
      smallTaskUpdate(task, updates);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete Task
  const handleDeleteTask = (taskId) => {
    try {
      deleteTask(taskId);
      deleteModalToggler();
      toast.success('Task Deleted');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Share Task
  const shareTask = (taskId) => {
    const url = new URL(window.location.href);
    url.pathname = '';
    const newUrl = url.href;
    navigator.clipboard.writeText(`${newUrl}task/${taskId}`);
    toast.success('Link Copied');
  };

  const emailInitials = isAssignedBySomeOneElse
    ? task.assignedBy.email.slice(0, 2)
    : task.assigned_to_email.slice(0, 2);

  return (
    <>
      {isLoading ? (
        <TaskCardShimmer />
      ) : (
        <div className={styles.wrapper}>
          {/* 1) Task Priority and Edit>Share>Delete Menu */}
          <div className={styles.priorityMenuDiv}>
            <Text
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              step={1}
              color="#767575"
              weight="500"
            >
              <span className={styles[task.priority]}></span>
              {task.priority.toUpperCase()} PRIORITY{' '}
              {task.assigned_to_email && (
                <span className={styles.emailCircle}>
                  {emailInitials}
                  <span className={styles.tooltip}>
                    {task.assigned_to_email === user.data.email ? (
                      <>
                        <span>{`Assigned By : ${task.assignedBy.name}`}</span>
                        <span style={{ display: 'inline-block' }}>
                          Email: {task.assignedBy.email}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>Assigned To</span>
                        <span style={{ display: 'inline-block' }}>
                          Email: {task.assigned_to_email}
                        </span>
                      </>
                    )}
                  </span>
                </span>
              )}
            </Text>

            {/* Menu Dots . . . */}
            <div className={styles.menu}>
              <button className={styles.menuButton} onClick={handleMenuToggle}>
                <MoreHorizontal />
              </button>

              {/* Edit Share Delete Menu */}
              {menuOpen && (
                <div className={`${styles.menuItems}`}>
                  <div
                    className={styles.menuItem}
                    onClick={() => {
                      editModalToggler();
                      handleMenuToggle();
                    }}
                  >
                    Edit
                  </div>

                  <div
                    className={styles.menuItem}
                    onClick={() => {
                      handleMenuToggle();
                      shareTask(task._id);
                    }}
                  >
                    Share
                  </div>

                  {!isAssignedBySomeOneElse && (
                    <div
                      className={`${styles.menuItem} ${styles.error}`}
                      onClick={() => {
                        deleteModalToggler();
                        handleMenuToggle();
                      }}
                    >
                      Delete
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 2) Task Title */}
          <Text
            step={3}
            weight="600"
            style={{
              marginTop: '0.9rem',
              marginBottom: '1.6rem',
              display: 'flex',
              justifyContent: 'space-between',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
            }}
            onClick={handleTitleToggle}
          >
            {displayedTitle}
          </Text>

          {/* 3 Check Lists */}
          <CheckLists
            isCardOpen={isCardOpen}
            toggleCardShrink={toggleCardShrink}
            task={task}
            checklists={task.checkLists}
          />

          {/* 4 Due Date and Categories Badges */}
          <div className={styles.badgesWrapper}>
            {task.dueDate && (
              <Badge variant={getBadgeVariant(task)}>
                {monthAndDateFormatter(dueDate)}
              </Badge>
            )}
            <div className={styles.categoriesBadgesDiv}>
              {categories.map((category) => {
                if (category.value !== task.status) {
                  return (
                    <div key={category.id}>
                      <Badge
                        onClick={() =>
                          handleBadgeUpdate({ status: category.value })
                        }
                      >
                        {' '}
                        {category.title === 'To do'
                          ? 'TO-DO'
                          : category.title.toUpperCase()}
                      </Badge>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}

      {/* Delete Task Card Modal  */}
      {deleteActiveModal && (
        <Modal modalToggler={deleteModalToggler}>
          <Text step={4} weight="500" style={{ textAlign: 'center' }}>
            Are you sure want to delete?
          </Text>

          <div className={styles.deleteActions}>
            <Button2 onClick={() => handleDeleteTask(task._id)}>
              {'Yes, Delete'}
            </Button2>
            <Button2
              variant="outline"
              color="error"
              onClick={deleteModalToggler}
            >
              Cancel
            </Button2>
          </div>
        </Modal>
      )}

      {/* Edit Existing Task Card Modal */}
      {editActiveModal && (
        <Modal modalToggler={editModalToggler}>
          <CreateTaskForm
            defaultTask={task}
            action="update"
            modalToggler={editModalToggler}
          />
        </Modal>
      )}
    </>
  );
};

export default TaskCard;

TaskCard.propTypes = {
  task: PropTypes.object,
  isCardOpen: PropTypes.bool,
  // isModalActive: PropTypes.bool,
  toggleCardShrink: PropTypes.func,
};
