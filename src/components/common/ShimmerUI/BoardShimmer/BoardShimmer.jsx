import styles from './BoardShimmer.module.css';

const BoardShimmer = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.shimmerLists}>
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className={styles.shimmerList}></div>
        ))}
      </div>
    </div>
  );
};

export default BoardShimmer;
