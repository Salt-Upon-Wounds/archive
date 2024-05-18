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
      wrapper(<EditQuestion examId={1} questionId={6} />)
    );

    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
    await wait(100);
    expect(await screen.findByText(savedMessage)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: buttonMessage })
    ).not.toBeInTheDocument();
  });

  test("user can change text description and update; when component is loading, the button must be labeled with loading", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={6} />)
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

  test("user can change text score and update", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={6} />)
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

  test("user can add answer and update", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={6} />)
    );
    await wait(100);
    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // add answer
    const addAnswerButton = screen.getByRole("button", { name: /new answer/i });
    expect(addAnswerButton).toBeEnabled();
    userEvent.click(addAnswerButton);
    // end

    // fill new answer
    const answerInputs = screen.getAllByRole("textbox", {
      name: /question answer/i,
    });
    const lastAnswerInput = answerInputs[answerInputs.length - 1];
    userEvent.clear(lastAnswerInput);
    userEvent.type(lastAnswerInput, values.newAnswer1);
    // end

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

  test("user can delete answer and update", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={6} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // delete first answer
    const deleteFirstAnswerButton = screen.getAllByRole("button", {
      name: /delete answer/i,
    })[0];
    userEvent.click(deleteFirstAnswerButton);

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

  test("user can delete a created answer and dont need update", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={6} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // add answer
    const addAnswerButton = screen.getByRole("button", { name: /new answer/i });
    expect(addAnswerButton).toBeEnabled();
    userEvent.click(addAnswerButton);
    // end

    // fill new answer
    const answerInputs = screen.getAllByRole("textbox", {
      name: /question answer/i,
    });
    const lastAnswerInput = answerInputs[answerInputs.length - 1];
    userEvent.clear(lastAnswerInput);
    userEvent.type(lastAnswerInput, values.newAnswer1);
    // end

    // delete created answer
    const deleteButtons = screen.getAllByRole("button", {
      name: /delete answer/i,
    });
    userEvent.click(deleteButtons[deleteButtons.length - 1]);
    // end

    await wait(100);

    // check for update
    expect(await screen.findByText(savedMessage)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: buttonMessage })
    ).not.toBeInTheDocument();
    // end
  });

  test("user can change an answer and update", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={6} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // change last answer
    const answerInputs = screen.getAllByRole("textbox", {
      name: /question answer/i,
    });
    const lastAnswerInput = answerInputs[answerInputs.length - 1];
    userEvent.clear(lastAnswerInput);
    userEvent.type(lastAnswerInput, values.newAnswer1);
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

  test("question text must not be empty and user will see error", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={6} />)
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
      wrapper(<EditQuestion examId={1} questionId={6} />)
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

  test("question answer must not be empty", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={6} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // add answer
    const addAnswerButton = screen.getByRole("button", { name: /new answer/i });
    expect(addAnswerButton).toBeEnabled();
    userEvent.click(addAnswerButton);
    // end

    // click update button
    const updateButton = await screen.findByRole("button", {
      name: buttonMessage,
    });
    userEvent.click(updateButton);
    // end

    // check error
    expect(
      await screen.findByText(errors.answerFieldIsEmpty, { exact: false })
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
      wrapper(<EditQuestion readOnly={true} examId={1} questionId={6} />)
    );
    await wait(100);

    const textboxInputs = screen.getAllByRole("textbox");
    for (let i = 0; i < textboxInputs.length; i++) {
      expect(textboxInputs[i]).toHaveAttribute("readonly");
    }
  });
  test("check all the spinbutton fields are readonly", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion readOnly={true} examId={1} questionId={6} />)
    );
    await wait(100);

    const spinButtons = screen.getAllByRole("spinbutton");
    for (let i = 0; i < spinButtons.length; i++) {
      expect(spinButtons[i]).toHaveAttribute("readonly");
    }
  });
  test("check add button is disabled", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion readOnly={true} examId={1} questionId={6} />)
    );
    await wait(100);

    const addButton = screen.getByRole("button", { name: /create a new/i });
    expect(addButton).toBeDisabled();
  });
});
