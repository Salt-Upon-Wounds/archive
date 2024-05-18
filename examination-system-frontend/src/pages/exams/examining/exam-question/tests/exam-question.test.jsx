import {
  screen,
  waitFor,
  renderWithAuthentication,
} from "../../../../../test-utils/testing-library-utils";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import ExamQuestionPage from "../exam-question.page";
import { wrapper } from "./partials";
import programRoutes from "../../../../../constants/program-routes.constant";
import {
  indexDescriptive,
  indexFillTheBlank,
  indexMultipleAnswers,
  indexSelectTheAnswer,
  indexTrueOrFalse,
  indexOrdering,
} from "../../../../../mocks/mocks/answers.mock";
import { randomString, wait } from "../../../../../utilities/tests.utility";
import {
  statesIndexMultipleAnswer,
  statesIndexSelectTheAnswer,
  statesIndexOrdering,
} from "../../../../../mocks/mocks/states.mock";

describe("check isContextLoaded", () => {
  test("if isContextLoaded of examining context is false, loading message must be shown in the exam question page", () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      isContextLoaded: false,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 1),
    });

    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
  });
});

describe("check save feature", () => {
  test("check 'saving...' phrase must be shown to user when request is sending", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 1,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 1),
    });

    const textboxValue = randomString();
    const textbox = await screen.findByRole("textbox", {
      name: /answer of question/i,
    });
    userEvent.clear(textbox);
    userEvent.type(textbox, textboxValue);

    await waitFor(() => expect(textbox).toHaveValue(textboxValue));

    await waitFor(() =>
      expect(screen.getByText(/not saved/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/saving\.\.\./i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
    );
  });
});

describe("check descriptive questions", () => {
  test("the answers must be exist when component loaded", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 1),
    });

    const textbox = await screen.findByRole("textbox", {
      name: /answer of question/i,
    });
    await waitFor(() =>
      expect(textbox).toHaveValue(indexDescriptive.data.answers[0].text_part)
    );
  });

  test("user can create answer", async () => {
    const axiosPost = jest.spyOn(axios, "post");
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 1,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 1),
    });

    const textboxValue = randomString();
    const textbox = await screen.findByRole("textbox", {
      name: /answer of question/i,
    });
    expect(textbox).toHaveValue("");

    userEvent.clear(textbox);
    userEvent.type(textbox, textboxValue);

    await waitFor(() => expect(textbox).toHaveValue(textboxValue));

    await waitFor(() =>
      expect(screen.getByText(/not saved/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
    );

    await waitFor(() => expect(axiosPost).toHaveBeenCalledTimes(1));
  });

  test("user can change answer", async () => {
    const axiosDelete = jest.spyOn(axios, "delete");
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 1),
    });

    const textboxValue = randomString();
    const textbox = await screen.findByRole("textbox", {
      name: /answer of question/i,
    });
    expect(textbox).not.toHaveValue("");

    userEvent.clear(textbox);
    userEvent.type(textbox, textboxValue);

    await waitFor(() => expect(textbox).toHaveValue(textboxValue));

    await waitFor(() =>
      expect(screen.getByText(/not saved/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
    );
    expect(textbox).toHaveValue(textboxValue);

    await waitFor(() => expect(axiosDelete).toHaveBeenCalledTimes(1));
  });
});

describe("check fill the blank questions", () => {
  test("the answers of the question must be loaded when component loaded", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 2),
    });

    const textbox = await screen.findByRole("textbox", {
      name: /answer of question/i,
    });
    await waitFor(() =>
      expect(textbox).toHaveValue(indexFillTheBlank.data.answers[0].text_part)
    );
  });

  test("user can create answer if the question does not have any answer", async () => {
    const axiosPost = jest.spyOn(axios, "post");
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 1,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 2),
    });

    const textboxValue = randomString();
    const textbox = await screen.findByRole("textbox", {
      name: /answer of question/i,
    });
    expect(textbox).toHaveValue("");

    userEvent.clear(textbox);
    userEvent.type(textbox, textboxValue);

    await waitFor(() => expect(textbox).toHaveValue(textboxValue));

    await waitFor(() =>
      expect(screen.getByText(/not saved/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
    );

    await waitFor(() => expect(axiosPost).toHaveBeenCalledTimes(1));
  });

  test("user can change answer if the question has answer", async () => {
    const axiosDelete = jest.spyOn(axios, "delete");
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 2),
    });

    const textboxValue = randomString();
    const textbox = await screen.findByRole("textbox", {
      name: /answer of question/i,
    });
    expect(textbox).not.toHaveValue("");

    userEvent.clear(textbox);
    userEvent.type(textbox, textboxValue);

    await waitFor(() => expect(textbox).toHaveValue(textboxValue));

    await waitFor(() =>
      expect(screen.getByText(/not saved/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
    );

    await waitFor(() => expect(axiosDelete).toHaveBeenCalledTimes(1));
  });
});

