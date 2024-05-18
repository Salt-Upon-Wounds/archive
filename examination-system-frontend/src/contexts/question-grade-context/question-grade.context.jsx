import { createContext, useState, useContext, useEffect } from "react";
import { useMountedState } from "react-use";
import useAsyncError from "../../hooks/useAsyncError";

import { AuthenticationContext } from "../authentication-context/authentication.context";

import {
  getGradeRequest,
  storeGradeRequest,
} from "../../services/grades/grades.service";

export const QuestionGradeContext = createContext();

export const QuestionGradeProvider = ({
  children,
  participantId,
  questionId,
  participantStatus,
}) => {
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const [newGrade, setNewGrade] = useState("");
  const [grade, setGrade] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { token, removeUserInfo } = useContext(AuthenticationContext);
  const isMounted = useMountedState();
  const throwError = useAsyncError();

  const showGradeEnabled =
    participantStatus === "FINISHED" ||
    participantStatus === "WAIT_FOR_MANUAL_CORRECTING";
  const changeGradeEnabled =
    participantStatus === "FINISHED" ||
    participantStatus === "WAIT_FOR_MANUAL_CORRECTING";

  useEffect(() => {
    if (
      showGradeEnabled &&
      isContextLoaded &&
      (Number(questionId) !== Number(grade.question_id) ||
        Number(participantId) !== Number(grade.participant_id))
    ) {
      if (isMounted()) {
        setIsContextLoaded(false);
      }
    }
  }, [
    isMounted,
    participantId,
    showGradeEnabled,
    questionId,
    isContextLoaded,
    grade,
  ]);

  useEffect(() => {
    if (!token || isContextLoaded) {
      return;
    }

    if (!showGradeEnabled) {
      setIsContextLoaded(true);
      return;
    }

    getGradeRequest(participantId, questionId, token)
      .then((response) => response.data.data)
      .then(({ grade: receivedGrade }) => {
        if (isMounted()) {
          setGrade(receivedGrade);
          setIsContextLoaded(true);
        }
      })
      .catch((err) => {
        switch (Number(err?.response?.status)) {
          case 401:
            removeUserInfo();
            break;
          default:
            throwError(err);
        }
      });
  }, [
    token,
    isContextLoaded,
    participantId,
    questionId,
    isMounted,
    showGradeEnabled,
    removeUserInfo,
    throwError,
  ]);

  const submitGrade = () => {
    setIsLoading(true);
    storeGradeRequest(participantId, questionId, token, { grade: newGrade })
      .then(() => {
        if (isMounted()) {
          setGrade((prevGrade) => ({ ...prevGrade, grade: Number(newGrade) }));
          setNewGrade("");

          setErrors({});
          setIsLoading(false);
        }
      })
      .catch((err) => {
        switch (Number(err?.response?.status)) {
          case 401:
            removeUserInfo();
            break;
          case 422:
            const newErrors = { ...err.response.data.errors };
            newErrors.message = err.response.data.message;
            for (const current in newErrors) {
              if (Array.isArray(newErrors[current])) {
                newErrors[current] = newErrors[current][0];
              }
            }
            setErrors(newErrors);
            break;
          default:
            setErrors({
              message: "что-то пошло не так, попробуйте позже",
            });
        }
        setIsLoading(false);
      });
  };

  const value = {
    isContextLoaded,
    isLoading,
    grade:
      showGradeEnabled &&
      (grade && grade.grade !== null ? Number(grade.grade) : null),
    newGrade,
    changeGrade: (new_grade) => setNewGrade(new_grade),
    submitGrade,
    hasChange: newGrade !== "",
    showGradeEnabled,
    changeGradeEnabled,
    errors,
  };

  return (
    <QuestionGradeContext.Provider value={value}>
      {children}
    </QuestionGradeContext.Provider>
  );
};
