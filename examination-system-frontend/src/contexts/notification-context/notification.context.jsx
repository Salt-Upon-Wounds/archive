import { createContext, useCallback, useState, useEffect } from "react";
import NotificationAlert from "../../components/notification-alert/notification-alert.component";
import { useMountedState } from "react-use";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const isMounted = useMountedState();
  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        if (isMounted()) setNotification(null);
      }, notification.time);
    }
  }, [notification, isMounted]);

  const createNotification = useCallback((message, time) => {
    setNotification({ message, time });
  }, []);
  return (
    <NotificationContext.Provider
      value={{
        createNotification,
      }}
    >
      {children}
      {notification && (
        <NotificationAlert variant="success">
          {notification.message}{" "}
        </NotificationAlert>
      )}
    </NotificationContext.Provider>
  );
};
