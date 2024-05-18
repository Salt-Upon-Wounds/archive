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

describe.skip("check register functionality", () => {
  test("user can click register button and then register to the site", async () => {
    render(<Layout />);

    const registerButton = screen.getByRole("button", { name: /register/i });
    userEvent.click(registerButton);

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

    const submitButton = screen.getByRole("button", { name: "REGISTER" });

    userEvent.click(submitButton);

    const registerMessage = await screen.findByText(
      /you registered successfully/i
    );
    expect(registerMessage).toBeInTheDocument();
    expect(registerMessage).toHaveClass("alert-success");
  });

  test("user can try again after his registration was unsuccessful", async () => {
    render(<Layout />);

    const registerButton = screen.getByRole("button", { name: /register/i });
    userEvent.click(registerButton);

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

    const submitButton = screen.getByRole("button", { name: "REGISTER" });

    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(
      /the password must be at least 8 characters/i
    );
    expect(errorMessage).toBeInTheDocument();

    userEvent.clear(passwordField);
    userEvent.clear(confirmPasswordField);

    userEvent.type(passwordField, correctPassword);
    userEvent.type(confirmPasswordField, correctPassword);

    userEvent.click(submitButton);

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
});

describe.skip("check popover functionality", () => {
  test("user can close the popover", async () => {
    render(<Layout />);

    const registerButton = screen.getByRole("button", { name: /register/i });
    userEvent.click(registerButton);

    const nameField = screen.getByRole("textbox", { name: /name/i });
    const emailField = screen.getByRole("textbox", { name: /email address/i });
    const passwordField = screen.getAllByLabelText(/password/i)[0];
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);
    expect(nameField).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(confirmPasswordField).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    userEvent.click(closeButton);

    const nullNameField = screen.queryByRole("textbox", { name: /name/i });
    const nullEmailField = screen.queryByRole("textbox", {
      name: /email address/i,
    });
    const nullPasswordField = screen.queryByLabelText(/password/i);
    const nullConfirmPasswordField = screen.queryByLabelText(
      /confirm password/i
    );
    expect(nullNameField).not.toBeInTheDocument();
    expect(nullEmailField).not.toBeInTheDocument();
    expect(nullPasswordField).not.toBeInTheDocument();
    expect(nullConfirmPasswordField).not.toBeInTheDocument();
  });

  test("if user registered successfully, he will see the message for 3 seconds but register popover will be disappear that moment", async () => {
    render(<Layout />);

    const registerButton = screen.getByRole("button", { name: /register/i });
    userEvent.click(registerButton);

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

    const submitButton = screen.getByRole("button", { name: "REGISTER" });

    userEvent.click(submitButton);

    const registerMessage = await screen.findByText(
      /you registered successfully/i
    );
    expect(registerMessage).toBeInTheDocument();
    expect(registerMessage).toHaveClass("alert-success");

    const nullNameField = screen.queryByRole("textbox", { name: /name/i });
    expect(nullNameField).not.toBeInTheDocument();

    await wait(3000);

    const nullRegisterMessage = screen.queryByText(
      /you registered successfully/i
    );
    expect(nullRegisterMessage).not.toBeInTheDocument();
  });

  test("user can open the popover again and register to the site", async () => {
    render(<Layout />);

    const registerButton = screen.getByRole("button", { name: /register/i });
    userEvent.click(registerButton);

    const nameField = screen.getByRole("textbox", { name: /name/i });

    expect(nameField).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    userEvent.click(closeButton);

    const nullNameField = screen.queryByRole("textbox", { name: /name/i });
    expect(nullNameField).not.toBeInTheDocument();

    userEvent.click(registerButton);
    const nameFieldAgain = screen.getByRole("textbox", { name: /name/i });
    const emailField = screen.getByRole("textbox", { name: /email address/i });
    const passwordField = screen.getAllByLabelText(/password/i)[0];
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);

    userEvent.clear(nameFieldAgain);
    userEvent.clear(emailField);
    userEvent.clear(passwordField);
    userEvent.clear(confirmPasswordField);

    userEvent.type(nameFieldAgain, "test");
    userEvent.type(emailField, userEmail);
    userEvent.type(passwordField, correctPassword);
    userEvent.type(confirmPasswordField, correctPassword);

    const submitButton = screen.getByRole("button", { name: "REGISTER" });

    userEvent.click(submitButton);

    const registerMessage = await screen.findByText(
      /you registered successfully/i
    );
    expect(registerMessage).toBeInTheDocument();
    expect(registerMessage).toHaveClass("alert-success");
  });
});

describe.skip("check header after registration", () => {
  test("user won't be able to see the login and register button after registration", async () => {
    render(<Layout />);

    const registerButton = screen.getByRole("button", { name: /register/i });
    userEvent.click(registerButton);

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

    const submitButton = screen.getByRole("button", { name: "REGISTER" });

    userEvent.click(submitButton);

    const registerMessage = await screen.findByText(
      /you registered successfully/i
    );
    expect(registerMessage).toBeInTheDocument();
    expect(registerMessage).toHaveClass("alert-success");

    const nullLoginButton = screen.queryByRole("button", { name: /login/i });
    const nullRegisterButton = screen.queryByRole("button", {
      name: /register/i,
    });
    expect(nullLoginButton).not.toBeInTheDocument();
    expect(nullRegisterButton).not.toBeInTheDocument();
  });

  test("user will see the profile and logout buttons after registeration", async () => {
    render(<Layout />);

    const registerButton = screen.getByRole("button", { name: /register/i });
    userEvent.click(registerButton);

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

    const submitButton = screen.getByRole("button", { name: "REGISTER" });

    userEvent.click(submitButton);

    const registerMessage = await screen.findByText(
      /you registered successfully/i
    );
    expect(registerMessage).toBeInTheDocument();
    expect(registerMessage).toHaveClass("alert-success");

    const profileLink = await screen.findByRole("link", { name: /profile/i });
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(profileLink).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });
});
