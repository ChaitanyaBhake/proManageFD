import { UsersRound } from 'lucide-react';
import { useContext } from 'react';
import Modal from '../../../components/common/Modal/Modal';
import Text from '../../../components/common/Text/Text';
import { filters } from '../../../constants/data';
import { AuthContext } from '../../../context/AuthProvider';
import { TaskContext } from '../../../context/TaskProvider';
import useModal from '../../../hooks/useModal';
import { dateFormatter } from '../../../utils/dateFormatter';
import AddPeople from './AddPeople/AddPeople';
import styles from './Board.module.css';
import TasksContainer from './TasksContainer/TasksContainer';

//Outlet for the Admin Hero Component
const Board = () => {
  const { user } = useContext(AuthContext);
  const { selectedDateRange, setSelectedDateRange } = useContext(TaskContext);

  // console.log(selectedDateRange);

  const { isModalActive: createModalActive, modalToggler: createModalToggler } =
    useModal();
  // console.log(user);
  const todaysDate = dateFormatter(new Date());

  return (
    <>
      <div className={styles.wrapper}>
        {/* Welcome Name */}
        <div className={styles.welcomeDiv}>
          <Text weight="600" step={6}>
            Welcome! {user.data.name}
          </Text>
          <Text style={{ opacity: '0.8' }}>{todaysDate}</Text>
        </div>

        <div className={styles.boardDiv}>
          {/* Add People */}
          <div className={styles.textWrapper}>
            <Text step={7} weight="500">
              Board{' '}
            </Text>
            <div className={styles.addPeopleDiv} onClick={createModalToggler}>
              <UsersRound color="#767575" />
              <Text weight="500" color="grey">
                Add People
              </Text>
            </div>
          </div>

          {/* Today,Week,Month Filter */}
          <select
            value={selectedDateRange.name}
            onChange={(e) => {
              const selectedOption = filters.find(
                (option) => option.name === e.target.value
              );
              setSelectedDateRange(selectedOption);
            }}
            className={styles.select}
          >
            {filters.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <TasksContainer />
      </div>

      {/* Add People Modal */}
      {createModalActive && (
        <Modal modalToggler={createModalToggler}>
          <AddPeople modalToggler={createModalToggler} />
        </Modal>
      )}
    </>
  );
};

export default Board;
