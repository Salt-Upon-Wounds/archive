import {
  screen,
  renderWithAuthentication,
  waitFor,
  waitForElementToBeRemoved,
} from "../../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import UpdateExam from "../update-exam.page";
import programRoutes from "../../../../constants/program-routes.constant";
import { wrapper } from "./partials";

test("if exam is not published, user can click on the delete button of questions and the question must be removed", async () => {
  renderWithAuthentication(wrapper(<UpdateExam />), {
    route: programRoutes.updateExam(1),
  });

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

  const firstTextbox = (
    await screen.findAllByRole("textbox", {
      name: /question text/i,
    })
  )[0];
  const deleteQuestionButton = (
    await screen.findAllByRole("button", {
      name: /delete question/i,
    })
  )[0];

  userEvent.click(deleteQuestionButton);

  const confirmButton = await screen.findByRole("button", { name: /confirm/i });
  userEvent.click(confirmButton);

  await waitFor(() => expect(firstTextbox).not.toBeInTheDocument());
});
