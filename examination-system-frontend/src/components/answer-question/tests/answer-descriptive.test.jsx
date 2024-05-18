import {
  screen,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import { wrapper } from "./partials";
import AnswerDescriptive from "../answer-descriptive.component";
import { randomString } from "../../../utilities/tests.utility";

test("the given answers from context will be shown in inputs", () => {
  const questionAnswer = randomString();
  const { WrappedElement } = wrapper(<AnswerDescriptive />, {
    answers: [{ integer_part: null, text_part: questionAnswer }],
    questionTypeId: 1,
  });
  renderWithAuthentication(WrappedElement);

  const textbox = screen.getByRole("textbox", {
    name: /answer of question/i,
  });
  expect(textbox).toHaveValue(questionAnswer);
});

test("if the input was empty first, the changeAnswers must be called with appropriate input", () => {
  // const questionAnswer = "";
  const { WrappedElement, value } = wrapper(<AnswerDescriptive />, {
    answers: [],
    questionTypeId: 1,
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
  const { WrappedElement, value } = wrapper(<AnswerDescriptive />, {
    answers: [{ text_part: questionAnswer }],
    questionTypeId: 1,
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
  const { WrappedElement, value } = wrapper(<AnswerDescriptive />, {
    answers: [{ text_part: questionAnswer }],
    questionTypeId: 1,
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
