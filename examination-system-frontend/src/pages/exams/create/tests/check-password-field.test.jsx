import { screen, render } from "../../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import CreateExamPage from "../create-exam.page";

test("by default, needs password checkbox is unchecked and password field is not visible", () => {
  render(<CreateExamPage />);

  const needsPasswordCheckbox = screen.getByRole("checkbox", {
    name: /needs password\?/i,
  });
  expect(needsPasswordCheckbox).not.toBeChecked();

  const nullPasswordField = screen.queryByPlaceholderText(/exam's password/i);
  expect(nullPasswordField).not.toBeInTheDocument();
});

test("if exam needs password, the password field will be shown", () => {
  render(<CreateExamPage />);

  const needsPasswordCheckbox = screen.getByRole("checkbox", {
    name: /needs password\?/i,
  });
  expect(needsPasswordCheckbox).not.toBeChecked();

  userEvent.click(needsPasswordCheckbox);

  expect(needsPasswordCheckbox).toBeChecked();

  const passwordField = screen.getByPlaceholderText(/exam's password/i);
  expect(passwordField).toBeInTheDocument();
});

test("user can disable password feature", () => {
  render(<CreateExamPage />);

  const needsPasswordCheckbox = screen.getByRole("checkbox", {
    name: /needs password\?/i,
  });
  expect(needsPasswordCheckbox).not.toBeChecked();

  userEvent.click(needsPasswordCheckbox);
  userEvent.click(needsPasswordCheckbox);

  expect(needsPasswordCheckbox).not.toBeChecked();

  const nullPasswordField = screen.queryByPlaceholderText(/exam's password/i);
  expect(nullPasswordField).not.toBeInTheDocument();
});
