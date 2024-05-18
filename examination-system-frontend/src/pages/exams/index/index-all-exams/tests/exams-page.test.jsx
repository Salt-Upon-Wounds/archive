import {
  renderWithAuthentication,
  waitForElementToBeRemoved,
  screen,
  waitFor,
} from "../../../../../test-utils/testing-library-utils";
import axios from "axios";

import IndexAllExams from "../index-all-exams.page";
import { emptyRequest } from "../../../../../utilities/tests.utility";
import apiRoutes from "../../../../../constants/api-routes.constant";
import programRoutes from "../../../../../constants/program-routes.constant";
import {
  pageOneExamsIndex,
  foundSearch,
} from "../../../../../mocks/mocks/exams.mock";

const PAGE_SIZE = 18;
const searchPrefix = "search";

describe("initial conditions", () => {
  test("there is a search section to search exams", async () => {
    renderWithAuthentication(<IndexAllExams />);

    const searchSection = await screen.findByRole("search");
    expect(searchSection).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText("Search Exam");
    expect(searchInput).toBeInTheDocument();
  });
  test(
    "when pages loads, a loading will be displayed and then " +
      PAGE_SIZE +
      " exams must be loaded",
    async () => {
      renderWithAuthentication(<IndexAllExams />);

      const loading = screen.getByText(/loading.../i);
      expect(loading).toBeInTheDocument();

      const exams = await screen.findAllByRole("button", {
        name: /more details/i,
      });

      expect(exams).toHaveLength(PAGE_SIZE);
    }
  );
});

describe("check pagination and exams", () => {
  test("after loading, pagination must have link to other pages", async () => {
    renderWithAuthentication(<IndexAllExams />, {
      route: programRoutes.indexAllExams(),
    });

    const numberOfPages = pageOneExamsIndex.meta.last_page;

    for (let i = 2; i <= numberOfPages; i++) {
      expect(await screen.findByRole("link", { name: i })).toHaveAttribute(
        "href",
        `${programRoutes.indexAllExams()}?page=${i}`
      );
    }
  });

  test("if there is not any created exam, loading must be gone", async () => {
    emptyRequest({
      method: "get",
      route: apiRoutes.exams.indexAllExams(),
      objectName: "exams",
    });

    renderWithAuthentication(<IndexAllExams />, {
      route: programRoutes.indexAllExams(),
    });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  test("if user came to a page that do not exist, he must be redirected to the page 1", async () => {
    const axiosGet = jest.spyOn(axios, "get");
    renderWithAuthentication(<IndexAllExams />, {
      route: `${programRoutes.indexAllExams()}?page=100`,
    });

    await waitFor(() => {
      return expect(
        window.location.href.endsWith(programRoutes.indexAllExams())
      ).toBe(true);
    });
    expect(axiosGet).toHaveBeenCalledTimes(2);
    expect(axiosGet.mock.calls[0][1].params).toEqual({ page: 100 });
    expect(axiosGet.mock.calls[1][1].params).toEqual({ page: 1 });
  });

  test("if the page is in the url, that page must be loaded", async () => {
    const axiosGet = jest.spyOn(axios, "get");
    renderWithAuthentication(<IndexAllExams />, {
      route: `${programRoutes.indexAllExams()}?page=2`,
    });

    // for (let i = 19; i < 19 + 18; i++) {
    //   expect(await screen.findByText(i, { exact: false })).toBeInTheDocument();
    // }
    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet.mock.calls[0][1].params).toEqual({ page: 2 });
  });
});

describe("check when we have search query in url", () => {
  test("after loading, pagination must have link to other pages", async () => {
    const url = `${programRoutes.indexAllExams()}?${searchPrefix}=${encodeURIComponent(
      foundSearch
    )}`;
    renderWithAuthentication(<IndexAllExams />, {
      route: url,
    });

    const numberOfPages = pageOneExamsIndex.meta.last_page;

    for (let i = 2; i <= numberOfPages; i++) {
      expect(await screen.findByRole("link", { name: i })).toHaveAttribute(
        "href",
        `${url}&page=${i}`
      );
    }
  });

  test("if there is not any matched exam, loading must be gone", async () => {
    const url = `${programRoutes.indexAllExams()}?${searchPrefix}=testtest`;
    emptyRequest({
      method: "get",
      route: apiRoutes.exams.indexAllExams(),
      objectName: "exams",
    });

    renderWithAuthentication(<IndexAllExams />, {
      route: url,
    });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  test("if user came to a page that do not exist, he must be redirected to the page 1", async () => {
    const axiosGet = jest.spyOn(axios, "get");
    const url = `${programRoutes.indexAllExams()}?${searchPrefix}=${encodeURIComponent(
      foundSearch
    )}`;
    renderWithAuthentication(<IndexAllExams />, {
      route: `${url}&page=100`,
    });

    await waitFor(() => expect(window.location.href.endsWith(url)).toBe(true));
    expect(axiosGet).toHaveBeenCalledTimes(2);
  });

  test("if the page is in the url, that page must be loaded", async () => {
    const axiosGet = jest.spyOn(axios, "get");
    const url = `${programRoutes.indexAllExams()}?${searchPrefix}=${foundSearch}`;
    renderWithAuthentication(<IndexAllExams />, {
      route: `${url}&page=2`,
    });

    // for (let i = 19; i < 19 + 18; i++) {
    //   expect(await screen.findByText(i, { exact: false })).toBeInTheDocument();
    // }
    expect(axiosGet).toHaveBeenCalledTimes(1);
    const paramsObject = { page: 2 };
    paramsObject[searchPrefix] = foundSearch;
    expect(axiosGet.mock.calls[0][1].params).toEqual(paramsObject);
  });
});
