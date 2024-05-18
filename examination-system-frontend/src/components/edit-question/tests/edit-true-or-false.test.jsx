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
      wrapper(<EditQuestion examId={1} questionId={5} />)
    );

    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
    await wait(100);
    expect(await screen.findByText(savedMessage)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: buttonMessage })
    ).not.toBeInTheDocument();
  });

  test("user can change text description and update; loading must be labeled on button when component is loading", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={5} />)
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
      wrapper(<EditQuestion examId={1} questionId={5} />)
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

  test("user can change the answer of question and update", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={5} />)
    );
    await wait(100);

    expect(await screen.findByText(savedMessage)).toBeInTheDocument();

    // change the answer of question
    const AllButtons = screen.getAllByRole("button");
    const radioButtons = AllButtons.slice(1, 2);
    if (radioButtons[0].checked) {
      userEvent.click(radioButtons[1]);
    } else {
      userEvent.click(radioButtons[0]);
    }

    await wait(100);

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

  test("question text must not be empty and user will see error", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion examId={1} questionId={5} />)
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
      wrapper(<EditQuestion examId={1} questionId={5} />)
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
});

describe("check readonly property", () => {
  test("check all the textbox fields are readonly", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion readOnly={true} examId={1} questionId={5} />)
    );
    await wait(100);

    const textboxInputs = screen.getAllByRole("textbox");
    for (let i = 0; i < textboxInputs.length; i++) {
      expect(textboxInputs[i]).toHaveAttribute("readonly");
    }
  });
  test("check all the spinbutton fields are readonly", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion readOnly={true} examId={1} questionId={5} />)
    );
    await wait(100);

    const spinButtons = screen.getAllByRole("spinbutton");
    for (let i = 0; i < spinButtons.length; i++) {
      expect(spinButtons[i]).toHaveAttribute("readonly");
    }
  });
  test("check all the radio buttons are disabled", async () => {
    renderWithAuthentication(
      wrapper(<EditQuestion readOnly={true} examId={1} questionId={5} />)
    );
    await wait(100);

    const radioButtons = screen.getAllByRole("radio");
    for (let i = 0; i < radioButtons.length; i++) {
      expect(radioButtons[i]).toHaveAttribute("disabled");
    }
  });
});
