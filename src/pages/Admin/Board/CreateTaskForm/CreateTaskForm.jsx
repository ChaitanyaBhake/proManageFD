import { ChevronDown, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { useContext, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';
import Button2 from '../../../../components/common/Button2/Button2';
import Text from '../../../../components/common/Text/Text';
import { dummyTask } from '../../../../constants/tasks';
import { AuthContext } from '../../../../context/AuthProvider';
import { TaskContext } from '../../../../context/TaskProvider';
import styles from './CreateTaskForm.module.css';

const CreateTaskForm = ({
  defaultTask = dummyTask,
  modalToggler,
  action = 'add',
}) => {
  // Immer allows us to modify the state in a mutable way

  // (although Immer internally converts these modifications into immutable updates),

  // it becomes more convenient to manage complex states. This reduces the need for spreading and manually updating nested state objects using spread operator

  //Here Task Object will contain lot of nested array of objects and I dont want to lose other fields while updating single property

  //So with the help of immer draft (copy of orignal object) , states can be directly mutated using . notation
  const [task, setTask] = useImmer(defaultTask);

  const { user } = useContext(AuthContext);
  const { addTask, taskFormUpdate, fetchTasks } = useContext(TaskContext);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailAdded, setIsEmailAdded] = useState(false);
  const [assign_to_email, setAssignToEmail] = useState('');
  const [isInputClicked, setInputClicked] = useState(false);
  const [isAssignedToOther, setIsAssignedToOther] = useState(false);

  // Date State
  const [startDate, setStartDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  //Ref for checkList Auto Scroll
  const checklistContainerRef = useRef(null);

  // Returns true or false based on if task is assigned by someone else
  const isAssignedBySomeOneElse =
    task.assignedBy && user.data.email !== task.assignedBy.email;

  useEffect(() => {
    // If the defaultTask has an assigned_to_email field, sets the assign_to_email state with this value.
    if (defaultTask.assigned_to_email) {
      setAssignToEmail(defaultTask.assigned_to_email);
    }

    // If the defaultTask has a dueDate field, convert this due date from a string format to a Date object and sets the startDate state with this date.
    if (defaultTask.dueDate) {
      const dateObject = new Date(defaultTask.dueDate);
      setStartDate(dateObject);
    }
  }, [defaultTask]);

  // Check if the user object exists, the user has a board property, and the board has at least one email and update state accordingly
  useEffect(() => {
    if (user && user.board && user.board.length > 0) {
      setIsEmailAdded(true);
    } else {
      setIsEmailAdded(false);
    }
  }, [user]);

  // Effect to call addAssignToEmail whenever assign_to_email changes
  useEffect(() => {
    if (assign_to_email !== '') {
      addAssignToEmail(assign_to_email);
    }
  }, [assign_to_email]);

  // Check if task is assigned to someone else
  useEffect(() => {
    setIsAssignedToOther(
      task.assigned_to_email && task.assigned_to_email !== user.data.email
    );
  }, [task, user]);

  //Add Task
  const handleAddTask = async () => {
    setIsLoading(true);
    try {
      if (isAssignedToOther) {
        setTask((draft) => {
          draft.status = 'backlog';
        });
      }
      await addTask(task);
      modalToggler();
      fetchTasks();
      toast.success('Successfully added task');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //Update Task
  const handleUpdateTask = async () => {
    setIsLoading(true);
    try {
      await taskFormUpdate(task._id, task);
      modalToggler();
      fetchTasks();
      toast.success('Successfully updated task');
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Function to update the due date
  const onDateChange = (date) => {
    //For some reason .ISOString() function was not working
    //Hence MongoDB does not store the date in normal format so manually converted it to MongoDB supported format to save date.
    const isoDateString = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(
      date.getHours()
    ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(
      date.getSeconds()
    ).padStart(2, '0')}.${String(date.getMilliseconds()).padStart(3, '0')}Z`;
    setStartDate(date);

    setTask((draft) => {
      draft.dueDate = isoDateString;
    });

    setShowDatePicker(false);
  };

  //Title field onChangeHandler
  const updateTitle = (event) => {
    setTask((draft) => {
      draft.title = event;
    });
  };

  //Set Priority for Task [High, Moderate, Low]
  const changePriority = (priority) => {
    setTask((draft) => {
      draft.priority = priority;
    });
  };

  //Add assignToEmail
  const addAssignToEmail = (email) => {
    setTask((draft) => {
      draft.assigned_to_email = email;
      if (email !== user.data.email) {
        draft.status = 'backlog'; 
      }
    });
  };

  //Add Button New Task
  const addCheckList = () => {
    setTask((draft) => {
      draft.checkLists.push({
        checked: false,
        title: '',
        _id: uuidv4(),
        isNew: true,
      });
    });

    // Scroll to the newly added checklist item
    setTimeout(() => {
      checklistContainerRef.current.scrollTop =
        checklistContainerRef.current.scrollHeight;
    }, 0);
  };

  //Delete Task List
  const deleteCheckList = (id) => {
    setTask((draft) => {
      draft.checkLists = draft.checkLists.filter((item) => item._id !== id);
    });
  };

  //Tracking Which checkbox is selected
  const checkBoxUpdater = (listId, value) => {
    setTask((draft) => {
      let list = draft.checkLists.find((list) => list._id === listId);

      if (!list) return;
      //Updating directly the checked property (thanks to immer) of found checklist created from addCheckList function
      list.checked = value;
    });
  };

  //CheckList Add Task onChangeHandler
  const checkListTitleUpdater = (listId, value) => {
    setTask((draft) => {
      let list = draft.checkLists.find((list) => list._id === listId);

      if (!list) return;

      list.title = value;
    });
  };

  //To show checklists ( 0 / 0 dynamically)
  const checkBoxTicked = task?.checkLists.filter((list) => list.checked);
  const totalCheckLists = task?.checkLists.length;

  return (
    <div className={styles.wrapper}>
      {/* 1) Title */}
      <div className={styles.inputDiv}>
        <label htmlFor="taskTitle" style={{ fontWeight: '600' }}>
          Title <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          placeholder="Enter Task Title"
          type="text"
          id="taskTitle"
          value={task.title}
          onChange={(e) => updateTitle(e.target.value)}
        />
      </div>

      {/* 2) Select Priority */}
      <div className={styles.priorityContainer}>
        {/* Select Priority */}
        <Text step={3} weight="500">
          Select Priority <span style={{ color: 'red' }}>*</span>
        </Text>

        <div className={styles.priorityBtnsCon}>
          {/* High Priority */}
          <button
            onClick={() => changePriority('high')}
            className={`${styles.priorityButton} ${
              task.priority === 'high' && styles.selectedPriority
            }`}
          >
            <span className={styles.redSpan}></span>
            <Text step={1}>HIGH PRIORITY</Text>
          </button>

          {/* Moderate Priority */}
          <button
            className={`${styles.priorityButton} ${
              task.priority === 'moderate' && styles.selectedPriority
            }`}
            onClick={() => changePriority('moderate')}
          >
            <span className={styles.blueSpan}></span>
            <Text step={1}>Moderate PRIORITY</Text>
          </button>

          {/* Low Priority */}
          <button
            className={`${styles.priorityButton} ${
              task.priority === 'low' && styles.selectedPriority
            }`}
            onClick={() => changePriority('low')}
          >
            <span className={styles.greenSpan}></span>
            <Text step={1}>Low PRIORITY</Text>
          </button>
        </div>
      </div>

      {/* 3) Show Assign To :- Only if there is any email added to users board or he has assigned task already to someone else and wants to reassign the task to someone else  */}
      {isAssignedBySomeOneElse
        ? ''
        : isEmailAdded && (
            <div className={styles.assignToDiv}>
              <Text step={2} weight="600">
                Assign To
              </Text>
              <input
                type="text"
                placeholder="Add an assignee"
                value={assign_to_email}
                onFocus={() => setInputClicked(true)}
                readOnly
              />
              {isInputClicked && (
                <ChevronDown
                  color="grey"
                  onClick={() => setInputClicked(false)}
                  className={styles.chevronDown}
                />
              )}

              {isInputClicked && (
                <div className={styles.emailDiv}>
                  {user.board.map((email, i) => (
                    <div key={i} className={styles.emailAssignDiv}>
                      <span className={styles.emailInitials}>
                        {email.slice(0, 2)}
                      </span>
                      <p>{email}</p>

                      <button
                        onClick={() => {
                          setAssignToEmail(email);
                          setInputClicked(false);
                        }}
                      >
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

      {/* 4) CheckList and Add Tasks Button  */}
      <div>
        <Text>
          Checklist(
          {(checkBoxTicked.length ?? 0) + '/' + (totalCheckLists ?? 0)})
          <span style={{ color: 'red' }}>*</span>
        </Text>

        <div className={styles.checkListsCon} ref={checklistContainerRef}>
          {/* Render a div for each checkList consisting Checkbox ,Task title and Delete */}
          {task?.checkLists.map((taskList) => (
            <div key={taskList._id} className={styles.checkListsDiv}>
              <div className={styles.checkBoxDiv}>
                <input
                  type="checkbox"
                  name=""
                  id=""
                  checked={taskList.checked}
                  onChange={(e) =>
                    checkBoxUpdater(taskList._id, e.target.checked)
                  }
                />
                <input
                  type="text"
                  placeholder="Add a task"
                  value={taskList.title}
                  onChange={(e) =>
                    checkListTitleUpdater(taskList._id, e.target.value)
                  }
                />
              </div>

              {/* Delete Button */}
              <div>
                <button
                  onClick={() => deleteCheckList(taskList._id)}
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                >
                  <Trash2 className={styles.trashBin} size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Task Button */}
        <div className={styles.addBtnDiv}>
          <button onClick={addCheckList} className={styles.addbtn}>
            + Add New
          </button>
        </div>
      </div>

      {/* 5) Calendar and CTA Buttons */}
      <div>
        <div className={styles.calendarPickerCon}>
          {/* Show Calendar */}
          <div className={styles.calendarPicker}>
            {showDatePicker && (
              <DatePicker
                selected={startDate}
                onChange={onDateChange}
                startDate={startDate}
                selectsRange={false}
                inline
                placeholderText="Select Due Date"
                dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
              />
            )}
          </div>
        </div>

        <div className={styles.ctaBtnsCon}>
          {/* Select Due Date Button */}
          <button
            id="calendarContainer"
            className={styles.selectDateBtn}
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            {startDate ? startDate.toLocaleDateString() : 'Select Due Date'}
          </button>

          {/* Cancel and Save Buttons */}
          <div className={styles.ctaBtns}>
            <Button2 variant="outline" color="error" onClick={modalToggler}>
              Cancel
            </Button2>
            <Button2
              onClick={action == 'add' ? handleAddTask : handleUpdateTask}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskForm;

CreateTaskForm.propTypes = {
  defaultTask: PropTypes.object,
  modalToggler: PropTypes.func,
  action: PropTypes.oneOf(['add', 'update']),
};
