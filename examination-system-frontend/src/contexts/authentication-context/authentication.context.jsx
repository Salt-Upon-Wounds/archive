import {
  useState,
  useCallback,
  createContext,
  useEffect,
  useContext,
} from "react";
import { useMountedState } from "react-use";
import { NotificationContext } from "../notification-context/notification.context";
import {
  loginRequest,
  registerRequest,
  logoutRequest,
  changePasswordRequest,
} from "../../services/authentication/authentication.service";
import { getCurrentUserRequest } from "../../services/users/users.service";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [popover, setPopover] = useState("");
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const { createNotification } = useContext(NotificationContext);
  const isMounted = useMountedState();

  const authenticateUser = useCallback(
    (user, token, message = null) => {
      setUser(user);
      setToken(token);
      setErrors({});
      localStorage.setItem("token", token);
      if (message) {
        createNotification(message, 3000);
      }
    },
    [createNotification]
  );

  useEffect(() => {
    if (isAuthLoaded) {
      return;
    }
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      getCurrentUserRequest(savedToken)
        .then((response) => response.data.data)
        .then(({ user: receivedUser }) => {
          if (isMounted()) {
            authenticateUser(receivedUser, savedToken);
            setIsAuthLoaded(true);
          }
        })
        .catch(() => {
          if (isMounted()) {
            if (localStorage.getItem("token")) {
              localStorage.removeItem("token");
            }
            setIsAuthLoaded(true);
          }
        });
    } else {
      setIsAuthLoaded(true);
    }
  }, [isAuthLoaded, authenticateUser, isMounted]);

  useEffect(() => {
    if (user && token) {
      setIsUserAuthenticated(true);
    } else {
      setIsUserAuthenticated(false);
    }
  }, [user, token]);

  const showUserLoginPopover = () => {
    setPopover("login");
  };

  const resetErrors = useCallback(() => {
    if (Object.keys(errors).length !== 0) {
      setErrors({});
    }
  }, [errors]);

  const changePopover = (newPopover) => {
    if (
      newPopover !== "login" &&
      newPopover !== "register" &&
      newPopover !== ""
    ) {
      throw Error("popover is invalid");
    }
    setErrors({});
    setPopover(newPopover);
  };

  const login = async (email, password) => {
    setIsLoading(true);
    loginRequest(email, password)
      .then((response) => response.data.data)
      .then(({ user, token }) => {
        if (isMounted()) {
          authenticateUser(user, token, "вы успешно вошли в аккаунт");
          setIsLoading(false);
        }
        return true;
      })
      .catch((err) => {
        if (isMounted()) {
          switch (Number(err?.response?.status)) {
            case 401:
            case 422:
              const { errors: receivedErrors, message } =
                err?.response?.data || {};
              setErrors((correntErrors) => ({
                ...correntErrors,
                ...receivedErrors,
                message,
              }));
              break;
            default:
              setErrors({
                message: "что-то пошло не так, попробуйте позже.",
              });
              break;
          }
          setIsLoading(false);
        }
        return false;
      });
  };

  const register = (name, email, password, password_confirmation) => {
    setIsLoading(true);
    registerRequest(name, email, password, password_confirmation)
      .then((response) => {
        return response.data.data;
      })
      .then(({ user, token }) => {
        if (isMounted()) {
          authenticateUser(user, token, "you registered successfully");
          setIsLoading(false);
        }
        return true;
      })
      .catch((requestErrors) => {
        if (isMounted()) {
          switch (Number(requestErrors?.response?.status)) {
            case 422:
              const err = requestErrors.response.data;
              const correntErrors = { ...errors };
              if (err.message) {
                correntErrors.message = err.message;
              }
              if (err.errors) {
                Object.keys(err.errors).forEach((error) => {
                  correntErrors[error] = err.errors[error];
                });
              }
              setErrors(correntErrors);

              break;
            default:
              setErrors({
                message: "что-то пошло не так, попробуйте позже.",
              });
              break;
          }
          setIsLoading(false);
        }
        return false;
      });
  };

  const removeUserInfo = useCallback(() => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    }
  }, []);

  const logout = () => {
    setIsLoggedOut(true);
    logoutRequest(token).then(() => {
      removeUserInfo();
      setErrors({});
    });
  };

  const changePassword = (
    currentPassword,
    newPassword,
    newPasswordConfirmation
  ) => {
    setIsLoading(true);
    changePasswordRequest(
      {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      },
      token
    )
      .then(() => {
        setUser(null);
        setToken(null);
        setIsLoading(false);
        setErrors({});
      })
      .catch((err) => {
        switch (Number(err?.response?.status)) {
          case 422:
            const newErrors = { ...err.response.data.errors };
            newErrors.message = err.response.data.message;
            setErrors(newErrors);
            break;
          default:
            setErrors({
              message: "что-то пошло не так, попробуйте позже.",
            });
            break;
        }
        setIsLoading(false);
      });
  };

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        login,
        register,
        errors,
        isLoading,
        isAuthLoaded,
        popover,
        changePopover,
        resetErrors,
        token,
        isUserAuthenticated,
        showUserLoginPopover,
        logout,
        changePassword,
        removeUserInfo,
        isLoggedOut,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
