import { QuestionTypesProvider } from "../../../contexts/question-types-context/question-types.context";
import errorMessages from "../../../constants/error-messages.constant";

export const wrapper = (ui) => (
  <QuestionTypesProvider>{ui}</QuestionTypesProvider>
);

export const savedMessage = "all changes saved";
export const buttonMessage = "Save Changes";

export const errors = {
  emptyQuestionText: errorMessages.questions.question_text.empty,
  zeroOrNegativeQuestionScore:
    errorMessages.questions.question_score.notPositive,
  answerFieldIsEmpty: errorMessages.questions.question_answers.emptyAnswer,
  optionFieldIsEmpty: errorMessages.questions.question_options.emptyOption,
};

export const values = {
  questionText: "text text text",
  newQuestionText: "new new new",
  questionScore: "100",
  newQuestionScore: "80",
  option1: "option 1 option 1",
  option2: "option 2 option 2",
  option3: "option 3 option 3",
  newOption1: "new option 1 new option 1",
  newOption2: "new option 2 new option 2",
  newOption3: "new option 3 new option 3",
  answer1: "answer 1 answer 1",
  answer2: "answer 2 answer 2",
  answer3: "answer 3 answer 3",
  newAnswer1: "new answer 1 new answer 1",
  newAnswer2: "new answer 2 new answer 2",
  newAnswer3: "new answer 3 new answer 3",
};
