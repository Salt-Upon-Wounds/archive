import {
  waitFor,
  screen,
  renderWithRouter,
} from "../test-utils/testing-library-utils";
import programRoutes from "../constants/program-routes.constant";
import App from "../App";
import userEvent from "@testing-library/user-event";
import { userEmail, correctPassword } from "../mocks/mocks/authentication.mock";

test("profile routes are not accessible without authentication", async () => {
  renderWithRouter(<App />, {
    route: programRoutes.profile(),
    withContexts: true,
  });

  await waitFor(() =>
    expect(
      window.location.href.endsWith(
        `${programRoutes.redirectUnAuthenticated()}?redirect=${encodeURIComponent(
          programRoutes.profile()
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
    expect(window.location.pathname).toBe(programRoutes.profile())
  );
});

test("exam routes are not accessible without authentication", async () => {
  renderWithRouter(<App />, {
    route: programRoutes.indexAllExams(),
    withContexts: true,
  });

  await waitFor(() =>
    expect(
      window.location.href.endsWith(
        `${programRoutes.redirectUnAuthenticated()}?redirect=${encodeURIComponent(
          programRoutes.indexAllExams()
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
    expect(window.location.pathname).toBe(programRoutes.indexAllExams())
  );
});
