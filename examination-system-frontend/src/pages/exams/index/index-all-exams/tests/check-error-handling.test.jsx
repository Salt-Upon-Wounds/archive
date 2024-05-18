import {
  waitFor,
  screen,
  renderWithAuthentication,
} from "../../../../../test-utils/testing-library-utils";
import {
  changeRequestResponseTo401,
  changeRequestResponseToSpecificStatus,
} from "../../../../../utilities/tests.utility";

import IndexAllExamsPage from "../index-all-exams.page";

import { ErrorBoundaryProvider } from "../../../../../contexts/error-boundary-context/error-boundary.context";

import apiRoutes from "../../../../../constants/api-routes.constant";

describe("check 401 errors(the removeUserInfo() func from authentication context must be called)", () => {
  test("check exams.indexAllExams route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.exams.indexAllExams(),
      method: "get",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(<IndexAllExamsPage />, {
      authenticationProviderProps: { removeUserInfo },
    });

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
});

describe("check other errors", () => {
  test("check exams.indexAllExams route", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.exams.indexAllExams(),
      status: 403,
      method: "get",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ErrorBoundaryProvider>
        <IndexAllExamsPage />
      </ErrorBoundaryProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(screen.getByText(403)).toBeInTheDocument());
  });
});
