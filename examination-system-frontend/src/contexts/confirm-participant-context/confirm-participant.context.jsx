import { createContext, useState, useContext } from "react";

import { useMountedState } from "react-use";

import { confirmParticipantRequest } from "../../services/participants/participants.service";

import { AuthenticationContext } from "../authentication-context/authentication.context";

export const ConfirmParticipantContext = createContext();

export const ConfirmParticipantProvider = ({ children, examId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { token, removeUserInfo } = useContext(AuthenticationContext);
  const isMounted = useMountedState();

  const confirmUser = (userId) => {
    setIsLoading(true);
    confirmParticipantRequest(examId, { user_id: userId }, token)
      .then((response) => response.data.data)
      .then(() => {
        if (isMounted()) {
          setConfirmed(true);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        if (isMounted()) {
          switch (Number(e?.response?.status)) {
            case 401:
              removeUserInfo();
              break;
            case 422:
              const { message } = e.response.data;
              setErrors({ message });
              break;
            default:
              setErrors({
                message: "что-то пошло не так, попробуйте позже",
              });
          }
          setIsLoading(false);
        }
      });
  };

  const value = { isLoading, confirmed, errors, confirmUser };
  return (
    <ConfirmParticipantContext.Provider value={value}>
      {children}
    </ConfirmParticipantContext.Provider>
  );
};
