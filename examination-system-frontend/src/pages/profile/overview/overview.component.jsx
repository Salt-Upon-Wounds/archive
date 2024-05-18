import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BsFileEarmarkMedical,
  BsFileEarmarkCheck,
  BsGear,
} from "react-icons/bs";
import ItemButton from "./item-button.component";

import MiniExamRecord from "../../../components/exam-models/mini-exam-record/mini-exam-record.component";

import { CreatedExamsContext } from "../../../contexts/created-exams-context/created-exams.context";
import { ParticipatedExamsContext } from "../../../contexts/participated-exams-context/participated-exams.context";
import programRoutes from "../../../constants/program-routes.constant";
import { AuthenticationContext } from "../../../contexts/authentication-context/authentication.context";

const Overview = () => {
  const createdExams = useContext(CreatedExamsContext);
  const participatedExams = useContext(ParticipatedExamsContext);
  const { user } = useContext(AuthenticationContext);

  if (createdExams.isLoading || participatedExams.isLoading) {
    return <p>Загрузка...</p>;
  }

  return (
    <Container>
      <div className="m-3 p-3 ">
        <div>
          <Row>
            {user && user.permissions.includes('create-exams') &&
            <Col xs={12} md={6} xl={4} className="my-3">
              <ItemButton
                text="Созданные тесты"
                subText={createdExams.numberOfAllExams}
                variant="success"
                icon={<BsFileEarmarkMedical />}
                to={programRoutes.indexCreatedExams()}
              />
            </Col>}
            <Col xs={12} md={6} xl={4} className="my-3">
              <ItemButton
                text="Пройденные тесты"
                subText={participatedExams.numberOfAllExams}
                variant="primary"
                icon={<BsFileEarmarkCheck />}
                to={programRoutes.indexParticipatedExams()}
              />
            </Col>
            <Col xs={12} md={6} xl={4} className="my-3">
              <ItemButton
                text="Настройки"
                variant="info"
                icon={<BsGear />}
                to={programRoutes.settings()}
              />
            </Col>
          </Row>
          <Row className="my-5">
            {user && user.permissions.includes('create-exams') &&
            <Col xs={12} md={6}>
              <Container className="bg-white p-4 rounded shadow border h-100">
                <h2 className="display-6 fs-3">
                  <span className="d-block">Последние созданные</span>
                  <span> Тесты</span>
                </h2>
                <div>
                  {createdExams.exams.slice(0, 5).map((exam) => (
                    <MiniExamRecord
                      examName={exam.exam_name}
                      examTime={exam.creation_time}
                      to={programRoutes.examiningOverview(exam.exam_id)}
                      examStart={exam.start_of_exam}
                      examEnd={exam.end_of_exam}
                      isPublished={exam.published}
                      className="my-1"
                      key={exam.exam_id}
                    />
                  ))}
                  {createdExams.exams.length > 5 && (
                    <Link
                      to={programRoutes.indexCreatedExams()}
                      className="d-block text-start"
                    >
                      Больше...
                    </Link>
                  )}
                  {createdExams.exams.length === 0 && (
                    <p className="lead">Вы пока не создали ни одного теста</p>
                  )}
                </div>
              </Container>
            </Col>}
            <Col xs={12} md={6} className="mt-4 mt-md-0">
              <Container className="bg-white p-4 rounded shadow border h-100">
                <h2 className="display-6 fs-3">
                  <span className="d-block">Последние пройденные</span>
                  <span> Тесты</span>
                </h2>
                <div>
                  {participatedExams.exams.slice(0, 5).map((exam) => (
                    <MiniExamRecord
                      examName={exam.exam_name}
                      examTime={exam.start_of_exam}
                      to={programRoutes.examiningOverview(exam.exam_id)}
                      examStart={exam.start_of_exam}
                      examEnd={exam.end_of_exam}
                      isPublished={true}
                      className="my-1"
                      key={exam.exam_id}
                    />
                  ))}
                  {participatedExams.exams.length > 5 && (
                    <Link
                      to={programRoutes.indexParticipatedExams()}
                      className="d-block text-start"
                    >
                      Больше...
                    </Link>
                  )}
                  {participatedExams.exams.length === 0 && (
                    <p className="lead">
                      Вы пока не прошли ни одного экзамена
                    </p>
                  )}
                </div>
              </Container>
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default Overview;
