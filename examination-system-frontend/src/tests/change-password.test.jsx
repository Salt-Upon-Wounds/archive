import { screen, waitFor, render } from "../test-utils/testing-library-utils";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import App from "../App";
import {
  correctPassword,
  correctNewPassword,
  userEmail,
} from "../mocks/mocks/authentication.mock";
import { wrongCurrentPassword } from "../mocks/errors/failed-change-password.error";
import { userName } from "../mocks/mocks/authentication.mock";

test("user can change the password, the button must be labeled by loading and then the user must be logged out", async () => {
  render(<App />);

  // authenticate
  const loginLink = await screen.findByRole("link", { name: /login/i });
  userEvent.click(loginLink);

  const emailField = await screen.findByRole("textbox", { name: /email/i });
  userEvent.clear(emailField);
  userEvent.type(emailField, userEmail);

  const passwordField = await screen.findByLabelText(/password/i);
  userEvent.clear(passwordField);
  userEvent.type(passwordField, correctPassword);

  const mainLoginButton = await screen.findByRole("button", { name: "LOGIN" });
  userEvent.click(mainLoginButton);

  // goto settings
  const dashboardLink = (
    await screen.findAllByRole("link", { name: /dashboard/i })
  )[0];
  userEvent.click(dashboardLink);

  const settingsLink = (
    await screen.findAllByRole("link", { name: /settings/i })
  )[0];
  userEvent.click(settingsLink);

  // mock axios
  const axiosPutMock = jest.spyOn(axios, "put");

  // change password
  const currentPasswordField = screen.getByLabelText(/current password/i);
  userEvent.clear(currentPasswordField);
  userEvent.type(currentPasswordField, correctPassword);

  const newPasswordField = screen.getByLabelText(/^new password$/i);
  userEvent.clear(newPasswordField);
  userEvent.type(newPasswordField, correctNewPassword);

  const confirmNewPasswordField = screen.getByLabelText(
    /confirm new password/i
  );
  userEvent.clear(confirmNewPasswordField);
  userEvent.type(confirmNewPasswordField, correctNewPassword);

  const changePasswordButton = screen.getByRole("button", {
    name: /change password/i,
  });
  userEvent.click(changePasswordButton);

  await waitFor(() =>
    expect(changePasswordButton).toHaveTextContent(/loading/i)
  );
  expect(changePasswordButton).toBeDisabled();

  expect(axiosPutMock).toHaveBeenCalledTimes(1);

  await waitFor(() =>
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument()
  );
});

test("if user's action has error, the error must be shown to user", async () => {
  render(<App />);

  // authenticate
  const loginLink = await screen.findByRole("link", { name: /login/i });
  userEvent.click(loginLink);

  const emailField = await screen.findByRole("textbox", { name: /email/i });
  userEvent.clear(emailField);
  userEvent.type(emailField, userEmail);

  const passwordField = await screen.findByLabelText(/password/i);
  userEvent.clear(passwordField);
  userEvent.type(passwordField, correctPassword);

  const mainLoginButton = await screen.findByRole("button", { name: "LOGIN" });
  userEvent.click(mainLoginButton);

  // goto settings
  const dashboardLink = (
    await screen.findAllByRole("link", { name: /dashboard/i })
  )[0];
  userEvent.click(dashboardLink);

  const settingsLink = (
    await screen.findAllByRole("link", { name: /settings/i })
  )[0];
  userEvent.click(settingsLink);

  // mock axios
  const axiosPutMock = jest.spyOn(axios, "put");

  // change password
  const currentPasswordField = screen.getByLabelText(/current password/i);
  userEvent.clear(currentPasswordField);
  userEvent.type(currentPasswordField, correctPassword + "a");

  const newPasswordField = screen.getByLabelText(/^new password$/i);
  userEvent.clear(newPasswordField);
  userEvent.type(newPasswordField, correctNewPassword);

  const confirmNewPasswordField = screen.getByLabelText(
    /confirm new password/i
  );
  userEvent.clear(confirmNewPasswordField);
  userEvent.type(confirmNewPasswordField, correctNewPassword);

  const changePasswordButton = screen.getByRole("button", {
    name: /change password/i,
  });
  userEvent.click(changePasswordButton);

  expect(
    await screen.findByText(wrongCurrentPassword.errors.current_password)
  ).toBeInTheDocument();
});
