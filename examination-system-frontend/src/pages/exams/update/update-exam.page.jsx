import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import UpdateExamForm from "./update-exam-form.component";
import useMetaTag from "../../../hooks/useMetaTag";
import EditQuestion from "../../../components/edit-question/edit-question.component";
import CreateQuestion from "../../../components/create-question/create-question.component";
import ElementContainer from "./element-container.component";
import { QuestionTypesProvider } from "../../../contexts/question-types-context/question-types.context";
import { UpdateExamContext } from "../../../contexts/update-exam-context/update-exam.context";
import { BsExclamationTriangle } from "react-icons/bs";
import programRoutes from "../../../constants/program-routes.constant";
import { isDateInThePast } from "../../../utilities/dateAndTime.utility";

const UpdateExamPage = () => {
  const [addQuestionFormVisible, setAddQuestionFormVisible] = useState(false);
  const {
    exam,
    examId,
    questions,
    addQuestion,
    deleteQuestion,
    isPublished,
    publishExam,
    unpublishExam,
    isPublishStateChanging,
  } = useContext(UpdateExamContext);
  useMetaTag({
    title: "Update Exam",
    ogTitle: "Update Exam",
  });

  if (!exam) {
    return <p> Загрузка... </p>;
  }

  const userCanEdit = !isPublished || !isDateInThePast(exam.start_of_exam);

  return (
    <div className="text-start mb-5">
      <ElementContainer>
        <div className="d-flex flex-column">
          <div>
            {userCanEdit && (
              <Button
                variant="success"
                onClick={() => {
                  if (!isPublished) {
                    publishExam();
                  } else {
                    unpublishExam();
                  }
                }}
                disabled={isPublishStateChanging}
              >
                {isPublishStateChanging
                  ? "Загрузка..."
                  : isPublished
                  ? "Закрыть Тест"
                  : "открыть Тест"}
              </Button>
            )}
            <Link to={programRoutes.indexParticipants(examId)}>
              <Button variant="primary" className="mx-2">
                участники
              </Button>
            </Link>
          </div>
          <div>
            <p className="text-muted small my-2">
              <BsExclamationTriangle />
              <span>
                {isPublished
                  ? "если вы хотите редактировать тест, его нужно закрыть"
                  : "вы должны открыть тест, чтобы позвлить пользователям регистрироваться и проходить его"}
              </span>
            </p>
            {!userCanEdit && (
              <p className="text-muted small my-2">
                <BsExclamationTriangle />
                <span>
                  Невозможно редактировать, т.к. тест уже идет или завершен.
                </span>
              </p>
            )}
          </div>
        </div>
      </ElementContainer>
      <ElementContainer>
        <UpdateExamForm examId={examId} />
      </ElementContainer>
      <QuestionTypesProvider>
        {questions.map((question) => {
          return (
            <ElementContainer key={question.question_id}>
              <EditQuestion
                readOnly={isPublished}
                examId={examId}
                questionId={question.question_id}
                deleteQuestion={() => deleteQuestion(question.question_id)}
              />
            </ElementContainer>
          );
        })}
        {addQuestionFormVisible ? (
          <ElementContainer>
            <CreateQuestion
              readOnly={isPublished}
              examId={examId}
              isVisible={addQuestionFormVisible}
              onDismiss={() => setAddQuestionFormVisible(false)}
              addQuestion={(questionObject) => {
                addQuestion(questionObject);
                setAddQuestionFormVisible(false);
              }}
            />
          </ElementContainer>
        ) : (
          <Button
            variant="success"
            className="w-100"
            onClick={() => setAddQuestionFormVisible(true)}
            disabled={isPublished}
          >
            Добавить вопрос
          </Button>
        )}
      </QuestionTypesProvider>
    </div>
  );
};

export default UpdateExamPage;
