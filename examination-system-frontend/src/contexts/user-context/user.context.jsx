import { createContext, useState, useEffect, useContext } from "react";
import useAsyncError from "../../hooks/useAsyncError";
import { useMountedState } from "react-use";
import { AuthenticationContext } from "../authentication-context/authentication.context";
import { showUserRequest } from "../../services/users/users.service";

export const UserContext = createContext();

export const UserProvider = ({ children, userId }) => {
  const { token, removeUserInfo } = useContext(AuthenticationContext);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const isMounted = useMountedState();
  const throwError = useAsyncError();

  useEffect(() => {
    if (isContextLoaded && user.user_id !== userId) {
      setIsContextLoaded(false);
    } else if (!isContextLoaded && user && user.user_id === userId) {
      setIsContextLoaded(true);
    }
  }, [isContextLoaded, user, userId]);

  useEffect(() => {
    // if (!token || isLoading || (user && user.user_id === userId) || isFailed) {
    if (isContextLoaded || isLoading || isFailed) {
      return;
    }

    setIsLoading(true);
    showUserRequest(userId, token)
      .then((response) => response.data.data)
      .then(({ user }) => {
        if (isMounted()) {
          setUser(user);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        if (isMounted()) {
          switch (Number(e?.response?.status)) {
            case 401:
              removeUserInfo();
              break;
            default:
              throwError(e);
          }
          setIsFailed(true);
          setIsLoading(false);
        }
      });
  }, [
    userId,
    isLoading,
    removeUserInfo,
    token,
    user,
    isMounted,
    isFailed,
    throwError,
    isContextLoaded,
  ]);

  const value = { user, isLoading, isContextLoaded };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
