import {
  render,
  waitFor,
  screen,
} from "../../../test-utils/testing-library-utils";
import CreateQuestion from "../create-question.component";
import userEvent from "@testing-library/user-event";
import { wrapper, selectValues } from "./partials";
import { wait } from "../../../utilities/tests.utility";

describe("create select the answer questions", () => {
  test("user can create a select the answer question without options", async () => {
    const addQuestion = jest.fn();
    render(
      wrapper(
        <CreateQuestion isVisible={true} addQuestion={addQuestion} examId={1} />
      )
    );

    // change question type
    const questionTypeSelector = await screen.findByRole("combobox", {
      name: /question type/i,
    });

    userEvent.selectOptions(questionTypeSelector, [
      selectValues.selectTheAnswer,
    ]);
    // end

    // change question text
    const questionText = "new new new test";
    const questionTextInput = screen.getByRole("textbox", {
      name: /question text/i,
    });
    userEvent.clear(questionTextInput);
    userEvent.type(questionTextInput, questionText);
    // end

    // change question score
    const questionScore = "20";
    const questionScoreInput = screen.getByRole("spinbutton", {
      name: /question score/i,
    });
    userEvent.clear(questionScoreInput);
    userEvent.type(questionScoreInput, questionScore);
    // end

    // click create button
    const createButton = screen.getAllByRole("button", { name: /create/i })[1];
    expect(createButton).toBeEnabled();
    userEvent.click(createButton);
    // end

    // check button label changed to loading
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

    await waitFor(() => expect(addQuestion).toHaveBeenCalledTimes(1));

    // check button returned to normal
    await waitFor(() =>
      expect(
        screen.getAllByRole("button", { name: /create/i })[1]
      ).toBeEnabled()
    );
    // end
  });

  test("user can create a select the answer question with options", async () => {
    const addQuestion = jest.fn();
    render(
      wrapper(
        <CreateQuestion isVisible={true} addQuestion={addQuestion} examId={1} />
      )
    );

    // change question type
    const questionTypeSelector = await screen.findByRole("combobox", {
      name: /question type/i,
    });

    userEvent.selectOptions(questionTypeSelector, [
      selectValues.selectTheAnswer,
    ]);
    // end

    // change question text
    const questionText = "new new new test";
    const questionTextInput = screen.getByRole("textbox", {
      name: /question text/i,
    });
    userEvent.clear(questionTextInput);
    userEvent.type(questionTextInput, questionText);
    // end

    // change question score
    const questionScore = "20";
    const questionScoreInput = screen.getByRole("spinbutton", {
      name: /question score/i,
    });
    userEvent.clear(questionScoreInput);
    userEvent.type(questionScoreInput, questionScore);
    // end

    // add options
    const addOptionsButton = screen.getByRole("button", {
      name: /new option/i,
    });

    userEvent.click(addOptionsButton);
    userEvent.click(addOptionsButton);
    userEvent.click(addOptionsButton);
    // end

    // fill options
    const optionTextFields = screen.getAllByRole("textbox", {
      name: /question option/i,
    });
    userEvent.clear(optionTextFields[0]);
    userEvent.clear(optionTextFields[1]);
    userEvent.clear(optionTextFields[2]);

    const option1 = "option 1 option 1";
    const option2 = "option 2 option 2";
    const option3 = "option 3 option 3";

    userEvent.type(optionTextFields[0], option1);
    userEvent.type(optionTextFields[1], option2);
    userEvent.type(optionTextFields[2], option3);

    const correctRadios = screen.getAllByRole("radio", {
      name: /correct answer/i,
    });
    userEvent.click(correctRadios[0]);
    userEvent.click(correctRadios[1]);
    // end

    // check answer of options
    await waitFor(() => expect(correctRadios[0]).not.toBeChecked());
    expect(correctRadios[1]).toBeChecked();
    expect(correctRadios[2]).not.toBeChecked();
    // end

    // click create button
    const createButton = screen.getAllByRole("button", { name: /create/i })[1];
    expect(createButton).toBeEnabled();
    userEvent.click(createButton);
    // end

    await waitFor(() => expect(addQuestion).toHaveBeenCalledTimes(1));
  });

  test("user can delete an option before creating the question", async () => {
    const addQuestion = jest.fn();
    render(
      wrapper(
        <CreateQuestion isVisible={true} addQuestion={addQuestion} examId={1} />
      )
    );

    // change question type
    const questionTypeSelector = await screen.findByRole("combobox", {
      name: /question type/i,
    });

    userEvent.selectOptions(questionTypeSelector, [
      selectValues.selectTheAnswer,
    ]);
    // end

    // change question text
    const questionText = "new new new test";
    const questionTextInput = screen.getByRole("textbox", {
      name: /question text/i,
    });
    userEvent.clear(questionTextInput);
    userEvent.type(questionTextInput, questionText);
    // end

    // change question score
    const questionScore = "20";
    const questionScoreInput = screen.getByRole("spinbutton", {
      name: /question score/i,
    });
    userEvent.clear(questionScoreInput);
    userEvent.type(questionScoreInput, questionScore);
    // end

    // add options
    const addOptionsButton = screen.getByRole("button", {
      name: /new option/i,
    });

    userEvent.click(addOptionsButton);
    userEvent.click(addOptionsButton);
    userEvent.click(addOptionsButton);
    // end

    // fill options
    const optionTextFields = screen.getAllByRole("textbox", {
      name: /question option/i,
    });
    userEvent.clear(optionTextFields[0]);
    userEvent.clear(optionTextFields[1]);
    userEvent.clear(optionTextFields[2]);

    const option1 = "option 1 option 1";
    const option2 = "option 2 option 2";
    const option3 = "option 3 option 3";

    userEvent.type(optionTextFields[0], option1);
    userEvent.type(optionTextFields[1], option2);
    userEvent.type(optionTextFields[2], option3);

    const correctRadios = screen.getAllByRole("radio", {
      name: /correct answer/i,
    });
    userEvent.click(correctRadios[0]);
    userEvent.click(correctRadios[1]);
    // end

    // check answer of options
    await waitFor(() => expect(correctRadios[0]).not.toBeChecked());
    expect(correctRadios[1]).toBeChecked();
    expect(correctRadios[2]).not.toBeChecked();
    // end

    // delete second option
    const deleteButtons = screen.getAllByRole("button", {
      name: /delete option/i,
    });
    userEvent.click(deleteButtons[1]);
    // end

    // check second option is deleted
    await waitFor(() =>
      expect(
        screen.getAllByRole("textbox", { name: /question option/i })
      ).toHaveLength(2)
    );

    // click create button
    const createButton = screen.getAllByRole("button", { name: /create/i })[1];
    expect(createButton).toBeEnabled();
    userEvent.click(createButton);
    // end

    await waitFor(() => expect(addQuestion).toHaveBeenCalledTimes(1));
  });

  test("user can change an option before creating the question", async () => {
    const addQuestion = jest.fn();
    render(
      wrapper(
        <CreateQuestion isVisible={true} addQuestion={addQuestion} examId={1} />
      )
    );

    // change question type
    const questionTypeSelector = await screen.findByRole("combobox", {
      name: /question type/i,
    });

    userEvent.selectOptions(questionTypeSelector, [
      selectValues.selectTheAnswer,
    ]);
    // end

    // change question text
    const questionText = "new new new test";
    const questionTextInput = screen.getByRole("textbox", {
      name: /question text/i,
    });
    userEvent.clear(questionTextInput);
    userEvent.type(questionTextInput, questionText);
    // end

    // change question score
    const questionScore = "20";
    const questionScoreInput = screen.getByRole("spinbutton", {
      name: /question score/i,
    });
    userEvent.clear(questionScoreInput);
    userEvent.type(questionScoreInput, questionScore);
    // end

    // add options
    const addOptionsButton = screen.getByRole("button", {
      name: /new option/i,
    });

    userEvent.click(addOptionsButton);
    userEvent.click(addOptionsButton);
    userEvent.click(addOptionsButton);
    // end

    // fill options
    const optionTextFields = screen.getAllByRole("textbox", {
      name: /question option/i,
    });
    userEvent.clear(optionTextFields[0]);
    userEvent.clear(optionTextFields[1]);
    userEvent.clear(optionTextFields[2]);

    const option1 = "option 1 option 1";
    const option2 = "option 2 option 2";
    const option3 = "option 3 option 3";

    userEvent.type(optionTextFields[0], option1);
    userEvent.type(optionTextFields[1], option2);
    userEvent.type(optionTextFields[2], option3);

    const correctRadios = screen.getAllByRole("radio", {
      name: /correct answer/i,
    });
    userEvent.click(correctRadios[0]);
    userEvent.click(correctRadios[1]);
    // end

    // check answer of options
    await waitFor(() => expect(correctRadios[0]).not.toBeChecked());
    expect(correctRadios[1]).toBeChecked();
    expect(correctRadios[2]).not.toBeChecked();
    // end

    // change an option value
    const changedOption2 = option2 + "new new update";
    userEvent.clear(optionTextFields[1]);
    userEvent.type(optionTextFields[1], changedOption2);
    // end

    // check for new value
    expect(optionTextFields[1]).toHaveValue(changedOption2);
    // end

    // click create button
    const createButton = screen.getAllByRole("button", { name: /create/i })[1];
    expect(createButton).toBeEnabled();
    userEvent.click(createButton);
    // end

    await waitFor(() => expect(addQuestion).toHaveBeenCalledTimes(1));
  });
});

