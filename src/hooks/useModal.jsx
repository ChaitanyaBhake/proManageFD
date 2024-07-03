
import { useCallback, useState } from 'react';

//Since Modal will be used every now and then , while creating task, editing task , assigning task , managing state  of modal across different components is easy with custom Hook function
const useModal = () => {
  const [isModalActive, setIsModalActive] = useState(false);

  const modalToggler = useCallback(() => {
    setIsModalActive((prev) => !prev);
  }, []);

  return { isModalActive, modalToggler };
};

export default useModal;
