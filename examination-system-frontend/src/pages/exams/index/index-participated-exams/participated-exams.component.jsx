import { useContext } from "react";
import { Redirect } from "react-router-dom";
import Pagination from "../../../../components/pagination/pagination.component";
import ExamRecord from "../../../../components/exam-models/exam-record/exam-record.component";

import programRoutes from "../../../../constants/program-routes.constant";
import { ParticipatedExamsContext } from "../../../../contexts/participated-exams-context/participated-exams.context";

const ParticipatedExams = () => {
  const { isLoading, page, currentPage, numberOfPages, exams } = useContext(
    ParticipatedExamsContext
  );

  if (
    !isLoading &&
    (Number(page) > Number(numberOfPages) || Number(page) <= 0)
  ) {
    return <Redirect to={programRoutes.indexParticipatedExams()} />;
  }

  return (
    <>
      {isLoading ? (
        <p>Загрузка...</p>
      ) : exams.length > 0 ? (
        <>
          {exams.map((exam, idx) => {
            return (
              <ExamRecord
                links={[
                  {
                    linkName: "Инфо",
                    linkHref: programRoutes.examiningOverview(exam.exam_id),
                  },
                ]}
                key={exam.exam_id}
                exam={exam}
                className="mb-3"
              />
            );
          })}
          <Pagination
            currentPage={currentPage}
            numberOfPages={numberOfPages}
            prefix={programRoutes.indexParticipatedExams()}
          />
        </>
      ) : (
        <p className="lead"> Вы пока не прошли ни одного теста </p>
      )}
    </>
  );
};

export default ParticipatedExams;
