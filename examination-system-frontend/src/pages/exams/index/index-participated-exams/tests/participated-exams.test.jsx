import {
  renderWithAuthentication,
  waitForElementToBeRemoved,
  waitFor,
  screen,
} from "../../../../../test-utils/testing-library-utils";
import ParticipatedExams from "../participated-exams.page";
import programRoutes from "../../../../../constants/program-routes.constant";
import apiRoutes from "../../../../../constants/api-routes.constant";
import { pageOneExamsIndex } from "../../../../../mocks/mocks/exams.mock";
import { emptyRequest } from "../../../../../utilities/tests.utility";

test("first of all, loading must be shown in the page", async () => {
  renderWithAuthentication(<ParticipatedExams />, {
    route: programRoutes.indexParticipatedExams(),
  });

  expect(await screen.findByText(/loading/i)).toBeInTheDocument();
});

test("after loading, pagination must have link to other pages", async () => {
  renderWithAuthentication(<ParticipatedExams />, {
    route: programRoutes.indexParticipatedExams(),
  });

  const numberOfPages = pageOneExamsIndex.meta.last_page;

  for (let i = 2; i <= numberOfPages; i++) {
    expect(await screen.findByRole("link", { name: i })).toHaveAttribute(
      "href",
      `${programRoutes.indexParticipatedExams()}?page=${i}`
    );
  }
});

test("if there is not any participated exam, loading must be gone", async () => {
  emptyRequest({
    method: "get",
    route: apiRoutes.participants.indexParticipants(1),
    objectName: "exams",
  });

  renderWithAuthentication(<ParticipatedExams />, {
    route: programRoutes.indexParticipatedExams(),
  });

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
});

test("if user came to a page that do not exist, he must be redirected to the page 1", async () => {
  renderWithAuthentication(<ParticipatedExams />, {
    route: `${programRoutes.indexParticipatedExams()}?page=100`,
  });

  await waitFor(() =>
    expect(
      window.location.href.endsWith(programRoutes.indexParticipatedExams())
    ).toBe(true)
  );
});
