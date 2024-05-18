import {
  render,
  waitFor,
  screen,
} from "../../../test-utils/testing-library-utils";
import CreateQuestion from "../create-question.component";
import userEvent from "@testing-library/user-event";
import { wrapper, selectValues } from "./partials";

describe("check errors", () => {
  test("check question text error", async () => {
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
    const value = "";
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

    await waitFor(() =>
      expect(
        screen.getByText(/the question text field is required/i)
      ).toBeInTheDocument()
    );

    expect(addQuestion).toHaveBeenCalledTimes(0);
  });

  test("check question score error", async () => {
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
    const value = "value value value";
    userEvent.clear(questionText);
    userEvent.type(questionText, value);

    const questionScore = screen.getByRole("spinbutton", {
      name: /question score/i,
    });
    const score = "";
    userEvent.clear(questionScore);
    userEvent.type(questionScore, score);

    const createButton = screen.getByRole("button", { name: /create/i });
    expect(createButton).toBeEnabled();
    userEvent.click(createButton);

    await waitFor(() =>
      expect(
        screen.getByText(/the question score field is required/i)
      ).toBeInTheDocument()
    );

    expect(addQuestion).toHaveBeenCalledTimes(0);
  });

  test("check error of question answers part", async () => {
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

    userEvent.selectOptions(questionTypeSelector, [selectValues.fillTheBlank]);
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

    // add answers
    const addAnswerButton = screen.getByRole("button", { name: /new answer/i });
    userEvent.click(addAnswerButton);
    userEvent.click(addAnswerButton);
    userEvent.click(addAnswerButton);

    const answer1 = "answer 1 answer 1";
    // const answer2 = "answer 2 answer 2";
    const answer3 = "answer 3 answer 3";
    // end

    // fill answers
    const answerInputs = screen.getAllByRole("textbox", {
      name: /question answer/i,
    });

    userEvent.clear(answerInputs[0]);
    userEvent.clear(answerInputs[1]);
    userEvent.clear(answerInputs[2]);

    userEvent.type(answerInputs[0], answer1);
    // userEvent.type(answerInputs[1], answer2);
    userEvent.type(answerInputs[2], answer3);
    // end

    // click create button
    const createButton = screen.getAllByRole("button", { name: /create/i })[1];
    userEvent.click(createButton);
    // end

    expect(
      await screen.findByText(/you must fill all the states/i)
    ).toBeInTheDocument();
    expect(addQuestion).toHaveBeenCalledTimes(0);
  });

  test("check error of question options part", async () => {
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
      selectValues.multipleAnswer,
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
    // const option2 = "option 2 option 2";
    const option3 = "option 3 option 3";

    userEvent.type(optionTextFields[0], option1);
    // userEvent.type(optionTextFields[1], option2);
    userEvent.type(optionTextFields[2], option3);

    const correctRadios = screen.getAllByRole("radio", {
      name: /correct answer/i,
    });
    userEvent.click(correctRadios[0]);
    // end

    // click create button
    const createButton = screen.getAllByRole("button", { name: /create/i })[1];
    expect(createButton).toBeEnabled();
    userEvent.click(createButton);
    // end

    expect(
      await screen.findByText(/you must fill all the states/i)
    ).toBeInTheDocument();
    expect(addQuestion).toHaveBeenCalledTimes(0);
  });
});
