import {
  screen,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import { wrapper } from "./partials";
import AnswerSelectTheAnswer from "../answer-select-the-answer.component";

test("the answer must be checked if we have initial answer", () => {
  const { WrappedElement, value } = wrapper(<AnswerSelectTheAnswer />, {
    answers: [{ integer_part: 2 }],
    questionTypeId: 4,
  });
  renderWithAuthentication(WrappedElement);

  const { states, answers } = value;

  const radios = screen.getAllByRole("radio");
  expect(radios).toHaveLength(states.length);

  for (let i = 0; i < states.length; i++) {
    const answer = answers.find(
      (answer) => Number(answer.integer_part) === Number(states[i].state_id)
    );
    expect(radios[i].checked).toBe(Boolean(answer !== undefined));
  }
});

test("none of the radios must be checked if we did not have initial answers", () => {
  const { WrappedElement, value } = wrapper(<AnswerSelectTheAnswer />, {
    answers: [],
    questionTypeId: 4,
  });
  renderWithAuthentication(WrappedElement);

  const radios = screen.getAllByRole("radio");

  const { states } = value;

  expect(radios).toHaveLength(states.length);

  for (let i = 0; i < radios.length; i++) {
    expect(radios[i]).not.toBeChecked();
  }
});

test("if user check another radio, changeAnswers must be called with appropriate inputs", () => {
  const { WrappedElement, value } = wrapper(<AnswerSelectTheAnswer />, {
    answers: [{ integer_part: 2 }],
    questionTypeId: 4,
  });
  renderWithAuthentication(WrappedElement);

  const { states } = value;

  const radios = screen.getAllByRole("radio");
  expect(radios).toHaveLength(states.length);

  userEvent.click(radios[0]);

  expect(value.changeAnswers).toHaveBeenCalledTimes(1);
  expect(value.changeAnswers).toHaveBeenCalledWith([{ integer_part: 1 }]);
});
