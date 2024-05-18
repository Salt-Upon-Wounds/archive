import {
  waitFor,
  render,
  screen,
} from "../../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Register from "../register.component";
import {
  userEmail,
  userName,
  repeatedEmail,
  correctPassword,
  shortPassword,
} from "../../../../mocks/mocks/authentication.mock";

test("user can register to the site", async () => {
  render(<Register />);

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
  render(<Register />);

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
  render(<Register />);

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
  render(<Register />);

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
  render(<Register />);

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
  render(<Register />);

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
