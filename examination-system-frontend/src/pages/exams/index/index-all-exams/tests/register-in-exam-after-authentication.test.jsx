import {
  screen,
  renderWithRouter,
} from "../../../../../test-utils/testing-library-utils";
import {
  asignExamShowStartAndEnd,
  wait,
} from "../../../../../utilities/tests.utility";
import App from "../../../../../App";
import userEvent from "@testing-library/user-event";
import {
  userEmail,
  correctPassword,
} from "../../../../../mocks/mocks/authentication.mock";
import { examsPassword } from "../../../../../mocks/mocks/participants.mock";
import programRoutes from "../../../../../constants/program-routes.constant";
import {
  wrongPassword,
  withoutPassword,
} from "../../../../../mocks/errors/failed-exam-registration.error";

const wrongPasswordError = wrongPassword.errors.password;

describe("authenticated user can register for exam", () => {
  test("user can authenticate and then register to not started exam", async () => {
    asignExamShowStartAndEnd(
      1,
      new Date(Date.now() + 5000 * 60),
      new Date(Date.now() + 3600 * 1000)
    );
    renderWithRouter(<App />, {
      route: programRoutes.indexAllExams(),
      withContexts: true,
    });
    await wait(200);

    // click login button
    const loginButton = screen.getByRole("link", { name: /login/i });
    userEvent.click(loginButton);
    // end

    // login to site
    const loginEmailField = screen.getByRole("textbox", { name: /email/i });
    const loginPasswordField = screen.getByLabelText(/password/i);

    userEvent.clear(loginEmailField);
    userEvent.clear(loginPasswordField);
    userEvent.type(loginEmailField, userEmail);
    userEvent.type(loginPasswordField, correctPassword);

    const loginSubmitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(loginSubmitButton);

    const loginMessage = await screen.findByText(/you logged in successfully/i);
    expect(loginMessage).toBeInTheDocument();
    // end

    // open exam description
    userEvent.click(screen.getAllByRole("link", { name: /exams/i })[0]);
    const moreDetailsButtons = await screen.findAllByText(/more details/i);
    const ElementmoreDetailsButton = moreDetailsButtons[0];

    userEvent.click(ElementmoreDetailsButton);
    await wait(100);
    // end

    // register for exam description without password
    const registerButton = await screen.findByRole("button", {
      name: /register for exam/i,
    });
    expect(registerButton).toBeEnabled();
    userEvent.click(registerButton);
    // end

    // check registration
    const registerToExamMessage = await screen.findByText(
      /^you registered in exam ".*" successfully$/i
    );
    expect(registerToExamMessage).toBeInTheDocument();

    const registeredText = await screen.findByText(/registered/i);
    expect(registeredText).toBeInTheDocument();
    // end
  });
  test("user can authenticate and then input the password and then register to the exam if his password was corrent", async () => {
    asignExamShowStartAndEnd(
      4,
      new Date(Date.now() + 5000 * 60),
      new Date(Date.now() + 3600 * 1000),
      true
    );
    renderWithRouter(<App />, {
      route: programRoutes.indexAllExams(),
      withContexts: true,
    });
    await wait(200);

    // click login button
    const loginButton = screen.getByRole("link", { name: /login/i });
    userEvent.click(loginButton);
    // end

    // login to site
    const loginEmailField = screen.getByRole("textbox", { name: /email/i });
    const loginPasswordField = screen.getByLabelText(/password/i);

    userEvent.clear(loginEmailField);
    userEvent.clear(loginPasswordField);
    userEvent.type(loginEmailField, userEmail);
    userEvent.type(loginPasswordField, correctPassword);

    const loginSubmitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(loginSubmitButton);

    const loginMessage = await screen.findByText(/you logged in successfully/i);
    expect(loginMessage).toBeInTheDocument();
    // end

    // open exam description
    userEvent.click(screen.getAllByRole("link", { name: /exams/i })[0]);
    const moreDetailsButtons = await screen.findAllByText(/more details/i);
    const ElementmoreDetailsButton = moreDetailsButtons[3];

    userEvent.click(ElementmoreDetailsButton);
    await wait(100);
    // end

    // register for exam description with password
    const registerExamPasswordField = await screen.findByLabelText(
      /exam password/i
    );
    userEvent.clear(registerExamPasswordField);
    userEvent.type(registerExamPasswordField, examsPassword);

    const registerButton = screen.getByRole("button", {
      name: /register for exam/i,
    });
    expect(registerButton).toBeEnabled();
    userEvent.click(registerButton);
    // end

    // check registration
    const registerToExamMessage = await screen.findByText(
      /you registered in exam ".*" successfully/i
    );
    expect(registerToExamMessage).toBeInTheDocument();

    const registeredText = await screen.findByText(/registered/i);
    expect(registeredText).toBeInTheDocument();
    // end
  });
  test("user can authenticate and then input the password and then he will receive an error if his password was incorrect", async () => {
    asignExamShowStartAndEnd(
      4,
      new Date(Date.now() + 5000 * 60),
      new Date(Date.now() + 3600 * 1000),
      true
    );
    renderWithRouter(<App />, {
      route: programRoutes.indexAllExams(),
      withContexts: true,
    });
    await wait(200);

    // click login button
    const loginButton = screen.getByRole("link", { name: /login/i });
    userEvent.click(loginButton);
    // end

    // login to site
    const loginEmailField = screen.getByRole("textbox", { name: /email/i });
    const loginPasswordField = screen.getByLabelText(/password/i);

    userEvent.clear(loginEmailField);
    userEvent.clear(loginPasswordField);
    userEvent.type(loginEmailField, userEmail);
    userEvent.type(loginPasswordField, correctPassword);

    const loginSubmitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(loginSubmitButton);

    const loginMessage = await screen.findByText(/you logged in successfully/i);
    expect(loginMessage).toBeInTheDocument();
    // end

    // open exam description
    userEvent.click(screen.getAllByRole("link", { name: /exams/i })[0]);
    const moreDetailsButtons = await screen.findAllByText(/more details/i);
    const ElementmoreDetailsButton = moreDetailsButtons[3];

    userEvent.click(ElementmoreDetailsButton);
    await wait(100);
    // end

    // register for exam description with wrong password
    const registerExamPasswordField = await screen.findByLabelText(
      /exam password/i
    );
    userEvent.clear(registerExamPasswordField);
    userEvent.type(registerExamPasswordField, "wrongPassword");

    const registerButton = screen.getByRole("button", {
      name: /register for exam/i,
    });
    expect(registerButton).toBeEnabled();
    userEvent.click(registerButton);
    // end

    // check error
    const errorMessage = await screen.findByText(wrongPasswordError);
    expect(errorMessage).toBeInTheDocument();

    const nullRegisteredText = screen.queryByText(/^registered/i);
    expect(nullRegisteredText).not.toBeInTheDocument();
    // end
  });
  test("user can authenticate and then input the password wrong and then he can try again and register for exam", async () => {
    asignExamShowStartAndEnd(
      4,
      new Date(Date.now() + 5000 * 60),
      new Date(Date.now() + 3600 * 1000),
      true
    );
    renderWithRouter(<App />, {
      route: programRoutes.indexAllExams(),
      withContexts: true,
    });
    await wait(200);

    // click login button
    const loginButton = screen.getByRole("link", { name: /login/i });
    userEvent.click(loginButton);
    // end

    // login to site
    const loginEmailField = screen.getByRole("textbox", { name: /email/i });
    const loginPasswordField = screen.getByLabelText(/password/i);

    userEvent.clear(loginEmailField);
    userEvent.clear(loginPasswordField);
    userEvent.type(loginEmailField, userEmail);
    userEvent.type(loginPasswordField, correctPassword);

    const loginSubmitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(loginSubmitButton);

    const loginMessage = await screen.findByText(/you logged in successfully/i);
    expect(loginMessage).toBeInTheDocument();
    // end

    // open exam description
    userEvent.click(screen.getAllByRole("link", { name: /exams/i })[0]);
    const moreDetailsButtons = await screen.findAllByText(/more details/i);
    const ElementmoreDetailsButton = moreDetailsButtons[3];

    userEvent.click(ElementmoreDetailsButton);
    await wait(100);
    // end

    // register for exam description with wrong password
    const registerExamPasswordField = await screen.findByLabelText(
      /exam password/i
    );
    userEvent.clear(registerExamPasswordField);
    userEvent.type(registerExamPasswordField, "wrongPassword");

    const registerButton = screen.getByRole("button", {
      name: /register for exam/i,
    });
    expect(registerButton).toBeEnabled();
    userEvent.click(registerButton);
    // end

    // check error
    const errorMessage = await screen.findByText(wrongPasswordError);
    expect(errorMessage).toBeInTheDocument();

    const nullRegisteredText = screen.queryByText(/^registered/i);
    expect(nullRegisteredText).not.toBeInTheDocument();
    // end

    //register again with correct password
    userEvent.clear(registerExamPasswordField);
    userEvent.type(registerExamPasswordField, examsPassword);

    expect(registerButton).toBeEnabled();
    userEvent.click(registerButton);
    // end

    // check registration
    const registerToExamMessage = await screen.findByText(
      /you registered in exam ".*" successfully/i
    );
    expect(registerToExamMessage).toBeInTheDocument();

    const registeredText = await screen.findByText(/registered/i);
    expect(registeredText).toBeInTheDocument();
    // end

    // check error removed
    const nullErrorMessage = screen.queryByText(wrongPasswordError);
    expect(nullErrorMessage).not.toBeInTheDocument();
    // end
  });
});
