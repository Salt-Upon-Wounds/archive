import {
  screen,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import { wrapper } from "./partials";
import AnswerTrueOrFalse from "../answer-true-or-false.component";

test("if user did not choose any answer, the answer must not be true or false", () => {
  const { WrappedElement } = wrapper(<AnswerTrueOrFalse />, {
    answers: [],
    questionTypeId: 5,
  });
  renderWithAuthentication(WrappedElement);

  const correct = screen.getByRole("radio", { name: /true/i });
  const wrong = screen.getByRole("radio", { name: /false/i });
  expect(correct).not.toBeChecked();
  expect(wrong).not.toBeChecked();
});

test("if the initial answer is true, the true radio must be enabled", () => {
  const { WrappedElement } = wrapper(<AnswerTrueOrFalse />, {
    answers: [{ integer_part: 1 }],
    questionTypeId: 5,
  });
  renderWithAuthentication(WrappedElement);

  const correct = screen.getByRole("radio", { name: /true/i });
  const wrong = screen.getByRole("radio", { name: /false/i });
  expect(correct).toBeChecked();
  expect(wrong).not.toBeChecked();
});

test("if the initial answer is false, the false radio must be enabled", () => {
  const { WrappedElement } = wrapper(<AnswerTrueOrFalse />, {
    answers: [{ integer_part: 0 }],
    questionTypeId: 5,
  });
  renderWithAuthentication(WrappedElement);

  const correct = screen.getByRole("radio", { name: /true/i });
  const wrong = screen.getByRole("radio", { name: /false/i });
  expect(correct).not.toBeChecked();
  expect(wrong).toBeChecked();
});

test("if user change the answer to true, the changeAnswers must be called with appropriate input", () => {
  const { WrappedElement, value } = wrapper(<AnswerTrueOrFalse />, {
    answers: [{ integer_part: 0 }],
    questionTypeId: 5,
  });
  renderWithAuthentication(WrappedElement);

  const correct = screen.getByRole("radio", { name: /true/i });
  // const wrong = screen.getByRole("radio", { name: /false/i });

  userEvent.click(correct);

  expect(value.changeAnswers).toHaveBeenCalledTimes(1);
  expect(value.changeAnswers).toHaveBeenCalledWith([{ integer_part: 1 }]);
});

test("if user change the answer to false, the changeAnswers must be called with appropriate input", () => {
  const { WrappedElement, value } = wrapper(<AnswerTrueOrFalse />, {
    answers: [{ integer_part: 1 }],
    questionTypeId: 5,
  });
  renderWithAuthentication(WrappedElement);

  // const correct = screen.getByRole("radio", { name: /true/i });
  const wrong = screen.getByRole("radio", { name: /false/i });

  userEvent.click(wrong);

  expect(value.changeAnswers).toHaveBeenCalledTimes(1);
  expect(value.changeAnswers).toHaveBeenCalledWith([{ integer_part: 0 }]);
});

test("if initial answer is none of them and user click true, the changeAnswers must be called with appropriate input", () => {
  const { WrappedElement, value } = wrapper(<AnswerTrueOrFalse />, {
    answers: [],
    questionTypeId: 5,
  });
  renderWithAuthentication(WrappedElement);

  const correct = screen.getByRole("radio", { name: /true/i });
  // const wrong = screen.getByRole("radio", { name: /false/i });

  userEvent.click(correct);

  expect(value.changeAnswers).toHaveBeenCalledTimes(1);
  expect(value.changeAnswers).toHaveBeenCalledWith([{ integer_part: 1 }]);
});

test("if initial answer is none of them and user click false, the changeAnswers must be called with appropriate input", () => {
  const { WrappedElement, value } = wrapper(<AnswerTrueOrFalse />, {
    answers: [],
    questionTypeId: 5,
  });
  renderWithAuthentication(WrappedElement);

  // const correct = screen.getByRole("radio", { name: /true/i });
  const wrong = screen.getByRole("radio", { name: /false/i });

  userEvent.click(wrong);

  expect(value.changeAnswers).toHaveBeenCalledTimes(1);
  expect(value.changeAnswers).toHaveBeenCalledWith([{ integer_part: 0 }]);
});
