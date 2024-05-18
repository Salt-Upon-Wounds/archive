import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useMountedState } from "react-use";

import { AuthenticationContext } from "../authentication-context/authentication.context";

import {
  questionsShowRequest,
  questionsUpdateRequest,
  questionsDeleteRequest,
} from "../../services/questions/questions.service";

import {
  statesIndexRequest,
  statesDeleteRequest,
  statesUpdateRequest,
  statesStoreRequest,
} from "../../services/states/states.service";

import useAsyncError from "../../hooks/useAsyncError";

export const EditQuestionContext = createContext();

export const EditQuestionProvider = ({ children, examId, questionId }) => {
  const [question, setQuestion] = useState(null);
  const [states, setStates] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const { token, removeUserInfo } = useContext(AuthenticationContext);
  const isMounted = useMountedState();
  const throwError = useAsyncError();

  const addError = (newErrors) => {
    setErrors(newErrors);
  };

  useEffect(() => {
    if (!token || isLoading || isContextLoaded || isFailed) {
      return;
    }
    setIsLoading(true);
    const requests = [
      questionsShowRequest(examId, questionId, token),
      statesIndexRequest(examId, questionId, token),
    ];

    axios
      .all(requests)
      .then(
        axios.spread((...responses) => {
          if (isMounted()) {
            const questionsShowResponse = responses[0];
            const statesIndexResponse = responses[1];
            const { question } = questionsShowResponse.data.data;
            setQuestion(question);
            const { states: newStates } = statesIndexResponse.data.data;
            const changedStates = newStates.map((state) => ({
              text_part: state.text_part,
              id: state.state_id,
              integer_part: state.integer_part,
            }));
            setStates(changedStates);
            setIsContextLoaded(true);
            setIsLoading(false);
          }
        })
      )
      .catch((errors) => {
        if (isMounted()) {
          switch (Number(errors?.response?.status)) {
            case 401:
              removeUserInfo();
              break;
            default:
              throwError(errors);
          }
          setIsFailed(true);
          setIsLoading(false);
        }
      });
  }, [
    questionId,
    isFailed,
    examId,
    token,
    isMounted,
    isLoading,
    isContextLoaded,
    removeUserInfo,
    throwError,
  ]);

  const updateQuestion = async ({
    question_text,
    question_score,
    deletedStateIds,
    changedStates,
    createdStates,
  }) => {
    try {
      setIsLoading(true);
      const bodyOfRequest = {};
      if (question_text) {
        bodyOfRequest.question_text = question_text;
      }
      if (question_score) {
        bodyOfRequest.question_score = question_score;
      }
      const questionChanged = Object.keys(bodyOfRequest).length !== 0;
      if (questionChanged) {
        const questionResponse = await questionsUpdateRequest(
          examId,
          questionId,
          bodyOfRequest,
          token
        );
        const { question: receivedQuestion } = questionResponse.data.data;
        setQuestion(receivedQuestion);
      }
      if (deletedStateIds) {
        for (const deletedStateId of deletedStateIds) {
          await statesDeleteRequest(examId, questionId, deletedStateId, token);
        }
      }
      const newStates =
        deletedStateIds && deletedStateIds.length > 0
          ? [
              ...states.filter((state) =>
                deletedStateIds.includes(state.id) ? false : true
              ),
            ]
          : [...states];
      if (createdStates) {
        for (const createdState of createdStates) {
          const createdStateBody = {};
          if (createdState.integer_part !== undefined) {
            createdStateBody.integer_part = createdState.integer_part;
          }
          if (createdState.text_part !== undefined) {
            createdStateBody.text_part = createdState.text_part;
          }
          const createdStateResponse = await statesStoreRequest(
            examId,
            questionId,
            createdStateBody,
            token
          );
          const { state: currentState } = createdStateResponse.data.data;
          newStates.push({
            text_part: currentState.text_part,
            integer_part: currentState.integer_part,
            id: currentState.state_id,
          });
        }
      }
      if (changedStates) {
        for (const changedState of changedStates) {
          const changedStateBody = {};
          if (changedState.integer_part !== undefined) {
            changedStateBody.integer_part = changedState.integer_part;
          }
          if (changedState.text_part !== undefined) {
            changedStateBody.text_part = changedState.text_part;
          }
          const changeStateResponse = await statesUpdateRequest(
            examId,
            questionId,
            changedState.id,
            changedStateBody,
            token
          );

          const { state: receivedState } = changeStateResponse.data.data;

          const currentStateIndex = newStates.findIndex(
            (state) => state.id === receivedState.state_id
          );
          newStates[currentStateIndex].text_part = receivedState.text_part;
          newStates[currentStateIndex].integer_part =
            receivedState.integer_part;
        }
      }

      setStates(newStates);
      setIsLoading(false);
      setErrors({});
    } catch (errors) {
      if (isMounted()) {
        switch (Number(errors?.response?.status)) {
          case 401:
            removeUserInfo();
            break;
          case 422:
            const { message, errors: receivedErrors } = errors.response.data;
            setErrors({ message, ...receivedErrors });
            break;
          default:
            setErrors({
              message: "что-то пошло не так, попробуйте позже",
            });
        }
        setIsLoading(false);
      }
    }
  };

  const deleteQuestion = async () => {
    setIsDeleting(true);
    try {
      await questionsDeleteRequest(examId, questionId, token);
      setIsDeleting(false);
      setErrors({});
      return true;
    } catch (e) {
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
      setIsDeleting(false);
      return false;
    }
  };

  const value = {
    question,
    errors,
    updateQuestion,
    addError,
    states,
    isLoading,
    isDeleting,
    isContextLoaded,
    deleteQuestion,
  };
  return (
    <EditQuestionContext.Provider value={value}>
      {children}
    </EditQuestionContext.Provider>
  );
};
