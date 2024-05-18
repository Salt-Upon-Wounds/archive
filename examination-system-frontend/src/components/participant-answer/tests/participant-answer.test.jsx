import {
  waitFor,
  waitForElementToBeRemoved,
  screen,
  renderWithAuthentication,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import ParticipantAnswer from "../participant-answer.component";
import { showGrade } from "../../../mocks/mocks/grades.mock";
import { questionsShowId_1 } from "../../../mocks/mocks/questions.mock";

test("check readonly inputs for descriptive questions", async () => {
  renderWithAuthentication(
    <ParticipantAnswer
      participantStatus="FINISHED"
      examId={1}
      participantId={1}
      questionId={1}
      canUserChangeGrade={true}
    />
  );
  await waitForElementToBeRemoved(() => screen.getAllByText(/loading/i));

  await waitFor(() =>
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly")
  );
});

test("check readonly inputs for fill the blank questions", async () => {
  renderWithAuthentication(
    <ParticipantAnswer
      participantStatus="FINISHED"
      examId={1}
      participantId={1}
      questionId={2}
      canUserChangeGrade={true}
    />
  );
  await waitForElementToBeRemoved(() => screen.getAllByText(/loading/i));

  await waitFor(() =>
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly")
  );
});

test("check readonly inputs for multiple answer questions", async () => {
  renderWithAuthentication(
    <ParticipantAnswer
      participantStatus="FINISHED"
      examId={1}
      participantId={1}
      questionId={3}
      canUserChangeGrade={true}
    />
  );
  await waitForElementToBeRemoved(() => screen.getAllByText(/loading/i));

  const checkboxes = screen.getAllByRole("checkbox");
  for (const checkbox of checkboxes) {
    expect(checkbox).toBeDisabled();
  }
});

test("check readonly inputs for select the answer questions", async () => {
  renderWithAuthentication(
    <ParticipantAnswer
      participantStatus="FINISHED"
      examId={1}
      participantId={1}
      questionId={4}
      canUserChangeGrade={true}
    />
  );
  await waitForElementToBeRemoved(() => screen.getAllByText(/loading/i));

  const radios = screen.getAllByRole("radio");
  for (const radio of radios) {
    expect(radio).toBeDisabled();
  }
});

test("check readonly inputs for true or false questions", async () => {
  renderWithAuthentication(
    <ParticipantAnswer
      participantStatus="FINISHED"
      examId={1}
      participantId={1}
      questionId={5}
      canUserChangeGrade={true}
    />
  );
  await waitForElementToBeRemoved(() => screen.getAllByText(/loading/i));

  const radios = screen.getAllByRole("radio");
  for (const radio of radios) {
    expect(radio).toBeDisabled();
  }
});

test("check readonly inputs for ordering questions", async () => {
  renderWithAuthentication(
    <ParticipantAnswer
      participantStatus="FINISHED"
      examId={1}
      participantId={1}
      questionId={6}
      canUserChangeGrade={true}
    />
  );
  await waitForElementToBeRemoved(() => screen.getAllByText(/loading/i));

  const buttons = screen.getAllByRole("button");
  for (const button of buttons) {
    expect(button).toBeDisabled();
  }
});

test("user can see the grade, change it and save it", async () => {
  renderWithAuthentication(
    <ParticipantAnswer
      participantStatus="FINISHED"
      examId={1}
      participantId={1}
      questionId={6}
      canUserChangeGrade={true}
    />
  );

  expect(
    await screen.findByText(showGrade(1, 1).data.grade.grade, { exact: false })
  ).toBeInTheDocument();

  const newGrade = (showGrade(1, 1).data.grade.grade ===
  questionsShowId_1.data.question.question_score - 1
    ? questionsShowId_1.data.question.question_score - 2
    : questionsShowId_1.data.question.question_score - 1
  ).toString();

  const gradeInput = screen.getByRole("spinbutton", { name: /grade/i });
  userEvent.clear(gradeInput);
  userEvent.type(gradeInput, newGrade);

  const submitButton = await screen.findByRole("button", {
    name: /update grade/i,
  });
  userEvent.click(submitButton);

  await waitFor(() => expect(gradeInput).toHaveValue(null));
  expect(screen.getByText(newGrade, { exact: false })).toBeInTheDocument();
});
