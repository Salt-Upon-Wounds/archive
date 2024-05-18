import { useContext, useState, createContext } from "react";
import axios from "axios";

import { AuthenticationContext } from "../authentication-context/authentication.context";

import { questionsStoreRequest } from "../../services/questions/questions.service";
import { statesStoreRequest } from "../../services/states/states.service";

import { isStatesValid } from "../../utilities/question-form-parts.utility";

export const CreateQuestionContext = createContext();

export const CreateQuestionProvider = ({ onDismiss, children }) => {
  const { token, removeUserInfo } = useContext(AuthenticationContext);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const areStatesValid = ({ states, questionTypeId }) => {
    switch (Number(questionTypeId)) {
      case 2:
        if (!isStatesValid(states, 2)) {
          setErrors({ question_answers: "заполните все поля" });
          return false;
        }
        return true;

      case 3:
        if (!isStatesValid(states, 3)) {
          setErrors({ question_options: "заполните все поля" });
          return false;
        }
        return true;

      case 4:
        if (!isStatesValid(states, 4)) {
          setErrors({ question_options: "заполните все поля" });
          return false;
        }
        return true;

      case 6:
        if (!isStatesValid(states, 6)) {
          setErrors({ question_answers: "заполните все поля" });
          return false;
        }
        return true;

      default:
    }
  };

  const createQuestion = async ({ examId, questionBody, stateBodies }) => {
    try {
      setIsLoading(true);
      const questionStoreResponse = await questionsStoreRequest(
        examId,
        questionBody,
        token
      );
      const { question } = questionStoreResponse.data.data;
      if (stateBodies && stateBodies.length > 0) {
        for (const stateBody of stateBodies) {
          await statesStoreRequest(
            examId,
            question.question_id,
            stateBody,
            token
          );
        }
      }
      setIsLoading(false);
      setErrors({});
      return question;
    } catch (e) {
      switch (Number(e?.response?.status)) {
        case 401:
          removeUserInfo();
          break;
        case 422:
          const { errors: receivedErrors, message } = e.response.data;
          const newErrors = { ...receivedErrors, message };
          for (const error in newErrors) {
            if (Array.isArray(newErrors[error])) {
              newErrors[error] = newErrors[error][0];
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
      return null;
    }
  };

  const value = {
    createQuestion,
    areStatesValid,
    isLoading,
    errors,
    dismissForm: onDismiss,
  };
  return (
    <CreateQuestionContext.Provider value={value}>
      {children}
    </CreateQuestionContext.Provider>
  );
};
