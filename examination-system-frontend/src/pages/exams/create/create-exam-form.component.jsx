import { useState, useContext } from "react";
import { Alert, Button, Row, Col, Form } from "react-bootstrap";
import { useMountedState } from "react-use";
import { useHistory } from "react-router-dom";

import TextInput from "../../../components/inputs/text-input.component";
import NumberInput from "../../../components/inputs/number-input.component";
// import TextareaInput from "../../../components/inputs/textarea-input.component";
import CheckboxInput from "../../../components/inputs/checkbox-input.component";
import PasswordInput from "../../../components/inputs/password-input.component";

import programRoutes from "../../../constants/program-routes.constant";

import { examsStoreRequest } from "../../../services/exams/exams.service";

import { AuthenticationContext } from "../../../contexts/authentication-context/authentication.context";
import { NotificationContext } from "../../../contexts/notification-context/notification.context";
import { convertToUTC } from "../../../utilities/dateAndTime.utility";

const CreateExamForm = ({ ...props }) => {
  // exam description part commented
  const [needsPassword, setNeedsPassword] = useState(false);
  const [examName, setExamName] = useState("");
  // const [examDescription, setExamDescription] = useState("");
  const [examStart, setExamStart] = useState("");
  const [examEnd, setExamEnd] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [examPassword, setExamPassword] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { token, removeUserInfo } = useContext(AuthenticationContext);
  const { createNotification } = useContext(NotificationContext);
  const isMounted = useMountedState();
  const history = useHistory();

  const handleSubmit = (e) => {
    const bodyOfRequest = {
      exam_name: examName,
      // exam_description: examDescription,
      start_of_exam: convertToUTC(examStart),
      end_of_exam: convertToUTC(examEnd),
      total_score: totalScore,
      needs_confirmation: needsConfirmation,
    };
    if (needsPassword && examPassword !== "") {
      bodyOfRequest.password = examPassword;
    }
    e.preventDefault();
    setIsLoading(true);
    examsStoreRequest(token, bodyOfRequest)
      .then((response) => response.data.data)
      .then(({ exam }) => {
        if (isMounted()) {
          createNotification(
            `тест "${exam.exam_name}" создан успешно`,
            3000
          );
          setIsLoading(false);
          setErrors({});
          history.push(programRoutes.updateExam(exam.exam_id));
        }
      })
      .catch((err) => {
        if (isMounted()) {
          switch (Number(err?.response?.status)) {
            case 401:
              removeUserInfo();
              break;
            case 422:
              const { message, errors } = err.response.data;
              setErrors({ message, ...errors });
              break;
            default:
              setErrors({
                message: "что-то пошло не так, попробуйте позже",
              });
          }
          setIsLoading(false);
        }
      });
  };

  return (
    <div {...props}>
      <div className="shadow bg-white rounded p-3 m-4 border">
        <p className="text-muted lead">
          подсказка: Все внесенные данные можно изменить после сохранения
        </p>
        <Form onSubmit={handleSubmit}>
          {errors.message && <Alert variant="danger">{errors.message}</Alert>}
          <Row className="mt-3">
            <Col md={6} xl={3}>
              <TextInput
                error={errors.exam_name}
                label="Тема теста"
                id="exam-name"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Тема теста"
                autoFocus
              />
            </Col>
          </Row>
          {
            // <Row className="mt-3">
            //   <Col>
            //     <TextareaInput
            //       error={errors.exam_description}
            //       label="Exam Description"
            //       id="exam-description"
            //       value={examDescription}
            //       onChange={(e) => setExamDescription(e.target.value)}
            //       placeholder="Exam Description"
            //     />
            //   </Col>
            // </Row>
          }
          <Row className="mt-3">
            <Col xs={12} md={6}>
              <TextInput
                error={errors.start_of_exam}
                label="Дата открытия"
                id="exams-start"
                placeholder="Дата открытия"
                value={examStart}
                onChange={(e) => setExamStart(e.target.value)}
              />
              <p className="text-muted small">
                * в YYYY-MM-DD HH:MM:SS формате <br />
                Пример: для Дек 1ого 2021 в 8 утра: <br />
                2021-12-01 08:00:00
              </p>
            </Col>
            <Col xs={12} md={6}>
              <TextInput
                error={errors.end_of_exam}
                label="Дата закрытия"
                id="exams-end"
                placeholder="Дата закрытия"
                value={examEnd}
                onChange={(e) => setExamEnd(e.target.value)}
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
                label="Баллы за тест"
                id="total-score"
                placeholder="Баллы"
                value={totalScore}
                onChange={(e) => setTotalScore(e.target.value)}
              />
              <p className="text-muted small">* максимум баллов за тест</p>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <CheckboxInput
                error={errors.needs_confirmation}
                label="Нужно ли подтверждение?"
                id="confirmation-required"
                checked={needsConfirmation}
                onChange={(e) => setNeedsConfirmation(e.target.checked)}
              />
              <p className="text-muted small">
                * если включено, то составитель должен одобрить прохождение
                теста для каждого зарегистрированного на него пользователя
              </p>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12} md={6}>
              <CheckboxInput
                error={errors.needs_password}
                checked={!!needsPassword}
                onChange={(e) => setNeedsPassword(e.target.checked)}
                label="Нужен ли пароль?"
                id="needs-password"
              />
              <p className="text-muted small">
                * если включено, то для регитсрации на тест нужно ввести пароль
              </p>
            </Col>
            <Col xs={12} md={6} xl={4} style={{ minHeight: "100px" }}>
              {needsPassword && (
                <PasswordInput
                  error={errors.password}
                  label="Пароль"
                  id="exam-password"
                  placeholder="Пароль для теста"
                  value={examPassword}
                  onChange={(e) => setExamPassword(e.target.value)}
                />
              )}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Button variant="success" disabled={isLoading} type="submit">
                {isLoading ? "Загрузка..." : "Создание"}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default CreateExamForm;
