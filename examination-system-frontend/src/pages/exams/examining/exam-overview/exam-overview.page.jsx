import { useContext } from "react";
import { Container, Button, Form, Table } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";

import { AuthenticationContext } from "../../../../contexts/authentication-context/authentication.context";
import { ExaminingContext } from "../../../../contexts/examining-context/examining.context";

import useMetaTag from "../../../../hooks/useMetaTag";
import ExamPassword from "../../../../components/exam-password/exam-password.component";

import programRoutes from "../../../../constants/program-routes.constant";

import useExamStatus from "../../../../hooks/useExamStatus";

const ExamOverviewPage = () => {
  const {
    exam,
    examTime,
    isContextLoaded,
    isRegisteringLoading,
    participant,
    firstQuestion,
    isUserFinishedExam,
    registerToExam,
    examPassword,
    changeExamPassword,
    errors,
  } = useContext(ExaminingContext);
  const { isUserAuthenticated, showUserLoginPopover, user } = useContext(
    AuthenticationContext
  );
  const { examId } = useParams();

  useMetaTag({
    title: "Exam Overview",
    ogTitle: "Exam Overview",
  });

  const isUserOwnExam = exam && user && exam.owner_id === user.user_id;

  const [examStatus] = useExamStatus({
    examStart: exam?.start_of_exam,
    examEnd: exam?.end_of_exam,
    isPublished: isUserOwnExam ? exam?.published : true,
  });

  const canUserRegisterToExam =
    examTime.isExamFinished === false && !participant && !isUserOwnExam;
  const canUserGoToExam =
    !!participant &&
    !isUserFinishedExam &&
    examTime.isExamStarted &&
    !examTime.isExamFinished &&
    firstQuestion !== null;

  const canUserSeeGrade =
    !!participant &&
    participant.status === "FINISHED";// &&
    //examTime.isExamFinished;

  const canUserEditExam =
    isUserOwnExam &&
    (exam?.published === false ? true : !examTime.isExamStarted);

  const canUserSeeAnswers =
    !!participant && !isUserOwnExam &&
    (participant.status === 'FINISHED' || participant.status === 'WAIT_FOR_MANUAL_CORRECTING');// && examTime.isExamFinished;

  const handleRegistration = (e) => {
    e.preventDefault();

    if (!isUserAuthenticated) {
      showUserLoginPopover();
    } else {
      registerToExam();
    }
  };

  if (!isContextLoaded) {
    return <p>Загрузка...</p>;
  }

  function status_ru(el) {
    switch (el) {
      case 'NOT_FINISHED': return 'Не выполнено';
      case 'FINISHED': return 'Выполнено';
      case 'WAIT_FOR_MANUAL_CORRECTING': return 'Ожидает проверки';
      default: return el;
    }
  }

  return (
    <div style={{ minHeight: "100vh" }} className="text-start d-flex">
      <Container className="flex-grow-1 m-2 m-md-3 m-lg-5 d-flex flex-column">
        <Container className="bg-white p-3 border shadow rounded">
          <Table>
            <tbody>
              <tr>
                <td>Тема теста</td>
                <td>{exam.exam_name}</td>
              </tr>
              <tr>
                <td>Составитель</td>
                <td>{exam.owner_name}</td>
              </tr>
              <tr>
                <td>Статус</td>
                <td>
                  {examStatus === "not started" ? "не начался" : ""}
                  {examStatus === "running" ? "открыт" : ""}
                  {examStatus === "finished" ? "завершен" : ""}
                  {examStatus === "not published" ? "закрыт" : ""}
                </td>
              </tr>
              <tr>
                <td>Открытие</td>
                <td>{exam.start_of_exam}</td>
              </tr>
              <tr>
                <td>Закрытие</td>
                <td>{exam.end_of_exam}</td>
              </tr>
              <tr>
                <td>Максимум баллов</td>
                <td>{exam.total_score}</td>
              </tr>
              <tr>
                <td>Статус пользователя</td>
                <td>
                  {!!participant ? (
                    <>
                      <span> Зарегистрирован и </span>
                      <span>
                        {/*participant.status
                          .replace(/_/g, " ")
                          .toLowerCase()
                      .replace(/([ ]\w)|(^\w)/g, (c) => c.toUpperCase())*/}
                      {status_ru(participant.status)}
                      </span>
                    </>
                  ) : (
                    <span> Не зарегистрирован</span>
                  )}
                </td>
              </tr>
              {canUserSeeGrade && (
                <tr>
                  <td>Ваша оценка</td>
                  <td>{participant.grade}</td>
                </tr>
              )}
            </tbody>
          </Table>

          {!isUserOwnExam &&
            exam.needs_confirmation &&
            participant &&
            !participant.confirmed && (
              <p className="lead">
                Для входа на тест требуется одобрение состовителя. Его у вас нет
              </p>
            )}

          {canUserGoToExam && (
            <Link to={programRoutes.examiningQuestion(examId, firstQuestion)}>
              <Button className="m-2" variant="success">
                к тесту
              </Button>
            </Link>
          )}

          {canUserEditExam && (
            <Link to={programRoutes.updateExam(examId)}>
              <Button className="m-2" variant="warning">
                редактировать
              </Button>
            </Link>
          )}

          {isUserOwnExam && (
            <Link to={programRoutes.indexParticipants(examId)}>
              <Button className="m-2" variant="primary">
                участники
              </Button>
            </Link>
          )}

          {canUserSeeAnswers && (
            <Link
              to={programRoutes.showParticipant(
                examId,
                participant.participant_id
              )}
            >
              <Button className="m-2" variant="primary">
                ответы
              </Button>
            </Link>
          )}

          {canUserRegisterToExam && (
            <Form onSubmit={handleRegistration}>
              {errors.message && (
                <p className="text-danger">{errors.message}</p>
              )}
              {exam.has_password && (
                <ExamPassword
                  examPassword={examPassword}
                  changeExamPassword={changeExamPassword}
                  passwordErrorMessage={errors.password}
                  examId={examId}
                />
              )}
              <Button
                className="m-2"
                variant="success"
                disabled={isRegisteringLoading}
                type="submit"
              >
                {isRegisteringLoading ? "Загрузка..." : "Зарегестрироваться на тест"}
              </Button>
            </Form>
          )}
        </Container>
      </Container>
    </div>
  );
};

export default ExamOverviewPage;
