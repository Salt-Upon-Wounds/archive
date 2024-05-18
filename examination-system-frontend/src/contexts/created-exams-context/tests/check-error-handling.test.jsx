import {
  waitFor,
  screen,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import {
  changeRequestResponseTo401,
  changeRequestResponseToSpecificStatus,
} from "../../../utilities/tests.utility";

import CreatedExamsPage from "../../../pages/exams/index/index-created-exams/created-exams.page";
import { ErrorBoundaryProvider } from "../../../contexts/error-boundary-context/error-boundary.context";

import apiRoutes from "../../../constants/api-routes.constant";
import programRoutes from "../../../constants/program-routes.constant";

describe("check 401 errors(the removeUserInfo() func from authentication context must be called)", () => {
  test("check exams.indexCreatedExams route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.exams.indexCreatedExams(),
      method: "get",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(<CreatedExamsPage />, {
      authenticationProviderProps: { removeUserInfo },
      route: programRoutes.indexCreatedExams(),
    });

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
});

describe("check other errors", () => {
  test("check exams.indexCreatedExams route", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.exams.indexCreatedExams(),
      method: "get",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ErrorBoundaryProvider>
        <CreatedExamsPage />
      </ErrorBoundaryProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.indexCreatedExams(),
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(screen.getByText(403)).toBeInTheDocument());
  });
});
