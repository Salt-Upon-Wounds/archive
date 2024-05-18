import { useContext } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import programRoutes from "../../../constants/program-routes.constant";

import { AuthenticationContext } from "../../../contexts/authentication-context/authentication.context";

import IndexParticipantsPage from "./index/index-participants.page";
import ShowParticipantPage from "./show/show-participant.page";

const ParticipantsRouter = () => {
  const { isAuthLoaded } = useContext(AuthenticationContext);

  if (!isAuthLoaded) {
    return <p> Загрузка... </p>;
  }

  return (
    <Switch>
      <Route
        exact
        path={programRoutes.indexParticipants(":examId")}
        component={IndexParticipantsPage}
      />

      <Route
        exact
        path={programRoutes.showParticipant(":examId", ":participantId")}
        component={ShowParticipantPage}
      />

      <Route
        path="*"
        render={() => <Redirect to={programRoutes.profile()} />}
      />
    </Switch>
  );
};

export default ParticipantsRouter;
