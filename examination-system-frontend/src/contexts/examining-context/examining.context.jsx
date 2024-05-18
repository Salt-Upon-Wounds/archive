import { createContext, useMemo, useContext, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useMountedState } from "react-use";

import useAsyncError from "../../hooks/useAsyncError";

import { ExamInfoContext } from "../exam-info-context/exam-info.context";
import { AuthenticationContext } from "../authentication-context/authentication.context";

import { getCurrentParticipantRequest } from "../../services/participants/participants.service";
import { questionsIndexRequest } from "../../services/questions/questions.service";
import { finishExamRequest } from "../../services/participants/participants.service";

export const ExaminingContext = createContext();

export const ExaminingProvider = ({ children }) => {
  const examInfo = useContext(ExamInfoContext);
  const { token, removeUserInfo } = useContext(AuthenticationContext);

  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const [participant, setParticipant] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isUserFinishedExam, setIsUserFinishedExam] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const isMounted = useMountedState();
  const { examId } = useParams();
  const { pathname } = useLocation();
  const throwError = useAsyncError();

  const questionId = isNaN(pathname.split("/").reverse()[0])
    ? undefined
    : pathname.split("/").reverse()[0];

  const currentQuestionIndex = useMemo(
    () =>
      questions.findIndex(
        (question) => Number(question.question_id) === Number(questionId)
      ),
    [questionId, questions]
  );
  const nextQuestionId = useMemo(() => {
    if (
      currentQuestionIndex === -1 ||
      currentQuestionIndex === questions.length - 1
    ) {
      return -1;
    }
    return Number(questions[currentQuestionIndex + 1].question_id);
  }, [currentQuestionIndex, questions]);
  const prevQuestionId = useMemo(() => {
    if (currentQuestionIndex === -1 || currentQuestionIndex === 0) {
      return -1;
    }
    return Number(questions[currentQuestionIndex - 1].question_id);
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (!examInfo.isContextLoaded) {
      return;
    }
    const haveNewChanges =
      (examInfo.isUserRegisteredToExam && !participant) ||
      (isUserFinishedExam && participant.status === "NOT_FINISHED");
    if (
      examInfo.isContextLoaded &&
      participant !== undefined &&
      !isContextLoaded &&
      !haveNewChanges
    ) {
      setIsContextLoaded(true);
    } else if (isContextLoaded && haveNewChanges) {
      setIsContextLoaded(false);
    }
  }, [
    examInfo.isContextLoaded,
    examInfo.isUserRegisteredToExam,
    isUserFinishedExam,
    isContextLoaded,
    participant,
  ]);

  useEffect(() => {
    if (isFailed || isContextLoaded || isLoading || !examInfo.isContextLoaded) {
      return;
    }
    if (!examInfo.isUserRegisteredToExam) {
      setParticipant(null);
      return;
    }
    setIsLoading(true);
    // TODO: get index questions after getting participant and if participant.status is equal to 'not_finished'
    getCurrentParticipantRequest(examId, token)
      .then((response) => {
        if (isMounted()) {
          const currentParticipantResponse = response;

          const {
            participant: receivedParticipant,
          } = currentParticipantResponse.data.data;
          setParticipant(receivedParticipant);

          if (
            receivedParticipant.status === "NOT_FINISHED" &&
            examInfo.examTime.isExamStarted &&
            !examInfo.examTime.isExamFinished &&
            (!examInfo.exam.needs_confirmation ||
              (examInfo.exam.needs_confirmation &&
                receivedParticipant.confirmed))
          ) {
            return questionsIndexRequest(examId, token);
          }
        }
      })
      .then((response) => {
        if (isMounted()) {
          if (response) {
            const { questions: receivedQuestions } = response.data.data;
            setQuestions(receivedQuestions);
          }
          setIsLoading(false);
        }
      })
      .catch((errors) => {
        if (isMounted()) {
          switch (Number(errors?.response?.status)) {
            case 401:
              removeUserInfo();
              setIsFailed(true);
              break;
            default:
              throwError(errors);
          }
          setIsLoading(false);
        }
      });
  }, [
    examInfo.isUserRegisteredToExam,
    isUserFinishedExam,
    isContextLoaded,
    isMounted,
    participant,
    examId,
    token,
    isLoading,
    removeUserInfo,
    examInfo,
    isFailed,
    throwError,
  ]);

  const finishExam = () => {
    setIsLoading(true);
    finishExamRequest(examId, token)
      .then(() => {
        setIsUserFinishedExam(true);
        setIsLoading(false);
        setErrors({});
      })
      .catch((err) => {
        switch (Number(err?.response?.status)) {
          case 401:
            removeUserInfo();
            break;
          case 422:
            const { message } = err.response.data;
            setErrors({ message });
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
    ...examInfo,
    isContextLoaded,
    participant,
    errors: { ...examInfo.errors, ...errors },
    isLoading,
    nextQuestion: nextQuestionId,
    prevQuestion: prevQuestionId,
    firstQuestion: questions[0] ? questions[0].question_id : null,
    isUserFinishedExam,
    finishExam,
  };

  return (
    <ExaminingContext.Provider value={value}>
      {children}
    </ExaminingContext.Provider>
  );
};
