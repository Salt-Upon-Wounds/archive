import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import { QuestionGradeContext } from "../../../contexts/question-grade-context/question-grade.context";
import QuestionGrade from "../question-grade.component";

const Wrapper = (
  ui,
  {
    grade = 10,
    newGrade = "",
    changeGrade = jest.fn(),
    submitGrade = jest.fn(),
    hasChange = false,
    isContextLoaded = true,
    showGradeEnabled = true,
    changeGradeEnabled = true,
    errors = {},
  } = {}
) => {
  const value = {
    grade,
    newGrade,
    changeGrade,
    submitGrade,
    hasChange,
    isContextLoaded,
    showGradeEnabled,
    changeGradeEnabled,
    errors,
  };
  const WrappedElement = (
    <QuestionGradeContext.Provider value={value}>
      {ui}
    </QuestionGradeContext.Provider>
  );
  return { WrappedElement, value };
};

test("the grade of user must be shown in the question grade component", async () => {
  const { WrappedElement, value } = Wrapper(<QuestionGrade questionId={1} />);
  render(WrappedElement);

  expect(screen.getByText(value.grade, { exact: false })).toBeInTheDocument();
});

test("if canUserChangeGrade is true and hasChange is true, a button must be shown to user that clicking on that call the submitGrade function", async () => {
  const { WrappedElement, value } = Wrapper(
    <QuestionGrade questionId={1} canUserChangeGrade={true} />,
    {
      hasChange: true,
    }
  );
  render(WrappedElement);

  const submitButton = screen.getByRole("button", { name: /update grade/i });

  userEvent.click(submitButton);

  expect(value.submitGrade).toHaveBeenCalledTimes(1);
});

test("if canUserChangeGrade is true and hasChange is false, button must not be shown to user", async () => {
  const { WrappedElement } = Wrapper(
    <QuestionGrade questionId={1} canUserChangeGrade={true} />,
    {
      hasChange: false,
    }
  );
  render(WrappedElement);

  expect(
    screen.queryByRole("button", { name: /update grade/i })
  ).not.toBeInTheDocument();
});

test("the value of the number input must be equal to newGrade", async () => {
  const { WrappedElement, value } = Wrapper(
    <QuestionGrade questionId={1} canUserChangeGrade={true} />,
    { newGrade: 12 }
  );
  render(WrappedElement);

  const gradeInput = screen.getByRole("spinbutton", { name: /grade/i });
  expect(gradeInput).toHaveValue(value.newGrade);
});

test("if canUserChangeGrade is true, user can fill input", async () => {
  const { WrappedElement, value } = Wrapper(
    <QuestionGrade questionId={1} canUserChangeGrade={true} />
  );
  render(WrappedElement);

  const gradeInput = screen.getByRole("spinbutton", { name: /grade/i });
  const newGrade = "20";
  userEvent.clear(gradeInput);
  userEvent.type(gradeInput, newGrade);

  expect(value.changeGrade).toHaveBeenCalledTimes(newGrade.length);
  for (const current of newGrade) {
    expect(value.changeGrade).toHaveBeenCalledWith(current);
  }
});

test("if canUserChangeGrade is false, there must not be any input", async () => {
  const { WrappedElement } = Wrapper(
    <QuestionGrade questionId={1} canUserChangeGrade={false} />
  );
  render(WrappedElement);

  expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("if showGradeEnabled is false, the grade must not be shown to user even if it is not undefined", async () => {
  const { WrappedElement } = Wrapper(
    <QuestionGrade questionId={1} canUserChangeGrade={true} />,
    { grade: 43, showGradeEnabled: false }
  );
  render(WrappedElement);

  expect(screen.queryByText(43, { exact: false })).not.toBeInTheDocument();
});

test("if changeGradeEnabled is false, the grade input must not be shown to user", async () => {
  const { WrappedElement } = Wrapper(
    <QuestionGrade questionId={1} canUserChangeGrade={true} />,
    { grade: 43, changeGradeEnabled: false }
  );
  render(WrappedElement);

  expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
});

test("the questionId must be affect on id of spinbutton", async () => {
  const randomId = Math.floor(Math.random() * 100);
  const { WrappedElement } = Wrapper(
    <QuestionGrade questionId={randomId} canUserChangeGrade={true} />,
    { grade: 43 }
  );
  render(WrappedElement);

  expect(screen.getByRole("spinbutton")).toHaveAttribute(
    "id",
    `grade-of-question-${randomId}`
  );
});

test("if there is any error in context, it must be shown bellow the input", async () => {
  const errorMessage = "something went wrong, please try again later";
  const { WrappedElement } = Wrapper(
    <QuestionGrade questionId={1} canUserChangeGrade={true} />,
    {
      errors: { grade: errorMessage },
    }
  );
  render(WrappedElement);

  expect(await screen.findByText(errorMessage)).toHaveClass("text-danger");
});
