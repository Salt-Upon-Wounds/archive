import { useEffect, useState, createContext, useContext, useMemo } from "react";
import useRemainingTime from "../../hooks/useRemainingTime";
import useAsyncError from "../../hooks/useAsyncError";
import { AuthenticationContext } from "../authentication-context/authentication.context";
import { NotificationContext } from "../notification-context/notification.context";
import { useMountedState } from "react-use";

import {
  convertDateTimeToObject,
  convertSecondsToObject,
  convertFromUTC,
} from "../../utilities/dateAndTime.utility";

import { examsShowRequest } from "../../services/exams/exams.service";
import { registerToExamRequest } from "../../services/participants/participants.service";

export const ExamInfoContext = createContext();

export const ExamInfoProvider = ({ children, examId }) => {
  const {
    isUserAuthenticated,
    showUserLoginPopover,
    token,
    removeUserInfo,
  } = useContext(AuthenticationContext);
  const { createNotification } = useContext(NotificationContext);
  const [exam, setExam] = useState(null);
  const [errors, setErrors] = useState({});
  const [examPassword, setExamPassword] = useState("");
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const [isRegisteringLoading, setIsRegisteringLoading] = useState(false);
  const [
    isUserJustRegisteredForExam,
    setIsUserJustRegisteredForExam,
  ] = useState(false);
  const [notificationShown, setNotificationShown] = useState(false);
  const isMounted = useMountedState();
  const isUserRegisteredToExam = exam ? exam.is_registered : false;
  const throwError = useAsyncError();

  useEffect(() => {
    if (isContextLoaded) {
      return;
    }
    if (exam) {
      setIsContextLoaded(true);
    }
  }, [exam, isContextLoaded]);

  useEffect(() => {
    examsShowRequest(examId, token)
      .then((response) => response.data.data)
      .then((data) => {
        if (isMounted()) {
          setExam({
            ...data.exam,
            start_of_exam: convertFromUTC(data.exam.start_of_exam),
            end_of_exam: convertFromUTC(data.exam.end_of_exam),
          });
        }
      })
      .catch((e) => {
        switch (Number(e?.response?.status)) {
          case 401:
            removeUserInfo();
            break;
          default:
            throwError(e);
        }
      });
  }, [examId, isMounted, token, removeUserInfo, throwError]);

  useEffect(() => {
    if (isUserJustRegisteredForExam && !notificationShown) {
      setNotificationShown(true);
      createNotification(
        `вы успешно зарегистрировались на тест "${exam.exam_name}"`,
        3000
      );
    }
  }, [
    isUserJustRegisteredForExam,
    notificationShown,
    createNotification,
    exam?.exam_name,
  ]);

  const startOfExam = useMemo(
    () =>
      exam
        ? new Date(convertDateTimeToObject(exam?.start_of_exam).timestamp)
        : null,
    [exam]
  );
  const endOfExam = useMemo(
    () =>
      exam
        ? new Date(convertDateTimeToObject(exam?.end_of_exam).timestamp)
        : null,
    [exam]
  );

  const timeToStart = useRemainingTime(new Date(), startOfExam);
  const timeToEnd = useRemainingTime(new Date(), endOfExam);
  const isExamStarted = timeToStart.isIntervalFinished;
  const isExamFinished = timeToEnd.isIntervalFinished;

  const canUserRegister = useMemo(() => {
    if (!isExamFinished && !isUserRegisteredToExam) {
      return true;
    } else {
      return false;
    }
  }, [isExamFinished, isUserRegisteredToExam]);

  const registerToExam = () => {
    setIsRegisteringLoading(true);
    if (isUserAuthenticated) {
      registerToExamRequest(examId, token, examPassword)
        .then(({ data, status }) => {
          if (status === 201 && isMounted()) {
            setIsUserJustRegisteredForExam(true);
            setExam((prevExam) => ({ ...prevExam, is_registered: true }));
            setIsRegisteringLoading(false);
            setErrors({});
          }
        })
        .catch((err) => {
          if (isMounted()) {
            switch (Number(err?.response?.status)) {
              case 401:
                removeUserInfo();
                break;
              case 422:
                const { message, errors: receivedErrors } = err.response.data;
                setErrors({ message, ...receivedErrors });
                break;
              default:
                setErrors({
                  message: "что-то пошло не так, попробуйте позже",
                });
            }
            setIsRegisteringLoading(false);
          }
        });
    } else {
      showUserLoginPopover();
    }
  };

  const examTimeDuration = useMemo(() => {
    const duration = startOfExam
      ? Math.floor((endOfExam.getTime() - startOfExam.getTime()) / 1000)
      : 0;
    return convertSecondsToObject(duration);
  }, [endOfExam, startOfExam]);

  const examTime = {
    isExamStarted,
    isExamFinished,
    examTimeDuration,
    seconds: isExamStarted
      ? isExamFinished
        ? 0
        : timeToEnd.seconds
      : timeToStart.seconds,
    minutes: isExamStarted
      ? isExamFinished
        ? 0
        : timeToEnd.minutes
      : timeToStart.minutes,
    hours: isExamStarted
      ? isExamFinished
        ? 0
        : timeToEnd.hours
      : timeToStart.hours,
    days: isExamStarted
      ? isExamFinished
        ? 0
        : timeToEnd.days
      : timeToStart.days,
  };

  const changeExamPassword = (newPassword) => {
    setExamPassword(newPassword);
  };

  return (
    <ExamInfoContext.Provider
      value={{
        examTime,
        canUserRegister,
        exam,
        isUserRegisteredToExam,
        registerToExam,
        examPassword,
        changeExamPassword,
        isContextLoaded,
        isRegisteringLoading,
        errors,
      }}
    >
      {children}
    </ExamInfoContext.Provider>
  );
};
