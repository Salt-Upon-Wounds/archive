import {
  screen,
  renderWithRouter,
} from "../../../../../test-utils/testing-library-utils";
import {
  asignExamShowStartAndEnd,
  changeCurrentParticipant,
  wait,
} from "../../../../../utilities/tests.utility";
import App from "../../../../../App";
import userEvent from "@testing-library/user-event";
import {
  userEmail,
  correctPassword,
} from "../../../../../mocks/mocks/authentication.mock";
import programRoutes from "../../../../../constants/program-routes.constant";
import { examsPassword } from "../../../../../mocks/mocks/participants.mock";

describe("an authenticated user can register in an started exam that did not finished", () => {
  test("user can authenticate and then register to started exam", async () => {
    changeCurrentParticipant({
      participantId: 4,
      otherHandlers: [
        asignExamShowStartAndEnd(
          1,
          new Date(Date.now() - 5000 * 60),
          new Date(Date.now() + 3600 * 1000)
        ),
      ],
    });
    renderWithRouter(<App />, {
      route: programRoutes.indexAllExams(),
      withContexts: true,
    });
    await wait(300);

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
      new Date(Date.now() - 5000 * 60),
      new Date(Date.now() + 3600 * 1000),
      true
    );
    renderWithRouter(<App />, {
      route: programRoutes.indexAllExams(),
      withContexts: true,
    });
    await wait(300);

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
    userEvent.click(screen.getAllByRole("link", { name: /^all exams$/i })[0]);
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
});
