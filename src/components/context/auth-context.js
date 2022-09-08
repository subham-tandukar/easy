import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  // const initialToken = localStorage.getItem("token");
  const initialToken = sessionStorage.getItem("token");

  const userData = JSON.parse(initialToken);
  const [UserID, setUserID] = useState(userData);
  const userIsLoggedIn = !!UserID;

  const loginHandler = (token) => {

    setUserID(token);
    localStorage.setItem("token", JSON.stringify(token));
  };

  const logoutHandler = () => {
    setUserID(null);
  };
  const contextValue = {
    User: UserID,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
