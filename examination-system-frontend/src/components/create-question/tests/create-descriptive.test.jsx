import {
  render,
  waitFor,
  screen,
} from "../../../test-utils/testing-library-utils";
import CreateQuestion from "../create-question.component";
import userEvent from "@testing-library/user-event";
import { wrapper, selectValues } from "./partials";
import { wait } from "../../../utilities/tests.utility";

describe("create descriptive questions", () => {
  test("user can create a new descriptive question", async () => {
    const addQuestion = jest.fn();
    render(
      wrapper(
        <CreateQuestion isVisible={true} examId={1} addQuestion={addQuestion} />
      )
    );

    const selectInput = await screen.findByRole("combobox", {
      name: /question type/i,
    });

    userEvent.selectOptions(selectInput, [selectValues.descriptive]);

    const questionText = screen.getByRole("textbox", {
      name: /question text/i,
    });
    const value = "new new new value";
    userEvent.clear(questionText);
    userEvent.type(questionText, value);

    const questionScore = screen.getByRole("spinbutton", {
      name: /question score/i,
    });
    const score = "20";
    userEvent.clear(questionScore);
    userEvent.type(questionScore, score);

    const createButton = screen.getByRole("button", { name: /create/i });
    expect(createButton).toBeEnabled();
    userEvent.click(createButton);

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
    await wait(100);

    const spinButtons = screen.getAllByRole("spinbutton");
    for (let i = 0; i < spinButtons.length; i++) {
      expect(spinButtons[i]).toHaveAttribute("readonly");
    }
  });
  test("check all the buttons are readonly except cancel button", async () => {
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
    await wait(100);

    const buttons = screen.getAllByRole("button");
    for (let i = 0; i < buttons.length - 1; i++) {
      expect(buttons[i]).toHaveAttribute("disabled");
    }
  });
});
