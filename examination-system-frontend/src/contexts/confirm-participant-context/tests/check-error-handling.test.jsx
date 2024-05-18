import {
  waitFor,
  screen,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import moment from "moment";
import userEvent from "@testing-library/user-event";
import { Route } from "react-router-dom";
import {
  changeRequestResponseTo401,
  changeRequestResponseTo422,
  changeRequestResponseToSpecificStatus,
  changeParticipantsWithOneParticipant,
  changeShowExam,
} from "../../../utilities/tests.utility";

import IndexParticipantsPage from "../../../pages/exams/participants/index/index-participants.page";

import apiRoutes from "../../../constants/api-routes.constant";
import programRoutes from "../../../constants/program-routes.constant";

describe("check 401 errors(the removeUserInfo() func from authentication context must be called)", () => {
  test("check exams.confirmParticipant route", async () => {
    const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
    const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
    changeRequestResponseTo401({
      route: apiRoutes.exams.confirmParticipant(":examId"),
      method: "put",
      otherHandlers: [
        changeParticipantsWithOneParticipant({
          participant: {
            confirmed: false,
          },
        }),
        changeShowExam({
          exam: {
            startOfExam: start,
            needsConfirmation: true,
            endOfExam: end,
            published: true,
            isRegistered: false,
            ownerId: 12,
          },
        }),
      ],
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <Route path={programRoutes.indexParticipants(":examId")}>
        <IndexParticipantsPage />
      </Route>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.indexParticipants(2),
      }
    );

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    const confirmButton = screen.getByRole("button", {
      name: /confirm this participant/i,
    });
    userEvent.click(confirmButton);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /confirm this participant/i })
      ).toBeEnabled()
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(1));
  });
});

describe("check 422 errors", () => {
  test("check exams.confirmParticipant route", async () => {
    const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
    const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
    const { message } = changeRequestResponseTo422({
      route: apiRoutes.exams.confirmParticipant(":examId"),
      method: "put",
      fields: [],
      otherHandlers: [
        changeParticipantsWithOneParticipant({
          participant: {
            confirmed: false,
          },
        }),
        changeShowExam({
          exam: {
            startOfExam: start,
            needsConfirmation: true,
            endOfExam: end,
            published: true,
            isRegistered: false,
            ownerId: 12,
          },
        }),
      ],
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <Route path={programRoutes.indexParticipants(":examId")}>
        <IndexParticipantsPage />
      </Route>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.indexParticipants(2),
      }
    );

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    const confirmButton = screen.getByRole("button", {
      name: /confirm this participant/i,
    });
    userEvent.click(confirmButton);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /confirm this participant/i })
      ).toBeEnabled()
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(message, { exact: false })).toBeInTheDocument()
    );
  });
});

describe("check other errors", () => {
  test("check exams.confirmParticipant route", async () => {
    const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
    const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
    changeRequestResponseToSpecificStatus({
      route: apiRoutes.exams.confirmParticipant(":examId"),
      status: 403,
      method: "put",
      otherHandlers: [
        changeParticipantsWithOneParticipant({
          participant: {
            confirmed: false,
          },
        }),
        changeShowExam({
          exam: {
            startOfExam: start,
            needsConfirmation: true,
            endOfExam: end,
            published: true,
            isRegistered: false,
            ownerId: 12,
          },
        }),
      ],
    });

    const removeUserInfo = jest.fn();
    renderWithAuthentication(
      <Route path={programRoutes.indexParticipants(":examId")}>
        <IndexParticipantsPage />
      </Route>,
      {
        authenticationProviderProps: { removeUserInfo },
        route: programRoutes.indexParticipants(2),
      }
    );

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    const confirmButton = screen.getByRole("button", {
      name: /confirm this participant/i,
    });
    userEvent.click(confirmButton);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
    );

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /confirm this participant/i })
      ).toBeEnabled()
    );

    await waitFor(() => expect(removeUserInfo).toHaveBeenCalledTimes(0));
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );
  });
});
