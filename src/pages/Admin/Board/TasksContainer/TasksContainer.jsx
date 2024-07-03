import { useContext, useEffect} from 'react';
import { categories } from '../../../../constants/data';
import { TaskContext } from '../../../../context/TaskProvider';
import CategoryContainer from '../CategoryContainer/CategoryContainer';
import styles from './TasksContainer.module.css';
import BoardShimmer from '../../../../components/common/ShimmerUI/BoardShimmer/BoardShimmer';


const TasksContainer = () => {
  const { tasks, isLoading,fetchTasks } = useContext(TaskContext);

 
  // console.log(tasks);

  let content;

  useEffect(()=>{
    fetchTasks()
  },[fetchTasks])

  
  if (isLoading) {
    content = <BoardShimmer/>;
  }

  //Map through categories and for every category render a Category Container Component
  if (tasks) {
    content = (
      <div className={styles.categoriesDiv}>
        {categories.map((category) => (
          <CategoryContainer
            tasks={tasks}
            key={category.id}
            category={category}
          />
        ))}
      </div>
    );
  }
  return <div className={styles.wrapper}>{content}</div>;
};

export default TasksContainer;
