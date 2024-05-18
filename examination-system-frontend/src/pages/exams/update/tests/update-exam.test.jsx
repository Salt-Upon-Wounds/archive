import {
  screen,
  renderWithAuthentication,
  waitForElementToBeRemoved,
} from "../../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import UpdateExamForm from "../update-exam-form.component";
import { convertFromUTC } from "../../../../utilities/dateAndTime.utility";
import { wait } from "../../../../utilities/tests.utility";
import { examShowId_1 } from "../../../../mocks/mocks/exams.mock";
import { wrapper } from "./partials";
import programRoutes from "../../../../constants/program-routes.constant";

test("user will see the current values of exam in inputs after the loading", async () => {
  renderWithAuthentication(wrapper(<UpdateExamForm examId={1} />), {
    route: programRoutes.updateExam(1),
  });

  const loadingMessage = screen.getByText(/loading/i);
  expect(loadingMessage).toBeInTheDocument();

  const examNameField = await screen.findByRole("textbox", {
    name: /exam name/i,
  });
  expect(examNameField).toHaveValue(examShowId_1.data.exam.exam_name);

  // const examDescriptionField = screen.getByRole("textbox", {
  //   name: /exam description/i,
  // });
  // expect(examDescriptionField).toHaveValue(
  //   examShowId_1.data.exam.exam_description
  // );

  const examNeedsConfirmation = screen.getByRole("checkbox", {
    name: /confirmation required/i,
  });
  expect(examNeedsConfirmation).not.toBeChecked();

  const examStartTimeField = screen.getByRole("textbox", {
    name: /exam's start/i,
  });
  expect(examStartTimeField).toHaveValue(
    convertFromUTC(examShowId_1.data.exam.start_of_exam)
  );

  const examEndTimeField = screen.getByRole("textbox", { name: /exam's end/i });
  expect(examEndTimeField).toHaveValue(
    convertFromUTC(examShowId_1.data.exam.end_of_exam)
  );

  const totalScoreField = screen.getByRole("spinbutton", {
    name: /total score/i,
  });
  expect(totalScoreField).toHaveValue(examShowId_1.data.exam.total_score);
});

test("the inputs must be read only if exam published", async () => {
  renderWithAuthentication(wrapper(<UpdateExamForm examId={2} />), {
    route: programRoutes.updateExam(2),
  });

  const loadingMessage = screen.getByText(/loading/i);
  expect(loadingMessage).toBeInTheDocument();

  const examNameField = await screen.findByRole("textbox", {
    name: /exam name/i,
  });
  expect(examNameField).toHaveAttribute("readonly");
  // const examDescriptionField = screen.getByRole("textbox", {
  //   name: /exam description/i,
  // });
  // expect(examDescriptionField).toHaveValue(
  //   examShowId_1.data.exam.exam_description
  // );

  const examNeedsConfirmation = screen.getByRole("checkbox", {
    name: /confirmation required/i,
  });
  expect(examNeedsConfirmation).toBeDisabled();

  const examStartTimeField = screen.getByRole("textbox", {
    name: /exam's start/i,
  });
  expect(examStartTimeField).toHaveAttribute("readonly");

  const examEndTimeField = screen.getByRole("textbox", { name: /exam's end/i });
  expect(examEndTimeField).toHaveAttribute("readonly");

  const totalScoreField = screen.getByRole("spinbutton", {
    name: /total score/i,
  });
  expect(totalScoreField).toHaveAttribute("readonly");
});

test("the inputs must not be read only if exam did not publish", async () => {
  renderWithAuthentication(wrapper(<UpdateExamForm examId={1} />), {
    route: programRoutes.updateExam(1),
  });

  const loadingMessage = screen.getByText(/loading/i);
  expect(loadingMessage).toBeInTheDocument();

  const examNameField = await screen.findByRole("textbox", {
    name: /exam name/i,
  });
  expect(examNameField).not.toHaveAttribute("readonly");
  // const examDescriptionField = screen.getByRole("textbox", {
  //   name: /exam description/i,
  // });
  // expect(examDescriptionField).toHaveValue(
  //   examShowId_1.data.exam.exam_description
  // );

  const examNeedsConfirmation = screen.getByRole("checkbox", {
    name: /confirmation required/i,
  });
  expect(examNeedsConfirmation).not.toHaveAttribute("readonly");

  const examStartTimeField = screen.getByRole("textbox", {
    name: /exam's start/i,
  });
  expect(examStartTimeField).not.toHaveAttribute("readonly");

  const examEndTimeField = screen.getByRole("textbox", { name: /exam's end/i });
  expect(examEndTimeField).not.toHaveAttribute("readonly");

  const totalScoreField = screen.getByRole("spinbutton", {
    name: /total score/i,
  });
  expect(totalScoreField).not.toHaveAttribute("readonly");
});

test("if user click save button it must change to saved", async () => {
  renderWithAuthentication(wrapper(<UpdateExamForm examId={1} />), {
    route: programRoutes.updateExam(1),
  });

  const loadingMessage = screen.getByText(/loading/i);
  expect(loadingMessage).toBeInTheDocument();

  const examNameField = await screen.findByRole("textbox", {
    name: /exam name/i,
  });

  userEvent.clear(examNameField, "");
  userEvent.type(examNameField, examShowId_1.data.exam.exam_name + "a");

  const saveButton = await screen.findByRole("button", {
    name: /save changes/i,
  });
  userEvent.click(saveButton);

  const saveButtonToLoading = await screen.findByRole("button", {
    name: /loading/i,
  });
  expect(saveButtonToLoading).toBeDisabled();

  expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /save changes/i })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /loading/i })
  ).not.toBeInTheDocument();
});

test("if the inputs dont change the save button must not be appeared", async () => {
  renderWithAuthentication(wrapper(<UpdateExamForm examId={1} />), {
    route: programRoutes.updateExam(1),
  });

  const loadingMessage = screen.getByText(/loading/i);
  expect(loadingMessage).toBeInTheDocument();

  const examNameField = await screen.findByRole("textbox", {
    name: /exam name/i,
  });

  // all changes saved
  expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /save changes/i })
  ).not.toBeInTheDocument();

  userEvent.clear(examNameField);
  userEvent.type(examNameField, examShowId_1.data.exam.exam_name + "a");

  // save button
  expect(
    await screen.findByRole("button", { name: /save changes/i })
  ).toBeInTheDocument();
  expect(screen.queryByText(/all changes saved/i)).not.toBeInTheDocument();

  userEvent.clear(examNameField);
  userEvent.type(examNameField, examShowId_1.data.exam.exam_name);

  // all changes saved
  expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /save changes/i })
  ).not.toBeInTheDocument();

  const examNeedsConfirmation = screen.getByRole("checkbox", {
    name: /confirmation required/i,
  });

  // all changes saved
  expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /save changes/i })
  ).not.toBeInTheDocument();

  userEvent.click(examNeedsConfirmation);

  // save button
  expect(
    await screen.findByRole("button", { name: /save changes/i })
  ).toBeInTheDocument();
  expect(screen.queryByText(/all changes saved/i)).not.toBeInTheDocument();

  userEvent.click(examNeedsConfirmation);

  // all changes saved
  expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /save changes/i })
  ).not.toBeInTheDocument();

  const examStartTimeField = screen.getByRole("textbox", {
    name: /exam's start/i,
  });

  // all changes saved
  expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /save changes/i })
  ).not.toBeInTheDocument();

  userEvent.clear(examStartTimeField);
  userEvent.type(examStartTimeField, "somethingInvalid");

  // save button
  expect(
    await screen.findByRole("button", { name: /save changes/i })
  ).toBeInTheDocument();
  expect(screen.queryByText(/all changes saved/i)).not.toBeInTheDocument();

  userEvent.clear(examStartTimeField);
  userEvent.type(
    examStartTimeField,
    convertFromUTC(examShowId_1.data.exam.start_of_exam)
  );

  // all changes saved
  expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /save changes/i })
  ).not.toBeInTheDocument();

  const examEndTimeField = screen.getByRole("textbox", { name: /exam's end/i });

  // all changes saved
  expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /save changes/i })
  ).not.toBeInTheDocument();

  userEvent.clear(examEndTimeField);
  userEvent.type(examEndTimeField, "somethingInvalid");

  // save button
  expect(
    await screen.findByRole("button", { name: /save changes/i })
  ).toBeInTheDocument();
  expect(screen.queryByText(/all changes saved/i)).not.toBeInTheDocument();

  userEvent.clear(examEndTimeField);
  userEvent.type(
    examEndTimeField,
    convertFromUTC(examShowId_1.data.exam.end_of_exam)
  );

  // all changes saved
  expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /save changes/i })
  ).not.toBeInTheDocument();

  const totalScoreField = await screen.findByRole("spinbutton", {
    name: /total score/i,
  });

  // all changes saved
  expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /save changes/i })
  ).not.toBeInTheDocument();

  userEvent.clear(totalScoreField);
  userEvent.type(totalScoreField, `${examShowId_1.data.exam.total_score + 1}`);

  // save button
  expect(
    await screen.findByRole("button", { name: /save changes/i })
  ).toBeInTheDocument();
  expect(screen.queryByText(/all changes saved/i)).not.toBeInTheDocument();

  userEvent.clear(totalScoreField);
  userEvent.type(totalScoreField, `${examShowId_1.data.exam.total_score}`);

  // all changes saved
  await wait(100);
  expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /save changes/i })
  ).not.toBeInTheDocument();
});

