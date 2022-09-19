import React, { useState } from "react";

const NotificationContext = React.createContext();

export const NotificationContextProvider = (props) => {
  const [notificationList, setNotificationList] = useState([]);

  return (
    <NotificationContext.Provider
      value={{
        notificationList,
        setNotificationList,
      }}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
