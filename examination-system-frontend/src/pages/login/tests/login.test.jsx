import {
  screen,
  waitFor,
  renderWithRouter,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import LoginPage from "../login.page";
import App from "../../../App";
import programRoutes from "../../../constants/program-routes.constant";
import { AuthenticationProvider } from "../../../contexts/authentication-context/authentication.context";
import { NotificationProvider } from "../../../contexts/notification-context/notification.context";
import {
  userEmail,
  correctPassword,
} from "../../../mocks/mocks/authentication.mock";

test("first of all, the email field must be focused", async () => {
  renderWithRouter(
    <NotificationProvider>
      <AuthenticationProvider>
        <LoginPage />
      </AuthenticationProvider>
    </NotificationProvider>,
    {
      route: programRoutes.login(),
    }
  );

  const emailField = screen.getByRole("textbox", { name: /email address/i });

  expect(emailField).toHaveFocus();
});

test("user can login", async () => {
  renderWithRouter(
    <NotificationProvider>
      <AuthenticationProvider>
        <LoginPage />
      </AuthenticationProvider>
    </NotificationProvider>,
    {
      route: programRoutes.login(),
    }
  );

  const emailField = screen.getByRole("textbox", { name: /email address/i });
  const passwordField = screen.getByLabelText(/password/i);

  userEvent.clear(emailField);
  userEvent.type(emailField, userEmail);
  userEvent.clear(passwordField);
  userEvent.type(passwordField, correctPassword);

  const submitButton = screen.getByRole("button", { name: "LOGIN" });
  userEvent.click(submitButton);
});

test("user will see 'loading...' in button and button will be disabled when the request is pending", async () => {
  renderWithRouter(
    <NotificationProvider>
      <AuthenticationProvider>
        <LoginPage />
      </AuthenticationProvider>
    </NotificationProvider>,
    {
      route: programRoutes.login(),
    }
  );

  const examField = screen.getByRole("textbox", { name: /email address/i });
  const passwordField = screen.getByLabelText(/password/i);

  userEvent.clear(examField);
  userEvent.type(examField, userEmail);

  userEvent.clear(passwordField);
  userEvent.type(passwordField, correctPassword);

  const loginButton = screen.getByRole("button", { name: /login/i });

  userEvent.click(loginButton);

  await waitFor(() =>
    expect(
      screen.getByRole("button", {
        name: /loading\.\.\./i,
      })
    ).toBeDisabled()
  );

  const textMessage = await screen.findByRole(
    "alert",
    /you logged in successfully/i
  );
  expect(textMessage).toHaveClass("alert-success");
  expect(textMessage).toBeInTheDocument();
});

test("user will not see 'loading...' in button when the response is given and we have errors", async () => {
  renderWithRouter(
    <NotificationProvider>
      <AuthenticationProvider>
        <LoginPage />
      </AuthenticationProvider>
    </NotificationProvider>,
    {
      route: programRoutes.login(),
    }
  );

  const examField = screen.getByRole("textbox", { name: /email address/i });
  const passwordField = screen.getByLabelText(/password/i);

  userEvent.clear(examField);
  userEvent.type(examField, userEmail);

  userEvent.clear(passwordField);
  userEvent.type(passwordField, "wrongPassword");

  const loginButton = screen.getByRole("button", { name: /login/i });

  userEvent.click(loginButton);

  await waitFor(() =>
    expect(
      screen.getByRole("button", {
        name: /loading\.\.\./i,
      })
    ).toBeDisabled()
  );

  const errorMessage = await screen.findByText(/invalid email or password/i);
  expect(errorMessage).toBeInTheDocument();

  const changedLoginButtonToNormal = await screen.findByRole("button", {
    name: "LOGIN",
  });
  expect(changedLoginButtonToNormal).toBeInTheDocument();
});

test("user will see the errors if he/she's login was unsuccessful", async () => {
  renderWithRouter(
    <NotificationProvider>
      <AuthenticationProvider>
        <LoginPage />
      </AuthenticationProvider>
    </NotificationProvider>,
    {
      route: programRoutes.login(),
    }
  );

  const examField = screen.getByRole("textbox", { name: /email address/i });
  const passwordField = screen.getByLabelText(/password/i);

  userEvent.clear(examField);
  userEvent.type(examField, "wrong.email@example.org");

  userEvent.clear(passwordField);
  userEvent.type(passwordField, correctPassword);

  const loginButton = screen.getByRole("button", { name: /login/i });

  userEvent.click(loginButton);

  const textMessage = await screen.findByText(/invalid email or password/i);
  expect(textMessage).toHaveClass("text-danger");
});

test("user can go to the register page by bottom link", async () => {
  renderWithRouter(
    <NotificationProvider>
      <AuthenticationProvider>
        <LoginPage />
      </AuthenticationProvider>
    </NotificationProvider>,
    {
      route: programRoutes.login(),
    }
  );

  const registerLink = await screen.findByRole("link", { name: /sign up/i });
  expect(registerLink).toHaveAttribute("href", programRoutes.register());
});

describe("check redirection", () => {
  test("if there is redirect in url, user must be redirect to there after authentication", async () => {
    renderWithRouter(
      <NotificationProvider>
        <AuthenticationProvider>
          <App />
        </AuthenticationProvider>
      </NotificationProvider>,
      {
        route: `${programRoutes.login()}?redirect=${encodeURIComponent(
          programRoutes.indexCreatedExams()
        )}`,
        singleWrapper: "router",
      }
    );

    const emailField = screen.getByRole("textbox", { name: /email address/i });
    const passwordField = screen.getByLabelText(/password/i);

    userEvent.clear(emailField);
    userEvent.type(emailField, userEmail);
    userEvent.clear(passwordField);
    userEvent.type(passwordField, correctPassword);

    const submitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(submitButton);

    await waitFor(() =>
      expect(
        window.location.href.endsWith(programRoutes.indexCreatedExams())
      ).toBe(true)
    );
  });
  test("if there is not any Redirect in the url, user must be redirected to profile overview", async () => {
    renderWithRouter(
      <NotificationProvider>
        <AuthenticationProvider>
          <App />
        </AuthenticationProvider>
      </NotificationProvider>,
      {
        route: programRoutes.login(),
        singleWrapper: "router",
      }
    );

    const emailField = await screen.findByRole("textbox", {
      name: /email address/i,
    });
    const passwordField = screen.getByLabelText(/password/i);

    userEvent.clear(emailField);
    userEvent.type(emailField, userEmail);
    userEvent.clear(passwordField);
    userEvent.type(passwordField, correctPassword);

    const submitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(submitButton);

    await waitFor(() =>
      expect(window.location.href.endsWith(programRoutes.profile())).toBe(true)
    );
  });
  test("if user already authenticated and has redirect in url, he must be redirected to that url", async () => {
    renderWithAuthentication(<App />, {
      route: `${programRoutes.login()}?redirect=${encodeURIComponent(
        programRoutes.indexCreatedExams()
      )}`,
    });

    await waitFor(() =>
      expect(
        window.location.href.endsWith(programRoutes.indexCreatedExams())
      ).toBe(true)
    );
  });
  test("if user already authenticated and does not have redirect in url, he must be redirected to profile", async () => {
    renderWithAuthentication(<App />, {
      route: programRoutes.login(),
    });

    await waitFor(() =>
      expect(window.location.href.endsWith(programRoutes.profile())).toBe(true)
    );
  });
});
