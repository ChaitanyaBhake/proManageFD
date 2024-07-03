import { useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AnalyticsShimmer from '../../../components/common/ShimmerUI/AnalyticsShimmer/AnalyticsShimmer';
import Text from '../../../components/common/Text/Text';
import { prioritesTasks, tasks } from '../../../constants/tasks';
import { AuthContext } from '../../../context/AuthProvider';
import styles from './Analytics.module.css';

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const { token } = user;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const backendApi = `${baseUrl}/user/analytics`;

  // Function for API call to fetch user analytics data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(backendApi, options);

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error);
      }

      const resObj = await response.json();
      setData(resObj.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [backendApi, token]);

  //Run fetchData function on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className={styles.wrapper}>
      <Text step={5} weight="700">
        Analytics
      </Text>

      {isLoading ? (
        <AnalyticsShimmer />
      ) : (
        <div className={styles.analyticsLists}>
          {data && (
            <>
              {/* 1) Show Backlog, Todo, In-Progress, CompletedTask */}
              <ul className={styles.tasksUl}>
                {tasks.map((task) => (
                  <li key={task.value}>
                    <div>
                      <Text weight="500">{task.name}</Text>
                      <Text weight="600">{data.status[task.value]}</Text>
                    </div>
                  </li>
                ))}
              </ul>

              {/* 2) Show Low Priority, Moderate Priority, High Priority, Due Date */}
              <ul className={styles.tasksUl}>
                {prioritesTasks.map((task) => (
                  <li key={task.value}>
                    <div>
                      <Text weight="500">{task.name}</Text>
                      <Text weight="600">{data.priorities[task.value]}</Text>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;
