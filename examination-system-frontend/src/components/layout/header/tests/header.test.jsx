import {
  renderWithAuthentication,
  screen,
} from "../../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Header from "../header.component";
import { userName } from "../../../../mocks/mocks/authentication.mock";

test("on clicking on logout, logout function from authentication context must be called", async () => {
  const logoutFunc = jest.fn();
  renderWithAuthentication(<Header />, {
    authenticationProviderProps: { logout: logoutFunc },
  });

  const validator = new RegExp(userName, "i");
  userEvent.click(await screen.findByRole("button", { name: validator }));
  const logoutButton = await screen.findByRole("button", { name: /logout/i });
  userEvent.click(logoutButton);

  expect(logoutFunc).toHaveBeenCalledTimes(1);
});
