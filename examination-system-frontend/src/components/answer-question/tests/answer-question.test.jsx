import {
  screen,
  waitFor,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import { wrapper } from "./partials";
import AnswerQuestion from "../answer-question.component";
import { wait, randomString } from "../../../utilities/tests.utility";

test("if isContextLoaded is false, the answerQuestionComponent must show loading message", () => {
  const { WrappedElement } = wrapper(<AnswerQuestion />, {
    questionTypeId: 1,
    hasChange: true,
    isContextLoaded: false,
  });
  renderWithAuthentication(WrappedElement);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("if there is error message, it must be shown in the component", () => {
  const errorMessage = randomString();
  const { WrappedElement } = wrapper(<AnswerQuestion />, {
    errors: { message: errorMessage },
    questionTypeId: 1,
  });
  renderWithAuthentication(WrappedElement);

  expect(screen.getByText(errorMessage)).toHaveClass("text-danger");
});

describe("check saving feature", () => {
  test("if hasChange is true, 'not saved' must be shown to user", () => {
    const { WrappedElement } = wrapper(<AnswerQuestion />, {
      questionTypeId: 1,
      hasChange: true,
    });
    renderWithAuthentication(WrappedElement);

    expect(screen.queryByText(/all changes saved/i)).not.toBeInTheDocument();
    expect(screen.getByText(/not saved/i)).toBeInTheDocument();
  });

  test("if hasChange is true and isLoading is false, updateAnswers must be called", async () => {
    const { WrappedElement, value } = wrapper(<AnswerQuestion />, {
      questionTypeId: 1,
      hasChange: true,
    });
    renderWithAuthentication(WrappedElement);

    await waitFor(() => expect(value.updateAnswers).toHaveBeenCalledTimes(1));
  });

  test("if isLoading is true, 'saving...' phrase must be shown", async () => {
    const { WrappedElement } = wrapper(<AnswerQuestion />, {
      questionTypeId: 1,
      hasChange: true,
      isLoading: true,
    });
    renderWithAuthentication(WrappedElement);

    await waitFor(() =>
      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    );
  });

  test("if hasChange is false, updateAnswers must not be called", async () => {
    const { WrappedElement, value } = wrapper(<AnswerQuestion />, {
      questionTypeId: 1,
      hasChange: false,
    });
    renderWithAuthentication(WrappedElement);

    expect(screen.getByText(/all changes saved/i)).toBeInTheDocument();

    await wait(1000);

    await waitFor(() => expect(value.updateAnswers).toHaveBeenCalledTimes(0));
  });
});

describe("check descriptive", () => {
  test("descriptive component must be mounted", () => {
    const { WrappedElement } = wrapper(<AnswerQuestion />, {
      questionTypeId: 1,
      hasChange: false,
    });
    renderWithAuthentication(WrappedElement);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});

describe("check fill the blank", () => {
  test("fill the blank component must be mounted", () => {
    const { WrappedElement } = wrapper(<AnswerQuestion />, {
      questionTypeId: 2,
      hasChange: false,
    });
    renderWithAuthentication(WrappedElement);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});

describe("check multiple answers", () => {
  test("multiple answers component must be mounted", () => {
    const { WrappedElement } = wrapper(<AnswerQuestion />, {
      questionTypeId: 3,
      hasChange: false,
    });
    renderWithAuthentication(WrappedElement);

    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
  });
});

describe("check select the answer", () => {
  test("multiple answers component must be mounted", () => {
    const { WrappedElement } = wrapper(<AnswerQuestion />, {
      questionTypeId: 4,
      hasChange: false,
    });
    renderWithAuthentication(WrappedElement);

    expect(screen.getAllByRole("radio").length).toBeGreaterThan(0);
  });
});

describe("check true or false", () => {
  test("multiple answers component must be mounted", () => {
    const { WrappedElement } = wrapper(<AnswerQuestion />, {
      questionTypeId: 5,
      hasChange: false,
    });
    renderWithAuthentication(WrappedElement);

    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });
});

describe("check ordering", () => {
  test("multiple answers component must be mounted", () => {
    const { WrappedElement } = wrapper(<AnswerQuestion />, {
      questionTypeId: 6,
      hasChange: false,
    });
    renderWithAuthentication(WrappedElement);

    expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
  });
});

describe("check text of question", () => {
  test("the question text must be shown in the component", () => {
    const { WrappedElement, value } = wrapper(<AnswerQuestion />, {
      questionTypeId: 6,
      hasChange: false,
    });
    renderWithAuthentication(WrappedElement);

    expect(screen.getByText(value.question.question_text)).toBeInTheDocument();
  });

  test("the question score must be shown in the component", () => {
    const { WrappedElement, value } = wrapper(<AnswerQuestion />, {
      questionTypeId: 6,
      hasChange: false,
    });
    renderWithAuthentication(WrappedElement);

    expect(
      screen.getByText(value.question.question_score, { exact: false })
    ).toBeInTheDocument();
  });
});
