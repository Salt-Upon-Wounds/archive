import { AnswerQuestionContext } from "../../../contexts/answer-question-context/answer-question.context";
import {
  questionsShowId_1,
  questionsShowId_2,
  questionsShowId_3,
  questionsShowId_4,
  questionsShowId_5,
  questionsShowId_6,
} from "../../../mocks/mocks/questions.mock";
import {
  statesIndexEmpty,
  statesIndexFillTheBlank,
  statesIndexMultipleAnswer,
  statesIndexSelectTheAnswer,
  statesIndexTrueOrFalse,
  statesIndexOrdering,
} from "../../../mocks/mocks/states.mock";

const getQuestion = (questionTypeId) => {
  let question;
  switch (Number(questionTypeId)) {
    case 1:
      question = questionsShowId_1;
      break;
    case 2:
      question = questionsShowId_2;
      break;
    case 3:
      question = questionsShowId_3;
      break;
    case 4:
      question = questionsShowId_4;
      break;
    case 5:
      question = questionsShowId_5;
      break;
    case 6:
      question = questionsShowId_6;
      break;
    default:
      throw new Error("questionTypeId in wrapper is required");
  }
  return question.data.question;
};

const getStates = (questionTypeId) => {
  let states;
  switch (Number(questionTypeId)) {
    case 1:
      states = statesIndexEmpty;
      break;
    case 2:
      states = statesIndexFillTheBlank;
      break;
    case 3:
      states = statesIndexMultipleAnswer;
      break;
    case 4:
      states = statesIndexSelectTheAnswer;
      break;
    case 5:
      states = statesIndexTrueOrFalse;
      break;
    case 6:
      states = statesIndexOrdering;
      break;
    default:
      throw new Error("questionTypeId is invalid in getStates in partials");
  }
  return states.data.states;
};

export const wrapper = (
  ui,
  {
    questionTypeId,
    question,
    states,
    hasChange,
    answers,
    changeAnswers,
    updateAnswers,
    isLoading,
    isContextLoaded,
    errors,
  }
) => {
  const value = {
    question: question || getQuestion(questionTypeId),
    states: states || getStates(questionTypeId),
    hasChange: hasChange || false,
    answers: answers || [],
    changeAnswers: changeAnswers || jest.fn(),
    updateAnswers: updateAnswers || jest.fn(),
    isLoading: isLoading || false,
    isContextLoaded: isContextLoaded === undefined ? true : isContextLoaded,
    errors: errors || {},
  };

  const WrappedElement = (
    <AnswerQuestionContext.Provider value={value}>
      {ui}
    </AnswerQuestionContext.Provider>
  );

  return { WrappedElement, value };
};
