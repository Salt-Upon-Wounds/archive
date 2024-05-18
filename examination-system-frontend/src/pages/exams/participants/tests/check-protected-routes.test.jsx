import {
  waitFor,
  screen,
  renderWithRouter,
} from "../../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import programRoutes from "../../../../constants/program-routes.constant";
import App from "../../../../App";
import {
  correctPassword,
  userEmail,
} from "../../../../mocks/mocks/authentication.mock";

test("participants routes must be protected", async () => {
  renderWithRouter(<App />, {
    route: programRoutes.indexParticipants(1),
    withContexts: true,
  });

  await waitFor(() =>
    expect(
      window.location.href.endsWith(
        `${programRoutes.redirectUnAuthenticated()}?redirect=${encodeURIComponent(
          programRoutes.indexParticipants(1)
        )}`
      )
    ).toBe(true)
  );

  const emailField = screen.getByRole("textbox", { name: /email/i });
  const passwordField = screen.getByPlaceholderText(/password/i);

  userEvent.clear(emailField);
  userEvent.clear(passwordField);

  userEvent.type(emailField, userEmail);
  userEvent.type(passwordField, correctPassword);

  const submitButton = screen.getByRole("button", { name: "LOGIN" });
  userEvent.click(submitButton);

  await waitFor(() =>
    expect(window.location.pathname).toBe(programRoutes.indexParticipants(1))
  );
});
