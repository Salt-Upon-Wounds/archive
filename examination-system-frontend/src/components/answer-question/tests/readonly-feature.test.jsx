import {
  screen,
  waitFor,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import { wrapper } from "./partials";
import AnswerQuestion from "../answer-question.component";
import { randomString } from "../../../utilities/tests.utility";

test("check descriptive question", async () => {
  const { WrappedElement } = wrapper(<AnswerQuestion readOnly={true} />, {
    questionTypeId: 1,
  });
  renderWithAuthentication(WrappedElement);

  const textbox = screen.getByRole("textbox");
  expect(textbox).toHaveAttribute("readonly");
});

test("check fill the blank question", async () => {
  const { WrappedElement } = wrapper(<AnswerQuestion readOnly={true} />, {
    questionTypeId: 2,
  });
  renderWithAuthentication(WrappedElement);

  const textbox = screen.getByRole("textbox");
  expect(textbox).toHaveAttribute("readonly");
});

test("check multiple answers question", async () => {
  const { WrappedElement } = wrapper(<AnswerQuestion readOnly={true} />, {
    questionTypeId: 3,
  });
  renderWithAuthentication(WrappedElement);

  const checkboxes = screen.getAllByRole("checkbox");
  for (const checkbox of checkboxes) {
    expect(checkbox).toBeDisabled();
  }
});

test("check select the answer question", async () => {
  const { WrappedElement } = wrapper(<AnswerQuestion readOnly={true} />, {
    questionTypeId: 4,
  });
  renderWithAuthentication(WrappedElement);

  const radios = screen.getAllByRole("radio");
  for (const radio of radios) {
    expect(radio).toBeDisabled();
  }
});

test("check true or false question", async () => {
  const { WrappedElement } = wrapper(<AnswerQuestion readOnly={true} />, {
    questionTypeId: 5,
  });
  renderWithAuthentication(WrappedElement);

  const radios = screen.getAllByRole("radio");
  for (const radio of radios) {
    expect(radio).toBeDisabled();
  }
});

test("check ordering question", async () => {
  const { WrappedElement } = wrapper(<AnswerQuestion readOnly={true} />, {
    questionTypeId: 6,
  });
  renderWithAuthentication(WrappedElement);

  const buttons = screen.getAllByRole("button");
  for (const button of buttons) {
    expect(button).toBeDisabled();
  }
});

test("'all changes saved' must not be appeared if component is readonly", async () => {
  const { WrappedElement } = wrapper(<AnswerQuestion readOnly={true} />, {
    questionTypeId: 1,
  });
  renderWithAuthentication(WrappedElement);

  expect(screen.queryByText(/all changes saved/i)).not.toBeInTheDocument();
});
