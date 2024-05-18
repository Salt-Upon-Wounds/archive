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
import { questionsShowId_1 } from "../../../mocks/mocks/questions.mock";

import { QuestionGradeProvider } from "../question-grade.context";

import QuestionGrade from "../../../components/question-grade/question-grade.component";
import { ErrorBoundaryProvider } from "../../../contexts/error-boundary-context/error-boundary.context";

import apiRoutes from "../../../constants/api-routes.constant";

describe("check 401 errors(the removeUserInfo() func from authentication context must be called)", () => {
  test("check participants.getGradeOfQuestion route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.participants.getGradeOfQuestion(
        ":participantId",
        ":questionId"
      ),
      method: "get",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <QuestionGradeProvider
        participantId={1}
        questionId={1}
        participantStatus="FINISHED"
      />,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
  test("check participants.saveScoreOfQuestion route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.participants.saveScoreOfQuestion(
        ":questionId",
        ":participantId"
      ),
      method: "post",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <QuestionGradeProvider
        participantId={1}
        questionId={1}
        participantStatus="FINISHED"
      >
        <QuestionGrade canUserChangeGrade={true} questionId={1} />
      </QuestionGradeProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    const changeGradeInput = await screen.findByRole("spinbutton", {
      name: /grade/i,
    });
    userEvent.clear(changeGradeInput);
    userEvent.type(
      changeGradeInput,
      questionsShowId_1.data.question.question_score.toString()
    );

    const updateButton = screen.getByRole("button", { name: /update/i });
    userEvent.click(updateButton);

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
});

describe("check 422 errors", () => {
  test("check participants.saveScoreOfQuestion route", async () => {
    const { message, errors } = changeRequestResponseTo422({
      route: apiRoutes.participants.saveScoreOfQuestion(
        ":questionId",
        ":participantId"
      ),
      fields: ["grade"],
      method: "post",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <QuestionGradeProvider
        participantId={1}
        questionId={1}
        participantStatus="FINISHED"
      >
        <QuestionGrade canUserChangeGrade={true} questionId={1} />
      </QuestionGradeProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    const changeGradeInput = await screen.findByRole("spinbutton", {
      name: /grade/i,
    });
    userEvent.clear(changeGradeInput);
    userEvent.type(
      changeGradeInput,
      questionsShowId_1.data.question.question_score.toString()
    );

    const updateButton = screen.getByRole("button", { name: /update/i });
    userEvent.click(updateButton);

    // check loading is shown in button
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

    // check button changed to original one
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /update/i })).toBeEnabled()
    );
    // end
  });
});

describe("check other errors", () => {
  test("check participants.getGradeOfQuestion route", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.participants.getGradeOfQuestion(
        ":participantId",
        ":questionId"
      ),
      method: "get",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ErrorBoundaryProvider>
        <QuestionGradeProvider
          participantId={1}
          questionId={1}
          participantStatus="FINISHED"
        />
      </ErrorBoundaryProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(screen.getByText(403)).toBeInTheDocument());
  });
  test("check participants.saveScoreOfQuestion route", async () => {
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.participants.saveScoreOfQuestion(
        ":questionId",
        ":participantId"
      ),
      method: "post",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <QuestionGradeProvider
        participantId={1}
        questionId={1}
        participantStatus="FINISHED"
      >
        <QuestionGrade canUserChangeGrade={true} questionId={1} />
      </QuestionGradeProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    const changeGradeInput = await screen.findByRole("spinbutton", {
      name: /grade/i,
    });
    userEvent.clear(changeGradeInput);
    userEvent.type(
      changeGradeInput,
      questionsShowId_1.data.question.question_score.toString()
    );

    const updateButton = screen.getByRole("button", { name: /update/i });
    userEvent.click(updateButton);

    // check loading is shown in button
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );

    // check button changed to original one
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /update/i })).toBeEnabled()
    );
    // end
  });
});
