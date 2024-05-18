import {
  waitFor,
  screen,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import { Route } from "react-router-dom";
import {
  changeRequestResponseTo401,
  changeRequestResponseToSpecificStatus,
} from "../../../utilities/tests.utility";

import { ShowParticipantProvider } from "../show-participant.context";

import { ErrorBoundaryProvider } from "../../../contexts/error-boundary-context/error-boundary.context";

import apiRoutes from "../../../constants/api-routes.constant";
import programRoutes from "../../../constants/program-routes.constant";

describe("check 401 errors(the removeUserInfo() func from authentication context must be called)", () => {
  test("check participants.showParticipant route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.participants.showParticipant(
        ":examId",
        ":participantId"
      ),
      method: "get",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <Route path={programRoutes.showParticipant(":examId", ":participantId")}>
        <ShowParticipantProvider />
      </Route>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.showParticipant(2, 1),
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
  test("check questions.indexQuestions route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.questions.indexQuestions(":examId"),
      method: "get",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <Route path={programRoutes.showParticipant(":examId", ":participantId")}>
        <ShowParticipantProvider />
      </Route>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.showParticipant(2, 1),
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
});

describe("check other errors", () => {
  test("check participants.showParticipant route", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.participants.showParticipant(
        ":examId",
        ":participantId"
      ),
      status: 403,
      method: "get",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <Route path={programRoutes.showParticipant(":examId", ":participantId")}>
        <ErrorBoundaryProvider>
          <ShowParticipantProvider />
        </ErrorBoundaryProvider>
      </Route>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.showParticipant(2, 1),
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(screen.getByText(403)).toBeInTheDocument());
  });
  test("check questions.indexQuestions route", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.questions.indexQuestions(":examId"),
      method: "get",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <Route path={programRoutes.showParticipant(":examId", ":participantId")}>
        <ErrorBoundaryProvider>
          <ShowParticipantProvider />
        </ErrorBoundaryProvider>
      </Route>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.showParticipant(2, 1),
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(screen.getByText(403)).toBeInTheDocument());
  });
});
