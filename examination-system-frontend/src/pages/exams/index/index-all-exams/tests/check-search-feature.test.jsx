import {
  screen,
  waitFor,
  renderWithRouter,
} from "../../../../../test-utils/testing-library-utils";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import IndexAllExamsPage from "../index-all-exams.page";
import programRoutes from "../../../../../constants/program-routes.constant";
import { wait } from "../../../../../utilities/tests.utility";

const searchPrefix = "search";
const notFoundMessage = (searchQuery) =>
  `no exam found that match "${searchQuery}"`;
test("when user type in search field, the search query must be added in url and get request must be resent", async () => {
  const axiosGet = jest.spyOn(axios, "get");
  renderWithRouter(<IndexAllExamsPage />, {
    route: programRoutes.indexAllExams(),
    withContexts: true,
  });

  const searchbar = await screen.findByRole("textbox", { name: /search/i });
  userEvent.clear(searchbar);
  userEvent.type(searchbar, "testtest");

  const searchButton = await screen.findByRole("button", { name: /search/i });
  userEvent.click(searchButton);

  await waitFor(() =>
    expect(window.location.search).toBe(`?${searchPrefix}=testtest`)
  );
  await waitFor(() =>
    expect(window.location.pathname).toBe(programRoutes.indexAllExams())
  );
  await waitFor(() => expect(axiosGet).toHaveBeenCalledTimes(2));
  await waitFor(() =>
    expect(
      axiosGet.mock.calls[axiosGet.mock.calls.length - 1][1].params[
        searchPrefix
      ]
    ).toBe("testtest")
  );
});

test("when app loaded, everything in search query must be in the input and request must be sent with that search query", async () => {
  const axiosGet = jest.spyOn(axios, "get");
  const searchQuery = "somethingsomething";
  renderWithRouter(<IndexAllExamsPage />, {
    route: `${programRoutes.indexAllExams()}?${searchPrefix}=${searchQuery}`,
    withContexts: true,
  });

  const searchbar = await screen.findByRole("textbox", { name: /search/i });

  await waitFor(() => expect(searchbar).toHaveValue(searchQuery));
  await waitFor(() =>
    expect(
      axiosGet.mock.calls[axiosGet.mock.calls.length - 1][1].params[
        searchPrefix
      ]
    ).toBe(searchQuery)
  );
});

test("if user remove all the search query, it must be gone from url", async () => {
  const searchQuery = "somethingsomething";
  renderWithRouter(<IndexAllExamsPage />, {
    route: `${programRoutes.indexAllExams()}?${searchPrefix}=${searchQuery}`,
    withContexts: true,
  });

  const searchbar = await screen.findByRole("textbox", { name: /search/i });
  userEvent.clear(searchbar);

  await waitFor(() => expect(window.location.search).toBe(``));
  await waitFor(() =>
    expect(window.location.pathname).toBe(programRoutes.indexAllExams())
  );
});

test("if there is not any record that match with the search query, it must be written for user", async () => {
  renderWithRouter(<IndexAllExamsPage />, {
    route: programRoutes.indexAllExams(),
    withContexts: true,
  });

  const searchbar = await screen.findByRole("textbox", { name: /search/i });
  userEvent.clear(searchbar);
  userEvent.type(searchbar, "testtest");

  const searchButton = await screen.findByRole("button", { name: /search/i });
  userEvent.click(searchButton);

  await waitFor(() =>
    expect(screen.getByText(notFoundMessage("testtest"))).toBeInTheDocument()
  );
});

test("without clicking search button, the request must be sent", async () => {
  const axiosGet = jest.spyOn(axios, "get");
  renderWithRouter(<IndexAllExamsPage />, {
    route: programRoutes.indexAllExams(),
    withContexts: true,
  });

  const searchbar = await screen.findByRole("textbox", { name: /search/i });
  userEvent.clear(searchbar);
  userEvent.type(searchbar, "testtest");
  //
  // const searchButton = await screen.findByRole("button", { name: /search/i });
  // userEvent.click(searchButton);

  await wait(1000);
  await waitFor(() =>
    expect(window.location.search).toBe(`?${searchPrefix}=testtest`)
  );
  await waitFor(() =>
    expect(window.location.pathname).toBe(programRoutes.indexAllExams())
  );
  await waitFor(() => expect(axiosGet).toHaveBeenCalledTimes(2));
  await waitFor(() =>
    expect(
      axiosGet.mock.calls[axiosGet.mock.calls.length - 1][1].params[
        searchPrefix
      ]
    ).toBe("testtest")
  );
});
