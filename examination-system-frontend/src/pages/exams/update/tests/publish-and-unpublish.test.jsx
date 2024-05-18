import {
  screen,
  renderWithAuthentication,
} from "../../../../test-utils/testing-library-utils";
import moment from "moment";
import userEvent from "@testing-library/user-event";
import UpdateExam from "../update-exam.page";
import { wait, changeShowExam } from "../../../../utilities/tests.utility";
import programRoutes from "../../../../constants/program-routes.constant";
import { wrapper } from "./partials";
import { invalidSum } from "../../../../mocks/errors/failed-publish.error";

describe("check publish and unpublish button", () => {
  describe("check when exam is published", () => {
    test("check when exam is not started, unpublish button must be shown", async () => {
      const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
      const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
      changeShowExam({
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 1,
          isRegistered: false,
          published: true,
        },
      });
      renderWithAuthentication(wrapper(<UpdateExam />), {
        route: programRoutes.updateExam(1),
      });

      expect(
        await screen.findByRole("button", { name: /unpublish/i })
      ).toBeInTheDocument();
    });
    test("check when exam is running, unpublish button must not be shown", async () => {
      const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
      changeShowExam({
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 1,
          isRegistered: false,
          published: true,
        },
      });
      renderWithAuthentication(wrapper(<UpdateExam />), {
        route: programRoutes.updateExam(1),
      });
      await wait(300);

      expect(
        screen.queryByRole("button", { name: /unpublish/i })
      ).not.toBeInTheDocument();
    });
    test("check when exam is finished, unpublish button must not be shown", async () => {
      const start = moment(Date.now() - 60 * 5000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      changeShowExam({
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 1,
          isRegistered: false,
          published: true,
        },
      });
      renderWithAuthentication(wrapper(<UpdateExam />), {
        route: programRoutes.updateExam(1),
      });
      await wait(300);

      expect(
        screen.queryByRole("button", { name: /unpublish/i })
      ).not.toBeInTheDocument();
    });
  });
  describe("check when exam is not published", () => {
    test("check when exam is not started, publish button must be shown", async () => {
      const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
      const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
      changeShowExam({
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 1,
          isRegistered: false,
          published: false,
        },
      });
      renderWithAuthentication(wrapper(<UpdateExam />), {
        route: programRoutes.updateExam(1),
      });

      expect(
        await screen.findByRole("button", { name: /publish/i })
      ).toBeInTheDocument();
    });
    test("check when exam is running, publish button must be shown", async () => {
      const start = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
      changeShowExam({
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 1,
          isRegistered: false,
          published: false,
        },
      });
      renderWithAuthentication(wrapper(<UpdateExam />), {
        route: programRoutes.updateExam(1),
      });

      expect(
        await screen.findByRole("button", { name: /publish/i })
      ).toBeInTheDocument();
    });
    test("check when exam is finished, publish button must be shown", async () => {
      const start = moment(Date.now() - 60 * 5000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const end = moment(Date.now() - 5000).format("YYYY-MM-DD HH:mm:ss");
      changeShowExam({
        exam: {
          startOfExam: start,
          endOfExam: end,
          ownerId: 1,
          isRegistered: false,
          published: false,
        },
      });
      renderWithAuthentication(wrapper(<UpdateExam />), {
        route: programRoutes.updateExam(1),
      });

      expect(
        await screen.findByRole("button", { name: /publish/i })
      ).toBeInTheDocument();
    });
  });
});

test("user can publish his exam and unpublish again", async () => {
  const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
  const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
  changeShowExam({
    exam: {
      startOfExam: start,
      endOfExam: end,
      ownerId: 1,
      isRegistered: false,
      published: false,
    },
  });
  renderWithAuthentication(wrapper(<UpdateExam />), {
    route: programRoutes.updateExam(1),
  });
  await wait(300);

  // find and click publish button
  const publishButton = screen.getByRole("button", { name: /publish exam/i });
  userEvent.click(publishButton);
  // end

  await wait(100);

  // check for publish message
  const publishMessage = await screen.findByText(
    /you published this exam successfully/i
  );
  expect(publishMessage).toBeInTheDocument();
  // end

  // check textboxes are readonly
  const textboxes = screen.getAllByRole("textbox", { name: /question text/i });
  for (let i = 0; i < textboxes.length; i++) {
    expect(textboxes[i]).toHaveAttribute("readonly");
  }
  // end

  // find and click unpublish button
  const unpublishButton = screen.getByRole("button", {
    name: /unpublish exam/i,
  });
  userEvent.click(unpublishButton);
  // end

  // check for unpublish message
  const unpublishMessage = await screen.findByText(
    /you unpublished this exam successfully/i
  );
  expect(unpublishMessage).toBeInTheDocument();
  // end
});

test("user can not publish his exam if there is any error and he will see the error", async () => {
  const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
  const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
  changeShowExam({
    exam: {
      startOfExam: start,
      endOfExam: end,
      ownerId: 1,
      isRegistered: false,
      published: false,
    },
  });
  renderWithAuthentication(wrapper(<UpdateExam />), {
    route: programRoutes.updateExam(3),
  });
  await wait(300);

  // find and click publish button
  const publishButton = screen.getByRole("button", { name: /publish exam/i });
  userEvent.click(publishButton);
  // end

  await wait(100);

  // check publishing error
  expect(await screen.findByText(invalidSum.message)).toBeInTheDocument();
  // end
});

test("if exam is published, user will see unpublish button and he can unpublish that", async () => {
  const start = moment(Date.now() + 5000).format("YYYY-MM-DD HH:mm:ss");
  const end = moment(Date.now() + 60 * 5000).format("YYYY-MM-DD HH:mm:ss");
  changeShowExam({
    exam: {
      startOfExam: start,
      endOfExam: end,
      ownerId: 1,
      isRegistered: false,
      published: true,
    },
  });
  renderWithAuthentication(wrapper(<UpdateExam />), {
    route: programRoutes.updateExam(2),
  });
  await wait(300);

  // find and click unpublish button
  const unpublishButton = screen.getByRole("button", {
    name: /unpublish exam/i,
  });
  userEvent.click(unpublishButton);
  // end

  // check for unpublish message
  const unpublishMessage = await screen.findByText(
    /you unpublished this exam successfully/i
  );
  expect(unpublishMessage).toBeInTheDocument();
  // end
});
