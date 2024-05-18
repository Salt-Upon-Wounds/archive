import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordInput from "../password-input.component";

test("first of all, the type of password input is password but can be toggled to text", () => {
  render(<PasswordInput label="Password" />);

  const passwordInput = screen.getByLabelText(/password/i);
  expect(passwordInput.type).toBe("password");

  const showPasswordButton = screen.getByRole("button", {
    name: /show password/i,
  });
  userEvent.click(showPasswordButton);

  expect(passwordInput.type).toBe("text");

  const hidePasswordButton = screen.getByRole("button", {
    name: /hide password/i,
  });
  userEvent.click(hidePasswordButton);

  expect(passwordInput.type).toBe("password");
});