describe("check multiple answers questions", () => {
  test("if the question has answer, the answers must be loaded correctly", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 3),
    });

    const checkboxes = await screen.findAllByRole("checkbox");

    const answers = indexMultipleAnswers.data.answers.map((answer) =>
      Number(answer.integer_part)
    );
    const states = statesIndexMultipleAnswer.data.states;
    const checked = [],
      unchecked = [];
    for (let i = 0; i < states.length; i++) {
      if (answers.includes(Number(states[i].state_id))) {
        checked.push(i);
      } else {
        unchecked.push(i);
      }
    }

    for (const current of checked) {
      expect(checkboxes[current]).toBeChecked();
    }
    for (const current of unchecked) {
      expect(checkboxes[current]).not.toBeChecked();
    }
  });

  test("if the question has no answer, user can create answers", async () => {
    const axiosPost = jest.spyOn(axios, "post");
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 1,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 3),
    });

    const checkboxes = await screen.findAllByRole("checkbox");

    userEvent.click(checkboxes[0]);
    userEvent.click(checkboxes[1]);

    await waitFor(() =>
      expect(screen.getByText(/not saved/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
    );

    await waitFor(() => expect(axiosPost).toHaveBeenCalledTimes(2));

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    for (let i = 2; i < checkboxes.length; i++) {
      expect(checkboxes[i]).not.toBeChecked();
    }
  });

  test("if the question has answer, user can change the answers", async () => {
    const axiosDelete = jest.spyOn(axios, "delete");
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 3),
    });

    const checkboxes = await screen.findAllByRole("checkbox");

    userEvent.click(checkboxes[0]);
    userEvent.click(checkboxes[1]);

    await waitFor(() =>
      expect(screen.getByText(/not saved/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
    );

    // first one must not be changed, just third one must be deleted
    await waitFor(() => expect(axiosDelete).toHaveBeenCalledTimes(1));

    const checked = [],
      unchecked = [];
    const answers = indexMultipleAnswers.data.answers.map((answer) =>
      Number(answer.integer_part)
    );
    const states = statesIndexMultipleAnswer.data.states;
    if (answers.includes(Number(states[0].state_id))) {
      unchecked.push(0);
    } else {
      checked.push(0);
    }

    if (answers.includes(Number(states[1].state_id))) {
      unchecked.push(1);
    } else {
      checked.push(1);
    }

    for (let i = 2; i < states.length; i++) {
      if (answers.includes(Number(states[i].state_id))) {
        checked.push(i);
      } else {
        unchecked.push(i);
      }
    }

    for (const current of checked) {
      expect(checkboxes[current]).toBeChecked();
    }
    for (const current of unchecked) {
      expect(checkboxes[current]).not.toBeChecked();
    }
  });
});

describe("check select the answer questions", () => {
  test("if question has answer, the answer must be checked when component loaded", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 4),
    });

    const states = statesIndexSelectTheAnswer.data.states;
    const answer = Number(indexSelectTheAnswer.data.answers[0].integer_part);

    const checked = states.findIndex(
      (state) => Number(state.state_id) === answer
    );

    const radios = await screen.findAllByRole("radio");

    expect(radios[checked]).toBeChecked();
    for (let i = 0; i < radios.length; i++) {
      if (i === checked) continue;
      expect(radios[i]).not.toBeChecked();
    }
  });

  test("if question has no answer, user can create new answer", async () => {
    const axiosPost = jest.spyOn(axios, "post");
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 1,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 4),
    });

    const radios = await screen.findAllByRole("radio");
    for (const radio of radios) {
      expect(radio).not.toBeChecked();
    }

    userEvent.click(radios[1]);
    const checked = 1;

    await waitFor(() =>
      expect(screen.getByText(/not saved/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
    );

    expect(radios[checked]).toBeChecked();
    for (let i = 0; i < radios.length; i++) {
      if (i === checked) continue;
      expect(radios[i]).not.toBeChecked();
    }

    await waitFor(() => expect(axiosPost).toHaveBeenCalledTimes(1));
  });

  test("if question has answer, user can change the answer", async () => {
    const axiosDelete = jest.spyOn(axios, "delete");
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 4),
    });

    const radios = await screen.findAllByRole("radio");

    const states = statesIndexSelectTheAnswer.data.states;
    let checked;
    if (Number(states[0].integer_part) === 1) {
      userEvent.click(radios[1]);
      checked = 1;
    } else {
      userEvent.click(radios[0]);
      checked = 0;
    }

    await waitFor(() =>
      expect(screen.getByText(/not saved/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
    );

    expect(radios[checked]).toBeChecked();
    for (let i = 0; i < radios.length; i++) {
      if (i === checked) continue;
      expect(radios[i]).not.toBeChecked();
    }

    await waitFor(() => expect(axiosDelete).toHaveBeenCalledTimes(1));
  });
});

