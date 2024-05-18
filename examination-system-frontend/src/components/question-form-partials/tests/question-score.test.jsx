import QuestionScore from "../question-score.component";
import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";

test("the value of component must be shown in input", async () => {
  const value = 123;
  const error = "";
  const onChange = jest.fn();
  const readOnly = false;
  render(
    <QuestionScore
      value={value}
      onChange={onChange}
      error={error}
      readOnly={readOnly}
    />
  );

  const questionScoreInput = screen.getByRole("spinbutton", {
    name: /question score/i,
  });
  expect(questionScoreInput).toHaveValue(value);
});

test("on every change the onChange function must be triggered", async () => {
  const value = 123;
  const newValue = 456;
  const error = "";
  const onChange = jest.fn();
  const readOnly = false;
  render(
    <QuestionScore
      value={value}
      onChange={onChange}
      error={error}
      readOnly={readOnly}
    />
  );

  const questionScoreInput = screen.getByRole("spinbutton", {
    name: /question score/i,
  });
  userEvent.clear(questionScoreInput);
  userEvent.type(questionScoreInput, String(newValue));
  expect(onChange).toHaveBeenCalledTimes(String(newValue).length + 1);
});

test("if readOnly is equal to true, the input must be readOnly", async () => {
  const value = 123;
  const newValue = 456;
  const error = "";
  const onChange = jest.fn();
  const readOnly = true;
  render(
    <QuestionScore
      value={value}
      onChange={onChange}
      error={error}
      readOnly={readOnly}
    />
  );

  const questionScoreInput = screen.getByRole("spinbutton", {
    name: /question score/i,
  });
  expect(questionScoreInput).toHaveAttribute("readonly");

  userEvent.clear(questionScoreInput);
  userEvent.type(questionScoreInput, String(newValue));
  expect(onChange).toHaveBeenCalledTimes(0);
});

test("if there is any error, it must be appeared with the class 'text-danger'", async () => {
  const value = 123;
  const error = "something went wrong";
  const onChange = jest.fn();
  const readOnly = false;
  render(
    <QuestionScore
      value={value}
      onChange={onChange}
      error={error}
      readOnly={readOnly}
    />
  );

  const errorMessage = screen.getByText(error);
  expect(errorMessage).toHaveClass("text-danger");
});
