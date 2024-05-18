import { useContext } from "react";
import { Redirect, Link } from "react-router-dom";

import { CreatedExamsContext } from "../../../../contexts/created-exams-context/created-exams.context";

import Pagination from "../../../../components/pagination/pagination.component";
import ExamRecord from "../../../../components/exam-models/exam-record/exam-record.component";

import programRoutes from "../../../../constants/program-routes.constant";

const CreatedExams = () => {
  const { isLoading, page, currentPage, numberOfPages, exams } = useContext(
    CreatedExamsContext
  );

  if (
    !isLoading &&
    (Number(page) > Number(numberOfPages) || Number(page) <= 0)
  ) {
    return <Redirect to={programRoutes.indexCreatedExams()} />;
  }

  return (
    <>
      {isLoading ? (
        <p>Загрузка...</p>
      ) : exams.length > 0 ? (
        <>
          {exams.map((exam, idx) => {
            const links = [
              {
                linkName: "Инфо",
                linkHref: programRoutes.examiningOverview(exam.exam_id),
              },
            ];

            const extraLinks = [
              {
                linkName: "Редактировать",
                linkHref: programRoutes.updateExam(exam.exam_id),
              },
              {
                linkName: "Участники",
                linkHref: programRoutes.indexParticipants(exam.exam_id),
              },
            ];

            return (
              <ExamRecord
                links={links}
                extraLinks={extraLinks}
                key={exam.exam_id}
                exam={exam}
                className="mb-3"
              />
            );
          })}
          <Pagination
            currentPage={currentPage}
            numberOfPages={numberOfPages}
            prefix={programRoutes.indexCreatedExams()}
          />
        </>
      ) : (
        <>
          <p className="lead">
            <span>Вы еще не составили ни одного теста.</span>
          </p>
          <Link
            className="text-decoration-none fst-italic"
            to={programRoutes.createExam()}
          >
            Составить тест
          </Link>
        </>
      )}
    </>
  );
};

export default CreatedExams;