describe("check true or false question", () => {
  test("if the question is not answered, none of the radios must be checked", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 1,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 5),
    });

    const radios = await screen.findAllByRole("radio");
    for (const radio of radios) {
      expect(radio).not.toBeChecked();
    }
  });
  test("if the question is answered, that radio must be checked", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 5),
    });

    const answer = Boolean(indexTrueOrFalse.data.answers[0].integer_part);

    const checked = answer ? 0 : 1;

    const radios = await screen.findAllByRole("radio");
    expect(radios[checked]).toBeChecked();
    expect(radios[1 - checked]).not.toBeChecked();
  });
  test("if the question is not answered, user can create an answer", async () => {
    const axiosPost = jest.spyOn(axios, "post");
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 1,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 5),
    });

    const radios = await screen.findAllByRole("radio");
    userEvent.click(radios[0]);

    await waitFor(() =>
      expect(screen.getByText(/not saved/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
    );

    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();

    await waitFor(() => expect(axiosPost).toHaveBeenCalledTimes(1));
  });
  test("if the question is answered, user can change the answer", async () => {
    const axiosDelete = jest.spyOn(axios, "delete");
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 5),
    });

    const answer = Boolean(indexTrueOrFalse.data.answers[0].integer_part);

    const checked = answer ? 0 : 1;

    const radios = await screen.findAllByRole("radio");
    expect(radios[checked]).toBeChecked();
    expect(radios[1 - checked]).not.toBeChecked();

    userEvent.click(radios[1 - checked]);

    await waitFor(() =>
      expect(screen.getByText(/not saved/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/all changes saved/i)).toBeInTheDocument()
    );

    expect(radios[checked]).not.toBeChecked();
    expect(radios[1 - checked]).toBeChecked();

    await waitFor(() => expect(axiosDelete).toHaveBeenCalledTimes(1));
  });
});

describe("check ordering questions", () => {
  test("if the question is not answered, user can change the order of states", async () => {
    const axiosPost = jest.spyOn(axios, "post");
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 1,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 6),
    });

    const upButtons = await screen.findAllByRole("button", { name: /up/i });
    const lastUpButton = upButtons[upButtons.length - 1];

    userEvent.click(lastUpButton);

    await waitFor(() =>
      expect(screen.getByText(/not saved/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    );

    expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(axiosPost).toHaveBeenCalledTimes(upButtons.length)
    );
  });
  test("if the question is answered, user can change the order of states", async () => {
    const axiosDelete = jest.spyOn(axios, "delete");
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 6),
    });

    const upButtons = await screen.findAllByRole("button", { name: /up/i });
    const lastUpButton = upButtons[upButtons.length - 1];

    userEvent.click(lastUpButton);

    await waitFor(() =>
      expect(screen.getByText(/not saved/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    );

    expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();

    await waitFor(() => expect(axiosDelete).toHaveBeenCalledTimes(1));
  });
});

describe("check next question button", () => {
  test("if nextQuestion is -1, the next question button must be disabled and if user clicks on that, nothing must be happened", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
      nextQuestion: -1,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 1),
    });

    const nextQuestionButton = await screen.findByRole("link", {
      name: /next/i,
    });

    userEvent.click(nextQuestionButton);
    expect(
      window.location.href.endsWith(programRoutes.examiningQuestion(1, 1))
    ).toBe(true);
  });
  test("if nextQuestion is not -1, the next question must be a link to the next question", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
      nextQuestion: 2,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 1),
    });

    const nextQuestionButton = await screen.findByRole("link", {
      name: /next/i,
    });
    expect(nextQuestionButton).toBeEnabled();

    userEvent.click(nextQuestionButton);

    await waitFor(() =>
      expect(
        window.location.href.endsWith(programRoutes.examiningQuestion(1, 2))
      ).toBe(true)
    );
  });
});

