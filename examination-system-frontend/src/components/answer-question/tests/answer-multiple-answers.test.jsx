import {
  screen,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import { wrapper } from "./partials";
import AnswerMultipleAnswers from "../answer-multiple-answers.component";

test("the given answers must be checked at first", () => {
  const { WrappedElement, value } = wrapper(<AnswerMultipleAnswers />, {
    answers: [{ integer_part: 1 }, { integer_part: 2 }],
    questionTypeId: 3,
  });
  renderWithAuthentication(WrappedElement);

  const checkboxes = screen.getAllByRole("checkbox");

  const { states, answers } = value;

  for (let i = 0; i < states.length; i++) {
    const answer = answers.find(
      (answer) => Number(answer.integer_part) === Number(states[i].state_id)
    );
    expect(checkboxes[i].checked).toBe(Boolean(answer !== undefined));
  }
});

test("user can check an unchecked option and it must call the changeAnswers correctly", () => {
  const { WrappedElement, value } = wrapper(<AnswerMultipleAnswers />, {
    answers: [{ integer_part: 1 }, { integer_part: 2 }],
    questionTypeId: 3,
  });
  renderWithAuthentication(WrappedElement);

  const checkboxes = screen.getAllByRole("checkbox");

  const { changeAnswers, answers } = value;

  userEvent.click(checkboxes[2]);

  expect(changeAnswers).toHaveBeenCalledTimes(1);
  expect(changeAnswers).toHaveBeenCalledWith([...answers, { integer_part: 3 }]);
});

test("user can uncheck an checked option and it must call the changeAnswers correctly", () => {
  const { WrappedElement, value } = wrapper(<AnswerMultipleAnswers />, {
    answers: [{ integer_part: 1 }, { integer_part: 2 }],
    questionTypeId: 3,
  });
  renderWithAuthentication(WrappedElement);

  const checkboxes = screen.getAllByRole("checkbox");

  const { changeAnswers, answers } = value;

  userEvent.click(checkboxes[0]);

  expect(changeAnswers).toHaveBeenCalledTimes(1);
  expect(changeAnswers).toHaveBeenCalledWith(
    answers.filter((answer) => answer.integer_part !== 1)
  );
});
