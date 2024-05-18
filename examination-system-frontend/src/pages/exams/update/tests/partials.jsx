import { Route } from "react-router-dom";
import programRoutes from "../../../../constants/program-routes.constant";
import { UpdateExamProvider } from "../../../../contexts/update-exam-context/update-exam.context";

export const wrapper = (ui) => (
  <Route path={programRoutes.updateExam(":examId")}>
    <UpdateExamProvider>{ui}</UpdateExamProvider>
  </Route>
);