test("user will see the errors if his information is not correct and after correcting, errors must be disappeared", async () => {
  renderWithAuthentication(wrapper(<UpdateExamForm examId={1} />), {
    route: programRoutes.updateExam(1),
  });

  const loadingMessage = screen.getByText(/loading/i);
  expect(loadingMessage).toBeInTheDocument();

  const startOfExamField = await screen.findByRole("textbox", {
    name: /exam's start/i,
  });

  userEvent.clear(startOfExamField);
  userEvent.type(startOfExamField, "wrongFormat");

  const saveButton = screen.getByRole("button", { name: /save changes/i });
  expect(saveButton).toBeEnabled();
  userEvent.click(saveButton);

  const errorMessage = await screen.findByText(
    /The start of exam does not match the format Y-m-d H:i:s/i
  );
  expect(errorMessage).toBeInTheDocument();

  userEvent.clear(startOfExamField);
  userEvent.type(startOfExamField, "2020-10-10 10:10:10");

  userEvent.click(await screen.findByRole("button", { name: /save changes/i }));
  await waitForElementToBeRemoved(() =>
    screen.queryByText(
      /The start of exam does not match the format Y-m-d H:i:s/i
    )
  );
});

describe("user will save 'all changes saved' after pressing 'save changes' after changing every input", () => {
  test("check name input", async () => {
    renderWithAuthentication(wrapper(<UpdateExamForm examId={1} />), {
      route: programRoutes.updateExam(1),
    });

    const loadingMessage = screen.getByText(/loading/i);
    expect(loadingMessage).toBeInTheDocument();

    const examNameField = await screen.findByRole("textbox", {
      name: /exam name/i,
    });

    userEvent.clear(examNameField);
    userEvent.type(examNameField, examShowId_1.data.exam.exam_name + "a");

    // press save and check saved
    userEvent.click(
      await screen.findByRole("button", { name: /save changes/i })
    );
    expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /save changes/i })
    ).not.toBeInTheDocument();
  });
  test("check confirmation checkbox", async () => {
    renderWithAuthentication(wrapper(<UpdateExamForm examId={1} />), {
      route: programRoutes.updateExam(1),
    });

    const loadingMessage = screen.getByText(/loading/i);
    expect(loadingMessage).toBeInTheDocument();

    const examNeedsConfirmation = await screen.findByRole("checkbox", {
      name: /confirmation required/i,
    });

    userEvent.click(examNeedsConfirmation);

    // press save and check saved
    userEvent.click(
      await screen.findByRole("button", { name: /save changes/i })
    );
    expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /save changes/i })
    ).not.toBeInTheDocument();
  });

  test("check exam start input", async () => {
    renderWithAuthentication(wrapper(<UpdateExamForm examId={1} />), {
      route: programRoutes.updateExam(1),
    });

    const loadingMessage = screen.getByText(/loading/i);
    expect(loadingMessage).toBeInTheDocument();

    const examStartTimeField = await screen.findByRole("textbox", {
      name: /exam's start/i,
    });

    userEvent.clear(examStartTimeField);
    userEvent.type(examStartTimeField, "2021-10-10");

    // press save and check saved
    userEvent.click(
      await screen.findByRole("button", { name: /save changes/i })
    );
    expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /save changes/i })
    ).not.toBeInTheDocument();
  });

  test("check exam end input", async () => {
    renderWithAuthentication(wrapper(<UpdateExamForm examId={1} />), {
      route: programRoutes.updateExam(1),
    });

    const loadingMessage = screen.getByText(/loading/i);
    expect(loadingMessage).toBeInTheDocument();

    const examEndTimeField = await screen.findByRole("textbox", {
      name: /exam's end/i,
    });

    userEvent.clear(examEndTimeField);
    userEvent.type(examEndTimeField, "2021-10-10");

    // press save and check saved
    userEvent.click(
      await screen.findByRole("button", { name: /save changes/i })
    );
    expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /save changes/i })
    ).not.toBeInTheDocument();
  });

  test("check total score input", async () => {
    renderWithAuthentication(wrapper(<UpdateExamForm examId={1} />), {
      route: programRoutes.updateExam(1),
    });

    const loadingMessage = screen.getByText(/loading/i);
    expect(loadingMessage).toBeInTheDocument();

    const totalScoreField = await screen.findByRole("spinbutton", {
      name: /total score/i,
    });

    userEvent.clear(totalScoreField);
    userEvent.type(
      totalScoreField,
      `${examShowId_1.data.exam.total_score + 1}`
    );

    // press save and check saved
    userEvent.click(
      await screen.findByRole("button", { name: /save changes/i })
    );
    expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /save changes/i })
    ).not.toBeInTheDocument();
  });
});

