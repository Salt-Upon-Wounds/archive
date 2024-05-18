import {
  screen,
  renderWithAuthentication,
  waitForElementToBeRemoved,
  waitFor,
} from "../../../test-utils/testing-library-utils";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import EditQuestion from "../edit-question.component";

describe("check delete feature", () => {
  test("on clicking on delete question button, first of all a modal must be shown, if user confirm, a delete request must be sent and then deleteQuestion function must be called", async () => {
    const axiosDelete = jest.spyOn(axios, "delete");
    const deleteQuestion = jest.fn();
    renderWithAuthentication(
      <EditQuestion examId={1} questionId={1} deleteQuestion={deleteQuestion} />
    );

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const deleteButton = screen.getByRole("button", {
      name: /delete question/i,
    });
    userEvent.click(deleteButton);

    const confirmButton = await screen.findByRole("button", {
      name: /confirm/i,
    });
    userEvent.click(confirmButton);

    await waitFor(() => expect(axiosDelete).toHaveBeenCalledTimes(1));

    await waitFor(() => expect(deleteQuestion).toHaveBeenCalledTimes(1));
  });

  test("if question is readonly, user can not delete the question and the delete button must be disabled", async () => {
    const axiosDelete = jest.spyOn(axios, "delete");
    const deleteQuestion = jest.fn();
    renderWithAuthentication(
      <EditQuestion
        examId={1}
        readOnly={true}
        questionId={1}
        deleteQuestion={deleteQuestion}
      />
    );

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const deleteButton = screen.getByRole("button", {
      name: /delete question/i,
    });
    expect(deleteButton).toBeDisabled();
    userEvent.click(deleteButton);

    expect(
      screen.queryByRole("button", {
        name: /confirm/i,
      })
    ).not.toBeInTheDocument();

    expect(axiosDelete).toHaveBeenCalledTimes(0);

    expect(deleteQuestion).toHaveBeenCalledTimes(0);
  });
});
