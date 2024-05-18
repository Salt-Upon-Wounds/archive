import {
  renderWithAuthentication,
  screen,
  waitFor,
} from "../../../../../test-utils/testing-library-utils";
import axios from "axios";
import moment from "moment";
import userEvent from "@testing-library/user-event";
import ExamOverview from "../exam-overview.page";
import { wrapper } from "./partials";
import programRoutes from "../../../../../constants/program-routes.constant";
import apiRoutes from "../../../../../constants/api-routes.constant";
import {
  wait,
  changeCurrentParticipant,
} from "../../../../../utilities/tests.utility";

test("first of all, a loading message must be shown", async () => {
  const { WrappedElement } = wrapper(<ExamOverview />, {});
  renderWithAuthentication(WrappedElement, {
    route: programRoutes.examiningOverview(1),
  });

  expect(await screen.findByText(/loading\.\.\./i)).toBeInTheDocument();
});

describe("check register button", () => {
  describe("check when exam is finished", () => {
    test("if user own the exam, it must not be shown", async () => {
      const start = moment(Date.now() - 5000 * 60).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      const { WrappedElement } = wrapper(<ExamOverview />, {
        participantId: 1,
        exam: {
          startOfExam: start,
          endOfExam: end,
          published: true,
          isRegistered: false,
          ownerId: 1,
        },
      });
      renderWithAuthentication(WrappedElement, {
        route: programRoutes.examiningOverview(1),
      });

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );
      expect(
        screen.queryByRole("button", { name: /register/i })
      ).not.toBeInTheDocument();
    });
    test("if user does not own the exam, it must not be shown", async () => {
      const start = moment(Date.now() - 5000 * 60).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      const { WrappedElement } = wrapper(<ExamOverview />, {
        participantId: 1,
        exam: {
          startOfExam: start,
          endOfExam: end,
          published: true,
          isRegistered: false,
          ownerId: 12,
        },
      });
      renderWithAuthentication(WrappedElement, {
        route: programRoutes.examiningOverview(1),
      });

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );
      expect(
        screen.queryByRole("button", { name: /register/i })
      ).not.toBeInTheDocument();
    });
  });
  describe("check when exam is not finished", () => {
    describe("check when user own the exam", () => {
      test("the button must not be shown", async () => {
        const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
        const end = moment(Date.now() + 60 * 5000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const { WrappedElement } = wrapper(<ExamOverview />, {
          participantId: 1,
          exam: {
            startOfExam: start,
            endOfExam: end,
            published: true,
            isRegistered: false,
            ownerId: 1,
          },
        });
        renderWithAuthentication(WrappedElement, {
          route: programRoutes.examiningOverview(1),
        });

        await waitFor(() =>
          expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
        );
        expect(
          screen.queryByRole("button", { name: /register/i })
        ).not.toBeInTheDocument();
      });
    });
    describe("check when user does not own the exam", () => {
      test("if user registered in exam, it must not be shown", async () => {
        const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
        const end = moment(Date.now() + 60 * 5000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const { WrappedElement } = wrapper(<ExamOverview />, {
          participantId: 1,
          exam: {
            startOfExam: start,
            endOfExam: end,
            ownerId: 12,
            published: true,
            isRegistered: true,
          },
        });
        renderWithAuthentication(WrappedElement, {
          route: programRoutes.examiningOverview(1),
        });

        await waitFor(() =>
          expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
        );
        expect(
          screen.queryByRole("button", { name: /register/i })
        ).not.toBeInTheDocument();
      });
      test("if user not registered in exam, it must be shown", async () => {
        const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
        const end = moment(Date.now() + 60 * 5000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const { WrappedElement } = wrapper(<ExamOverview />, {
          participantId: 1,
          exam: {
            startOfExam: start,
            endOfExam: end,
            ownerId: 12,
            isRegistered: false,
            published: true,
          },
        });
        renderWithAuthentication(WrappedElement, {
          route: programRoutes.examiningOverview(1),
        });

        await waitFor(() =>
          expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
        );
        expect(
          screen.queryByRole("button", { name: /register/i })
        ).toBeInTheDocument();
      });
    });
  });
});
describe("check go to exam button", () => {
  describe("check when exam is finished", () => {
    test("if user own the exam, it must not be shown", async () => {
      const start = moment(Date.now() - 60 * 5000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      const { WrappedElement } = wrapper(<ExamOverview />, {
        participantId: 1,
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 1,
          isRegistered: false,
          published: true,
        },
      });
      renderWithAuthentication(WrappedElement, {
        route: programRoutes.examiningOverview(1),
      });

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );
      expect(
        screen.queryByRole("button", { name: /go to exam/i })
      ).not.toBeInTheDocument();
    });
    test("if user does not own the exam, it must not be shown", async () => {
      const start = moment(Date.now() - 60 * 5000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      const { WrappedElement } = wrapper(<ExamOverview />, {
        participantId: -1,
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 12,
          isRegistered: false,
          published: true,
        },
      });
      renderWithAuthentication(WrappedElement, {
        route: programRoutes.examiningOverview(1),
      });

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );
      expect(
        screen.queryByRole("button", { name: /go to exam/i })
      ).not.toBeInTheDocument();
    });
  });
  describe("check when exam is not finished", () => {
    describe("check when user own the exam", () => {
      test("if user own the exam, the go to exam button must not be shown", async () => {
        const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
        const end = moment(Date.now() + 60 * 5000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const { WrappedElement } = wrapper(<ExamOverview />, {
          participantId: -1,
          exam: {
            startOfExam: start,
            endOfExam: end,
            ownerId: 1,
            isRegistered: false,
            published: true,
          },
        });
        renderWithAuthentication(WrappedElement, {
          route: programRoutes.examiningOverview(1),
        });

        await waitFor(() =>
          expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
        );
        expect(
          screen.queryByRole("button", { name: /go to exam/i })
        ).not.toBeInTheDocument();
      });
    });
    describe("check when user does not own the exam", () => {
      describe("check when user registered for exam", () => {
        test("user can see the button if he/she does not finished the exam", async () => {
          const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
          const end = moment(Date.now() + 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: 4,
            exam: {
              startOfExam: start,
              endOfExam: end,
              ownerId: 12,
              isRegistered: true,
              published: true,
            },
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          expect(
            await screen.findByRole("button", { name: /go to exam/i })
          ).toBeInTheDocument();
        });
        test("user can not see the button if he/she finished the exam", async () => {
          const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
          const end = moment(Date.now() + 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: 1,
            exam: {
              startOfExam: start,
              endOfExam: end,
              ownerId: 12,
              isRegistered: true,
              published: true,
            },
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          await wait(500);
          expect(
            screen.queryByRole("button", { name: /go to exam/i })
          ).not.toBeInTheDocument();
        });
      });
      describe("check when user does not registered for exam", () => {
        test("if user does not registered, user must not see the exam", async () => {
          const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
          const end = moment(Date.now() + 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: -1,
            exam: {
              startOfExam: start,
              endOfExam: end,
              ownerId: 12,
              isRegistered: false,
              published: true,
            },
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          await wait(500);
          expect(
            screen.queryByRole("button", { name: /go to exam/i })
          ).not.toBeInTheDocument();
        });
      });
    });
  });
});
describe("check edit exam button", () => {
  describe("check when user own the exam", () => {
    describe("check when exam is published", () => {
      test("if exam is started, user must not see the button", async () => {
        const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
        const end = moment(Date.now() + 60 * 5000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const { WrappedElement } = wrapper(<ExamOverview />, {
          participantId: -1,
          exam: {
            startOfExam: start,
            endOfExam: end,
            ownerId: 1,
            isRegistered: false,
            published: true,
          },
        });
        renderWithAuthentication(WrappedElement, {
          route: programRoutes.examiningOverview(1),
        });

        await waitFor(() =>
          expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
        );
        await wait(500);
        expect(
          screen.queryByRole("button", { name: /edit exam/i })
        ).not.toBeInTheDocument();
      });
      test("if exam is not started, user must see the button", async () => {
        const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
        const end = moment(Date.now() + 60 * 5000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const { WrappedElement } = wrapper(<ExamOverview />, {
          participantId: -1,
          exam: {
            startOfExam: start,
            endOfExam: end,
            ownerId: 1,
            isRegistered: false,
            published: true,
          },
        });
        renderWithAuthentication(WrappedElement, {
          route: programRoutes.examiningOverview(1),
        });

        await waitFor(() =>
          expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
        );
        await wait(500);
        expect(
          screen.queryByRole("button", { name: /edit exam/i })
        ).toBeInTheDocument();
      });
    });
    describe("check when exam is not published", () => {
      test("if exam is started, user must see the button", async () => {
        const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
        const end = moment(Date.now() + 60 * 5000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const { WrappedElement } = wrapper(<ExamOverview />, {
          participantId: -1,
          exam: {
            startOfExam: start,
            endOfExam: end,
            ownerId: 1,
            isRegistered: false,
            published: false,
          },
        });
        renderWithAuthentication(WrappedElement, {
          route: programRoutes.examiningOverview(1),
        });

        await waitFor(() =>
          expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
        );
        await wait(500);
        expect(
          screen.queryByRole("button", { name: /edit exam/i })
        ).toBeInTheDocument();
      });
      test("if exam is not started, user must see the button", async () => {
        const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
        const end = moment(Date.now() + 60 * 5000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const { WrappedElement } = wrapper(<ExamOverview />, {
          participantId: -1,
          exam: {
            startOfExam: start,
            endOfExam: end,
            ownerId: 1,
            isRegistered: false,
            published: false,
          },
        });
        renderWithAuthentication(WrappedElement, {
          route: programRoutes.examiningOverview(1),
        });

        await waitFor(() =>
          expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
        );
        await wait(500);
        expect(
          screen.queryByRole("button", { name: /edit exam/i })
        ).toBeInTheDocument();
      });
    });
  });
  describe("check when user does not own the exam", () => {
    test("user must not see the button", async () => {
      const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
      const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
      const { WrappedElement } = wrapper(<ExamOverview />, {
        participantId: -1,
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 12,
          isRegistered: false,
          published: true,
        },
      });
      renderWithAuthentication(WrappedElement, {
        route: programRoutes.examiningOverview(1),
      });

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );
      await wait(500);
      expect(
        screen.queryByRole("button", { name: /edit exam/i })
      ).not.toBeInTheDocument();
    });
  });
});
describe("check participants button", () => {
  test("if user own the exam, user must see this button", async () => {
    const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
    const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
    const { WrappedElement } = wrapper(<ExamOverview />, {
      participantId: -1,
      exam: {
        startOfExam: start,
        endOfExam: end,
        ownerId: 1,
        isRegistered: false,
        published: true,
      },
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningOverview(1),
    });

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );
    expect(
      await screen.findByRole("button", { name: /participants/i })
    ).toBeInTheDocument();
  });
  test("if user does not own the exam, user must not see this button", async () => {
    const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
    const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
    const { WrappedElement } = wrapper(<ExamOverview />, {
      participantId: -1,
      exam: {
        startOfExam: start,
        endOfExam: end,
        ownerId: 12,
        isRegistered: false,
        published: true,
      },
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningOverview(1),
    });

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );
    await wait(300);
    expect(
      screen.queryByRole("button", { name: /participants/i })
    ).not.toBeInTheDocument();
  });
});
describe("check answers button", () => {
  describe("before start of exam", () => {
    test("if user own the exam, this button must not be shown", async () => {
      const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
      const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
      const { WrappedElement } = wrapper(<ExamOverview />, {
        participantId: -1,
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 1,
          isRegistered: false,
          published: true,
        },
      });
      renderWithAuthentication(WrappedElement, {
        route: programRoutes.examiningOverview(1),
      });

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );
      await wait(300);
      expect(
        screen.queryByRole("button", { name: /answers/i })
      ).not.toBeInTheDocument();
    });
    test("if user does not own the exam, this button must not be shown", async () => {
      const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
      const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
      const { WrappedElement } = wrapper(<ExamOverview />, {
        participantId: 1,
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 12,
          isRegistered: true,
          published: true,
        },
      });
      renderWithAuthentication(WrappedElement, {
        route: programRoutes.examiningOverview(1),
      });

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );
      await wait(300);
      expect(
        screen.queryByRole("button", { name: /answers/i })
      ).not.toBeInTheDocument();
    });
  });
  describe("when exam is running", () => {
    test("if user own the exam, this button must not be shown", async () => {
      const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
      const { WrappedElement } = wrapper(<ExamOverview />, {
        participantId: -1,
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 1,
          isRegistered: false,
          published: true,
        },
      });
      renderWithAuthentication(WrappedElement, {
        route: programRoutes.examiningOverview(1),
      });

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );
      await wait(300);
      expect(
        screen.queryByRole("button", { name: /answers/i })
      ).not.toBeInTheDocument();
    });
    test("if user does not own the exam, this button must not be shown", async () => {
      const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
      const { WrappedElement } = wrapper(<ExamOverview />, {
        participantId: 1,
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 12,
          isRegistered: true,
          published: true,
        },
      });
      renderWithAuthentication(WrappedElement, {
        route: programRoutes.examiningOverview(1),
      });

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );
      await wait(300);
      expect(
        screen.queryByRole("button", { name: /answers/i })
      ).not.toBeInTheDocument();
    });
  });
  describe("when exam is finished", () => {
    test("if user own the exam, this button must not be shown", async () => {
      const start = moment(Date.now() - 60 * 5000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      const { WrappedElement } = wrapper(<ExamOverview />, {
        participantId: -1,
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 1,
          isRegistered: false,
          published: true,
        },
      });
      renderWithAuthentication(WrappedElement, {
        route: programRoutes.examiningOverview(1),
      });

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );
      await wait(300);
      expect(
        screen.queryByRole("button", { name: /answers/i })
      ).not.toBeInTheDocument();
    });
    test("if user does not own the exam, this button must be shown", async () => {
      const start = moment(Date.now() - 60 * 5000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      const { WrappedElement } = wrapper(<ExamOverview />, {
        participantId: 1,
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 12,
          isRegistered: true,
          published: true,
        },
      });
      renderWithAuthentication(WrappedElement, {
        route: programRoutes.examiningOverview(1),
      });

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );

      expect(
        await screen.findByRole("button", { name: /answers/i })
      ).toBeInTheDocument();
    });
  });
});

