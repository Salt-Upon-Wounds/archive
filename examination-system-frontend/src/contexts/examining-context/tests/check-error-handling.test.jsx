import {
  waitFor,
  screen,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import moment from "moment";
import { Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import {
  changeRequestResponseTo401,
  changeRequestResponseTo422,
  changeRequestResponseToSpecificStatus,
} from "../../../utilities/tests.utility";

import { ExamInfoProvider } from "../../exam-info-context/exam-info.context";
import { ExaminingProvider } from "../examining.context";

import { ErrorBoundaryProvider } from "../../../contexts/error-boundary-context/error-boundary.context";

import ExamQuestionPage from "../../../pages/exams/examining/exam-question/exam-question.page";

import apiRoutes from "../../../constants/api-routes.constant";
import programRoutes from "../../../constants/program-routes.constant";
import {
  asignExamShowStartAndEnd,
  changeCurrentParticipant,
  changeShowExam,
} from "../../../utilities/tests.utility";

describe("check 401 errors(the removeUserInfo() func from authentication context must be called)", () => {
  test("check participants.finishExam route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.participants.finishExam(":examId"),
      method: "put",
      otherHandlers: [
        asignExamShowStartAndEnd(
          2,
          new Date(Date.now() - 5000),
          new Date(Date.now() + 3600 * 1000)
        ),
        changeCurrentParticipant({ participantId: 4 }),
      ],
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ExamInfoProvider examId={2}>
        <Route path={programRoutes.examiningQuestion(":examId", ":questionId")}>
          <ExaminingProvider>
            <ExamQuestionPage />
          </ExaminingProvider>
        </Route>
      </ExamInfoProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.examiningQuestion(2, 1),
      }
    );

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    const finishExamButton = await screen.findByRole("button", {
      name: /finish/i,
    });
    userEvent.click(finishExamButton);

    const confirmButton = await screen.findByRole("button", { name: /yes/i });
    userEvent.click(confirmButton);

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
  test("check questions.indexQuestions route", async () => {
    const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
    const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
    changeRequestResponseTo401({
      route: apiRoutes.questions.indexQuestions(":examId"),
      method: "get",
      otherHandlers: [
        changeShowExam({
          exam: {
            examId: 1,
            ownerId: 10,
            isRegistered: true,
            published: true,
            hasPassword: false,
            needsConfirmation: false,
            startOfExam: start,
            endOfExam: end,
          },
        }),
        changeCurrentParticipant({ participantId: 4 }),
      ],
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ExamInfoProvider examId={2}>
        <ExaminingProvider />
      </ExamInfoProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
  test("check participants.currentParticipant route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.participants.currentParticipant(":examId"),
      method: "get",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ExamInfoProvider examId={2}>
        <ExaminingProvider />
      </ExamInfoProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
});

describe("check 422 errors", () => {
  test("check participants.finishExam route", async () => {
    const { message } = changeRequestResponseTo422({
      route: apiRoutes.participants.finishExam(":examId"),
      method: "put",
      fields: [],
      otherHandlers: [
        asignExamShowStartAndEnd(
          2,
          new Date(Date.now() - 5000),
          new Date(Date.now() + 3600 * 1000)
        ),
        changeCurrentParticipant({ participantId: 4 }),
      ],
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ExamInfoProvider examId={2}>
        <Route path={programRoutes.examiningQuestion(":examId", ":questionId")}>
          <ExaminingProvider>
            <ExamQuestionPage />
          </ExaminingProvider>
        </Route>
      </ExamInfoProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.examiningQuestion(2, 1),
      }
    );

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    const finishExamButton = await screen.findByRole("button", {
      name: /finish/i,
    });
    userEvent.click(finishExamButton);

    const confirmButton = await screen.findByRole("button", { name: /yes/i });
    userEvent.click(confirmButton);

    // check button is changed to loading
    const loadingButtons = screen.getAllByRole("button", { name: /loading/i });
    expect(loadingButtons).toHaveLength(2);
    loadingButtons.forEach((loadingButton) =>
      expect(loadingButton).toBeDisabled()
    );
    // end

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(message, { exact: false })).toBeInTheDocument()
    );
  });
});

describe("check other errors", () => {
  test("check participants.finishExam route", async () => {
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.participants.finishExam(":examId"),
      method: "put",
      status: 403,
      otherHandlers: [
        asignExamShowStartAndEnd(
          2,
          new Date(Date.now() - 5000),
          new Date(Date.now() + 3600 * 1000)
        ),
        changeCurrentParticipant({ participantId: 4 }),
      ],
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ExamInfoProvider examId={2}>
        <Route path={programRoutes.examiningQuestion(":examId", ":questionId")}>
          <ExaminingProvider>
            <ExamQuestionPage />
          </ExaminingProvider>
        </Route>
      </ExamInfoProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.examiningQuestion(2, 1),
      }
    );

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    const finishExamButton = await screen.findByRole("button", {
      name: /finish/i,
    });
    userEvent.click(finishExamButton);

    const confirmButton = await screen.findByRole("button", { name: /yes/i });
    userEvent.click(confirmButton);

    // check button is changed to loading
    const loadingButtons = screen.getAllByRole("button", { name: /loading/i });
    expect(loadingButtons).toHaveLength(2);
    loadingButtons.forEach((loadingButton) =>
      expect(loadingButton).toBeDisabled()
    );
    // end

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );
  });
  test("check questions.indexQuestions route", async () => {
    const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
    const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
    jest.spyOn(console, "error").mockImplementation(() => {});
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.questions.indexQuestions(":examId"),
      method: "get",
      status: 403,
      otherHandlers: [
        changeShowExam({
          exam: {
            examId: 1,
            ownerId: 10,
            isRegistered: true,
            published: true,
            hasPassword: false,
            needsConfirmation: false,
            startOfExam: start,
            endOfExam: end,
          },
        }),
        changeCurrentParticipant({ participantId: 4 }),
      ],
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ExamInfoProvider examId={2}>
        <ErrorBoundaryProvider>
          <ExaminingProvider />
        </ErrorBoundaryProvider>
      </ExamInfoProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(screen.getByText(403)).toBeInTheDocument());
  });
  test("check participants.currentParticipant route", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.participants.currentParticipant(":examId"),
      method: "get",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ExamInfoProvider examId={2}>
        <ErrorBoundaryProvider>
          <ExaminingProvider />
        </ErrorBoundaryProvider>
      </ExamInfoProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(screen.getByText(403)).toBeInTheDocument());
  });
});
