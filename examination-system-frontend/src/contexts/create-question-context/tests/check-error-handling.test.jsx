import {
  waitFor,
  screen,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import {
  changeRequestResponseTo401,
  changeRequestResponseTo422,
  changeRequestResponseToSpecificStatus,
} from "../../../utilities/tests.utility";

import { CreateQuestionProvider } from "../create-question.context";
import { QuestionTypesProvider } from "../../question-types-context/question-types.context";

import { selectValues } from "../../../components/create-question/tests/partials";

import CreateQuestion from "../../../components/create-question/create-question.component";

import apiRoutes from "../../../constants/api-routes.constant";

describe("check 401 errors(the removeUserInfo() func from authentication context must be called)", () => {
  test("check questions.createQuestion route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.questions.createQuestion(":examId"),
      method: "post",
    });

    const removeUserInfo = jest.fn();
    const addQuestion = jest.fn();
    renderWithAuthentication(
      <QuestionTypesProvider>
        <CreateQuestionProvider>
          <CreateQuestion
            isVisible={true}
            examId={1}
            addQuestion={addQuestion}
          />
        </CreateQuestionProvider>
      </QuestionTypesProvider>,
      { authenticationProviderProps: { removeUserInfo } }
    );

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

    await waitFor(() => expect(addQuestion).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });

  test("check states.createState route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.states.createState(":examId", ":questionId"),
      method: "post",
    });

    const removeUserInfo = jest.fn();
    const addQuestion = jest.fn();
    renderWithAuthentication(
      <QuestionTypesProvider>
        <CreateQuestionProvider>
          <CreateQuestion
            isVisible={true}
            examId={1}
            addQuestion={addQuestion}
          />
        </CreateQuestionProvider>
      </QuestionTypesProvider>,
      { authenticationProviderProps: { removeUserInfo } }
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
    const option2 = "option 2 option 2";
    const option3 = "option 3 option 3";

    userEvent.type(optionTextFields[0], option1);
    userEvent.type(optionTextFields[1], option2);
    userEvent.type(optionTextFields[2], option3);

    const correctRadios = screen.getAllByRole("radio", {
      name: /correct answer/i,
    });
    userEvent.click(correctRadios[0]);
    userEvent.click(correctRadios[2]);
    // end

    // check selected answers
    expect(correctRadios[0]).toBeChecked();
    expect(correctRadios[1]).not.toBeChecked();
    expect(correctRadios[2]).toBeChecked();
    // end

    // click create button
    const createButton = screen.getAllByRole("button", { name: /create/i })[1];
    expect(createButton).toBeEnabled();
    userEvent.click(createButton);
    // end

    await waitFor(() => expect(addQuestion).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
});

