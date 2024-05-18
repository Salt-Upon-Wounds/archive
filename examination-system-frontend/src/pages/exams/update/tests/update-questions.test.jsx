import {
  screen,
  renderWithAuthentication,
  waitFor,
} from "../../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import UpdateExam from "../update-exam.page";
import { wait } from "../../../../utilities/tests.utility";
import programRoutes from "../../../../constants/program-routes.constant";
import { wrapper } from "./partials";
import { questionsIndex } from "../../../../mocks/mocks/questions.mock";

const numberOfQuestions = questionsIndex.data.questions.length;

test("user will see all the created questions in update page", async () => {
  renderWithAuthentication(wrapper(<UpdateExam />), {
    route: programRoutes.updateExam(1),
  });
  await wait(300);

  expect(screen.getAllByText(/question type/i)).toHaveLength(numberOfQuestions);
});

test("user can change and update the question if it is not published", async () => {
  renderWithAuthentication(wrapper(<UpdateExam />), {
    route: programRoutes.updateExam(1),
  });
  await wait(300);

  const newValue = "new new new value";
  const firstQuestionTextInput = screen.getAllByRole("textbox", {
    name: /question text/i,
  })[0];
  userEvent.clear(firstQuestionTextInput);
  userEvent.type(firstQuestionTextInput, newValue);

  const saveChangesButton = screen.getByRole("button", {
    name: /save changes/i,
  });
  userEvent.click(saveChangesButton);
  await waitFor(() =>
    expect(
      screen.queryByRole("button", { name: /save changes/i })
    ).not.toBeInTheDocument()
  );
});

test("user can not change the question if it is published", async () => {
  renderWithAuthentication(wrapper(<UpdateExam />), {
    route: programRoutes.updateExam(2),
  });
  await wait(300);

  const newValue = "new new new value";
  const firstQuestionTextInput = screen.getAllByRole("textbox", {
    name: /question text/i,
  })[0];
  userEvent.clear(firstQuestionTextInput);
  userEvent.type(firstQuestionTextInput, newValue);

  expect(firstQuestionTextInput).not.toHaveValue(newValue);
});

test("there must not be more than 2 radio buttons with similar name", async () => {
  renderWithAuthentication(wrapper(<UpdateExam />), {
    route: programRoutes.updateExam(1),
  });
  await wait(300);

  const radios = screen.getAllByRole("radio");

  for (let i = 0; i < radios.length; i += 2) {
    for (let j = i + 2; j < radios.length; j++) {
      expect(radios[i].name).not.toBe(radios[j].name);
    }
  }
});
