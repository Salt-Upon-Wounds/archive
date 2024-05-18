import { useContext } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

import { QuestionGradeContext } from "../../contexts/question-grade-context/question-grade.context";

import NumberInput from "../inputs/number-input.component";

const QuestionGrade = ({ canUserChangeGrade = false, questionId }) => {
  const {
    isContextLoaded,
    isLoading,
    grade,
    hasChange,
    submitGrade,
    changeGrade,
    newGrade,
    showGradeEnabled,
    changeGradeEnabled,
    errors,
  } = useContext(QuestionGradeContext);

  const handleChange = (e) => {
    changeGrade(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitGrade();
  };

  if (!isContextLoaded) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      {showGradeEnabled && (
        <p className="lead">Оценка: {grade === null ? "not checked" : grade}</p>
      )}
      {canUserChangeGrade && changeGradeEnabled && (
        <Form onSubmit={handleSubmit}>
          {errors.message && <p className="text-danger">{errors.message}</p>}
          <Row>
            <Col md={6}>
              <NumberInput
                label="Grade"
                value={newGrade}
                id={`grade-of-question-${questionId}`}
                onChange={handleChange}
                error={errors.grade}
              />
            </Col>
            <Col xs={12}>
              {hasChange && (
                <Button
                  variant="success"
                  disabled={isLoading}
                  type="submit"
                  className="my-2 my-md-0"
                >
                  {isLoading ? "загрузка..." : "Обновление оценки"}
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
};

export default QuestionGrade;
