import {
  screen,
  waitFor,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import { ErrorBoundaryProvider } from "../../error-boundary-context/error-boundary.context";
import {
  changeRequestResponseTo401,
  changeRequestResponseToSpecificStatus,
} from "../../../utilities/tests.utility";
import { UserProvider } from "../user.context";
import apiRoutes from "../../../constants/api-routes.constant";
import programRoutes from "../../../constants/program-routes.constant";

describe("check 401 error", () => {
  test("check users.showUser", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.users.showUser(":userId"),
      method: "get",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(<UserProvider userId={1} />, {
      authenticationProviderProps: { removeUserInfo },
    });

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
});

describe("check other errors", () => {
  test("check users.showUser", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.users.showUser(":userId"),
      method: "get",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ErrorBoundaryProvider>
        <UserProvider userId={1} />
      </ErrorBoundaryProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitFor(() => expect(screen.getByText(403)).toBeInTheDocument());
    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
  });
});
