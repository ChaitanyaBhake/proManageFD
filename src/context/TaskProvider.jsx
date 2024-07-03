import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import PropTypes from 'prop-types';
import { useImmer } from 'use-immer';
import { filters } from '../constants/data';
import { AuthContext } from './AuthProvider';

// TaskContext with default values
export const TaskContext = createContext({
  tasks: [],
  isLoading: false,
  selectedDateRange: filters[1],
  setSelectedDateRange: () => {},
  fetchTasks: async () => {},
  smallTaskUpdate: async () => {},
  taskFormUpdate: async () => {},
  addTask: async () => {},
  deleteTask: async () => {},
});

// TaskProvider component to provide task context to its children
export default function TaskProvider({ children }) {
  //States
  const [tasks, setTasks] = useImmer(null);
  const [selectedDateRange, setSelectedDateRange] = useState(filters[1]);
  const [isLoading, setIsLoading] = useState(false);

  // Access user and latest user details from authContext
  const { user, fetchLatestUserDetails } = useContext(AuthContext);

  //Destructing Value and and token
  const { token } = user;
  const { value } = selectedDateRange;

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  //Fetch User Task on Login/ Page Reload / Changing Week Filter
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/task?range=${value}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errObj = await response.json();
        console.log(errObj);
        throw new Error(errObj.error);
      }

      const dataObj = await response.json();

      setTasks(dataObj.data.tasks);
      fetchLatestUserDetails();

      setIsLoading(false);
    } catch (error) {
      console.log(error.message);

      setIsLoading(false);
    }
  }, [token, setTasks, value, baseUrl]);

  // Use Effect to run fetchTasks whenever any component calls the function
  useEffect(() => {
    (async () => {
      fetchTasks();
    })();
  }, [fetchTasks]);

  //------------------------ 1️⃣ CreateTaskHandler Functions Starts-------------------//

  // Helper function for making Api call to create a new Task
  const saveTaskToDatabase = useCallback(
    async (task) => {
      //Deep Copying the task object coming from Task Form to make changes in copied obj and not real task
      const taskCopy = JSON.parse(JSON.stringify(task));

      //Removing unnecessary UUID and IsNew from task Obj since MongoDb will generate its own object ID for Task Obj in which properties will be nested
      taskCopy.checkLists.forEach((list) => {
        delete list._id;
        delete list.isNew;
      });

      //Api Call
      const response = await fetch(`${baseUrl}/task/createTask`, {
        method: 'POST',
        body: JSON.stringify(taskCopy),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error);
      }

      const resObj = await response.json();
      return resObj.data.task;
    },
    [token, baseUrl]
  );

  // Add task 
  const addTask = useCallback(
    async (task) => {
      const newTask = await saveTaskToDatabase(task);
      setTasks((draft) => {
        draft.push(newTask);
      });
    },
    [setTasks, saveTaskToDatabase]
  );
  //------------------------CreateTaskHandler Functions Ends-------------------//



  //------------------------2️⃣ UpdateHandler for TaskCard (checkBoxes,changing categories) ------------------------ //

  // Helper function for updating state for checkBoxes/categories
  const taskCardStateUpdater = useCallback(
    async (task, updates) => {
      setTasks((draft) => {
        //Find the particular task whose checkBox is changed
        let singleTask = draft.find((t) => t._id === task._id);
        if (!singleTask) return;

        //Get the Keys of updates Object which is checked in our case
        const updateKeys = Object.keys(updates);

        //Map over the array returned by the Object.keys and update the singleTask with the values from updates
        updateKeys.map(
          (updateKey) => (singleTask[updateKey] = updates[updateKey])
        );
      });
    },
    [setTasks]
  );

  // Helper function making Api Call for updating the checkBoxes state in DB
  const taskCardDatabaseUpdater = useCallback(
    async (task, updates) => {
      const response = await fetch(`${baseUrl}/task/${task._id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error);
      }
    },
    [token, baseUrl]
  );

  // Small Update Task
  const smallTaskUpdate = useCallback(
    async (task, updates) => {
      //updateState
      taskCardStateUpdater(task, updates);
      //updateDB
      await taskCardDatabaseUpdater(task, updates);
    },
    [taskCardStateUpdater, taskCardDatabaseUpdater]
  );

  //------------------------- Small Updates Functions Ends------------------------------------------------------//



  //------------------------ 3️⃣ UpdateHandler for Existing TaskForm ---------------------------------------------------//

  // Helper function for making Api call to update an existing TaskDetails
  const taskFormDatabaseUpdater = useCallback(
    async (taskId, updates) => {
      const taskCopy = JSON.parse(JSON.stringify(updates));
      taskCopy.checkLists.forEach((list) => {
        if (list.isNew) {
          delete list._id;
          delete list.isNew;
        }
      });

      const response = await fetch(`${baseUrl}/task/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(taskCopy),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error);
      }

      const resObj = await response.json();
      return resObj.data.task;
    },
    [token, baseUrl]
  );

  const taskFormUpdate = useCallback(
    async (taskId, updates) => {
      const updatedTask = await taskFormDatabaseUpdater(taskId, updates);

      setTasks((draft) => {
        let index = draft.findIndex((task) => task._id === taskId);
        if (index < 0) return;
        draft[index] = updatedTask;
      });
    },
    [setTasks, taskFormDatabaseUpdater]
  );

  //------------------------ 3️⃣ TaskForm Updater Functions Ends-------------------//


  //------------------------4️⃣ 🗑️--DeleteTaskHandler Functions Start-----------------//

  // Helper function for making API call deleting task from DB
  const deleteTaskFromDatabase = useCallback(
    async (taskId) => {
      const response = await fetch(`${baseUrl}/task/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error);
      }
    },
    [baseUrl, token]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      setIsLoading(true);
      try {
        await deleteTaskFromDatabase(taskId);

        setTasks((draft) => {
          return draft.filter((task) => task._id !== taskId);
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [deleteTaskFromDatabase, setTasks]
  );
  //----------------------4️⃣ -DeleteTaskHandler Functions End-----------------//


  return (
    <TaskContext.Provider
      value={useMemo(() => {
        return {
          tasks,
          isLoading,
          fetchTasks,
          addTask,
          deleteTask,
          smallTaskUpdate,
          taskFormUpdate,
          selectedDateRange,
          setSelectedDateRange,
        };
      }, [
        tasks,
        isLoading,
        fetchTasks,
        addTask,
        deleteTask,
        smallTaskUpdate,
        taskFormUpdate,
        selectedDateRange,
        setSelectedDateRange,
      ])}
    >
      {children}
    </TaskContext.Provider>
  );
}

TaskProvider.propTypes = {
  children: PropTypes.node,
};
