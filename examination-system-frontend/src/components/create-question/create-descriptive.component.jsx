import { useState, useContext } from "react";

import { Button, Form, Row, Col } from "react-bootstrap";

import { CreateQuestionContext } from "../../contexts/create-question-context/create-question.context";

import QuestionText from "../question-form-partials/question-text.component";
import QuestionScore from "../question-form-partials/question-score.component";

import apiRoutes from "../../constants/api-routes.constant";

const CreateDescriptive = ({ examId, addQuestion, readOnly = false }) => {
  const [questionText, setQuestionText] = useState("");
  const [questionScore, setQuestionScore] = useState(0);
  const { createQuestion, dismissForm, errors, isLoading } = useContext(
    CreateQuestionContext
  );

  const handleCreate = async (e) => {
    e.preventDefault();

    const bodyOfRequest = {
      question_text: questionText,
      question_score: questionScore,
      question_type_id: 1,
    };

    const question = await createQuestion({
      examId,
      questionBody: bodyOfRequest,
    });
    if (!question) {
      return;
    }
    addQuestion({
      question_id: question.question_id,
      question_link: apiRoutes.questions.showQuestion(
        examId,
        question.question_id
      ),
    });
  };

  return (
    <Form className="my-4" onSubmit={handleCreate}>
      {errors.message && <p className="text-danger"> *{errors.message} </p>}
      <Row>
        <Col>
          <QuestionText
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            suffix={`not-created-question`}
            error={errors.question_text}
            readOnly={readOnly}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={6} xl={3}>
          <QuestionScore
            value={questionScore}
            error={errors.question_score}
            onChange={(e) => setQuestionScore(e.target.value)}
            suffix={`not-created-question`}
            readOnly={readOnly}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Button
            disabled={readOnly || isLoading}
            variant="success"
            type="submit"
          >
            {isLoading ? "Загрузка..." : "Создание"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => dismissForm()}
            className="ms-2"
          >
            Отмена
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateDescriptive;