describe("check password part", () => {
  const hasPasswordMessage = /you already set the password, fill the above input to change it/i;
  const noPasswordMessage = /you have not set the password yet, fill the above input to set it/i;

  test("user will see a message if he already has a password", async () => {
    renderWithAuthentication(wrapper(<UpdateExamForm examId={5} />), {
      route: programRoutes.updateExam(5),
    });

    const loadingMessage = screen.getByText(/loading/i);
    expect(loadingMessage).toBeInTheDocument();

    expect(await screen.findByText(hasPasswordMessage)).toBeInTheDocument();
  });
  test("user will see a message if he does not have a password", async () => {
    renderWithAuthentication(wrapper(<UpdateExamForm examId={1} />), {
      route: programRoutes.updateExam(1),
    });

    const loadingMessage = screen.getByText(/loading/i);
    expect(loadingMessage).toBeInTheDocument();

    expect(await screen.findByText(noPasswordMessage)).toBeInTheDocument();
  });
  test("user can change its password if he has password", async () => {
    renderWithAuthentication(wrapper(<UpdateExamForm examId={5} />), {
      route: programRoutes.updateExam(5),
    });
    const loadingMessage = screen.getByText(/loading/i);
    expect(loadingMessage).toBeInTheDocument();

    expect(await screen.findByText(hasPasswordMessage)).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText(/exam's password/i);

    userEvent.clear(passwordInput);
    userEvent.type(passwordInput, "password");

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    userEvent.click(saveButton);

    expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
    expect(await screen.findByText(hasPasswordMessage)).toBeInTheDocument();
  });
  test("user can change its password if he does not have password", async () => {
    renderWithAuthentication(wrapper(<UpdateExamForm examId={1} />), {
      route: programRoutes.updateExam(1),
    });
    const loadingMessage = screen.getByText(/loading/i);
    expect(loadingMessage).toBeInTheDocument();

    expect(await screen.findByText(noPasswordMessage)).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText(/exam's password/i);

    userEvent.clear(passwordInput);
    userEvent.type(passwordInput, "password");

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    userEvent.click(saveButton);

    expect(await screen.findByText(/all changes saved/i)).toBeInTheDocument();
    expect(await screen.findByText(hasPasswordMessage)).toBeInTheDocument();
  });
});
