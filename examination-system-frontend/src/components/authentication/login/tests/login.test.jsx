import {
  waitFor,
  render,
  screen,
} from "../../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Login from "../login.component";
import {
  userEmail,
  correctPassword,
} from "../../../../mocks/mocks/authentication.mock";

test("user can login with login component", async () => {
  render(<Login />);

  const examField = screen.getByRole("textbox", { name: /email address/i });
  const passwordField = screen.getByLabelText(/password/i);

  userEvent.clear(examField);
  userEvent.type(examField, userEmail);

  userEvent.clear(passwordField);
  userEvent.type(passwordField, correctPassword);

  const loginButton = screen.getByRole("button", { name: /login/i });

  userEvent.click(loginButton);

  const textMessage = await screen.findByRole(
    "alert",
    /you logged in successfully/i
  );
  expect(textMessage).toHaveClass("alert-success");
  expect(textMessage).toBeInTheDocument();
});

test("user will see 'loading...' in button and button will be disabled when the request is pending", async () => {
  render(<Login />);

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
  render(<Login />);

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
  render(<Login />);

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
