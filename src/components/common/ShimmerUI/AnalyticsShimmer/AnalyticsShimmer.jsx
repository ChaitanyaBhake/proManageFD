import styles from './AnalyticsShimmer.module.css';

const AnalyticsShimmer = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.shimmerLists}>
        {[1, 2].map((index) => (
          <div key={index} className={styles.shimmerList}></div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsShimmer;
