import { render, screen } from "../../../test-utils/testing-library-utils";

import Pagination from "../pagination.component";
describe("check without search query", () => {
  test("just current page must be active", () => {
    const currentPage = 2;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix="/test"
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const buttonToPage2 = screen.getByText("2").closest("li");
    expect(buttonToPage2).toHaveClass("active");

    for (
      let i = Math.max(1, currentPage - rangeOfPages);
      i <= Math.min(10, currentPage + rangeOfPages);
      i++
    ) {
      if (i === currentPage) {
        continue;
      }
      expect(screen.getByText(i).closest("li")).not.toHaveClass("active");
    }
  });

  describe("pagination must not contain button to a page out of the range", () => {
    test("check first of the range", () => {
      const currentPage = 2;
      const numberOfPages = 10;
      const rangeOfPages = 3;
      render(
        <Pagination
          rangeSize={rangeOfPages}
          prefix="/test"
          currentPage={currentPage}
          numberOfPages={numberOfPages}
        />
      );

      expect(screen.queryByText("0")).not.toBeInTheDocument();
      expect(screen.queryByText("-1")).not.toBeInTheDocument();
    });
    test("check last of the range", () => {
      const currentPage = 9;
      const numberOfPages = 10;
      const rangeOfPages = 3;
      render(
        <Pagination
          rangeSize={rangeOfPages}
          prefix="/test"
          currentPage={currentPage}
          numberOfPages={numberOfPages}
        />
      );

      expect(screen.queryByText("11")).not.toBeInTheDocument();
      expect(screen.queryByText("12")).not.toBeInTheDocument();
    });
  });

  test("check prev button's href", () => {
    const currentPage = 5;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix="/test"
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const prevLink = screen.getByText(/previous/i).closest("a");
    expect(prevLink).toHaveAttribute("href", `/test?page=${currentPage - 1}`);
  });

  test("check first button's href", () => {
    const currentPage = 6;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix="/test"
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const firstLink = screen.getByText(/first/i).closest("a");
    expect(firstLink).toHaveAttribute("href", "/test?page=1");
  });

  test("if user is in the first page, prev button must be disabled", () => {
    const currentPage = 1;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix="/test"
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const prevButtonContainer = screen.getByText("Previous").closest("li");
    expect(prevButtonContainer).toHaveClass("disabled");
  });

  test("if user is in the first page, first button must be disabled", () => {
    const currentPage = 1;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix="/test"
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const firstButtonContainer = screen.getByText(/first/i).closest("li");
    expect(firstButtonContainer).toHaveClass("disabled");
  });

  test("check next button's href", () => {
    const currentPage = 6;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix="/test"
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const nextLink = screen.getByText(/next/i).closest("a");
    expect(nextLink).toHaveAttribute("href", `/test?page=${currentPage + 1}`);
  });

  test("check last button's href", () => {
    const currentPage = 6;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix="/test"
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const lastLink = screen.getByText(/last/i).closest("a");
    expect(lastLink).toHaveAttribute("href", `/test?page=${numberOfPages}`);
  });

  test("if user is in the last page, next button must be disabled", () => {
    const currentPage = 10;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix="/test"
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const nextButtonContainer = screen.getByText(/next/i).closest("li");
    expect(nextButtonContainer).toHaveClass("disabled");
  });

  test("if user is in the last page, last button must be disabled", () => {
    const currentPage = 10;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix="/test"
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const lastButtonContainer = screen.getByText(/last/i).closest("li");
    expect(lastButtonContainer).toHaveClass("disabled");
  });
});

describe("check with search query", () => {
  test("just current page must be active", () => {
    const currentPage = 2;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix={`/test?search=search&test=test`}
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const buttonToPage2 = screen.getByText("2").closest("li");
    expect(buttonToPage2).toHaveClass("active");

    for (
      let i = Math.max(1, currentPage - rangeOfPages);
      i <= Math.min(10, currentPage + rangeOfPages);
      i++
    ) {
      if (i === currentPage) {
        continue;
      }
      expect(screen.getByText(i).closest("li")).not.toHaveClass("active");
    }
  });

  describe("pagination must not contain button to a page out of the range", () => {
    test("check first of the range", () => {
      const currentPage = 2;
      const numberOfPages = 10;
      const rangeOfPages = 3;
      render(
        <Pagination
          rangeSize={rangeOfPages}
          prefix={`/test?search=search&test=test`}
          currentPage={currentPage}
          numberOfPages={numberOfPages}
        />
      );

      expect(screen.queryByText("0")).not.toBeInTheDocument();
      expect(screen.queryByText("-1")).not.toBeInTheDocument();
    });
    test("check last of the range", () => {
      const currentPage = 9;
      const numberOfPages = 10;
      const rangeOfPages = 3;
      render(
        <Pagination
          rangeSize={rangeOfPages}
          prefix={`/test?search=search&test=test`}
          currentPage={currentPage}
          numberOfPages={numberOfPages}
        />
      );

      expect(screen.queryByText("11")).not.toBeInTheDocument();
      expect(screen.queryByText("12")).not.toBeInTheDocument();
    });
  });

  test("check prev button's href", () => {
    const currentPage = 5;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix={`/test?search=search&test=test`}
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const prevLink = screen.getByText(/previous/i).closest("a");
    expect(prevLink).toHaveAttribute(
      "href",
      `/test?search=search&test=test&page=${currentPage - 1}`
    );
  });

  test("check first button's href", () => {
    const currentPage = 6;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix={`/test?search=search&test=test`}
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const firstLink = screen.getByText(/first/i).closest("a");
    expect(firstLink).toHaveAttribute(
      "href",
      "/test?search=search&test=test&page=1"
    );
  });

  test("if user is in the first page, prev button must be disabled", () => {
    const currentPage = 1;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix={`/test?search=search&test=test`}
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const prevButtonContainer = screen.getByText("Previous").closest("li");
    expect(prevButtonContainer).toHaveClass("disabled");
  });

  test("if user is in the first page, first button must be disabled", () => {
    const currentPage = 1;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix={`/test?search=search&test=test`}
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const firstButtonContainer = screen.getByText(/first/i).closest("li");
    expect(firstButtonContainer).toHaveClass("disabled");
  });

  test("check next button's href", () => {
    const currentPage = 6;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix={`/test?search=search&test=test`}
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const nextLink = screen.getByText(/next/i).closest("a");
    expect(nextLink).toHaveAttribute(
      "href",
      `/test?search=search&test=test&page=${currentPage + 1}`
    );
  });

  test("check last button's href", () => {
    const currentPage = 6;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix={`/test?search=search&test=test`}
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const lastLink = screen.getByText(/last/i).closest("a");
    expect(lastLink).toHaveAttribute(
      "href",
      `/test?search=search&test=test&page=${numberOfPages}`
    );
  });

  test("if user is in the last page, next button must be disabled", () => {
    const currentPage = 10;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix={`/test?search=search&test=test`}
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const nextButtonContainer = screen.getByText(/next/i).closest("li");
    expect(nextButtonContainer).toHaveClass("disabled");
  });

  test("if user is in the last page, last button must be disabled", () => {
    const currentPage = 10;
    const numberOfPages = 10;
    const rangeOfPages = 3;
    render(
      <Pagination
        rangeSize={rangeOfPages}
        prefix={`/test?search=search&test=test`}
        currentPage={currentPage}
        numberOfPages={numberOfPages}
      />
    );

    const lastButtonContainer = screen.getByText(/last/i).closest("li");
    expect(lastButtonContainer).toHaveClass("disabled");
  });
});
