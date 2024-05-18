import QuestionText from "../question-text.component";
import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";

test("the value must be shown in the input", async () => {
  const onChange = jest.fn();
  const value = "test test test";
  render(<QuestionText value={value} onChange={onChange} />);

  const questionTextInput = screen.getByRole("textbox", {
    name: /question text/i,
  });
  expect(questionTextInput).toHaveValue(value);
});

test("on every change, the onChange function must be triggered", async () => {
  const onChange = jest.fn();
  const value = "test test test";
  const newValue = "test test";
  render(<QuestionText value={value} onChange={onChange} />);

  const questionTextInput = screen.getByRole("textbox", {
    name: /question text/i,
  });
  userEvent.clear(questionTextInput);
  userEvent.type(questionTextInput, newValue);
  expect(onChange).toHaveBeenCalledTimes(newValue.length + 1);
});

test("if readonly is equal to true, input must be readonly", async () => {
  const onChange = jest.fn();
  const value = "test test test";
  render(<QuestionText value={value} onChange={onChange} readOnly={true} />);

  const questionTextInput = screen.getByRole("textbox", {
    name: /question text/i,
  });
  expect(questionTextInput).toHaveAttribute("readonly");

  userEvent.clear(questionTextInput);
  userEvent.type(questionTextInput, value + " test");
  expect(onChange).toHaveBeenCalledTimes(0);
});

test("if there was errors, errors must be appear with class 'text-danger'", async () => {
  const onChange = jest.fn();
  const value = "test test test";
  const errorMessage = "something went wrong";
  render(
    <QuestionText value={value} onChange={onChange} error={errorMessage} />
  );

  const errorMessageContainer = screen.getByText(errorMessage);
  expect(errorMessageContainer).toBeInTheDocument();
  expect(errorMessageContainer).toHaveClass("text-danger");
});
