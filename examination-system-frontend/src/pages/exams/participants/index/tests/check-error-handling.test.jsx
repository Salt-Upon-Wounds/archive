import {
  waitFor,
  screen,
  renderWithAuthentication,
} from "../../../../../test-utils/testing-library-utils";
import { Route } from "react-router-dom";
import {
  changeRequestResponseTo401,
  changeRequestResponseToSpecificStatus,
} from "../../../../../utilities/tests.utility";

import IndexParticipantsPage from "../index-participants.page";

import { ErrorBoundaryProvider } from "../../../../../contexts/error-boundary-context/error-boundary.context";

import apiRoutes from "../../../../../constants/api-routes.constant";
import programRoutes from "../../../../../constants/program-routes.constant";

describe("check 401 errors(the removeUserInfo() func from authentication context must be called)", () => {
  test("check participants.indexParticipants route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.participants.indexParticipants(1),
      method: "get",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <Route path={programRoutes.indexParticipants(":examId")}>
        <IndexParticipantsPage />
      </Route>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.indexParticipants(1),
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
});

describe("check other errors", () => {
  test("check participants.indexParticipants route", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.participants.indexParticipants(1),
      method: "get",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <Route path={programRoutes.indexParticipants(":examId")}>
        <ErrorBoundaryProvider>
          <IndexParticipantsPage />
        </ErrorBoundaryProvider>
      </Route>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.indexParticipants(1),
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(screen.getByText(403)).toBeInTheDocument());
  });
});
