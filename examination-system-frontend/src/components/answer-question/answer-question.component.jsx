import { useContext } from "react";
import { Form, Container } from "react-bootstrap";

import { AnswerQuestionContext } from "../../contexts/answer-question-context/answer-question.context";
import { useDebounce } from "react-use";

import AnswerDescriptive from "./answer-descriptive.component";
import AnswerFillTheBlank from "./answer-fill-the-blank.component";
import AnswerMultipleAnswers from "./answer-multiple-answers.component";
import AnswerSelectTheAnswer from "./answer-select-the-answer.component";
import AnswerTrueOrFalse from "./answer-true-or-false.component";
import AnswerOrdering from "./answer-ordering.component";

import QuestionInfo from "./question-info.component";

const AnswerQuestion = ({ readOnly = false }) => {
  const {
    isContextLoaded,
    hasChange,
    question,
    updateAnswers,
    isLoading,
    errors,
    answers,
  } = useContext(AnswerQuestionContext);

  useDebounce(
    () => {
      if (hasChange && !isLoading) {
        updateAnswers();
      }
    },
    500,
    [hasChange, isLoading, answers]
  );

  if (!isContextLoaded) {
    return <p> Загрузка... </p>;
  }

  let form;
  console.log(question);
  switch (question.question_type.question_type_name) {
    case "descriptive":
      form = <AnswerDescriptive readOnly={readOnly} />;
      break;
    case "fill the blank":
      form = <AnswerFillTheBlank readOnly={readOnly} />;
      break;
    case "multiple answer":
      form = <AnswerMultipleAnswers readOnly={readOnly} />;
      break;
    case "select the answer":
      form = <AnswerSelectTheAnswer readOnly={readOnly} />;
      break;
    case "true or false":
      form = <AnswerTrueOrFalse readOnly={readOnly} />;
      break;
    case "ordering":
      form = <AnswerOrdering readOnly={readOnly} />;
      break;
    default:
  }

  return (
    <div className="flex-grow-1">
      <Container className="h-100">
        {errors.message && <p className="text-danger">{errors.message}</p>}
        {errors &&
          Object.keys(errors).map((errorKey) => {
            if (errorKey === "message") return null;
            return (
              <p key={errorKey} className="text-danger">
                {errors[errorKey]}
              </p>
            );
          })}
        <Form className="h-100 d-flex flex-column justify-content-around">
          <QuestionInfo
            questionText={question.question_text}
            questionScore={question.question_score}
            questionInput={
              question.question_type.question_type_name === "fill the blank"
                ? form
                : null
            }
          />
          {question.question_type.question_type_name === "fill the blank"
            ? null
            : form}
          {!readOnly &&
            (hasChange ? (
              isLoading ? (
                <p> Сохранение... </p>
              ) : (
                <p> Не сохранено</p>
              )
            ) : (
              <p> Все изменения сохранены </p>
            ))}
        </Form>
      </Container>
    </div>
  );
};

export default AnswerQuestion;
