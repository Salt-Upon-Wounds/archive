import { useContext } from "react";
import { Link } from "react-router-dom";
import { Table, Container } from "react-bootstrap";

import { UserContext } from "../../../../contexts/user-context/user.context";
import { ExamInfoContext } from "../../../../contexts/exam-info-context/exam-info.context";
import { ShowParticipantContext } from "../../../../contexts/show-participant-context/show-participant.context";
import programRoutes from "../../../../constants/program-routes.constant";

const ParticipantInfo = ({ ...props }) => {
  const userInfo = useContext(UserContext);
  const examInfo = useContext(ExamInfoContext);
  const participantInfo = useContext(ShowParticipantContext);

  function status_ru(el) {
    switch (el) {
      case 'NOT_FINISHED': return 'Не выполнено';
      case 'FINISHED': return 'Выполнено';
      case 'WAIT_FOR_MANUAL_CORRECTING': return 'Ожидает проверки';
      default: return el;
    }
  }
  return (
    <div {...props}>
      <Container className="bg-white p-3 border shadow rounded">
        <Table>
          <tbody>
            <tr>
              <td>Тема теста</td>
              <td>
                {examInfo.isContextLoaded ? (
                  <Link
                    className="text-decoration-none"
                    to={programRoutes.examiningOverview(examInfo.exam.exam_id)}
                  >
                    {examInfo.exam.exam_name}
                  </Link>
                ) : (
                  "..."
                )}
              </td>
            </tr>
            <tr>
              <td>Дата начала</td>
              <td>
                {examInfo.isContextLoaded ? examInfo.exam.start_of_exam : "..."}
              </td>
            </tr>
            <tr>
              <td>Дата завершения</td>
              <td>
                {examInfo.isContextLoaded ? examInfo.exam.end_of_exam : "..."}
              </td>
            </tr>
            <tr>
              <td>Имя пользователя</td>
              <td>
                {userInfo.isContextLoaded ? userInfo.user.user_name : "..."}
              </td>
            </tr>
            <tr>
              <td>email пользователя</td>
              <td>
                {userInfo.isContextLoaded ? userInfo.user.user_email : "..."}
              </td>
            </tr>
            <tr>
              <td>Статус пользователя</td>
              <td>
                {status_ru(participantInfo.isContextLoaded
                  ? participantInfo.participant.status
                  : "...")}
              </td>
            </tr>
            <tr>
              <td>Оценка пользователя</td>
              <td>
                {participantInfo.isContextLoaded && examInfo.isContextLoaded
                  //? examInfo.examTime.isExamFinished
                    ? participantInfo.participant.grade
                    : "_"
                  //: "..."
                  }
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default ParticipantInfo;