describe("check prev question button", () => {
  test("if prevQuestion is -1, the prev question button must be disabled", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
      prevQuestion: -1,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 1),
    });

    const prevButton = await screen.findByRole("link", { name: /prev/i });

    userEvent.click(prevButton);
    expect(
      window.location.href.endsWith(programRoutes.examiningQuestion(1, 1))
    ).toBe(true);
  });
  test("if prevQuestion is not -1, the prev question must be a link to the prev question", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
      prevQuestion: 1,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 2),
    });

    const prevButton = await screen.findByRole("link", { name: /prev/i });
    expect(prevButton).toBeEnabled();

    userEvent.click(prevButton);

    await waitFor(() =>
      expect(
        window.location.href.endsWith(programRoutes.examiningQuestion(1, 1))
      ).toBe(true)
    );
  });
});

describe("check the time of the exam", () => {
  test("if exam is not started, user must be redirected to the overview", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
      prevQuestion: 1,
      examTime: {
        examTimeDuration: { seconds: 10, minutes: 10, hours: 10, days: 0 },
        isExamStarted: false,
        isExamFinished: false,
        seconds: 1,
        minutes: 1,
        hours: 1,
        days: 0,
      },
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 2),
    });

    await waitFor(() =>
      expect(
        window.location.href.endsWith(programRoutes.examiningOverview(1))
      ).toBe(true)
    );
  });
  test("if exam is ended, user must be redirected to the overview", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
      prevQuestion: 1,
      examTime: {
        examTimeDuration: { seconds: 10, minutes: 10, hours: 10, days: 0 },
        isExamStarted: true,
        isExamFinished: true,
        seconds: 1,
        minutes: 1,
        hours: 1,
        days: 0,
      },
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 2),
    });

    await waitFor(() =>
      expect(
        window.location.href.endsWith(programRoutes.examiningOverview(1))
      ).toBe(true)
    );
  });
  test("if user is not registered and exam is started, user must be redirected to the overview", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 0,
      prevQuestion: 1,
      examTime: {
        examTimeDuration: { seconds: 10, minutes: 10, hours: 10, days: 0 },
        isExamStarted: true,
        isExamFinished: false,
        seconds: 1,
        minutes: 1,
        hours: 1,
        days: 0,
      },
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 2),
    });

    await waitFor(() =>
      expect(
        window.location.href.endsWith(programRoutes.examiningOverview(1))
      ).toBe(true)
    );
  });
  test("if exam is started, the remaining time must be shown in the page", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
      prevQuestion: 1,
      examTime: {
        examTimeDuration: { seconds: 10, minutes: 10, hours: 10, days: 0 },
        isExamStarted: true,
        isExamFinished: false,
        seconds: 10,
        minutes: 10,
        hours: 10,
        days: 0,
      },
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 2),
    });

    await waitFor(() =>
      expect(
        screen.getByText(`0:10:10:10`, { exact: false })
      ).toBeInTheDocument()
    );
  });
});

describe("check finishing exam", () => {
  test("if user clicks on finish exam button, a modal must be shown and if user click again on the button, the finishExam func must be called", async () => {
    const { WrappedElement, value } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 2),
    });

    const finishExamButton = await screen.findByRole("button", {
      name: /finish exam/i,
    });
    userEvent.click(finishExamButton);

    const confirmFinishExam = await screen.findByRole("button", {
      name: /yes, finish exam/i,
    });
    userEvent.click(confirmFinishExam);

    await waitFor(() => expect(value.finishExam).toHaveBeenCalledTimes(1));
  });

  test("if isUserFinishedExam is true, user must be redirected to the overview", async () => {
    const { WrappedElement } = wrapper(<ExamQuestionPage />, {
      participantId: 2,
      isUserFinishedExam: true,
    });
    renderWithAuthentication(WrappedElement, {
      route: programRoutes.examiningQuestion(1, 2),
    });

    await waitFor(() =>
      expect(
        window.location.href.endsWith(programRoutes.examiningOverview(1))
      ).toBe(true)
    );
  });
});
