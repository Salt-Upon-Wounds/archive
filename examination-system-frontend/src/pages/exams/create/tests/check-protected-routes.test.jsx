import {
  screen,
  renderWithRouter,
  waitFor,
} from "../../../../test-utils/testing-library-utils";
import programRoutes from "../../../../constants/program-routes.constant";
import App from "../../../../App";
import userEvent from "@testing-library/user-event";
import {
  userEmail,
  correctPassword,
} from "../../../../mocks/mocks/authentication.mock";

test("create-exam route is not accessible without authentication", async () => {
  renderWithRouter(<App />, {
    route: programRoutes.createExam(),
    withContexts: true,
  });

  await waitFor(() =>
    expect(
      window.location.href.endsWith(
        `${programRoutes.redirectUnAuthenticated()}?redirect=${encodeURIComponent(
          programRoutes.createExam()
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
    expect(window.location.pathname).toBe(programRoutes.createExam())
  );
});