describe("check 422 errors", () => {
  test("check questions.createQuestion route", async () => {
    const { message, errors } = changeRequestResponseTo422({
      route: apiRoutes.questions.createQuestion(":examId"),
      method: "post",
      fields: ["question_type_id", "question_text", "question_score"],
    });

    const removeUserInfo = jest.fn();
    const addQuestion = jest.fn();
    renderWithAuthentication(
      <QuestionTypesProvider>
        <CreateQuestionProvider>
          <CreateQuestion
            isVisible={true}
            examId={1}
            addQuestion={addQuestion}
          />
        </CreateQuestionProvider>
      </QuestionTypesProvider>,
      { authenticationProviderProps: { removeUserInfo } }
    );

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

    // check label of button changed to loading
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

    await waitFor(() => expect(addQuestion).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(message, { exact: false })).toBeInTheDocument()
    );
    for (const error in errors) {
      await waitFor(() =>
        expect(
          screen.getByText(errors[error], { exact: false })
        ).toBeInTheDocument()
      );
    }

    // check button backed to normal
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /create/i })).toBeEnabled()
    );
    // end
  });

  test("check states.createState route", async () => {
    const { message, errors } = changeRequestResponseTo422({
      route: apiRoutes.states.createState(":examId", ":questionId"),
      method: "post",
      fields: ["text_part", "integer_part"],
    });

    const removeUserInfo = jest.fn();
    const addQuestion = jest.fn();
    renderWithAuthentication(
      <QuestionTypesProvider>
        <CreateQuestionProvider>
          <CreateQuestion
            isVisible={true}
            examId={1}
            addQuestion={addQuestion}
          />
        </CreateQuestionProvider>
      </QuestionTypesProvider>,
      { authenticationProviderProps: { removeUserInfo } }
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
    const option2 = "option 2 option 2";
    const option3 = "option 3 option 3";

    userEvent.type(optionTextFields[0], option1);
    userEvent.type(optionTextFields[1], option2);
    userEvent.type(optionTextFields[2], option3);

    const correctRadios = screen.getAllByRole("radio", {
      name: /correct answer/i,
    });
    userEvent.click(correctRadios[0]);
    userEvent.click(correctRadios[2]);
    // end

    // check selected answers
    expect(correctRadios[0]).toBeChecked();
    expect(correctRadios[1]).not.toBeChecked();
    expect(correctRadios[2]).toBeChecked();
    // end

    // click create button
    const createButton = screen.getAllByRole("button", { name: /create/i })[1];
    expect(createButton).toBeEnabled();
    userEvent.click(createButton);
    // end

    // check label of button changed to loading
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

    await waitFor(() => expect(addQuestion).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(message, { exact: false })).toBeInTheDocument()
    );
    for (const error in errors) {
      await waitFor(() =>
        expect(
          screen.getByText(errors[error], { exact: false })
        ).toBeInTheDocument()
      );
    }

    // check button backed to normal
    await waitFor(() =>
      expect(
        screen.getAllByRole("button", { name: /create/i })[1]
      ).toBeEnabled()
    );
    // end
  });
});

describe("check other errors", () => {
  test("check questions.createQuestion route", async () => {
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.questions.createQuestion(":examId"),
      method: "post",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    const addQuestion = jest.fn();
    renderWithAuthentication(
      <QuestionTypesProvider>
        <CreateQuestionProvider>
          <CreateQuestion
            isVisible={true}
            examId={1}
            addQuestion={addQuestion}
          />
        </CreateQuestionProvider>
      </QuestionTypesProvider>,
      { authenticationProviderProps: { removeUserInfo } }
    );

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

    // check label of button changed to loading
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

    await waitFor(() => expect(addQuestion).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );

    // check button backed to normal
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /create/i })).toBeEnabled()
    );
    // end
  });

  test("check states.createState route", async () => {
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.states.createState(":examId", ":questionId"),
      method: "post",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    const addQuestion = jest.fn();
    renderWithAuthentication(
      <QuestionTypesProvider>
        <CreateQuestionProvider>
          <CreateQuestion
            isVisible={true}
            examId={1}
            addQuestion={addQuestion}
          />
        </CreateQuestionProvider>
      </QuestionTypesProvider>,
      { authenticationProviderProps: { removeUserInfo } }
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
    const option2 = "option 2 option 2";
    const option3 = "option 3 option 3";

    userEvent.type(optionTextFields[0], option1);
    userEvent.type(optionTextFields[1], option2);
    userEvent.type(optionTextFields[2], option3);

    const correctRadios = screen.getAllByRole("radio", {
      name: /correct answer/i,
    });
    userEvent.click(correctRadios[0]);
    userEvent.click(correctRadios[2]);
    // end

    // check selected answers
    expect(correctRadios[0]).toBeChecked();
    expect(correctRadios[1]).not.toBeChecked();
    expect(correctRadios[2]).toBeChecked();
    // end

    // click create button
    const createButton = screen.getAllByRole("button", { name: /create/i })[1];
    expect(createButton).toBeEnabled();
    userEvent.click(createButton);
    // end

    // check label of button changed to loading
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

    await waitFor(() => expect(addQuestion).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );

    // check button backed to normal
    await waitFor(() =>
      expect(
        screen.getAllByRole("button", { name: /create/i })[1]
      ).toBeEnabled()
    );
    // end
  });
});
