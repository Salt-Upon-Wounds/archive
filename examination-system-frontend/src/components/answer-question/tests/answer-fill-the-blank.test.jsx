import {
  screen,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import { wrapper } from "./partials";
import AnswerQuestion from "../answer-question.component";
import { randomString } from "../../../utilities/tests.utility";

test("the input must be placed instead of {{{}}}", () => {
  const questionAnswer = randomString();
  const { WrappedElement, value } = wrapper(<AnswerQuestion />, {
    answers: [{ integer_part: null, text_part: questionAnswer }],
    questionTypeId: 2,
  });
  renderWithAuthentication(WrappedElement);

  const textbox = screen.getByRole("textbox", {
    name: /answer of question/i,
  });
  expect(textbox).toHaveValue(questionAnswer);

  const [firstPart, secondPart] = value.question.question_text.split("{{{}}}");
  expect(
    screen.getByText((content, element) => {
      return content.trim() === firstPart.trim();
    })
  ).toBeInTheDocument();
  expect(
    screen.getByText((content, element) => {
      return content.trim() === secondPart.trim();
    })
  ).toBeInTheDocument();
  expect(
    screen.queryByText("{{{}}}", { exact: false })
  ).not.toBeInTheDocument();
});

test("the given answers from context will be shown in inputs", () => {
  const questionAnswer = randomString();
  const { WrappedElement } = wrapper(<AnswerQuestion />, {
    answers: [{ integer_part: null, text_part: questionAnswer }],
    questionTypeId: 2,
  });
  renderWithAuthentication(WrappedElement);

  const textbox = screen.getByRole("textbox", {
    name: /answer of question/i,
  });
  expect(textbox).toHaveValue(questionAnswer);
});

test("if the input was empty first, the changeAnswers must be called with appropriate input", () => {
  // const questionAnswer = "";
  const { WrappedElement, value } = wrapper(<AnswerQuestion />, {
    answers: [],
    questionTypeId: 2,
  });
  renderWithAuthentication(WrappedElement);

  const textbox = screen.getByRole("textbox", {
    name: /answer of question/i,
  });
  userEvent.type(textbox, "a");
  expect(value.changeAnswers).toHaveBeenCalledTimes(1);
  expect(value.changeAnswers).toHaveBeenCalledWith([{ text_part: "a" }]);
});

test("if the answers removed, the changeAnswers must be called with appropriate input", () => {
  const questionAnswer = randomString();
  const { WrappedElement, value } = wrapper(<AnswerQuestion />, {
    answers: [{ text_part: questionAnswer }],
    questionTypeId: 2,
  });
  renderWithAuthentication(WrappedElement);

  const textbox = screen.getByRole("textbox", {
    name: /answer of question/i,
  });
  userEvent.clear(textbox);
  expect(value.changeAnswers).toHaveBeenCalledTimes(1);
  expect(value.changeAnswers).toHaveBeenCalledWith([]);
});

test("if the answers changed, the changeAnswers must be called with appropriate input", () => {
  const questionAnswer = randomString();
  const { WrappedElement, value } = wrapper(<AnswerQuestion />, {
    answers: [{ text_part: questionAnswer }],
    questionTypeId: 2,
  });
  renderWithAuthentication(WrappedElement);

  const textbox = screen.getByRole("textbox", {
    name: /answer of question/i,
  });
  userEvent.type(textbox, "a");
  expect(value.changeAnswers).toHaveBeenCalledTimes(1);
  expect(value.changeAnswers).toHaveBeenCalledWith([
    { text_part: questionAnswer + "a" },
  ]);
});
