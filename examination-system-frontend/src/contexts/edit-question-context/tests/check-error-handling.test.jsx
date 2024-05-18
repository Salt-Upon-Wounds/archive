import {
  waitFor,
  waitForElementToBeRemoved,
  screen,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import { ErrorBoundaryProvider } from "../../../contexts/error-boundary-context/error-boundary.context";
import userEvent from "@testing-library/user-event";
import {
  changeRequestResponseTo401,
  changeRequestResponseTo422,
  changeRequestResponseToSpecificStatus,
} from "../../../utilities/tests.utility";

import { EditQuestionProvider } from "../edit-question.context";

import EditQuestion from "../../../components/edit-question/edit-question.component";

import apiRoutes from "../../../constants/api-routes.constant";
import { randomString } from "../../../utilities/tests.utility";
import {
  values,
  buttonMessage,
} from "../../../components/edit-question/tests/partials";

describe("check 401 errors(the removeUserInfo() func from authentication context must be called)", () => {
  test("check states.indexStates route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.states.indexStates(":examId", ":questionId"),
      method: "get",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3} />,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
  test("check states.createState route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.states.createState(":examId", ":questionId"),
      method: "post",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion examId={1} questionId={3} />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    // create new option
    const addOptionButton = await screen.findByRole("button", {
      name: /new option/i,
    });
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

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
  test("check states.updateState route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.states.updateState(":examId", ":questionId", ":stateId"),
      method: "put",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion examId={1} questionId={3} />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    // change last option
    const optionInputs = await screen.findAllByRole("textbox", {
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

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
  test("check states.deleteState route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.states.deleteState(":examId", ":questionId", ":stateId"),
      method: "delete",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion examId={1} questionId={3} />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    // delete last option
    const deleteButtons = await screen.findAllByRole("button", {
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

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });

  test("check questions.showQuestion route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.questions.showQuestion(":examId", ":questionId"),
      method: "get",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={1} />,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
  test("check questions.updateQuestion route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.questions.updateQuestion(":examId", ":questionId"),
      method: "put",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion examId={1} questionId={3} />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    // change question text
    const questionTextInput = await screen.findByRole("textbox", {
      name: /question text/i,
    });
    userEvent.clear(questionTextInput);
    userEvent.type(questionTextInput, randomString());
    // end

    // click update button
    const updateButton = await screen.findByRole("button", {
      name: buttonMessage,
    });
    userEvent.click(updateButton);
    // end

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
  test("check questions.deleteQuestion route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.questions.deleteQuestion(":examId", ":questionId"),
      method: "delete",
    });

    const removeUserInfo = jest.fn();
    const deleteQuestion = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion
          examId={1}
          questionId={1}
          deleteQuestion={deleteQuestion}
        />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const deleteButton = screen.getByRole("button", {
      name: /delete question/i,
    });
    userEvent.click(deleteButton);

    const confirmButton = await screen.findByRole("button", {
      name: /confirm/i,
    });
    userEvent.click(confirmButton);

    await waitFor(() => expect(deleteQuestion).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
});

describe("check 422 errors", () => {
  const stateFields = ["text_part", "integer_part"];
  const questionFields = ["question_text", "question_score"];
  test("check states.createState route", async () => {
    const { message, errors } = changeRequestResponseTo422({
      route: apiRoutes.states.createState(":examId", ":questionId"),
      method: "post",
      fields: stateFields,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion examId={1} questionId={3} />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    // create new option
    const addOptionButton = await screen.findByRole("button", {
      name: /new option/i,
    });
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

    // check button is changed to loading
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

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

    // check button changed to orginal one
    await waitFor(() =>
      expect(screen.getByRole("button", { name: buttonMessage })).toBeEnabled()
    );
    // end
  });
  test("check states.updateState route", async () => {
    const { message, errors } = changeRequestResponseTo422({
      route: apiRoutes.states.updateState(":examId", ":questionId", ":stateId"),
      method: "put",
      fields: stateFields,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion examId={1} questionId={3} />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    // change last option
    const optionInputs = await screen.findAllByRole("textbox", {
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

    // check button is changed to loading
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

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

    // check button changed to orginal one
    await waitFor(() =>
      expect(screen.getByRole("button", { name: buttonMessage })).toBeEnabled()
    );
    // end
  });
  test("check states.deleteState route", async () => {
    const { message } = changeRequestResponseTo422({
      route: apiRoutes.states.deleteState(":examId", ":questionId", ":stateId"),
      method: "delete",
      fields: [],
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion examId={1} questionId={3} />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    // delete last option
    const deleteButtons = await screen.findAllByRole("button", {
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

    // check button is changed to loading
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(message, { exact: false })).toBeInTheDocument()
    );

    // check button changed to orginal one
    await waitFor(() =>
      expect(screen.getByRole("button", { name: buttonMessage })).toBeEnabled()
    );
    // end
  });

  test("check questions.updateQuestion route", async () => {
    const { message, errors } = changeRequestResponseTo422({
      route: apiRoutes.questions.updateQuestion(":examId", ":questionId"),
      method: "put",
      fields: questionFields,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion examId={1} questionId={3} />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    // change question text
    const questionTextInput = await screen.findByRole("textbox", {
      name: /question text/i,
    });
    userEvent.clear(questionTextInput);
    userEvent.type(questionTextInput, randomString());
    // end

    // click update button
    const updateButton = await screen.findByRole("button", {
      name: buttonMessage,
    });
    userEvent.click(updateButton);
    // end

    // check button is changed to loading
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

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

    // check button changed to orginal one
    await waitFor(() =>
      expect(screen.getByRole("button", { name: buttonMessage })).toBeEnabled()
    );
    // end
  });
  test("check questions.deleteQuestion route", async () => {
    const { message } = changeRequestResponseTo422({
      route: apiRoutes.questions.deleteQuestion(":examId", ":questionId"),
      method: "delete",
      fields: [],
    });

    const removeUserInfo = jest.fn();
    const deleteQuestion = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion
          examId={1}
          questionId={1}
          deleteQuestion={deleteQuestion}
        />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const deleteButton = screen.getByRole("button", {
      name: /delete question/i,
    });
    userEvent.click(deleteButton);

    const confirmButton = await screen.findByRole("button", {
      name: /confirm/i,
    });
    userEvent.click(confirmButton);

    // check button changed to loading
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

    await waitFor(() => expect(deleteQuestion).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(message, { exact: false })).toBeInTheDocument()
    );
  });
});

describe("check other errors", () => {
  test("check states.indexStates route", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.states.indexStates(":examId", ":questionId"),
      method: "get",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ErrorBoundaryProvider>
        <EditQuestionProvider examId={1} questionId={3} />
      </ErrorBoundaryProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(screen.getByText(403)).toBeInTheDocument());
  });
  test("check questions.showQuestion route", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.questions.showQuestion(":examId", ":questionId"),
      method: "get",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ErrorBoundaryProvider>
        <EditQuestionProvider examId={1} questionId={1} />
      </ErrorBoundaryProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(screen.getByText(403)).toBeInTheDocument());
  });

  test("check states.createState route", async () => {
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.states.createState(":examId", ":questionId"),
      method: "post",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion examId={1} questionId={3} />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    // create new option
    const addOptionButton = await screen.findByRole("button", {
      name: /new option/i,
    });
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

    // check button is changed to loading
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );

    // check button changed to orginal one
    await waitFor(() =>
      expect(screen.getByRole("button", { name: buttonMessage })).toBeEnabled()
    );
    // end
  });
  test("check states.updateState route", async () => {
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.states.updateState(":examId", ":questionId", ":stateId"),
      method: "put",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion examId={1} questionId={3} />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    // change last option
    const optionInputs = await screen.findAllByRole("textbox", {
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

    // check button is changed to loading
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );

    // check button changed to orginal one
    await waitFor(() =>
      expect(screen.getByRole("button", { name: buttonMessage })).toBeEnabled()
    );
    // end
  });
  test("check states.deleteState route", async () => {
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.states.deleteState(":examId", ":questionId", ":stateId"),
      method: "delete",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion examId={1} questionId={3} />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    // delete last option
    const deleteButtons = await screen.findAllByRole("button", {
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

    // check button is changed to loading
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );

    // check button changed to orginal one
    await waitFor(() =>
      expect(screen.getByRole("button", { name: buttonMessage })).toBeEnabled()
    );
    // end
  });

  test("check questions.updateQuestion route", async () => {
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.questions.updateQuestion(":examId", ":questionId"),
      method: "put",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion examId={1} questionId={3} />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    // change question text
    const questionTextInput = await screen.findByRole("textbox", {
      name: /question text/i,
    });
    userEvent.clear(questionTextInput);
    userEvent.type(questionTextInput, randomString());
    // end

    // click update button
    const updateButton = await screen.findByRole("button", {
      name: buttonMessage,
    });
    userEvent.click(updateButton);
    // end

    // check button is changed to loading
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );

    // check button changed to orginal one
    await waitFor(() =>
      expect(screen.getByRole("button", { name: buttonMessage })).toBeEnabled()
    );
    // end
  });
  test("check questions.deleteQuestion route", async () => {
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.questions.deleteQuestion(":examId", ":questionId"),
      method: "delete",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    const deleteQuestion = jest.fn();
    renderWithAuthentication(
      <EditQuestionProvider examId={1} questionId={3}>
        <EditQuestion
          examId={1}
          questionId={1}
          deleteQuestion={deleteQuestion}
        />
      </EditQuestionProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const deleteButton = screen.getByRole("button", {
      name: /delete question/i,
    });
    userEvent.click(deleteButton);

    const confirmButton = await screen.findByRole("button", {
      name: /confirm/i,
    });
    userEvent.click(confirmButton);

    // check button changed to loading
    await waitFor(() => {
      return expect(
        screen.getByRole("button", { name: /loading/i })
      ).toBeDisabled();
    });
    // end

    await waitFor(() => expect(deleteQuestion).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );
  });
});
