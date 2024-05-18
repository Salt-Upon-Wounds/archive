import {
  waitFor,
  waitForElementToBeRemoved,
  screen,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import { ErrorBoundaryProvider } from "../../../contexts/error-boundary-context/error-boundary.context";
import {
  changeRequestResponseTo401,
  changeRequestResponseTo422,
  changeRequestResponseToSpecificStatus,
} from "../../../utilities/tests.utility";

import { ExamInfoProvider } from "../exam-info.context";
import { ExaminingProvider } from "../../examining-context/examining.context";

import ExamOverview from "../../../pages/exams/examining/exam-overview/exam-overview.page";

import apiRoutes from "../../../constants/api-routes.constant";
import programRoutes from "../../../constants/program-routes.constant";
import { asignExamShowStartAndEnd } from "../../../utilities/tests.utility";
import { userMock } from "../../../mocks/mocks/authentication.mock";

describe("check 401 errors(the removeUserInfo() func from authentication context must be called)", () => {
  test("check exams.showExam route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.exams.showExam(":examId"),
      method: "get",
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(<ExamInfoProvider examId={1} />, {
      authenticationProviderProps: { removeUserInfo },
    });

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
  test("check exams.registerInExam route", async () => {
    changeRequestResponseTo401({
      route: apiRoutes.exams.registerInExam(":examId"),
      method: "post",
      otherHandlers: [
        asignExamShowStartAndEnd(
          1,
          new Date(Date.now() - 5000),
          new Date(Date.now() + 3600 * 1000)
        ),
      ],
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ExamInfoProvider examId={1}>
        <ExaminingProvider>
          <ExamOverview />
        </ExaminingProvider>
      </ExamInfoProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.examiningOverview(1),
      }
    );

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const registerButton = await screen.findByRole("button", {
      name: /register/i,
    });
    userEvent.click(registerButton);

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
});

describe("check 422 errors", () => {
  const fields = ["password"];
  test("check exams.registerInExam route", async () => {
    const { message, errors } = changeRequestResponseTo422({
      route: apiRoutes.exams.registerInExam(":examId"),
      method: "post",
      fields,
      otherHandlers: [
        asignExamShowStartAndEnd(
          5,
          new Date(Date.now() - 5000),
          new Date(Date.now() + 3600 * 1000)
        ),
      ],
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ExamInfoProvider examId={5}>
        <ExaminingProvider>
          <ExamOverview />
        </ExaminingProvider>
      </ExamInfoProvider>,
      {
        authenticationProviderProps: {
          removeUserInfo,
          user: { ...userMock, user_id: 2 },
        },
        route: programRoutes.examiningOverview(5),
      }
    );

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const registerButton = await screen.findByRole("button", {
      name: /register/i,
    });
    userEvent.click(registerButton);

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
    // check loading is gone
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /register/i })
      ).toBeInTheDocument()
    );
    // end
  });
});

describe("check other errors", () => {
  test("check exams.showExam route", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.exams.showExam(":examId"),
      method: "get",
      status: 403,
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ErrorBoundaryProvider>
        <ExamInfoProvider examId={1} />
      </ErrorBoundaryProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
      }
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(screen.getByText(403)).toBeInTheDocument());
  });
  test("check exams.registerInExam route", async () => {
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.exams.registerInExam(":examId"),
      method: "post",
      status: 403,
      otherHandlers: [
        asignExamShowStartAndEnd(
          1,
          new Date(Date.now() - 5000),
          new Date(Date.now() + 3600 * 1000)
        ),
      ],
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <ExamInfoProvider examId={1}>
        <ExaminingProvider>
          <ExamOverview />
        </ExaminingProvider>
      </ExamInfoProvider>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.examiningOverview(1),
      }
    );

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const registerButton = await screen.findByRole("button", {
      name: /register/i,
    });
    userEvent.click(registerButton);

    // check loading is shown in button
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );
    // end

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );
    // check loading is gone
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /register/i })
      ).toBeInTheDocument()
    );
    // end
  });
});