describe("check requests", () => {
  describe("before start of exam", () => {
    describe("when user registered", () => {
      describe("when exam needs confirmation", () => {
        test("if user is confirmed, getCurrentParticipant and examsShow request must be sent", async () => {
          const axiosGet = jest.spyOn(axios, "get");
          const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
          const end = moment(Date.now() + 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: 1,
            useObject: true,
            participant: {
              id: 100,
              user_id: 200,
              examId: 1,
              status: "NOT_FINISHED",
              confirmed: true,
            },
            exam: {
              examId: 1,
              ownerId: 10,
              isRegistered: true,
              published: true,
              hasPassword: false,
              needsConfirmation: true,
              startOfExam: start,
              endOfExam: end,
            },
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          expect(axiosGet).toHaveBeenCalledTimes(2);
          expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
          expect(axiosGet.mock.calls[1][0]).toBe(
            apiRoutes.participants.currentParticipant(1)
          );
        });
        test("if user is not confirmed, getCurrentParticipant and examsShow request must be sent", async () => {
          const axiosGet = jest.spyOn(axios, "get");
          const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
          const end = moment(Date.now() + 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: 1,
            useObject: true,
            participant: {
              id: 100,
              user_id: 200,
              examId: 1,
              status: "NOT_FINISHED",
              confirmed: false,
            },
            exam: {
              examId: 1,
              ownerId: 10,
              isRegistered: true,
              published: true,
              hasPassword: false,
              needsConfirmation: true,
              startOfExam: start,
              endOfExam: end,
            },
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          expect(axiosGet).toHaveBeenCalledTimes(2);
          expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
          expect(axiosGet.mock.calls[1][0]).toBe(
            apiRoutes.participants.currentParticipant(1)
          );
        });
      });
      describe("when exam does not need confirmation", () => {
        test("getCurrentParticipant and examsShow must be sent", async () => {
          const axiosGet = jest.spyOn(axios, "get");
          const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
          const end = moment(Date.now() + 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: 1,
            useObject: true,
            participant: {
              id: 100,
              user_id: 200,
              examId: 1,
              status: "NOT_FINISHED",
              confirmed: false,
            },
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
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          expect(axiosGet).toHaveBeenCalledTimes(2);
          expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
          expect(axiosGet.mock.calls[1][0]).toBe(
            apiRoutes.participants.currentParticipant(1)
          );
        });
      });
    });
    describe("when user is not registered", () => {
      test("just examsShow request must be sent", async () => {
        const axiosGet = jest.spyOn(axios, "get");
        const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
        const end = moment(Date.now() + 60 * 5000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const { WrappedElement } = wrapper(<ExamOverview />, {
          participantId: -1,
          exam: {
            examId: 1,
            ownerId: 10,
            isRegistered: false,
            published: true,
            hasPassword: false,
            needsConfirmation: false,
            startOfExam: start,
            endOfExam: end,
          },
        });
        renderWithAuthentication(WrappedElement, {
          route: programRoutes.examiningOverview(1),
        });

        await waitFor(() =>
          expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
        );
        // expect(axiosGet).toHaveBeenCalledTimes(2);
        expect(axiosGet).toHaveBeenCalledTimes(1);
        expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
        // expect(axiosGet.mock.calls[1][0]).toBe(
        //   apiRoutes.participants.currentParticipant(1)
        // );
      });
      describe("if user registered", () => {
        test("if exam needs confirmation, getCurrentParticipant must be sent", async () => {
          const axiosGet = jest.spyOn(axios, "get");
          const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
          const end = moment(Date.now() + 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: -1,
            exam: {
              examId: 1,
              ownerId: 10,
              isRegistered: false,
              published: true,
              hasPassword: false,
              needsConfirmation: true,
              startOfExam: start,
              endOfExam: end,
            },
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          // expect(axiosGet).toHaveBeenCalledTimes(2);
          expect(axiosGet).toHaveBeenCalledTimes(1);
          expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
          // expect(axiosGet.mock.calls[1][0]).toBe(
          //   apiRoutes.participants.currentParticipant(1)
          // );

          const registerButton = screen.getByRole("button", {
            name: /register/i,
          });
          userEvent.click(registerButton);

          await waitFor(() => expect(axiosGet).toHaveBeenCalledTimes(2));
          expect(axiosGet.mock.calls[1][0]).toBe(
            apiRoutes.participants.currentParticipant(1)
          );
        });
        test("if exam does not need confirmation, getCurrentParticipant must be sent", async () => {
          const axiosGet = jest.spyOn(axios, "get");
          const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
          const end = moment(Date.now() + 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: -1,
            exam: {
              examId: 1,
              ownerId: 10,
              isRegistered: false,
              published: true,
              hasPassword: false,
              needsConfirmation: false,
              startOfExam: start,
              endOfExam: end,
            },
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          // expect(axiosGet).toHaveBeenCalledTimes(2);
          expect(axiosGet).toHaveBeenCalledTimes(1);
          expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
          // expect(axiosGet.mock.calls[1][0]).toBe(
          //   apiRoutes.participants.currentParticipant(1)
          // );

          const registerButton = screen.getByRole("button", {
            name: /register/i,
          });
          userEvent.click(registerButton);

          await waitFor(() => expect(axiosGet).toHaveBeenCalledTimes(2));
          expect(axiosGet.mock.calls[1][0]).toBe(
            apiRoutes.participants.currentParticipant(1)
          );
        });
      });
    });
  });
  describe("when exam is running", () => {
    describe("when user registered", () => {
      describe("when exam needs confirmation", () => {
        test("if user confirmed, examsShow, getCurrentParticipant and questionsIndex requests must be sent", async () => {
          const axiosGet = jest.spyOn(axios, "get");
          const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
          const end = moment(Date.now() + 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: 1,
            useObject: true,
            participant: {
              id: 100,
              user_id: 200,
              examId: 1,
              status: "NOT_FINISHED",
              confirmed: true,
            },
            exam: {
              examId: 1,
              ownerId: 10,
              isRegistered: true,
              published: true,
              hasPassword: false,
              needsConfirmation: true,
              startOfExam: start,
              endOfExam: end,
            },
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          expect(axiosGet).toHaveBeenCalledTimes(3);
          expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
          expect(axiosGet.mock.calls[1][0]).toBe(
            apiRoutes.participants.currentParticipant(1)
          );
          expect(axiosGet.mock.calls[2][0]).toBe(
            apiRoutes.questions.indexQuestions(1)
          );
        });
        test("if user is not confirmed, examsShow and getCurrentParticipant must be sent", async () => {
          const axiosGet = jest.spyOn(axios, "get");
          const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
          const end = moment(Date.now() + 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: 1,
            useObject: true,
            participant: {
              id: 100,
              user_id: 200,
              examId: 1,
              status: "NOT_FINISHED",
              confirmed: false,
            },
            exam: {
              examId: 1,
              ownerId: 10,
              isRegistered: true,
              published: true,
              hasPassword: false,
              needsConfirmation: true,
              startOfExam: start,
              endOfExam: end,
            },
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          expect(axiosGet).toHaveBeenCalledTimes(2);
          expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
          expect(axiosGet.mock.calls[1][0]).toBe(
            apiRoutes.participants.currentParticipant(1)
          );
          // expect(axiosGet.mock.calls[2][0]).toBe(
          //   apiRoutes.questions.indexQuestions(1)
          // );
        });
      });
      describe("when exam does not need confirmation", () => {
        test("examsShow, getCurrentParticipant and questionsIndex requests must be sent", async () => {
          const axiosGet = jest.spyOn(axios, "get");
          const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
          const end = moment(Date.now() + 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: 1,
            useObject: true,
            participant: {
              id: 100,
              user_id: 200,
              examId: 1,
              status: "NOT_FINISHED",
              confirmed: false,
            },
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
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          expect(axiosGet).toHaveBeenCalledTimes(3);
          expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
          expect(axiosGet.mock.calls[1][0]).toBe(
            apiRoutes.participants.currentParticipant(1)
          );
          expect(axiosGet.mock.calls[2][0]).toBe(
            apiRoutes.questions.indexQuestions(1)
          );
        });
      });
    });
    describe("when user is not registered", () => {
      test("just examsShow request must be sent", async () => {
        const axiosGet = jest.spyOn(axios, "get");
        const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
        const end = moment(Date.now() + 60 * 5000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const { WrappedElement } = wrapper(<ExamOverview />, {
          participantId: -1,
          // useObject: true,
          // participant: {
          //   id: 100,
          //   user_id: 200,
          //   examId: 1,
          //   status: "NOT_FINISHED",
          //   confirmed: false,
          // },
          exam: {
            examId: 1,
            ownerId: 10,
            isRegistered: false,
            published: true,
            hasPassword: false,
            needsConfirmation: false,
            startOfExam: start,
            endOfExam: end,
          },
        });
        renderWithAuthentication(WrappedElement, {
          route: programRoutes.examiningOverview(1),
        });

        await waitFor(() =>
          expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
        );
        expect(axiosGet).toHaveBeenCalledTimes(1);
        expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
        // expect(axiosGet.mock.calls[1][0]).toBe(
        //   apiRoutes.participants.currentParticipant(1)
        // );
        // expect(axiosGet.mock.calls[2][0]).toBe(
        //   apiRoutes.questions.indexQuestions(1)
        // );
      });
      describe("if user registered", () => {
        test("if exam needs confirmation, getCurrentParticipant request must be sent", async () => {
          const axiosGet = jest.spyOn(axios, "get");
          const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
          const end = moment(Date.now() + 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: 1,
            useObject: true,
            participant: {
              id: 100,
              user_id: 200,
              examId: 1,
              status: "NOT_FINISHED",
              confirmed: false,
            },
            exam: {
              examId: 1,
              ownerId: 10,
              isRegistered: false,
              published: true,
              hasPassword: false,
              needsConfirmation: true,
              startOfExam: start,
              endOfExam: end,
            },
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          expect(axiosGet).toHaveBeenCalledTimes(1);
          expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
          // expect(axiosGet.mock.calls[1][0]).toBe(
          //   apiRoutes.participants.currentParticipant(1)
          // );
          // expect(axiosGet.mock.calls[2][0]).toBe(
          //   apiRoutes.questions.indexQuestions(1)
          // );

          const registerButton = screen.getByRole("button", {
            name: /register/i,
          });
          userEvent.click(registerButton);

          await waitFor(() => expect(axiosGet).toHaveBeenCalledTimes(2));
          expect(axiosGet.mock.calls[1][0]).toBe(
            apiRoutes.participants.currentParticipant(1)
          );
        });
        test("if exam does not need confirmation, getCurrentParticipant and questionsIndex requests must be sent", async () => {
          const axiosGet = jest.spyOn(axios, "get");
          const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
          const end = moment(Date.now() + 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: 1,
            useObject: true,
            participant: {
              id: 100,
              user_id: 200,
              examId: 1,
              status: "NOT_FINISHED",
              confirmed: false,
            },
            exam: {
              examId: 1,
              ownerId: 10,
              isRegistered: false,
              published: true,
              hasPassword: false,
              needsConfirmation: false,
              startOfExam: start,
              endOfExam: end,
            },
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          expect(axiosGet).toHaveBeenCalledTimes(1);
          expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
          // expect(axiosGet.mock.calls[1][0]).toBe(
          //   apiRoutes.participants.currentParticipant(1)
          // );
          // expect(axiosGet.mock.calls[2][0]).toBe(
          //   apiRoutes.questions.indexQuestions(1)
          // );

          const registerButton = screen.getByRole("button", {
            name: /register/i,
          });
          userEvent.click(registerButton);

          await waitFor(() => expect(axiosGet).toHaveBeenCalledTimes(3));
          expect(axiosGet.mock.calls[1][0]).toBe(
            apiRoutes.participants.currentParticipant(1)
          );
          expect(axiosGet.mock.calls[2][0]).toBe(
            apiRoutes.questions.indexQuestions(1)
          );
        });
      });
    });
  });
  describe("when exam finished", () => {
    describe("when user registered", () => {
      describe("when exam needs confirmation", () => {
        test("if user is confirmed, examsShow and getCurrentParticipant must be sent", async () => {
          const axiosGet = jest.spyOn(axios, "get");
          const start = moment(Date.now() - 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: 1,
            useObject: true,
            participant: {
              id: 100,
              user_id: 200,
              examId: 1,
              status: "NOT_FINISHED",
              confirmed: true,
            },
            exam: {
              examId: 1,
              ownerId: 10,
              isRegistered: true,
              published: true,
              hasPassword: false,
              needsConfirmation: true,
              startOfExam: start,
              endOfExam: end,
            },
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          expect(axiosGet).toHaveBeenCalledTimes(2);
          expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
          expect(axiosGet.mock.calls[1][0]).toBe(
            apiRoutes.participants.currentParticipant(1)
          );
          // expect(axiosGet.mock.calls[2][0]).toBe(
          //   apiRoutes.questions.indexQuestions(1)
          // );
        });
        test("if user is not confirmed, examsShow and getCurrentParticipant must be sent", async () => {
          const axiosGet = jest.spyOn(axios, "get");
          const start = moment(Date.now() - 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: 1,
            useObject: true,
            participant: {
              id: 100,
              user_id: 200,
              examId: 1,
              status: "NOT_FINISHED",
              confirmed: false,
            },
            exam: {
              examId: 1,
              ownerId: 10,
              isRegistered: true,
              published: true,
              hasPassword: false,
              needsConfirmation: true,
              startOfExam: start,
              endOfExam: end,
            },
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          expect(axiosGet).toHaveBeenCalledTimes(2);
          expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
          expect(axiosGet.mock.calls[1][0]).toBe(
            apiRoutes.participants.currentParticipant(1)
          );
          // expect(axiosGet.mock.calls[2][0]).toBe(
          //   apiRoutes.questions.indexQuestions(1)
          // );
        });
      });
      describe("when exam does not need confirmation", () => {
        test("examsShow and getCurrentParticipant must be sent", async () => {
          const axiosGet = jest.spyOn(axios, "get");
          const start = moment(Date.now() - 60 * 5000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
          const { WrappedElement } = wrapper(<ExamOverview />, {
            participantId: 1,
            useObject: true,
            participant: {
              id: 100,
              user_id: 200,
              examId: 1,
              status: "NOT_FINISHED",
              confirmed: false,
            },
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
          });
          renderWithAuthentication(WrappedElement, {
            route: programRoutes.examiningOverview(1),
          });

          await waitFor(() =>
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
          );
          expect(axiosGet).toHaveBeenCalledTimes(2);
          expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
          expect(axiosGet.mock.calls[1][0]).toBe(
            apiRoutes.participants.currentParticipant(1)
          );
          // expect(axiosGet.mock.calls[2][0]).toBe(
          //   apiRoutes.questions.indexQuestions(1)
          // );
        });
      });
    });
    describe("when user is not registered", () => {
      test("examsShow must be sent", async () => {
        const axiosGet = jest.spyOn(axios, "get");
        const start = moment(Date.now() - 60 * 5000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
        const { WrappedElement } = wrapper(<ExamOverview />, {
          participantId: -1,
          // useObject: true,
          // participant: {
          //   id: 100,
          //   user_id: 200,
          //   examId: 1,
          //   status: "NOT_FINISHED",
          //   confirmed: false,
          // },
          exam: {
            examId: 1,
            ownerId: 10,
            isRegistered: false,
            published: true,
            hasPassword: false,
            needsConfirmation: false,
            startOfExam: start,
            endOfExam: end,
          },
        });
        renderWithAuthentication(WrappedElement, {
          route: programRoutes.examiningOverview(1),
        });

        await waitFor(() =>
          expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
        );
        expect(axiosGet).toHaveBeenCalledTimes(1);
        expect(axiosGet.mock.calls[0][0]).toBe(apiRoutes.exams.showExam(1));
        // expect(axiosGet.mock.calls[1][0]).toBe(
        //   apiRoutes.participants.currentParticipant(1)
        // );
        // expect(axiosGet.mock.calls[2][0]).toBe(
        //   apiRoutes.questions.indexQuestions(1)
        // );
      });
    });
  });
});
