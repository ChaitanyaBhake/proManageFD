import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import logo from '../../assets/logo.png';
import PublicViewShimmer from '../../components/common/ShimmerUI/PublicViewShimmer/PublicViewShimmer';
import PublicTaskCard from './PublicTaskCard/PublicTaskCard';
import styles from './PublicView.module.css';

const PublicView = () => {
  const { taskId } = useParams();

  const url = import.meta.env.VITE_BACKEND_URL + '/task/' + taskId;

  let showContent;

  //States
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //Fetch Particular Task
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.message);
      }

      const resObj = await response.json();

      setData(resObj.data);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [url])

  useEffect(() => {
    fetchData();
  }, [url, fetchData]);

  if (data) {
    showContent = <PublicTaskCard task={data.task} />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>
        {/* Logo */}
        <div className={styles.image}>
          <img src={logo} alt="Pro manage" />
        </div>

        {/* Title */}
        <div className={styles.title}>
          <Link to="/">Pro Manage</Link>
        </div>
      </div>

      {/*Public Task Card */}
      {isLoading ? <PublicViewShimmer /> : <main>{showContent}</main>}
    </div>
  );
};

export default PublicView;
