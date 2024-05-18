import {
  render,
  waitFor,
  screen,
} from "../../../test-utils/testing-library-utils";
import CreateQuestion from "../create-question.component";
import userEvent from "@testing-library/user-event";
import { wrapper, selectValues } from "./partials";
import { wait } from "../../../utilities/tests.utility";

describe("create true or false questions", () => {
  test("create question with answer true", async () => {
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

    userEvent.selectOptions(questionTypeSelector, [selectValues.trueOrFalse]);
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

    // change answer to true
    const questionAnswer = await screen.findByRole("radio", { name: /true/i });
    userEvent.click(questionAnswer);
    expect(questionAnswer).toBeChecked();
    // end

    // click create button
    const createButton = screen.getByRole("button", { name: /create/i });
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
      expect(screen.getByRole("button", { name: /create/i })).toBeEnabled()
    );
    // end
  });
  test("create question with answer false", async () => {
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

    userEvent.selectOptions(questionTypeSelector, [selectValues.trueOrFalse]);
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
    const createButton = screen.getByRole("button", { name: /create/i });
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

    userEvent.selectOptions(questionTypeSelector, [selectValues.trueOrFalse]);
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

    userEvent.selectOptions(questionTypeSelector, [selectValues.trueOrFalse]);
    // end

    await wait(100);

    const spinButtons = screen.getAllByRole("spinbutton");
    for (let i = 0; i < spinButtons.length; i++) {
      expect(spinButtons[i]).toHaveAttribute("readonly");
    }
  });
  test("check all the buttons are disabled", async () => {
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

    userEvent.selectOptions(questionTypeSelector, [selectValues.trueOrFalse]);
    // end

    await wait(100);

    const createButton = screen.getByRole("button", { name: /create/i });
    expect(createButton).toBeDisabled();

    const radios = screen.getAllByRole("radio");
    for (let i = 0; i < radios.length; i++) {
      expect(radios[i]).toBeDisabled();
    }
  });
});
