import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import QuestionAnswers from "../question-answers.component";

describe("check question answers for not created answers", () => {
  const answers = [
    { text_part: "first answer", id: 1 },
    { text_part: "second answer", id: 2 },
    { text_part: "third answer", id: 3 },
  ];

  test("for every answer, there must be an input with its value", () => {
    const deleteAnswer = jest.fn();
    const addAnswer = jest.fn();
    const changeAnswer = jest.fn();
    render(
      <QuestionAnswers
        notCreatedStates={answers}
        addState={addAnswer}
        deleteState={deleteAnswer}
        changeState={changeAnswer}
      />
    );

    for (const current of answers) {
      expect(screen.getByDisplayValue(current.text_part)).toBeInTheDocument();
    }
  });

  test("on clicking on create answer, 'addAnswer' must be called", async () => {
    const deleteAnswer = jest.fn();
    const addAnswer = jest.fn();
    const changeAnswer = jest.fn();
    render(
      <QuestionAnswers
        notCreatedStates={answers}
        addState={addAnswer}
        deleteState={deleteAnswer}
        changeState={changeAnswer}
      />
    );

    const addAnswerButton = screen.getByRole("button", {
      name: /create a new answer/i,
    });
    expect(addAnswerButton).toBeEnabled();

    userEvent.click(addAnswerButton);
    expect(addAnswer).toHaveBeenCalledTimes(1);
  });

  test("on clicking on delete button, the 'deleteAnswer' with answer id must be called", async () => {
    const deleteAnswer = jest.fn();
    const addAnswer = jest.fn();
    const changeAnswer = jest.fn();
    render(
      <QuestionAnswers
        notCreatedStates={answers}
        addState={addAnswer}
        deleteState={deleteAnswer}
        changeState={changeAnswer}
      />
    );

    const firstDeleteButton = screen.getAllByRole("button", {
      name: /delete answer/i,
    })[0];
    expect(firstDeleteButton).toBeEnabled();
    userEvent.click(firstDeleteButton);
    expect(deleteAnswer).toHaveBeenCalledTimes(1);
    expect(deleteAnswer).toHaveBeenCalledWith(answers[0].id);
  });

  test("if an answer changed, the 'changeAnswer' must be called with new value", () => {
    const deleteAnswer = jest.fn();
    const addAnswer = jest.fn();
    const changeAnswer = jest.fn();
    render(
      <QuestionAnswers
        notCreatedStates={answers}
        addState={addAnswer}
        deleteState={deleteAnswer}
        changeState={changeAnswer}
      />
    );

    const newValue = "new new value";
    const firstInput = screen.getAllByRole("textbox")[0];
    userEvent.clear(firstInput);
    userEvent.type(firstInput, newValue);

    expect(changeAnswer).toHaveBeenCalledTimes(1 + newValue.length);
  });

  test("if the readOnly property was true, user can not add or delete answers", async () => {
    const deleteAnswer = jest.fn();
    const addAnswer = jest.fn();
    const changeAnswer = jest.fn();
    render(
      <QuestionAnswers
        readOnly={true}
        notCreatedStates={answers}
        addState={addAnswer}
        deleteState={deleteAnswer}
        changeState={changeAnswer}
      />
    );

    const newValue = "new new value";
    const firstInput = screen.getAllByRole("textbox")[0];
    userEvent.clear(firstInput);
    userEvent.type(firstInput, newValue);

    expect(changeAnswer).toHaveBeenCalledTimes(0);

    const firstDeleteButton = screen.getAllByRole("button", {
      name: /delete answer/i,
    })[0];
    expect(firstDeleteButton).toBeDisabled();
    userEvent.click(firstDeleteButton);
    expect(deleteAnswer).toHaveBeenCalledTimes(0);
  });

  test("if there is any errors, it must be shown with class text-danger", async () => {
    const deleteAnswer = jest.fn();
    const addAnswer = jest.fn();
    const changeAnswer = jest.fn();
    const error = "something went wrong";
    render(
      <QuestionAnswers
        notCreatedStates={answers}
        addState={addAnswer}
        deleteState={deleteAnswer}
        changeState={changeAnswer}
        error={error}
      />
    );

    const errorMessage = screen.getByText(error, { exact: false });
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-danger");
  });
});
