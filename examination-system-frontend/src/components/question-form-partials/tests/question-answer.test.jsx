import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import QuestionAnswer from "../question-answer.component";

test("the given value in props will be in the input", () => {
  const value = "value value";
  const deleteAnswer = jest.fn();
  const changeAnswer = jest.fn();
  render(
    <QuestionAnswer
      value={value}
      deleteAnswer={deleteAnswer}
      changeAnswer={changeAnswer}
    />
  );

  const input = screen.getByRole("textbox");
  expect(input).toHaveValue(value);
});

test("when the input changed, the 'changeAnswer' must be called", () => {
  const value = "value value";
  const newValue = "new new value";
  const deleteAnswer = jest.fn();
  const changeAnswer = jest.fn();
  render(
    <QuestionAnswer
      value={value}
      deleteAnswer={deleteAnswer}
      changeAnswer={changeAnswer}
    />
  );

  const input = screen.getByRole("textbox");
  userEvent.clear(input);
  userEvent.type(input, newValue);
  expect(changeAnswer).toHaveBeenCalledTimes(1 + newValue.length);
});

test("if delete button clicked, the 'deleteAnswer' must be called", () => {
  const value = "value value";
  const deleteAnswer = jest.fn();
  const changeAnswer = jest.fn();
  render(
    <QuestionAnswer
      value={value}
      deleteAnswer={deleteAnswer}
      changeAnswer={changeAnswer}
    />
  );

  const deleteButton = screen.getByRole("button", { name: /delete answer/i });
  userEvent.click(deleteButton);

  expect(deleteAnswer).toHaveBeenCalledTimes(1);
});

test("if the readOnly prop was true, the input must be readonly and the button must be disabled", () => {
  const value = "value value";
  const newValue = "new new value";
  const deleteAnswer = jest.fn();
  const changeAnswer = jest.fn();
  render(
    <QuestionAnswer
      value={value}
      deleteAnswer={deleteAnswer}
      changeAnswer={changeAnswer}
      readOnly={true}
    />
  );

  const input = screen.getByRole("textbox");
  userEvent.clear(input);
  userEvent.type(input, newValue);

  expect(changeAnswer).toHaveBeenCalledTimes(0);

  const deleteButton = screen.getByRole("button", { name: /delete answer/i });
  userEvent.click(deleteButton);

  expect(deleteAnswer).toHaveBeenCalledTimes(0);
});

test("if there was any error, it must be shown with class text-danger", () => {
  const value = "value value";
  const error = "something went wrong";
  const deleteAnswer = jest.fn();
  const changeAnswer = jest.fn();
  render(
    <QuestionAnswer
      value={value}
      deleteAnswer={deleteAnswer}
      changeAnswer={changeAnswer}
      error={error}
    />
  );

  const errorMessage = screen.getByText(error);
  expect(errorMessage).toHaveClass("text-danger");
});
