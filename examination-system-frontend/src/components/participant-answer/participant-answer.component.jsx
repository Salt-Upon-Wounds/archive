import AnswerQuestion from "../answer-question/answer-question.component";
import QuestionGrade from "../question-grade/question-grade.component";
import { Container } from "react-bootstrap";

import { AnswerQuestionProvider } from "../../contexts/answer-question-context/answer-question.context";
import { QuestionGradeProvider } from "../../contexts/question-grade-context/question-grade.context";

const ParticipantAnswer = ({
  questionId,
  examId,
  participantId,
  participantStatus,
  canUserChangeGrade,
}) => {
  return (
    <div className="border rounded p-2 my-5 text-start">
      <Container className=" border-bottom my-2 pb-3">
        <h4> Текст вопроса: </h4>
        <AnswerQuestionProvider
          questionId={questionId}
          examId={examId}
          participantId={participantId}
        >
          <AnswerQuestion readOnly={true} />
        </AnswerQuestionProvider>
      </Container>
      <Container className="my-2">
        <h4> Оценка: </h4>
        {participantStatus === "FINISHED" ||
        participantStatus === "WAIT_FOR_MANUAL_CORRECTING" ? (
          <QuestionGradeProvider
            participantId={participantId}
            questionId={questionId}
            participantStatus={participantStatus}
          >
            <QuestionGrade
              questionId={questionId}
              canUserChangeGrade={canUserChangeGrade}
            />
          </QuestionGradeProvider>
        ) : (
          <p>Тест не пройден</p>
        )}
      </Container>
    </div>
  );
};

export default ParticipantAnswer;
