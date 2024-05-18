import {
  renderWithAuthentication,
  screen,
  waitFor,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import EditQuestion from "../edit-question.component";
import {
  errors,
  values,
  wrapper,
  savedMessage,
  buttonMessage,
} from "./partials";
import { wait } from "../../../utilities/tests.utility";

describe("check update feature", () => {
  test("at the beginning, there is not any update button and there is 'all changes saved' phrase", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={4} />)
    );

    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
    await wait(100);
    expect(await screen.findByText(savedMessage)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: buttonMessage })
    ).not.toBeInTheDocument();
  });

  test("user can change text description and update; loading message must be labeled on the button when component is loading", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={4} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // change question text
    const questionTextInput = await screen.findByRole("textbox", {
      name: /question text/i,
    });
    userEvent.clear(questionTextInput);
    userEvent.type(questionTextInput, values.newQuestionText);
    // end

    expect(screen.queryByText(savedMessage)).not.toBeInTheDocument();

    // click update button
    const updateButton = await screen.findByRole("button", {
      name: buttonMessage,
    });
    userEvent.click(updateButton);
    // end

    // check loading on button
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /loading/i })
      ).toBeInTheDocument()
    );
    // end

    await wait(100);

    // check for update
    expect(await screen.findByText(savedMessage)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: buttonMessage })
    ).not.toBeInTheDocument();
    // end
  });

  test("user can change question score and update", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={4} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // change question score
    const questionScoreInput = await screen.findByRole("spinbutton", {
      name: /question score/i,
    });
    userEvent.clear(questionScoreInput);
    userEvent.type(questionScoreInput, values.newQuestionScore);
    // end

    expect(screen.queryByText(savedMessage)).not.toBeInTheDocument();

    // click update button
    const updateButton = await screen.findByRole("button", {
      name: buttonMessage,
    });
    userEvent.click(updateButton);
    // end

    // check for update
    expect(await screen.findByText(savedMessage)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: buttonMessage })
    ).not.toBeInTheDocument();
    // end
  });

  test("user can create an option and update", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={4} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // create new option
    const addOptionButton = screen.getByRole("button", { name: /new option/i });
    userEvent.click(addOptionButton);
    // end

    // change last option
    const optionInputs = screen.getAllByRole("textbox", {
      name: /question option/i,
    });
    const lastOptionInput = optionInputs[optionInputs.length - 1];
    userEvent.clear(lastOptionInput);
    userEvent.type(lastOptionInput, values.option1);
    // end

    // click update button
    const updateButton = await screen.findByRole("button", {
      name: buttonMessage,
    });
    userEvent.click(updateButton);
    // end

    await wait(100);

    // check for update
    expect(await screen.findByText(savedMessage)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: buttonMessage })
    ).not.toBeInTheDocument();
    // end
  });

  test("user can edit the text part of an option and update", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={4} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // change last option
    const optionInputs = screen.getAllByRole("textbox", {
      name: /question option/i,
    });
    const lastOptionInput = optionInputs[optionInputs.length - 1];
    userEvent.clear(lastOptionInput);
    userEvent.type(lastOptionInput, values.newOption1);
    // end

    // click update button
    const updateButton = await screen.findByRole("button", {
      name: buttonMessage,
    });
    userEvent.click(updateButton);
    // end

    await wait(100);

    // check for update
    expect(await screen.findByText(savedMessage)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: buttonMessage })
    ).not.toBeInTheDocument();
    // end
  });

  test("user can edit the integer part of an option and update", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={4} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // change last option answer
    const optionAnswers = screen.getAllByRole("radio");
    if (optionAnswers[0].checked) {
      userEvent.click(optionAnswers[1]);
    } else {
      userEvent.click(optionAnswers[0]);
    }
    // end

    // click update button
    const updateButton = await screen.findByRole("button", {
      name: buttonMessage,
    });
    userEvent.click(updateButton);
    // end

    await wait(100);

    // check for update
    expect(await screen.findByText(savedMessage)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: buttonMessage })
    ).not.toBeInTheDocument();
    // end
  });

  test("every select the answer quetions atmost must have 1 correct answer", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={4} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // click correct answer buttons
    const optionAnswers = screen.getAllByRole("radio");
    for (let i = 0; i < optionAnswers.length; i += 2) {
      userEvent.click(optionAnswers[i]);
    }
    // end

    // check one of the correct answers are checked
    expect(optionAnswers[optionAnswers.length - 2]).toBeChecked();
    for (let i = 0; i < optionAnswers.length - 2; i += 2) {
      expect(optionAnswers[i]).not.toBeChecked();
    }
    // end
  });

  test("user can delete an option and update", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={4} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // delete last option
    const deleteButtons = screen.getAllByRole("button", {
      name: /delete option/i,
    });
    const lastDeleteButton = deleteButtons[deleteButtons.length - 1];
    userEvent.click(lastDeleteButton);
    // end

    // click update button
    const updateButton = await screen.findByRole("button", {
      name: buttonMessage,
    });
    userEvent.click(updateButton);
    // end

    await wait(100);

    // check for update
    expect(await screen.findByText(savedMessage)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: buttonMessage })
    ).not.toBeInTheDocument();
    // end
  });

  test("user can create an option and remove it and then he must not see any update button", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={4} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // create new option
    const addOptionButton = screen.getByRole("button", { name: /new option/i });
    userEvent.click(addOptionButton);
    // end

    // delete last option
    const deleteButtons = screen.getAllByRole("button", {
      name: /delete option/i,
    });
    const lastDeleteButton = deleteButtons[deleteButtons.length - 1];
    userEvent.click(lastDeleteButton);
    // end

    await wait(100);

    // check for update
    expect(await screen.findByText(savedMessage)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: buttonMessage })
    ).not.toBeInTheDocument();
    // end
  });

  test("question text must not be empty and user will see error", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={4} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // change question text
    const questionTextInput = await screen.findByRole("textbox", {
      name: /question text/i,
    });
    userEvent.clear(questionTextInput);
    userEvent.type(questionTextInput, "");
    // end

    expect(screen.queryByText(savedMessage)).not.toBeInTheDocument();

    // click update button
    const updateButton = await screen.findByRole("button", {
      name: buttonMessage,
    });
    userEvent.click(updateButton);
    // end

    // check error
    expect(
      await screen.findByText(errors.emptyQuestionText, { exact: false })
    ).toBeInTheDocument();
    // end

    // check update did not happened
    expect(screen.queryByText(savedMessage)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: buttonMessage })
    ).toBeInTheDocument();
    // end
  });

  test("question score must be a positive number and will cause an error", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={4} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // change question score
    const questionScoreInput = await screen.findByRole("spinbutton", {
      name: /question score/i,
    });
    userEvent.clear(questionScoreInput);
    userEvent.type(questionScoreInput, "-1");
    // end

    expect(screen.queryByText(savedMessage)).not.toBeInTheDocument();

    // click update button
    const updateButton = await screen.findByRole("button", {
      name: buttonMessage,
    });
    userEvent.click(updateButton);
    // end

    // check error
    expect(
      await screen.findByText(errors.zeroOrNegativeQuestionScore, {
        exact: false,
      })
    ).toBeInTheDocument();
    // end

    // check update did not happened
    expect(screen.queryByText(savedMessage)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: buttonMessage })
    ).toBeInTheDocument();
    // end
  });

  test("the text part of created option must not be empty", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={4} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // create new option
    const addOptionButton = screen.getByRole("button", { name: /new option/i });
    userEvent.click(addOptionButton);
    // end

    // change last option
    const optionInputs = screen.getAllByRole("textbox", {
      name: /question option/i,
    });
    const lastOptionInput = optionInputs[optionInputs.length - 1];
    userEvent.clear(lastOptionInput);
    userEvent.type(lastOptionInput, "");
    // end

    // click update button
    const updateButton = await screen.findByRole("button", {
      name: buttonMessage,
    });
    userEvent.click(updateButton);
    // end

    await wait(100);

    // check error
    expect(
      await screen.findByText(errors.optionFieldIsEmpty, {
        exact: false,
      })
    ).toBeInTheDocument();
    // end

    // check update did not happened
    expect(screen.queryByText(savedMessage)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: buttonMessage })
    ).toBeInTheDocument();
    // end
  });

  test("the text part of a past option must not be empty", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={4} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // change last option
    const optionInputs = screen.getAllByRole("textbox", {
      name: /question option/i,
    });
    const lastOptionInput = optionInputs[optionInputs.length - 1];
    userEvent.clear(lastOptionInput);
    userEvent.type(lastOptionInput, "");
    // end

    // click update button
    const updateButton = await screen.findByRole("button", {
      name: buttonMessage,
    });
    userEvent.click(updateButton);
    // end

    await wait(100);

    // check error
    expect(
      await screen.findByText(errors.optionFieldIsEmpty, {
        exact: false,
      })
    ).toBeInTheDocument();
    // end

    // check update did not happened
    expect(screen.queryByText(savedMessage)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: buttonMessage })
    ).toBeInTheDocument();
    // end
  });
});

describe("check readonly property", () => {
  test("check all the textbox fields are readonly", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion readOnly={true} examId={1} questionId={4} />)
    );
    await wait(100);

    const textboxInputs = screen.getAllByRole("textbox");
    for (let i = 0; i < textboxInputs.length; i++) {
      expect(textboxInputs[i]).toHaveAttribute("readonly");
    }
  });
  test("check all the spinbutton fields are readonly", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion readOnly={true} examId={1} questionId={4} />)
    );
    await wait(100);

    const spinButtons = screen.getAllByRole("spinbutton");
    for (let i = 0; i < spinButtons.length; i++) {
      expect(spinButtons[i]).toHaveAttribute("readonly");
    }
  });
  test("check all the radio buttons are disabled", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion readOnly={true} examId={1} questionId={4} />)
    );
    await wait(100);

    const radioButtons = screen.getAllByRole("radio");
    for (let i = 0; i < radioButtons.length; i++) {
      expect(radioButtons[i]).toHaveAttribute("disabled");
    }
  });
  test("check add button is disabled", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion readOnly={true} examId={1} questionId={4} />)
    );
    await wait(100);

    const addButton = screen.getByRole("button", { name: /create a new/i });
    expect(addButton).toBeDisabled();
  });
});
