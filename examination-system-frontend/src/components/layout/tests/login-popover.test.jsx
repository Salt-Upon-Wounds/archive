import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Layout from "../layout.component";
import { wait } from "../../../utilities/tests.utility";
import {
  userEmail,
  userName,
  repeatedEmail,
  correctPassword,
  shortPassword,
} from ".../../../mocks/mocks/authentication.mock";

describe.skip("check login functionality", () => {
  test("user can click 'login' button and then login to his account", async () => {
    render(<Layout />);

    const loginButton = screen.getByRole("button", { name: /login/i });
    userEvent.click(loginButton);

    const emailField = screen.getByRole("textbox", { name: /email address/i });
    const passwordField = screen.getByLabelText(/password/i);

    userEvent.clear(emailField);
    userEvent.type(emailField, userEmail);
    userEvent.clear(passwordField);
    userEvent.type(passwordField, correctPassword);

    const submitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(submitButton);

    const loginMessage = await screen.findByText(/you logged in successfully/i);
    expect(loginMessage).toBeInTheDocument();
  });

  test("user can try again after his login was unsuccessful", async () => {
    render(<Layout />);

    const loginButton = screen.getByRole("button", { name: /login/i });
    userEvent.click(loginButton);

    const emailField = screen.getByRole("textbox", { name: /email address/i });
    const passwordField = screen.getByLabelText(/password/i);

    userEvent.clear(emailField);
    userEvent.type(emailField, userEmail);
    userEvent.clear(passwordField);
    userEvent.type(passwordField, "wrongPassword");

    const submitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(/invalid email or password/i);
    expect(errorMessage).toBeInTheDocument();

    userEvent.clear(emailField);
    userEvent.type(emailField, userEmail);
    userEvent.clear(passwordField);
    userEvent.type(passwordField, correctPassword);

    userEvent.click(submitButton);

    const loginMessage = await screen.findByText(/you logged in successfully/i);
    expect(loginMessage).toBeInTheDocument();

    await wait(100);
    const nullErrorMessage = screen.queryByText(/invalid email or password/i);
    expect(nullErrorMessage).not.toBeInTheDocument();
  });
});

describe.skip("check popover functionality", () => {
  test("user can close the login popover", () => {
    render(<Layout />);

    const loginButton = screen.getByRole("button", { name: /login/i });
    userEvent.click(loginButton);

    const emailField = screen.getByRole("textbox", { name: /email address/i });
    const passwordField = screen.getByLabelText(/password/i);
    expect(emailField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    userEvent.click(closeButton);

    const nullEmailField = screen.queryByRole("textbox", {
      name: /email address/i,
    });
    const nullPasswordField = screen.queryByLabelText(/password/i);
    expect(nullEmailField).not.toBeInTheDocument();
    expect(nullPasswordField).not.toBeInTheDocument();
  });

  test("if user logged in successfully, login popover will be remove that moment and for 3 seconds login message will be shwon for user", async () => {
    render(<Layout />);

    const loginButton = screen.getByRole("button", { name: /login/i });
    userEvent.click(loginButton);

    const emailField = screen.getByRole("textbox", { name: /email address/i });
    const passwordField = screen.getByLabelText(/password/i);

    userEvent.clear(emailField);
    userEvent.type(emailField, userEmail);
    userEvent.clear(passwordField);
    userEvent.type(passwordField, correctPassword);

    const submitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(submitButton);

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("textbox", {
        name: /email address/i,
      })
    );

    const loginMessage = await screen.findByText(/you logged in successfully/i);
    expect(loginMessage).toBeInTheDocument();

    await wait(3200);

    const nullLoginMessage = screen.queryByText(/you logged in successfully/i);
    expect(nullLoginMessage).not.toBeInTheDocument();
  });
});

describe.skip("header after logging in", () => {
  test("after user logged in, user mustn't see login and register in header", async () => {
    render(<Layout />);

    const registerButton = screen.getByRole("button", { name: /register/i });
    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(registerButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();

    userEvent.click(loginButton);

    const emailField = screen.getByRole("textbox", { name: /email address/i });
    const passwordField = screen.getByLabelText(/password/i);

    userEvent.clear(emailField);
    userEvent.type(emailField, userEmail);
    userEvent.clear(passwordField);
    userEvent.type(passwordField, correctPassword);

    const submitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(submitButton);

    const loginMessage = await screen.findByText(/you logged in successfully/i);
    expect(loginMessage).toBeInTheDocument();

    const nullLoginButton = screen.queryByRole("button", { name: /login/i });
    const nullRegisterButton = screen.queryByRole("button", {
      name: /register/i,
    });
    expect(nullLoginButton).not.toBeInTheDocument();
    expect(nullRegisterButton).not.toBeInTheDocument();
  });

  test("after user logged in, user must see profile link and logout button in header", async () => {
    render(<Layout />);

    const registerButton = screen.getByRole("button", { name: /register/i });
    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(registerButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();

    userEvent.click(loginButton);

    const emailField = screen.getByRole("textbox", { name: /email address/i });
    const passwordField = screen.getByLabelText(/password/i);

    userEvent.clear(emailField);
    userEvent.type(emailField, userEmail);
    userEvent.clear(passwordField);
    userEvent.type(passwordField, correctPassword);

    const submitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(submitButton);

    const loginMessage = await screen.findByText(/you logged in successfully/i);
    expect(loginMessage).toBeInTheDocument();

    const profileLink = await screen.findByRole("link", { name: /profile/i });
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(profileLink).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });
});
