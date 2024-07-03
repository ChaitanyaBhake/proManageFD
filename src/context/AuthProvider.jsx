import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useState } from 'react';

// AuthContext with default values
export const AuthContext = createContext({
  user: {},
  login: () => {},
  logout: () => {},
  isLoading: true,
  fetchLatestUserDetails: async () => {},
});

// AuthProvider component to provide authentication context to its children
export default function AuthProvider({ children }) {

  // Base URL for making API requests
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  //States
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

   // useEffect to load user data from localStorage on component mount
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);


  // 1️⃣ Function to handle user login
  const login = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  // 2️⃣ Function to handle user logout
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // 3️⃣ Function to fetch and set  the latest user details to localStorage (board)
  const fetchLatestUserDetails = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/user/userDetail`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Throw Error if api call fails
      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error);
      }

      const resObj = await response.json();
      
      setUser({ ...user, board: resObj.data.board });
      localStorage.setItem(
        'user',
        JSON.stringify({ ...user, board: resObj.data.board })
      );
    } catch (error) {
      console.log(error.message);
    }
  }, [baseUrl, user]);

 
  return (

    // Provide context values to children 
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        fetchLatestUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.element,
};
