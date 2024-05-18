import {
  renderWithAuthentication,
  waitFor,
  waitForElementToBeRemoved,
  screen,
} from "../../../../../test-utils/testing-library-utils";
import moment from "moment";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { Route } from "react-router-dom";
import IndexParticipantsPage from "../index-participants.page";
import programRoutes from "../../../../../constants/program-routes.constant";
import apiRoutes from "../../../../../constants/api-routes.constant";
import { indexParticipantsPage1 } from "../../../../../mocks/mocks/participants.mock";
import {
  emptyRequest,
  changeParticipantsWithOneParticipant,
  changeShowExam,
} from "../../../../../utilities/tests.utility";

describe("check essential things", () => {
  test("first of all, loading must be in the page", async () => {
    renderWithAuthentication(
      <Route path={programRoutes.indexParticipants(":examId")} exact>
        <IndexParticipantsPage />
      </Route>,
      {
        route: programRoutes.indexParticipants(1),
      }
    );

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  test("after loading, pagination must have link to other pages", async () => {
    renderWithAuthentication(
      <Route path={programRoutes.indexParticipants(":examId")} exact>
        <IndexParticipantsPage />
      </Route>,
      {
        route: programRoutes.indexParticipants(1),
      }
    );

    const numberOfPages = indexParticipantsPage1.meta.last_page;

    for (let i = 2; i <= numberOfPages; i++) {
      expect(await screen.findByRole("link", { name: i })).toHaveAttribute(
        "href",
        `${programRoutes.indexParticipants(1)}?page=${i}`
      );
    }
  });

  test("if there is not any participant, loading must be gone", async () => {
    emptyRequest({
      method: "get",
      route: apiRoutes.participants.indexParticipants(1),
      objectName: "participants",
    });

    renderWithAuthentication(
      <Route path={programRoutes.indexParticipants(":examId")} exact>
        <IndexParticipantsPage />
      </Route>,
      {
        route: programRoutes.indexParticipants(1),
      }
    );

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  test("if user came to a page that do not exist, he must be redirected to the page 1", async () => {
    renderWithAuthentication(
      <Route path={programRoutes.indexParticipants(":examId")} exact>
        <IndexParticipantsPage />
      </Route>,
      {
        route: `${programRoutes.indexParticipants(1)}?page=100`,
      }
    );

    await waitFor(() =>
      expect(
        window.location.href.endsWith(programRoutes.indexParticipants(1))
      ).toBe(true)
    );
  });
});

describe("check confirmation", () => {
  describe("check when exam does not need confirmation", () => {
    test("'confirmation status' column must not exist in table", async () => {
      renderWithAuthentication(
        <Route path={programRoutes.indexParticipants(":examId")} exact>
          <IndexParticipantsPage />
        </Route>,
        {
          route: programRoutes.indexParticipants(1),
        }
      );

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );

      expect(
        screen.queryByText(/confirmation status/i)
      ).not.toBeInTheDocument();
    });

    test("button for confirming user must not exist", async () => {
      changeParticipantsWithOneParticipant({
        participant: {
          confirmed: false,
        },
      });
      renderWithAuthentication(
        <Route path={programRoutes.indexParticipants(":examId")} exact>
          <IndexParticipantsPage />
        </Route>,
        {
          route: programRoutes.indexParticipants(1),
        }
      );

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );

      expect(
        screen.queryByRole("button", { name: /confirm this participant/i })
      ).not.toBeInTheDocument();
    });

    test("confirmed phrase must not exist", async () => {
      changeParticipantsWithOneParticipant({
        participant: {
          confirmed: true,
        },
      });
      renderWithAuthentication(
        <Route path={programRoutes.indexParticipants(":examId")} exact>
          <IndexParticipantsPage />
        </Route>,
        {
          route: programRoutes.indexParticipants(1),
        }
      );

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );

      expect(screen.queryByText(/confirmed/i)).not.toBeInTheDocument();
    });
  });
  describe("check when exam does need confirmation", () => {
    test("'confirmation status' column must exist in table", async () => {
      renderWithAuthentication(
        <Route path={programRoutes.indexParticipants(":examId")} exact>
          <IndexParticipantsPage />
        </Route>,
        {
          route: programRoutes.indexParticipants(2),
        }
      );

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );

      expect(screen.getByText(/confirmation status/i)).toBeInTheDocument();
    });

    test("if participant is confirmed, 'confirmed' phrase must be shown in front of him/her", async () => {
      changeParticipantsWithOneParticipant({
        participant: {
          confirmed: true,
        },
      });
      renderWithAuthentication(
        <Route path={programRoutes.indexParticipants(":examId")} exact>
          <IndexParticipantsPage />
        </Route>,
        {
          route: programRoutes.indexParticipants(2),
        }
      );

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );

      expect(screen.getByText(/confirmed/i)).toBeInTheDocument();
    });

    describe("check when participant is not confirmed", () => {
      test("if exam is not started, a button must be exist to confirm participant", async () => {
        const axiosPut = jest.spyOn(axios, "put");
        const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
        const end = moment(Date.now() + 60 * 5000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        changeParticipantsWithOneParticipant({
          participant: {
            confirmed: false,
          },
          otherHandlers: [
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
        renderWithAuthentication(
          <Route path={programRoutes.indexParticipants(":examId")} exact>
            <IndexParticipantsPage />
          </Route>,
          {
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

        expect(
          await screen.findByRole("button", { name: /loading/i })
        ).toBeDisabled();

        await waitFor(() => expect(axiosPut).toHaveBeenCalledTimes(1));
        await waitFor(() =>
          expect(axiosPut.mock.calls[0][0]).toBe(
            apiRoutes.exams.confirmParticipant(2)
          )
        );

        expect(await screen.findByText(/confirmed/i)).toBeInTheDocument();
      });
      test("if exam is running, a button must be exist to confirm participant", async () => {
        const axiosPut = jest.spyOn(axios, "put");
        const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
        const end = moment(Date.now() + 60 * 5000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        changeParticipantsWithOneParticipant({
          participant: {
            confirmed: false,
          },
          otherHandlers: [
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
        renderWithAuthentication(
          <Route path={programRoutes.indexParticipants(":examId")} exact>
            <IndexParticipantsPage />
          </Route>,
          {
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

        expect(
          await screen.findByRole("button", { name: /loading/i })
        ).toBeDisabled();

        await waitFor(() => expect(axiosPut).toHaveBeenCalledTimes(1));
        await waitFor(() =>
          expect(axiosPut.mock.calls[0][0]).toBe(
            apiRoutes.exams.confirmParticipant(2)
          )
        );

        expect(await screen.findByText(/confirmed/i)).toBeInTheDocument();
      });
      test("if exam is finished, 'Not confirmed' must be shown", async () => {
        const start = moment(Date.now() - 60 * 5000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
        changeParticipantsWithOneParticipant({
          participant: {
            confirmed: false,
          },
          otherHandlers: [
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
        renderWithAuthentication(
          <Route path={programRoutes.indexParticipants(":examId")} exact>
            <IndexParticipantsPage />
          </Route>,
          {
            route: programRoutes.indexParticipants(2),
          }
        );

        await waitFor(() =>
          expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
        );

        expect(
          screen.queryByRole("button", {
            name: /confirm this participant/i,
          })
        ).not.toBeInTheDocument();

        expect(await screen.findByText(/not confirmed/i)).toBeInTheDocument();
      });
    });
  });
});

describe("check more button", () => {
  describe("when exam needs confirmation", () => {
    test("if exam is not started, more button must not be shown before confirming participant", async () => {
      const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
      const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
      changeParticipantsWithOneParticipant({
        participant: {
          confirmed: false,
        },
        otherHandlers: [
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
      renderWithAuthentication(
        <Route path={programRoutes.indexParticipants(":examId")} exact>
          <IndexParticipantsPage />
        </Route>,
        {
          route: programRoutes.indexParticipants(2),
        }
      );

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );

      expect(
        screen.queryByRole("button", { name: /more/i })
      ).not.toBeInTheDocument();

      const confirmButton = await screen.findByRole("button", {
        name: /confirm this participant/i,
      });

      userEvent.click(confirmButton);

      expect(
        await screen.findByRole("button", { name: /more/i })
      ).toBeInTheDocument();
    });
    test("if exam is running, more button must not be shown before confirming participant", async () => {
      const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
      changeParticipantsWithOneParticipant({
        participant: {
          confirmed: false,
        },
        otherHandlers: [
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
      renderWithAuthentication(
        <Route path={programRoutes.indexParticipants(":examId")} exact>
          <IndexParticipantsPage />
        </Route>,
        {
          route: programRoutes.indexParticipants(2),
        }
      );

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );

      expect(
        screen.queryByRole("button", { name: /more/i })
      ).not.toBeInTheDocument();

      const confirmButton = await screen.findByRole("button", {
        name: /confirm this participant/i,
      });

      userEvent.click(confirmButton);

      expect(
        await screen.findByRole("button", { name: /more/i })
      ).toBeInTheDocument();
    });
    test("if exam is finished, more button must not be shown", async () => {
      const start = moment(Date.now() - 60 * 5000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      changeParticipantsWithOneParticipant({
        participant: {
          confirmed: false,
        },
        otherHandlers: [
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
      renderWithAuthentication(
        <Route path={programRoutes.indexParticipants(":examId")} exact>
          <IndexParticipantsPage />
        </Route>,
        {
          route: programRoutes.indexParticipants(2),
        }
      );

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );

      expect(
        screen.queryByRole("button", { name: /more/i })
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("button", { name: /confirm this participant/i })
      ).not.toBeInTheDocument();
    });
  });
  describe("when exam does not need confirmation", () => {
    test("if exam is not started, more button must be shown", async () => {
      const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
      const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
      changeParticipantsWithOneParticipant({
        participant: {
          confirmed: false,
        },
        otherHandlers: [
          changeShowExam({
            exam: {
              startOfExam: start,
              needsConfirmation: false,
              endOfExam: end,
              published: true,
              isRegistered: false,
              ownerId: 12,
            },
          }),
        ],
      });
      renderWithAuthentication(
        <Route path={programRoutes.indexParticipants(":examId")} exact>
          <IndexParticipantsPage />
        </Route>,
        {
          route: programRoutes.indexParticipants(2),
        }
      );

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );

      expect(
        await screen.findByRole("button", { name: /more/i })
      ).toBeInTheDocument();
    });
    test("if exam is running, more button must be shown", async () => {
      const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
      changeParticipantsWithOneParticipant({
        participant: {
          confirmed: false,
        },
        otherHandlers: [
          changeShowExam({
            exam: {
              startOfExam: start,
              needsConfirmation: false,
              endOfExam: end,
              published: true,
              isRegistered: false,
              ownerId: 12,
            },
          }),
        ],
      });
      renderWithAuthentication(
        <Route path={programRoutes.indexParticipants(":examId")} exact>
          <IndexParticipantsPage />
        </Route>,
        {
          route: programRoutes.indexParticipants(2),
        }
      );

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );

      expect(
        await screen.findByRole("button", { name: /more/i })
      ).toBeInTheDocument();
    });
    test("if exam is finished, more button must be shown", async () => {
      const start = moment(Date.now() - 60 * 5000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      changeParticipantsWithOneParticipant({
        participant: {
          confirmed: false,
        },
        otherHandlers: [
          changeShowExam({
            exam: {
              startOfExam: start,
              needsConfirmation: false,
              endOfExam: end,
              published: true,
              isRegistered: false,
              ownerId: 12,
            },
          }),
        ],
      });
      renderWithAuthentication(
        <Route path={programRoutes.indexParticipants(":examId")} exact>
          <IndexParticipantsPage />
        </Route>,
        {
          route: programRoutes.indexParticipants(2),
        }
      );

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );

      expect(
        await screen.findByRole("button", { name: /more/i })
      ).toBeInTheDocument();
    });
  });
});
