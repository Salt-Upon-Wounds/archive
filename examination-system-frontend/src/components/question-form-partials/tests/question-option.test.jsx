import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import QuestionOption from "../question-option.component.jsx";

test("the given value on props must be in the input", () => {
  const value = "test test";
  const deleteOption = jest.fn();
  const changeOption = jest.fn();
  const readOnly = false;
  const answer = true;
  render(
    <QuestionOption
      value={value}
      deleteOption={deleteOption}
      changeOption={changeOption}
      readOnly={readOnly}
      answer={answer}
    />
  );

  const optionInput = screen.getByRole("textbox");
  expect(optionInput).toHaveValue(value);
});

describe("the given answer must be displayed", () => {
  test("check when answer = true", () => {
    const value = "test test";
    const deleteOption = jest.fn();
    const changeOption = jest.fn();
    const readOnly = false;
    const answer = true;
    render(
      <QuestionOption
        value={value}
        deleteOption={deleteOption}
        changeOption={changeOption}
        readOnly={readOnly}
        answer={answer}
      />
    );

    const correctCheckbox = screen.getByRole("radio", {
      name: /correct answer/i,
    });
    expect(correctCheckbox).toBeChecked();

    const wrongCheckbox = screen.getByRole("radio", { name: /wrong answer/i });
    expect(wrongCheckbox).not.toBeChecked();
  });
  test("check when answer = false", () => {
    const value = "test test";
    const deleteOption = jest.fn();
    const changeOption = jest.fn();
    const readOnly = false;
    const answer = false;
    render(
      <QuestionOption
        value={value}
        deleteOption={deleteOption}
        changeOption={changeOption}
        readOnly={readOnly}
        answer={answer}
      />
    );

    const correctCheckbox = screen.getByRole("radio", {
      name: /correct answer/i,
    });
    expect(correctCheckbox).not.toBeChecked();

    const wrongCheckbox = screen.getByRole("radio", { name: /wrong answer/i });
    expect(wrongCheckbox).toBeChecked();
  });
});

test("on clicking on delete button, the 'deleteOption' must be called", () => {
  const value = "test test";
  const deleteOption = jest.fn();
  const changeOption = jest.fn();
  const readOnly = false;
  const answer = false;
  render(
    <QuestionOption
      value={value}
      deleteOption={deleteOption}
      changeOption={changeOption}
      readOnly={readOnly}
      answer={answer}
    />
  );

  const deleteButton = screen.getByRole("button", { name: /delete option/i });
  expect(deleteButton).toBeEnabled();

  userEvent.click(deleteButton);
  expect(deleteOption).toHaveBeenCalledTimes(1);
});

test("on changing the answer, the 'changeOption' must be called with new value", () => {
  const value = "test test";
  const deleteOption = jest.fn();
  const changeOption = jest.fn();
  const readOnly = false;
  const answer = false;
  render(
    <QuestionOption
      value={value}
      deleteOption={deleteOption}
      changeOption={changeOption}
      readOnly={readOnly}
      answer={answer}
    />
  );

  const correctCheckbox = screen.getByRole("radio", {
    name: /correct answer/i,
  });
  expect(correctCheckbox).not.toBeChecked();

  userEvent.click(correctCheckbox);
  expect(changeOption).toHaveBeenCalledTimes(1);
  expect(changeOption).toHaveBeenCalledWith({ integer_part: 1 });
});

test("on changing the input, the 'changeOption' must be called with new value", () => {
  const value = "test test";
  const newValue = "new new";
  const deleteOption = jest.fn();
  const changeOption = jest.fn();
  const readOnly = false;
  const answer = false;
  render(
    <QuestionOption
      value={value}
      deleteOption={deleteOption}
      changeOption={changeOption}
      readOnly={readOnly}
      answer={answer}
    />
  );

  const optionInput = screen.getByRole("textbox");
  userEvent.clear(optionInput);
  userEvent.type(optionInput, newValue);

  expect(changeOption).toHaveBeenCalledTimes(1 + newValue.length);
});

test("if the readOnly prop was equal to true, none of the inputs must be change", () => {
  const value = "test test";
  const newValue = "new new";
  const deleteOption = jest.fn();
  const changeOption = jest.fn();
  const readOnly = true;
  const answer = false;
  render(
    <QuestionOption
      value={value}
      deleteOption={deleteOption}
      changeOption={changeOption}
      readOnly={readOnly}
      answer={answer}
    />
  );

  const optionInput = screen.getByRole("textbox");
  userEvent.clear(optionInput);
  userEvent.type(optionInput, newValue);

  expect(changeOption).toHaveBeenCalledTimes(0);

  const correctCheckbox = screen.getByRole("radio", {
    name: /correct answer/i,
  });
  expect(correctCheckbox).not.toBeChecked();
  userEvent.click(correctCheckbox);

  expect(changeOption).toHaveBeenCalledTimes(0);

  const deleteButton = screen.getByRole("button", { name: /delete option/i });
  expect(deleteButton).toBeDisabled();
  userEvent.click(deleteButton);

  expect(deleteOption).toHaveBeenCalledTimes(0);
});
