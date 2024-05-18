import { useContext, useRef } from "react";
import { Alert, Button, Row, Col, Form } from "react-bootstrap";
import { useDebounce } from "react-use";

import TextInput from "../../../components/inputs/text-input.component";
import NumberInput from "../../../components/inputs/number-input.component";
// import TextareaInput from "../../../components/inputs/textarea-input.component";
import CheckboxInput from "../../../components/inputs/checkbox-input.component";
import PasswordInput from "../../../components/inputs/password-input.component";

import { convertToUTC } from "../../../utilities/dateAndTime.utility";

import { UpdateExamContext } from "../../../contexts/update-exam-context/update-exam.context";

const UpdateExamForm = ({ examId }) => {
  // exam description part commented
  const {
    exam,
    examName,
    changeExamName,
    // examDescription,
    // changeExamDescription,
    examStart,
    changeExamStart,
    examEnd,
    changeExamEnd,
    totalScore,
    changeTotalScore,
    examPassword,
    changeExamPassword,
    needsConfirmation,
    changeNeedsConfirmation,
    isLoading,
    errors,
    isPublished,
    isAnyChangeExist,
    handleUpdate,
  } = useContext(UpdateExamContext);
  const buttonRef = useRef();

  useDebounce(
    () => {
      if (isAnyChangeExist && buttonRef.current) {
        buttonRef.current.click();
      }
    },
    3000,
    [
      isAnyChangeExist,
      examName,
      examStart,
      examEnd,
      totalScore,
      examPassword,
      needsConfirmation,
    ]
  );

  const handleSubmit = (e) => {
    const bodyOfRequest = {};
    if (exam.exam_name !== examName) {
      bodyOfRequest.exam_name = examName;
    }
    // if (exam.exam_description !== examDescription) {
    //   bodyOfRequest.exam_description = examDescription;
    // }
    if (exam.start_of_exam !== examStart) {
      bodyOfRequest.start_of_exam = convertToUTC(examStart);
    }
    if (exam.end_of_exam !== examEnd) {
      bodyOfRequest.end_of_exam = convertToUTC(examEnd);
    }
    if (exam.total_score !== totalScore) {
      bodyOfRequest.total_score = totalScore;
    }
    if (exam.needs_confirmation !== needsConfirmation) {
      bodyOfRequest.needs_confirmation = needsConfirmation;
    }
    bodyOfRequest.password = examPassword;
    e.preventDefault();
    handleUpdate(bodyOfRequest);
  };

  if (!exam) {
    return <p>Загрузка...</p>;
  }
  return (
    <Form onSubmit={handleSubmit}>
      {errors.message && <Alert variant="danger">{errors.message}</Alert>}
      <Row className="mt-3">
        <Col md={6} xl={3}>
          <TextInput
            readOnly={isPublished}
            error={errors.exam_name}
            label="Тема теста"
            id="exam-name"
            value={examName}
            onChange={(e) => {
              changeExamName(e.target.value);
            }}
            placeholder="Тема теста"
          />
        </Col>
      </Row>
      {
        // <Row className="mt-3">
        //   <Col>
        //     <TextareaInput
        //       error={errors.exam_description}
        //       readOnly={isPublished}
        //       label="Exam Description"
        //       id="exam-description"
        //       value={examDescription}
        //       onChange={(e) => {
        //         changeExamDescription(e.target.value);
        //       }}
        //       placeholder="Exam Description"
        //     />
        //   </Col>
        // </Row>
      }
      <Row className="mt-3">
        <Col>
          <TextInput
            error={errors.start_of_exam}
            readOnly={isPublished}
            label="Дата открытия"
            id="exams-start"
            placeholder="Дата открытия"
            value={examStart}
            onChange={(e) => {
              changeExamStart(e.target.value);
            }}
          />
          <p className="text-muted small">
            * в YYYY-MM-DD HH:MM:SS формате <br />
            Пример: для Дек 1ого 2021 в 8 утра: <br />
            2021-12-01 08:00:00
          </p>
        </Col>
        <Col>
          <TextInput
            error={errors.end_of_exam}
            readOnly={isPublished}
            label="Дата закрытия"
            id="exams-end"
            placeholder="Дата закрытия"
            value={examEnd}
            onChange={(e) => {
              changeExamEnd(e.target.value);
            }}
          />
          <p className="text-muted small">
            * в YYYY-MM-DD HH:MM:SS формате <br />
            Пример: для Дек 1ого 2021 в 8 утра: <br />
            2021-12-01 08:00:00
          </p>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={6} xl={3}>
          <NumberInput
            error={errors.total_score}
            readOnly={isPublished}
            label="Максимум баллов"
            id="total-score"
            placeholder="Баллы"
            value={totalScore}
            onChange={(e) => {
              changeTotalScore(Number(e.target.value));
            }}
          />
          <p className="text-muted small">* общее количество баллов за тест</p>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <CheckboxInput
            readOnly={isPublished}
            error={errors.needs_confirmation}
            label="Нужно ли подтверждение?"
            id="confirmation-required"
            checked={needsConfirmation}
            onChange={(e) => {
              changeNeedsConfirmation(e.target.checked);
            }}
          />
          <p className="text-muted small">
            * если включено, то составитель должен одобрить прохождение
            теста для каждого зарегистрированного на него пользователя
          </p>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12} md={6} xl={4}>
          <PasswordInput
            error={errors.password}
            label="Пароль"
            id="exam-password"
            placeholder="Пароль"
            value={examPassword}
            onChange={(e) => {
              changeExamPassword(e.target.value);
            }}
          />
          <p className="text-muted small">
            {exam.has_password
              ? "* Пароль уже установлен"
              : "* Пароль еще не установлен"}
          </p>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          {isAnyChangeExist ? (
            <Button
              variant="success"
              disabled={isLoading}
              ref={buttonRef}
              type="submit"
            >
              {isLoading ? "Загрузка..." : "Сохранение изменений"}
            </Button>
          ) : (
            <p>Изменения сохранены</p>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default UpdateExamForm;
