import { useContext } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import programRoutes from "../../constants/program-routes.constant";

import IndexAllExamsPage from "./index/index-all-exams/index-all-exams.page";
import IndexParticipatedExamsPage from "./index/index-participated-exams/participated-exams.page";
import IndexCreatedExamsPage from "./index/index-created-exams/created-exams.page";
import ParticipantsRouter from "./participants/participants.router";

import CreateExamPage from "./create/create-exam.page";

import UpdateExamPage from "./update/update-exam.page";
import { AuthenticationContext } from "../../contexts/authentication-context/authentication.context";
import { UpdateExamProvider } from "../../contexts/update-exam-context/update-exam.context";

import ExaminingRouter from "./examining/examining.router";

const ExamsRouter = () => {
  const { isAuthLoaded } = useContext(AuthenticationContext);

  if (!isAuthLoaded) {
    return <p> Загрузка... </p>;
  }

  return (
    <Switch>
      <Route
        exact
        path={programRoutes.indexAllExams()}
        component={IndexAllExamsPage}
      />

      <Route
        exact
        path={programRoutes.indexParticipatedExams()}
        component={IndexParticipatedExamsPage}
      />
      <Route
        exact
        path={programRoutes.indexCreatedExams()}
        component={IndexCreatedExamsPage}
      />
      <Route
        exact
        path={programRoutes.createExam()}
        component={CreateExamPage}
      />
      <Route
        exact
        path={programRoutes.updateExam(":examId")}
        render={() => (
          <UpdateExamProvider>
            <UpdateExamPage />
          </UpdateExamProvider>
        )}
      />

      <Route
        path={programRoutes.participantsRoot(":examId")}
        component={ParticipantsRouter}
      />

      <Route
        path={programRoutes.examining(":examId")}
        component={ExaminingRouter}
      />

      <Route
        path="*"
        render={() => <Redirect to={programRoutes.profile()} />}
      />
    </Switch>
  );
};

export default ExamsRouter;
