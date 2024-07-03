import styles from './TaskCardShimmer.module.css';

const TaskCardShimmer = () => {
  return (
    <div className={styles.shimmerWrapper}>
      <div className={styles.shimmer}></div>
    </div>
  );
};

export default TaskCardShimmer;
