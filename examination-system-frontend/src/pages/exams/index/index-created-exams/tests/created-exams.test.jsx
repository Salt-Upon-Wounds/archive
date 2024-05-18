import {
  renderWithAuthentication,
  waitFor,
  waitForElementToBeRemoved,
  screen,
} from "../../../../../test-utils/testing-library-utils";
import CreatedExamsPage from "../created-exams.page";
import programRoutes from "../../../../../constants/program-routes.constant";
import apiRoutes from "../../../../../constants/api-routes.constant";
import { pageOneExamsIndex } from "../../../../../mocks/mocks/exams.mock";
import { wait, emptyRequest } from "../../../../../utilities/tests.utility";

test("first of all, loading must be in the page", async () => {
  renderWithAuthentication(<CreatedExamsPage />, {
    route: programRoutes.indexCreatedExams(),
  });

  expect(await screen.findByText(/loading/i)).toBeInTheDocument();
});

test("after loading, pagination must have link to other pages", async () => {
  renderWithAuthentication(<CreatedExamsPage />, {
    route: programRoutes.indexCreatedExams(),
  });

  const numberOfPages = pageOneExamsIndex.meta.last_page;

  for (let i = 2; i <= numberOfPages; i++) {
    expect(await screen.findByRole("link", { name: i })).toHaveAttribute(
      "href",
      `${programRoutes.indexCreatedExams()}?page=${i}`
    );
  }
});

test("if there is not any created exam, loading must be gone", async () => {
  emptyRequest({
    method: "get",
    route: apiRoutes.exams.indexCreatedExams(1),
    objectName: "exams",
  });

  renderWithAuthentication(<CreatedExamsPage />, {
    route: programRoutes.indexParticipatedExams(),
  });

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
});

test("if user came to a page that do not exist, he must be redirected to the page 1", async () => {
  renderWithAuthentication(<CreatedExamsPage />, {
    route: `${programRoutes.indexCreatedExams()}?page=100`,
  });

  await waitFor(() =>
    expect(
      window.location.href.endsWith(programRoutes.indexCreatedExams())
    ).toBe(true)
  );
});
