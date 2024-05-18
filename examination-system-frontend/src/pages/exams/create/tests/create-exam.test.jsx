import {
  screen,
  waitFor,
  renderWithAuthentication,
} from "../../../../test-utils/testing-library-utils";
import { wait } from "../../../../utilities/tests.utility";
import userEvent from "@testing-library/user-event";
import App from "../../../../App";
import CreateExamPage from "../create-exam.page";
import moment from "moment";
import programRoutes from "../../../../constants/program-routes.constant";

// exam description part commented

test("first of all, exam name field must be focused", async () => {
  renderWithAuthentication(<CreateExamPage />);

  // check name field focused or not
  const examNameField = screen.getByRole("textbox", { name: /exam name/i });
  expect(examNameField).toHaveFocus();
  // end
});

test("user can create an exam without password and he will see loading... in create button and button will be disabled while waiting and alert will be displayed 3s", async () => {
  renderWithAuthentication(<CreateExamPage />);

  // fill exam name
  const examNameField = screen.getByRole("textbox", { name: /exam name/i });
  userEvent.clear(examNameField);
  userEvent.type(examNameField, "exam name");
  // end

  // // fill exam description
  // const examDescriptionField = screen.getByRole("textbox", {
  //   name: /exam description/i,
  // });
  // userEvent.clear(examDescriptionField);
  // userEvent.type(examDescriptionField, "exam description ".repeat(50));
  // // end

  // fill exam's start
  const examStartField = screen.getByRole("textbox", { name: /exam's start/i });
  userEvent.clear(examStartField);
  const startDate = moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss");
  userEvent.type(examStartField, startDate);
  // end

  // fill exam's end
  const examEndField = screen.getByRole("textbox", { name: /exam's end/i });
  userEvent.clear(examEndField);
  const endDate = moment()
    .add(5, "minutes")
    .add(2, "hours")
    .format("YYYY-MM-DD HH:mm:ss");
  userEvent.type(examEndField, endDate);
  // end

  // fill total score
  const totalScoreField = screen.getByRole("spinbutton", {
    name: /total score/i,
  });
  userEvent.clear(totalScoreField);
  userEvent.type(totalScoreField, "100");
  // end

  // press create button
  const createButton = screen.getByRole("button", { name: /create/i });
  expect(createButton).toBeEnabled();
  userEvent.click(createButton);
  // end

  // check button change
  const changedCreateButton = await screen.findByRole("button", {
    name: /loading\.\.\./i,
  });
  await waitFor(() => expect(changedCreateButton).toBeDisabled());
  //end

  // check alert with wait
  expect(
    await screen.findByText(/exam ".*" created successfully/i)
  ).toBeInTheDocument();
  await wait(3100);
  expect(
    screen.queryByText(/exam ".*" created successfully/i)
  ).not.toBeInTheDocument();
  // end
});

test("user can create an exam with password", async () => {
  renderWithAuthentication(<CreateExamPage />);

  // fill exam name
  const examNameField = screen.getByRole("textbox", { name: /exam name/i });
  userEvent.clear(examNameField);
  userEvent.type(examNameField, "exam name");
  // end

  // // fill exam description
  // const examDescriptionField = screen.getByRole("textbox", {
  //   name: /exam description/i,
  // });
  // userEvent.clear(examDescriptionField);
  // userEvent.type(examDescriptionField, "exam description ".repeat(50));
  // // end

  // fill exam's start
  const examStartField = screen.getByRole("textbox", { name: /exam's start/i });
  userEvent.clear(examStartField);
  const startDate = moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss");
  userEvent.type(examStartField, startDate);
  // end

  // fill exam's end
  const examEndField = screen.getByRole("textbox", { name: /exam's end/i });
  userEvent.clear(examEndField);
  const endDate = moment()
    .add(5, "minutes")
    .add(2, "hours")
    .format("YYYY-MM-DD HH:mm:ss");
  userEvent.type(examEndField, endDate);
  // end

  // fill total score
  const totalScoreField = screen.getByRole("spinbutton", {
    name: /total score/i,
  });
  userEvent.clear(totalScoreField);
  userEvent.type(totalScoreField, "100");
  // end

  // check need password checkbox
  const needPasswordCheckbox = screen.getByRole("checkbox", {
    name: /needs password/i,
  });
  expect(needPasswordCheckbox).not.toBeChecked();
  userEvent.click(needPasswordCheckbox);
  expect(needPasswordCheckbox).toBeChecked();
  //end

  // fill the password field
  const passwordField = screen.getByPlaceholderText(/exam's password/i);
  userEvent.clear(passwordField);
  userEvent.type(passwordField, "password");
  // end

  // press create button
  const createButton = screen.getByRole("button", { name: /create/i });
  expect(createButton).toBeEnabled();
  userEvent.click(createButton);
  // end

  // check button change
  const changedCreateButton = await screen.findByRole("button", {
    name: /loading\.\.\./i,
  });
  await waitFor(() => expect(changedCreateButton).toBeDisabled());
  //end

  // check alert without wait
  expect(
    await screen.findByText(/exam ".*" created successfully/i)
  ).toBeInTheDocument();
  // end
});

test("user will see errors if he completed the information wrong", async () => {
  renderWithAuthentication(<CreateExamPage />);

  // fill exam name wrong
  const examNameField = screen.getByRole("textbox", { name: /exam name/i });
  userEvent.clear(examNameField);
  userEvent.type(examNameField, "");
  // end

  // // fill exam description
  // const examDescriptionField = screen.getByRole("textbox", {
  //   name: /exam description/i,
  // });
  // userEvent.clear(examDescriptionField);
  // userEvent.type(examDescriptionField, "exam description ".repeat(50));
  // // end

  // fill exam's start
  const examStartField = screen.getByRole("textbox", { name: /exam's start/i });
  userEvent.clear(examStartField);
  const startDate = moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss");
  userEvent.type(examStartField, startDate);
  // end

  // fill exam's end
  const examEndField = screen.getByRole("textbox", { name: /exam's end/i });
  userEvent.clear(examEndField);
  const endDate = moment()
    .add(5, "minutes")
    .add(2, "hours")
    .format("YYYY-MM-DD HH:mm:ss");
  userEvent.type(examEndField, endDate);
  // end

  // fill total score
  const totalScoreField = screen.getByRole("spinbutton", {
    name: /total score/i,
  });
  userEvent.clear(totalScoreField);
  userEvent.type(totalScoreField, "100");
  // end

  // press create button
  const createButton = screen.getByRole("button", { name: /create/i });
  expect(createButton).toBeEnabled();
  userEvent.click(createButton);
  // end

  // check button change
  const changedCreateButton = await screen.findByRole("button", {
    name: /loading\.\.\./i,
  });
  await waitFor(() => expect(changedCreateButton).toBeDisabled());
  //end

  // check error
  expect(
    await screen.findByText(/The exam name field is required/i)
  ).toBeInTheDocument();
  // end

  // refill exam name
  userEvent.clear(examNameField);
  userEvent.type(examNameField, "exam name");
  // end

  // repress create button
  const createButton2 = screen.getByRole("button", { name: /create/i });
  expect(createButton2).toBeEnabled();
  userEvent.click(createButton2);
  // end

  // check alert without wait
  expect(
    await screen.findByText(/exam ".*" created successfully/i)
  ).toBeInTheDocument();
  // end
});

test("user will redirect to update the exams page after creating the exam", async () => {
  renderWithAuthentication(<App />, {
    route: programRoutes.createExam(),
    authenticationProviderProps: {
      redirectIfNotAuthenticated: (component) => component,
    },
  });

  // fill exam name
  const examNameField = screen.getByRole("textbox", { name: /exam name/i });
  userEvent.clear(examNameField);
  userEvent.type(examNameField, "exam name");
  // end

  // // fill exam description
  // const examDescriptionField = screen.getByRole("textbox", {
  //   name: /exam description/i,
  // });
  // userEvent.clear(examDescriptionField);
  // userEvent.type(examDescriptionField, "exam description ".repeat(50));
  // // end

  // fill exam's start
  const examStartField = screen.getByRole("textbox", { name: /exam's start/i });
  userEvent.clear(examStartField);
  const startDate = moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss");
  userEvent.type(examStartField, startDate);
  // end

  // fill exam's end
  const examEndField = screen.getByRole("textbox", { name: /exam's end/i });
  userEvent.clear(examEndField);
  const endDate = moment()
    .add(5, "minutes")
    .add(2, "hours")
    .format("YYYY-MM-DD HH:mm:ss");
  userEvent.type(examEndField, endDate);
  // end

  // fill total score
  const totalScoreField = screen.getByRole("spinbutton", {
    name: /total score/i,
  });
  userEvent.clear(totalScoreField);
  userEvent.type(totalScoreField, "100");
  // end

  // press create button
  const createButton = screen.getByRole("button", { name: /create/i });
  expect(createButton).toBeEnabled();
  userEvent.click(createButton);
  // end

  // check button change
  const changedCreateButton = await screen.findByRole("button", {
    name: /loading\.\.\./i,
  });
  await waitFor(() => expect(changedCreateButton).toBeDisabled());
  //end

  // check alert without wait
  expect(
    await screen.findByText(/exam ".*" created successfully/i)
  ).toBeInTheDocument();
  // end

  // check the path
  expect(window.location.pathname).toBe(programRoutes.updateExam(1));
  // end
});