describe("check readonly property", () => {
  test("check all the textbox fields are readonly", async () => {
    const addQuestion = jest.fn();
    render(
      wrapper(
        <CreateQuestion
          isVisible={true}
          examId={1}
          readOnly={true}
          addQuestion={addQuestion}
        />
      )
    );

    // change question type
    const questionTypeSelector = await screen.findByRole("combobox", {
      name: /question type/i,
    });

    userEvent.selectOptions(questionTypeSelector, [
      selectValues.selectTheAnswer,
    ]);
    // end

    await wait(100);

    const textboxInputs = screen.getAllByRole("textbox");
    for (let i = 0; i < textboxInputs.length; i++) {
      expect(textboxInputs[i]).toHaveAttribute("readonly");
    }
  });
  test("check all the spinbutton fields are readonly", async () => {
    const addQuestion = jest.fn();
    render(
      wrapper(
        <CreateQuestion
          isVisible={true}
          examId={1}
          readOnly={true}
          addQuestion={addQuestion}
        />
      )
    );

    // change question type
    const questionTypeSelector = await screen.findByRole("combobox", {
      name: /question type/i,
    });

    userEvent.selectOptions(questionTypeSelector, [
      selectValues.selectTheAnswer,
    ]);
    // end

    await wait(100);

    const spinButtons = screen.getAllByRole("spinbutton");
    for (let i = 0; i < spinButtons.length; i++) {
      expect(spinButtons[i]).toHaveAttribute("readonly");
    }
  });
  test("check all the buttons are disabled except cancel button", async () => {
    const addQuestion = jest.fn();
    render(
      wrapper(
        <CreateQuestion
          isVisible={true}
          examId={1}
          readOnly={true}
          addQuestion={addQuestion}
        />
      )
    );

    // change question type
    const questionTypeSelector = await screen.findByRole("combobox", {
      name: /question type/i,
    });

    userEvent.selectOptions(questionTypeSelector, [
      selectValues.selectTheAnswer,
    ]);
    // end

    await wait(100);

    const buttons = screen.getAllByRole("button");
    for (let i = 0; i < buttons.length - 1; i++) {
      expect(buttons[i]).toHaveAttribute("disabled");
    }
  });
});
