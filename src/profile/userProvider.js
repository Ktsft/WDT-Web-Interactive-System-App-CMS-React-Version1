import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check local storage for user data when the app loads
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // console.log("this is the storedUser from user provider: ", storedUser);
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);



  const login = (userData, userRoles) => {
    // console.log("this is user roles: ", userRoles);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userRoles);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};