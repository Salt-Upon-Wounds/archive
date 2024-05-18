import {
  screen,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import { wrapper } from "./partials";
import AnswerOrdering from "../answer-ordering.component";
import { randomString } from "../../../utilities/tests.utility";

const getRandomStates = () => {
  return [
    { state_id: 1, text_part: randomString() },
    { state_id: 2, text_part: randomString() },
    { state_id: 3, text_part: randomString() },
    { state_id: 4, text_part: randomString() },
  ];
};

test("if there is not any answer, the states must be in order of states", () => {
  const { WrappedElement, value } = wrapper(<AnswerOrdering />, {
    answers: [],
    states: getRandomStates(),
    questionTypeId: 6,
  });
  renderWithAuthentication(WrappedElement);

  const { states } = value;

  const items = screen.getAllByRole("listitem");
  expect(items).toHaveLength(states.length);

  for (let i = 0; i < states.length; i++) {
    expect(items[i]).toHaveTextContent(states[i].text_part);
  }
});

test("if there are answers, the states must be in order of answers", () => {
  const { WrappedElement, value } = wrapper(<AnswerOrdering />, {
    answers: [
      { integer_part: 2 },
      { integer_part: 1 },
      { integer_part: 4 },
      { integer_part: 3 },
    ],
    states: getRandomStates(),
    questionTypeId: 6,
  });
  renderWithAuthentication(WrappedElement);

  const { states, answers } = value;

  const items = screen.getAllByRole("listitem");
  expect(items).toHaveLength(states.length);

  for (let i = 0; i < items.length; i++) {
    const state = states.find(
      (state) => state.state_id === answers[i].integer_part
    );
    expect(items[i]).toHaveTextContent(state.text_part);
  }
});

test("the up botton of first element and down button of last element must be disabled", () => {
  const { WrappedElement, value } = wrapper(<AnswerOrdering />, {
    answers: [],
    states: getRandomStates(),
    questionTypeId: 6,
  });
  renderWithAuthentication(WrappedElement);

  const { states } = value;

  const upButtons = screen.getAllByRole("button", { name: /up/i });
  expect(upButtons).toHaveLength(states.length);
  expect(upButtons[0]).toBeDisabled();
  for (let i = 1; i < upButtons.length; i++) {
    expect(upButtons[i]).toBeEnabled();
  }

  const downButtons = screen.getAllByRole("button", { name: /down/i });
  expect(downButtons).toHaveLength(states.length);
  expect(downButtons[downButtons.length - 1]).toBeDisabled();
  for (let i = 0; i < downButtons.length - 1; i++) {
    expect(downButtons[i]).toBeEnabled();
  }
});

test("if user click on up button of an element, it must go up and reset the answers", () => {
  const { WrappedElement, value } = wrapper(<AnswerOrdering />, {
    answers: [],
    states: getRandomStates(),
    questionTypeId: 6,
  });
  renderWithAuthentication(WrappedElement);

  const { states } = value;

  const items = screen.getAllByRole("listitem");
  expect(items).toHaveLength(states.length);

  const upButtons = screen.getAllByRole("button", { name: /up/i });
  const upButton = upButtons[1];
  userEvent.click(upButton);

  expect(value.changeAnswers).toHaveBeenCalledTimes(1);
  expect(value.changeAnswers).toHaveBeenCalledWith([
    { integer_part: 2 },
    { integer_part: 1 },
    { integer_part: 3 },
    { integer_part: 4 },
  ]);
});

test("if user click on down button of an element, it must go down and reset the answers", () => {
  const { WrappedElement, value } = wrapper(<AnswerOrdering />, {
    answers: [],
    states: getRandomStates(),
    questionTypeId: 6,
  });
  renderWithAuthentication(WrappedElement);

  const { states } = value;

  const items = screen.getAllByRole("listitem");
  expect(items).toHaveLength(states.length);

  const downButtons = screen.getAllByRole("button", { name: /down/i });
  const downButton = downButtons[1];
  userEvent.click(downButton);

  expect(value.changeAnswers).toHaveBeenCalledTimes(1);
  expect(value.changeAnswers).toHaveBeenCalledWith([
    { integer_part: 1 },
    { integer_part: 3 },
    { integer_part: 2 },
    { integer_part: 4 },
  ]);
});
