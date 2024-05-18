import { useContext, useState } from "react";
import { Link, useParams, Redirect } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

import { ExaminingContext } from "../../../../contexts/examining-context/examining.context";
import { AnswerQuestionProvider } from "../../../../contexts/answer-question-context/answer-question.context";

import useMetaTag from "../../../../hooks/useMetaTag";
import AnswerQuestion from "../../../../components/answer-question/answer-question.component";
import ExamTime from "../../../../components/exam-time/exam-time.component";
import Modal from "../../../../components/modal/modal.component";

import programRoutes from "../../../../constants/program-routes.constant";

const ExamQuestionPage = () => {
  const {
    isContextLoaded,
    isLoading,
    nextQuestion,
    prevQuestion,
    examTime,
    participant,
    finishExam,
    isUserFinishedExam,
    errors,
  } = useContext(ExaminingContext);
  const { examId, questionId } = useParams();
  const [showModal, setShowModal] = useState(false);

  useMetaTag({
    title: "Examining",
    ogTitle: "Examining",
  });

  if (!isContextLoaded) {
    return <p> Загрузка... </p>;
  }

  if (
    !examTime.isExamStarted ||
    examTime.isExamFinished ||
    participant === null ||
    isUserFinishedExam
  ) {
    return <Redirect to={programRoutes.examiningOverview(examId)} />;
  }

  const handleClick = (disabled) => {
    if (disabled) {
      return { onClick: (e) => e.preventDefault() };
    }
    return {};
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="d-flex justify-content-around border  bg-white shadow py-2 align-items-center">
        <ExamTime color="dark" examTime={examTime} />
        <Button
          variant="success"
          onClick={() => {
            setShowModal(true);
          }}
          className="h-100 me-2"
        >
          Завершить тест
        </Button>
      </div>
      <Container className="bg-white shadow border flex-grow-1 rounded p-4 my-2 text-start">
        <div style={{ minHeight: "400px" }} className="d-flex ">
          {errors.message && <p className="text-danger">{errors.message}</p>}
          <AnswerQuestionProvider
            questionId={questionId}
            examId={examId}
            participantId={participant.participant_id}
          >
            <AnswerQuestion />
          </AnswerQuestionProvider>
        </div>
        <div className="d-flex justify-content-end">
          <Link
            {...handleClick(prevQuestion === -1)}
            className="me-3"
            to={programRoutes.examiningQuestion(examId, prevQuestion)}
          >
            <Button variant="success" disabled={prevQuestion === -1}>
              Пред
            </Button>
          </Link>
          <Link
            {...handleClick(nextQuestion === -1)}
            to={programRoutes.examiningQuestion(examId, nextQuestion)}
          >
            <Button
              variant="success"
              disabled={nextQuestion === -1 || isLoading}
            >
              След
            </Button>
          </Link>
        </div>
        <Modal
          buttonLabels={
            isLoading
              ? ["Загрузка...", "Загрузка..."]
              : ["Да, завершить тест", "Отмена"]
          }
          onConfirm={finishExam}
          isShown={showModal}
          closeModal={() => setShowModal(false)}
          disabled={isLoading}
          title="Finish Exam"
          body="Вы уверены, что хотите завершить тест? Вы не сможете изменить ответы после этого."
        />
      </Container>
    </div>
  );
};

export default ExamQuestionPage;
