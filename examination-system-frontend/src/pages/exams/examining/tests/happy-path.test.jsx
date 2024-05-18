import {
  waitFor,
  renderWithAuthentication,
  screen,
} from "../../../../test-utils/testing-library-utils";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import {
  asignExamShowStartAndEnd,
  changeCurrentParticipant,
  randomString,
  wait,
} from "../../../../utilities/tests.utility";
import ExamRouter from "../../exams.router";
import programRoutes from "../../../../constants/program-routes.constant";

test("authenticated user can register in started exam, solve the questions and then finish the exam", async () => {
  // render examining router
  const handler = asignExamShowStartAndEnd(
    1,
    new Date(Date.now() - 5000),
    new Date(Date.now() + 3600 * 1000)
  );
  changeCurrentParticipant({ participantId: 4, otherHandlers: [handler] });
  const redirectIfNotAuthenticated = (ui) => ui;
  renderWithAuthentication(<ExamRouter />, {
    route: programRoutes.examiningOverview(1),
    authenticationProviderProps: { redirectIfNotAuthenticated },
  });

  // register to exam
  const registerButton = await screen.findByRole("button", {
    name: /register/i,
  });
  userEvent.click(registerButton);

  // go into the exam
  const enterButton = await screen.findByRole("button", {
    name: /go to exam/i,
  });
  userEvent.click(enterButton);

  // solve descriptive question
  const descriptiveAnswer = randomString(100);

  await waitFor(() =>
    expect(
      window.location.href.endsWith(programRoutes.examiningQuestion(1, 1))
    ).toBe(true)
  );

  const answerTextbox = await screen.findByRole("textbox", { name: /answer/i });
  userEvent.clear(answerTextbox);
  userEvent.type(answerTextbox, descriptiveAnswer);

  await waitFor(() =>
    expect(screen.getByText(/not saved/i)).toBeInTheDocument()
  );

  await waitFor(() => expect(screen.getByText(/saving/i)).toBeInTheDocument());

  await waitFor(() =>
    expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
  );

  // go to fill the blank
  const nextButtonFromDescriptive = screen.getByRole("button", {
    name: /next/i,
  });
  userEvent.click(nextButtonFromDescriptive);

  // solve fill the blank question
  const fillTheBlankAnswer = randomString();

  await waitFor(() =>
    expect(
      window.location.href.endsWith(programRoutes.examiningQuestion(1, 2))
    ).toBe(true)
  );

  await wait(100);
  const answerField = await screen.findByRole("textbox", { name: /answer/i });
  userEvent.clear(answerField);
  userEvent.type(answerField, fillTheBlankAnswer);

  await waitFor(() =>
    expect(screen.getByText(/not saved/i)).toBeInTheDocument()
  );

  await waitFor(() => expect(screen.getByText(/saving/i)).toBeInTheDocument());

  await waitFor(() =>
    expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
  );

  // go to multiple answers
  const nextButtonFromFillTheBlank = screen.getByRole("button", {
    name: /next/i,
  });
  userEvent.click(nextButtonFromFillTheBlank);

  // solve multiple answers question
  const chosenAnswersMA = [1, 2];

  await waitFor(() =>
    expect(
      window.location.href.endsWith(programRoutes.examiningQuestion(1, 3))
    ).toBe(true)
  );

  const checkboxes = await screen.findAllByRole("checkbox");
  for (const current of chosenAnswersMA) {
    userEvent.click(checkboxes[current]);
  }

  await waitFor(() =>
    expect(screen.getByText(/not saved/i)).toBeInTheDocument()
  );

  await waitFor(() => expect(screen.getByText(/saving/i)).toBeInTheDocument());

  await waitFor(() =>
    expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
  );

  // go to select the answer
  const nextButtonFromMA = screen.getByRole("button", { name: /next/i });
  userEvent.click(nextButtonFromMA);

  // solve select the answer question
  const checkedAnswerSTA = 1;

  await waitFor(() =>
    expect(
      window.location.href.endsWith(programRoutes.examiningQuestion(1, 4))
    ).toBe(true)
  );

  const radios = await screen.findAllByRole("radio");
  userEvent.click(radios[checkedAnswerSTA]);

  await waitFor(() =>
    expect(screen.getByText(/not saved/i)).toBeInTheDocument()
  );

  await waitFor(() => expect(screen.getByText(/saving/i)).toBeInTheDocument());

  await waitFor(() =>
    expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
  );

  // go to true or false
  const nextButtonFromSTA = screen.getByRole("button", { name: /next/i });
  userEvent.click(nextButtonFromSTA);

  // solve true or false question
  const trueOrFalseAnswer = Math.floor(Math.random() * 2);

  await waitFor(() =>
    expect(
      window.location.href.endsWith(programRoutes.examiningQuestion(1, 5))
    ).toBe(true)
  );

  const trueAnswer = await screen.findByRole("radio", { name: /true/i });
  const falseAnswer = await screen.findByRole("radio", { name: /false/i });
  if (trueOrFalseAnswer === 1) {
    userEvent.click(trueAnswer);
  } else {
    userEvent.click(falseAnswer);
  }

  await waitFor(() =>
    expect(screen.getByText(/not saved/i)).toBeInTheDocument()
  );

  await waitFor(() => expect(screen.getByText(/saving/i)).toBeInTheDocument());

  await waitFor(() =>
    expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
  );

  // go to ordering
  const nextButtonFromTOR = screen.getByRole("button", { name: /next/i });
  userEvent.click(nextButtonFromTOR);

  // solve ordering question
  await waitFor(() =>
    expect(
      window.location.href.endsWith(programRoutes.examiningQuestion(1, 6))
    ).toBe(true)
  );

  const firstDownButton = (
    await screen.findAllByRole("button", { name: /down/i })
  )[0];
  userEvent.click(firstDownButton);

  await waitFor(() =>
    expect(screen.getByText(/not saved/i)).toBeInTheDocument()
  );

  await waitFor(() => expect(screen.getByText(/saving/i)).toBeInTheDocument());

  await waitFor(() =>
    expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
  );

  // finish the exam
  changeCurrentParticipant({ participantId: 1, otherHandlers: [handler] });
  const axiosGet = jest.spyOn(axios, "get");
  const finishExamButton = await screen.findByRole("button", {
    name: /finish exam/i,
  });
  userEvent.click(finishExamButton);

  const confirmButton = await screen.findByRole("button", { name: /yes/i });
  userEvent.click(confirmButton);

  await waitFor(() =>
    expect(
      window.location.href.endsWith(programRoutes.examiningOverview(1))
    ).toBe(true)
  );
  await waitFor(() => expect(axiosGet).toHaveBeenCalledTimes(1));

  expect(
    screen.queryByRole("button", { name: /go to exam/i })
  ).not.toBeInTheDocument();
});
