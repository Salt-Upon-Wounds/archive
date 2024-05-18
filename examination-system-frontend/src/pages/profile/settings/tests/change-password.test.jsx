import {
  renderWithAuthentication,
  screen,
} from "../../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import SettingsPage from "../settings.page";
import {
  correctPassword,
  correctNewPassword,
  shortPassword,
} from "../../../../mocks/mocks/authentication.mock";

test("after changing the password, changePassword function of authentication context must be called with right values", async () => {
  const logoutMock = jest.fn();
  const changePasswordMock = jest.fn();
  renderWithAuthentication(<SettingsPage />, {
    authenticationProviderProps: {
      logout: logoutMock,
      changePassword: changePasswordMock,
    },
  });

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

  expect(changePasswordMock).toHaveBeenCalledTimes(1);
  expect(changePasswordMock).toHaveBeenCalledWith(
    correctPassword,
    correctNewPassword,
    correctNewPassword
  );
});

test("if there is any error, it must be shown", async () => {
  const errors = {
    current_password: "current password error",
    password: "password error",
    password_confirmation: "password confirmation error",
  };
  renderWithAuthentication(<SettingsPage />, {
    authenticationProviderProps: {
      errors,
    },
  });

  for (const error in errors) {
    expect(screen.getByText(errors[error])).toBeInTheDocument();
  }
});
