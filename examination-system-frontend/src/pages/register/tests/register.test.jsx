import {
  renderWithRouter,
  renderWithAuthentication,
  screen,
  waitFor,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import RegisterPage from "../register.page";
import {
  userName,
  userEmail,
  correctPassword,
  shortPassword,
  repeatedEmail,
} from "../../../mocks/mocks/authentication.mock";
import App from "../../../App";
import programRoutes from "../../../constants/program-routes.constant";
import { AuthenticationProvider } from "../../../contexts/authentication-context/authentication.context";
import { NotificationProvider } from "../../../contexts/notification-context/notification.context";

test("first of all, the name field must be focused", async () => {
  renderWithRouter(
    <NotificationProvider>
      <AuthenticationProvider>
        <RegisterPage />
      </AuthenticationProvider>
    </NotificationProvider>,
    {
      route: programRoutes.register(),
      singleWrapper: "router",
    }
  );

  const nameField = screen.getByRole("textbox", { name: /name/i });
  expect(nameField).toHaveFocus();
});
test("user can register to the site", async () => {
  renderWithRouter(
    <NotificationProvider>
      <AuthenticationProvider>
        <RegisterPage />
      </AuthenticationProvider>
    </NotificationProvider>,
    {
      route: programRoutes.register(),
      singleWrapper: "router",
    }
  );

  const nameField = screen.getByRole("textbox", { name: /name/i });
  const emailField = screen.getByRole("textbox", { name: /email address/i });
  const passwordField = screen.getAllByLabelText(/password/i)[0];
  const confirmPasswordField = screen.getByLabelText(/confirm password/i);

  userEvent.clear(nameField);
  userEvent.clear(emailField);
  userEvent.clear(passwordField);
  userEvent.clear(confirmPasswordField);

  userEvent.type(nameField, userName);
  userEvent.type(emailField, userEmail);
  userEvent.type(passwordField, correctPassword);
  userEvent.type(confirmPasswordField, correctPassword);

  const registerButton = screen.getByRole("button", { name: /register/i });

  userEvent.click(registerButton);

  const registerMessage = await screen.findByText(
    /you registered successfully/i
  );
  expect(registerMessage).toBeInTheDocument();
  expect(registerMessage).toHaveClass("alert-success");
});

test("user will see 'loading...' message in register button when request is pending", async () => {
  renderWithRouter(
    <NotificationProvider>
      <AuthenticationProvider>
        <RegisterPage />
      </AuthenticationProvider>
    </NotificationProvider>,
    {
      route: programRoutes.register(),
      singleWrapper: "router",
    }
  );

  const nameField = screen.getByRole("textbox", { name: /name/i });
  const emailField = screen.getByRole("textbox", { name: /email address/i });
  const passwordField = screen.getAllByLabelText(/password/i)[0];
  const confirmPasswordField = screen.getByLabelText(/confirm password/i);

  userEvent.clear(nameField);
  userEvent.clear(emailField);
  userEvent.clear(passwordField);
  userEvent.clear(confirmPasswordField);

  userEvent.type(nameField, userName);
  userEvent.type(emailField, userEmail);
  userEvent.type(passwordField, correctPassword);
  userEvent.type(confirmPasswordField, correctPassword);

  const registerButton = screen.getByRole("button", { name: /register/i });

  userEvent.click(registerButton);

  await waitFor(() =>
    expect(
      screen.getByRole("button", {
        name: /loading\.\.\./i,
      })
    ).toBeDisabled()
  );

  const registerMessage = await screen.findByText(
    /you registered successfully/i
  );
  expect(registerMessage).toBeInTheDocument();
  expect(registerMessage).toHaveClass("alert-success");
});

test("user will not see 'loading...' message in register button when the response is received and it has errors", async () => {
  renderWithRouter(
    <NotificationProvider>
      <AuthenticationProvider>
        <RegisterPage />
      </AuthenticationProvider>
    </NotificationProvider>,
    {
      route: programRoutes.register(),
      singleWrapper: "router",
    }
  );

  const nameField = screen.getByRole("textbox", { name: /name/i });
  const emailField = screen.getByRole("textbox", { name: /email address/i });
  const passwordField = screen.getAllByLabelText(/password/i)[0];
  const confirmPasswordField = screen.getByLabelText(/confirm password/i);

  userEvent.clear(nameField);
  userEvent.clear(emailField);
  userEvent.clear(passwordField);
  userEvent.clear(confirmPasswordField);

  userEvent.type(nameField, userName);
  userEvent.type(emailField, userEmail);
  userEvent.type(passwordField, shortPassword);
  userEvent.type(confirmPasswordField, shortPassword);

  const registerButton = screen.getByRole("button", { name: /register/i });

  userEvent.click(registerButton);

  await waitFor(() =>
    expect(
      screen.getByRole("button", {
        name: /loading\.\.\./i,
      })
    ).toBeDisabled()
  );

  const errorMessage = await screen.findByText(
    /the password must be at least 8 characters/i
  );
  expect(errorMessage).toBeInTheDocument();

  const changedRegisterButtonToNormal = await screen.findByRole("button", {
    name: "REGISTER",
  });
  expect(changedRegisterButtonToNormal).toBeInTheDocument();
});

test("user can register after he faced to error", async () => {
  renderWithRouter(
    <NotificationProvider>
      <AuthenticationProvider>
        <RegisterPage />
      </AuthenticationProvider>
    </NotificationProvider>,
    {
      route: programRoutes.register(),
      singleWrapper: "router",
    }
  );

  const nameField = screen.getByRole("textbox", { name: /name/i });
  const emailField = screen.getByRole("textbox", { name: /email address/i });
  const passwordField = screen.getAllByLabelText(/password/i)[0];
  const confirmPasswordField = screen.getByLabelText(/confirm password/i);

  userEvent.clear(nameField);
  userEvent.clear(emailField);
  userEvent.clear(passwordField);
  userEvent.clear(confirmPasswordField);

  userEvent.type(nameField, userName);
  userEvent.type(emailField, userEmail);
  userEvent.type(passwordField, shortPassword);
  userEvent.type(confirmPasswordField, shortPassword);

  const registerButton = screen.getByRole("button", { name: /register/i });

  userEvent.click(registerButton);

  const errorMessage = await screen.findByText(
    /the password must be at least 8 characters/i
  );
  expect(errorMessage).toBeInTheDocument();

  userEvent.clear(passwordField);
  userEvent.clear(confirmPasswordField);

  userEvent.type(passwordField, correctPassword);
  userEvent.type(confirmPasswordField, correctPassword);

  userEvent.click(registerButton);

  const registerMessage = await screen.findByText(
    /you registered successfully/i
  );
  expect(registerMessage).toBeInTheDocument();
  expect(registerMessage).toHaveClass("alert-success");

  const nullErrorMessage = screen.queryByText(
    /the password must be at least 8 characters/i
  );
  expect(nullErrorMessage).not.toBeInTheDocument();
});

test("user will see error if his passwords did not match", async () => {
  renderWithRouter(
    <NotificationProvider>
      <AuthenticationProvider>
        <RegisterPage />
      </AuthenticationProvider>
    </NotificationProvider>,
    {
      route: programRoutes.register(),
      singleWrapper: "router",
    }
  );

  const nameField = screen.getByRole("textbox", { name: /name/i });
  const emailField = screen.getByRole("textbox", { name: /email address/i });
  const passwordField = screen.getAllByLabelText(/password/i)[0];
  const confirmPasswordField = screen.getByLabelText(/confirm password/i);

  userEvent.clear(nameField);
  userEvent.clear(emailField);
  userEvent.clear(passwordField);
  userEvent.clear(confirmPasswordField);

  userEvent.type(nameField, userName);
  userEvent.type(emailField, userEmail);
  userEvent.type(passwordField, correctPassword);
  userEvent.type(confirmPasswordField, "2ndStrongPassword");

  const registerButton = screen.getByRole("button", { name: /register/i });

  userEvent.click(registerButton);

  const errorMessage = await screen.findByText(
    /The password confirmation does not match/i
  );
  expect(errorMessage).toBeInTheDocument();
});

test("user will see error if his email was already in use", async () => {
  renderWithRouter(
    <NotificationProvider>
      <AuthenticationProvider>
        <RegisterPage />
      </AuthenticationProvider>
    </NotificationProvider>,
    {
      route: programRoutes.register(),
      singleWrapper: "router",
    }
  );

  const nameField = screen.getByRole("textbox", { name: /name/i });
  const emailField = screen.getByRole("textbox", { name: /email address/i });
  const passwordField = screen.getAllByLabelText(/password/i)[0];
  const confirmPasswordField = screen.getByLabelText(/confirm password/i);

  userEvent.clear(nameField);
  userEvent.clear(emailField);
  userEvent.clear(passwordField);
  userEvent.clear(confirmPasswordField);

  userEvent.type(nameField, userName);
  userEvent.type(emailField, repeatedEmail);
  userEvent.type(passwordField, correctPassword);
  userEvent.type(confirmPasswordField, correctPassword);

  const registerButton = screen.getByRole("button", { name: /register/i });

  userEvent.click(registerButton);

  const errorMessage = await screen.findByText(
    /The email has already been taken/i
  );
  expect(errorMessage).toBeInTheDocument();
});

test("user can go to login page with bottom link", async () => {
  renderWithRouter(
    <NotificationProvider>
      <AuthenticationProvider>
        <RegisterPage />
      </AuthenticationProvider>
    </NotificationProvider>,
    {
      route: programRoutes.register(),
      singleWrapper: "router",
    }
  );

  const signInLink = await screen.findByRole("link", { name: /sign in/i });
  expect(signInLink).toHaveAttribute("href", programRoutes.login());
});

describe("check redirections", () => {
  test("if redirect is in url, user must be redirected to that url after registration", async () => {
    renderWithRouter(
      <NotificationProvider>
        <AuthenticationProvider>
          <App />
        </AuthenticationProvider>
      </NotificationProvider>,
      {
        route: `${programRoutes.register()}?redirect=${encodeURIComponent(
          programRoutes.indexCreatedExams()
        )}`,
        singleWrapper: "router",
      }
    );

    const nameField = await screen.findByRole("textbox", { name: /name/i });
    const emailField = screen.getByRole("textbox", { name: /email address/i });
    const passwordField = screen.getAllByLabelText(/password/i)[0];
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);

    userEvent.clear(nameField);
    userEvent.clear(emailField);
    userEvent.clear(passwordField);
    userEvent.clear(confirmPasswordField);

    userEvent.type(nameField, userName);
    userEvent.type(emailField, userEmail);
    userEvent.type(passwordField, correctPassword);
    userEvent.type(confirmPasswordField, correctPassword);

    const registerButton = screen.getByRole("button", { name: "REGISTER" });

    userEvent.click(registerButton);

    const registerMessage = await screen.findByText(
      /you registered successfully/i
    );
    expect(registerMessage).toBeInTheDocument();
    expect(registerMessage).toHaveClass("alert-success");

    await waitFor(() =>
      expect(
        window.location.href.endsWith(programRoutes.indexCreatedExams())
      ).toBe(true)
    );
  });

  test("if redirect is not in url, user must be redirected to profile overview after registration", async () => {
    renderWithRouter(
      <NotificationProvider>
        <AuthenticationProvider>
          <App />
        </AuthenticationProvider>
      </NotificationProvider>,
      {
        route: programRoutes.register(),
        singleWrapper: "router",
      }
    );

    const nameField = await screen.findByRole("textbox", { name: /name/i });
    const emailField = screen.getByRole("textbox", { name: /email address/i });
    const passwordField = screen.getAllByLabelText(/password/i)[0];
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);

    userEvent.clear(nameField);
    userEvent.clear(emailField);
    userEvent.clear(passwordField);
    userEvent.clear(confirmPasswordField);

    userEvent.type(nameField, userName);
    userEvent.type(emailField, userEmail);
    userEvent.type(passwordField, correctPassword);
    userEvent.type(confirmPasswordField, correctPassword);

    const registerButton = screen.getByRole("button", { name: "REGISTER" });

    userEvent.click(registerButton);

    const registerMessage = await screen.findByText(
      /you registered successfully/i
    );
    expect(registerMessage).toBeInTheDocument();
    expect(registerMessage).toHaveClass("alert-success");

    await waitFor(() =>
      expect(window.location.href.endsWith(programRoutes.profile())).toBe(true)
    );
  });

  test("if user already authenticated, user must be redirected to redirect if redirect is in the url", async () => {
    renderWithAuthentication(<App />, {
      route: `${programRoutes.register()}?redirect=${encodeURIComponent(
        programRoutes.indexCreatedExams()
      )}`,
    });

    await waitFor(() =>
      expect(
        window.location.href.endsWith(programRoutes.indexCreatedExams())
      ).toBe(true)
    );
  });

  test("if user already authenticated, user must be redirected to profile if redirect is not in the url", async () => {
    renderWithAuthentication(<App />, {
      route: programRoutes.register(),
    });

    await waitFor(() =>
      expect(window.location.href.endsWith(programRoutes.profile())).toBe(true)
    );
  });
});
