import { useEffect, useState } from "react";
import { Form, Container, Button } from "react-bootstrap";

import AnswerDescriptive from "./answer-descriptive.component";
import AnswerFillTheBlank from "./answer-fill-the-blank.component";
import AnswerMultipleAnswers from "./answer-multiple-answers.component";
import AnswerSelectTheAnswer from "./answer-select-the-answer.component";
import AnswerTrueOrFalse from "./answer-true-or-false.component";
import AnswerOrdering from "./answer-ordering.component";

import QuestionInfo from "./question-info.component";


const AnswerQuestion = ({question}) => {

  const [res, setRes] = useState(-1);

  const [userAnswer, setUserAnswer] = useState([]);

  useEffect(()=>{
    setRes(-1);
  }, [question]);

  let checkSelectTheAnswer = () => {
    if (Number(userAnswer) === Number(question.answer)) setRes(1);
    else setRes(0);
  }

  let checkFillTheBlank = () => {
    console.log(userAnswer);
    if (question.answer.includes(userAnswer.toString())) setRes(1);
    else setRes(0);
  }

  let form, handler = null;
  switch (question.type) {
    case "descriptive":
      form = <AnswerDescriptive />;
      break;
    case "fill the blank":
      form = <AnswerFillTheBlank  question={question} userAnswerSetter={setUserAnswer}/>;
      handler = checkFillTheBlank;
      break;
    case "multiple answer":
      form = <AnswerMultipleAnswers  />;
      break;
    case "select the answer":
      form = <AnswerSelectTheAnswer question={question} userAnswerSetter={setUserAnswer} />;
      handler = checkSelectTheAnswer;
      break;
    case "true or false":
      form = <AnswerTrueOrFalse  />;
      break;
    case "ordering":
      form = <AnswerOrdering  />;
      break;
    default:
  }

  return (
    <div className="flex-grow-1">
      <div className="d-flex justify-content-around border  bg-white shadow py-2 align-items-center">
        {/* <ExamTime color="dark" examTime={examTime} /> */}
        <Button
          variant="success"
          onClick={() => {
            handler();
          }}
          className="h-100 me-2"
        >
          {res === 1 ? 'Верно' : (res === 0 ? 'Неверно' : 'Проверить')}
        </Button>
      </div>

      <Container className="h-100">
        <Form className="h-100 d-flex flex-column justify-content-around">
          <QuestionInfo
            questionText={question.text}
            questionScore={1}
            questionInput={
              question.type === "fill the blank"
                ? form
                : null
            }
          />
          {question.type === "fill the blank"
            ? null
            : form}
        </Form>
      </Container>
    </div>
  );
};

export default AnswerQuestion;
