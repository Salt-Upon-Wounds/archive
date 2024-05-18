import { useState, useEffect, useRef, useContext } from "react";

import { Button, Form, Row, Col } from "react-bootstrap";

import { CreateQuestionContext } from "../../contexts/create-question-context/create-question.context";

import QuestionText from "../question-form-partials/question-text.component";
import QuestionScore from "../question-form-partials/question-score.component";
import QuestionOptions from "../question-form-partials/question-options.component";

import apiRoutes from "../../constants/api-routes.constant";

const CreateMultipleAnswers = ({ examId, addQuestion, readOnly = false }) => {
  const [states, setStates] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [questionScore, setQuestionScore] = useState(0);
  const nextStateId = useRef(1);
  const {
    createQuestion,
    dismissForm,
    isLoading,
    areStatesValid,
    errors,
  } = useContext(CreateQuestionContext);

  useEffect(() => {
    if (
      states.length > 0 &&
      states[states.length - 1].id >= nextStateId.current
    ) {
      nextStateId.current = states[states.length - 1].id + 1;
    }
  }, [states]);

  const addState = () => {
    setStates((prevStates) => [
      ...prevStates,
      { text_part: "", integer_part: 0, id: nextStateId.current },
    ]);
  };

  const deleteState = (stateId) => {
    const newStates = states.filter((state) =>
      state.id === stateId ? false : true
    );
    setStates(newStates);
  };

  const changeState = ({ id, text_part = null, integer_part = null }) => {
    const newStates = states.map((state) => {
      if (state.id === id) {
        const newObj = {};
        if (text_part !== null) {
          newObj.text_part = text_part;
        }
        if (integer_part !== null) {
          newObj.integer_part = integer_part;
        }
        return { ...state, ...newObj };
      }
      return state;
    });
    setStates(newStates);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const bodyOfRequest = {
      question_text: questionText,
      question_score: questionScore,
      question_type_id: 3,
    };

    if (!areStatesValid({ states, questionTypeId: 3 })) {
      return;
    }

    const question = await createQuestion({
      examId,
      questionBody: bodyOfRequest,
      stateBodies: states.map((state) => {
        return { text_part: state.text_part, integer_part: state.integer_part };
      }),
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
    <Form onSubmit={handleCreate} className="my-4">
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
        <Col>
          <QuestionOptions
            notCreatedStates={states}
            deleteState={deleteState}
            addState={addState}
            changeState={changeState}
            error={errors.question_options}
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

export default CreateMultipleAnswers;
