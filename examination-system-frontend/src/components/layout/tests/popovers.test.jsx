import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Layout from "../layout.component";
import {
  userEmail,
  userName,
  repeatedEmail,
  correctPassword,
  shortPassword,
} from "../../../mocks/mocks/authentication.mock";

describe.skip("check errors of login and register don't have conflict", () => {
  test("if user get error from login, he can close the popover and register to site", async () => {
    render(<Layout />);

    const registerButton = screen.getByRole("button", { name: /register/i });
    const loginButton = screen.getByRole("button", { name: /login/i });

    userEvent.click(loginButton);

    //login fields
    const loginEmailField = screen.getByRole("textbox", { name: /email/i });
    const loginPasswordField = screen.getByLabelText(/password/i);

    userEvent.clear(loginEmailField);
    userEvent.clear(loginPasswordField);
    userEvent.type(loginEmailField, userEmail);
    userEvent.type(loginPasswordField, "wrongPassword");

    const loginSubmitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(loginSubmitButton);

    const errorMessage = await screen.findByText(/invalid email or password/i);
    expect(errorMessage).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    userEvent.click(closeButton);

    userEvent.click(registerButton);

    const nullErrorMessage = screen.queryByText(/invalid email or password/i);
    expect(nullErrorMessage).not.toBeInTheDocument();

    // register fields
    const registerNameField = screen.getByRole("textbox", { name: /name/i });
    const registerEmailField = screen.getByRole("textbox", { name: /email/i });
    const registerPasswordField = screen.getAllByLabelText(/password/i)[0];
    const registerConfirmPasswordField = screen.getByLabelText(
      /confirm password/i
    );

    userEvent.clear(registerNameField);
    userEvent.clear(registerEmailField);
    userEvent.clear(registerPasswordField);
    userEvent.clear(registerConfirmPasswordField);

    userEvent.type(registerNameField, userName);
    userEvent.type(registerEmailField, userEmail);
    userEvent.type(registerPasswordField, correctPassword);
    userEvent.type(registerConfirmPasswordField, correctPassword);

    const registerSubmitButton = screen.getByRole("button", {
      name: "REGISTER",
    });
    userEvent.click(registerSubmitButton);

    const registerMessage = await screen.findByText(
      /you registered successfully/i
    );
    expect(registerMessage).toBeInTheDocument();
  });

  test("if user see error in registration, he can close the registeration popover and login to the site", async () => {
    render(<Layout />);

    const registerButton = screen.getByRole("button", { name: /register/i });
    const loginButton = screen.getByRole("button", { name: /login/i });

    userEvent.click(registerButton);

    // register fields
    const registerNameField = screen.getByRole("textbox", { name: /name/i });
    const registerEmailField = screen.getByRole("textbox", { name: /email/i });
    const registerPasswordField = screen.getAllByLabelText(/password/i)[0];
    const registerConfirmPasswordField = screen.getByLabelText(
      /confirm password/i
    );

    userEvent.clear(registerNameField);
    userEvent.clear(registerEmailField);
    userEvent.clear(registerPasswordField);
    userEvent.clear(registerConfirmPasswordField);

    userEvent.type(registerNameField, userName);
    userEvent.type(registerEmailField, userEmail);
    userEvent.type(registerPasswordField, shortPassword);
    userEvent.type(registerConfirmPasswordField, shortPassword);

    const registerSubmitButton = screen.getByRole("button", {
      name: "REGISTER",
    });
    userEvent.click(registerSubmitButton);

    const errorMessage = await screen.findByText(
      /the password must be at least 8 characters/i
    );
    expect(errorMessage).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });

    userEvent.click(closeButton);

    userEvent.click(loginButton);

    const nullErrorMessage = screen.queryByText(
      /the password must be at least 8 characters/i
    );
    expect(nullErrorMessage).not.toBeInTheDocument();

    //login fields
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
  });
});

describe.skip("check user can move from login to register popover", () => {
  test("user can go to register popover from login popover after he faced to an error and register", async () => {
    render(<Layout />);

    const loginButton = screen.getByRole("button", { name: /login/i });

    userEvent.click(loginButton);

    //login fields
    const loginEmailField = screen.getByRole("textbox", { name: /email/i });
    const loginPasswordField = screen.getByLabelText(/password/i);

    userEvent.clear(loginEmailField);
    userEvent.clear(loginPasswordField);
    userEvent.type(loginEmailField, userEmail);
    userEvent.type(loginPasswordField, "wrongPassword");

    const loginSubmitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(loginSubmitButton);

    const errorMessage = await screen.findByText(/invalid email or password/i);
    expect(errorMessage).toBeInTheDocument();

    const registerPopoverButton = screen.getByRole("button", {
      name: /sign up/i,
    });
    userEvent.click(registerPopoverButton);

    const nullErrorMessage = screen.queryByText(/invalid email or password/i);
    expect(nullErrorMessage).not.toBeInTheDocument();

    // register fields
    const registerNameField = screen.getByRole("textbox", { name: /name/i });
    const registerEmailField = screen.getByRole("textbox", { name: /email/i });
    const registerPasswordField = screen.getAllByLabelText(/password/i)[0];
    const registerConfirmPasswordField = screen.getByLabelText(
      /confirm password/i
    );

    userEvent.clear(registerNameField);
    userEvent.clear(registerEmailField);
    userEvent.clear(registerPasswordField);
    userEvent.clear(registerConfirmPasswordField);

    userEvent.type(registerNameField, userName);
    userEvent.type(registerEmailField, userEmail);
    userEvent.type(registerPasswordField, correctPassword);
    userEvent.type(registerConfirmPasswordField, correctPassword);

    const registerSubmitButton = screen.getByRole("button", {
      name: "REGISTER",
    });
    userEvent.click(registerSubmitButton);

    const registerMessage = await screen.findByText(
      /you registered successfully/i
    );
    expect(registerMessage).toBeInTheDocument();
  });
});

describe.skip("check user can move from register to login popover", () => {
  test("user can go to login popover from register popover after he faced to an error and login", async () => {
    render(<Layout />);

    const registerButton = screen.getByRole("button", { name: /register/i });

    userEvent.click(registerButton);

    // register fields
    const registerNameField = screen.getByRole("textbox", { name: /name/i });
    const registerEmailField = screen.getByRole("textbox", { name: /email/i });
    const registerPasswordField = screen.getAllByLabelText(/password/i)[0];
    const registerConfirmPasswordField = screen.getByLabelText(
      /confirm password/i
    );

    userEvent.clear(registerNameField);
    userEvent.clear(registerEmailField);
    userEvent.clear(registerPasswordField);
    userEvent.clear(registerConfirmPasswordField);

    userEvent.type(registerNameField, userName);
    userEvent.type(registerEmailField, userEmail);
    userEvent.type(registerPasswordField, shortPassword);
    userEvent.type(registerConfirmPasswordField, shortPassword);

    const registerSubmitButton = screen.getByRole("button", {
      name: "REGISTER",
    });
    userEvent.click(registerSubmitButton);

    const errorMessage = await screen.findByText(
      /the password must be at least 8 characters/i
    );
    expect(errorMessage).toBeInTheDocument();

    const loginPopoverButton = screen.getByRole("button", { name: /sign in/i });
    userEvent.click(loginPopoverButton);

    const nullErrorMessage = screen.queryByText(
      /the password must be at least 8 characters/i
    );
    expect(nullErrorMessage).not.toBeInTheDocument();

    //login fields
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
  });
});

describe.skip("check that errors are removed when the component is unmounted and mounted again", () => {
  test("if user have error on logging in and he moved to register by bottom button and then returned by bottom button to login, he must not see errors anymore", async () => {
    render(<Layout />);

    const loginButton = screen.getByRole("button", { name: /login/i });

    userEvent.click(loginButton);

    //login fields
    const loginEmailField = screen.getByRole("textbox", { name: /email/i });
    const loginPasswordField = screen.getByLabelText(/password/i);

    userEvent.clear(loginEmailField);
    userEvent.clear(loginPasswordField);
    userEvent.type(loginEmailField, userEmail);
    userEvent.type(loginPasswordField, "wrongPassword");

    const loginSubmitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(loginSubmitButton);

    const errorMessage = await screen.findByText(/invalid email or password/i);
    expect(errorMessage).toBeInTheDocument();

    const registerBottomButton = screen.getByRole("button", {
      name: /sign up/i,
    });
    userEvent.click(registerBottomButton);

    const registerNameField = screen.getByRole("textbox", { name: /name/i });
    expect(registerNameField).toBeInTheDocument();

    const loginBottomButton = screen.getByRole("button", { name: /sign in/i });
    userEvent.click(loginBottomButton);

    const nullErrorMessage = screen.queryByText(/invalid email or password/i);
    expect(nullErrorMessage).not.toBeInTheDocument();
  });

  test("if user have error on logging in and he moved to register by close button and then returned by login button to login, he must not see errors anymore", async () => {
    render(<Layout />);

    const loginButton = screen.getByRole("button", { name: /login/i });

    userEvent.click(loginButton);

    //login fields
    const loginEmailField = screen.getByRole("textbox", { name: /email/i });
    const loginPasswordField = screen.getByLabelText(/password/i);

    userEvent.clear(loginEmailField);
    userEvent.clear(loginPasswordField);
    userEvent.type(loginEmailField, userEmail);
    userEvent.type(loginPasswordField, "wrongPassword");

    const loginSubmitButton = screen.getByRole("button", { name: "LOGIN" });
    userEvent.click(loginSubmitButton);

    const errorMessage = await screen.findByText(/invalid email or password/i);
    expect(errorMessage).toBeInTheDocument();

    const closeButton = await screen.findByRole("button", { name: /close/i });
    userEvent.click(closeButton);

    userEvent.click(loginButton);

    const nullErrorMessage = screen.queryByText(/invalid email or password/i);
    expect(nullErrorMessage).not.toBeInTheDocument();
  });

  test("if user have error on registration and he moved to login by bottom button and then returned by bottom button to register, he must not see errors anymore", async () => {
    render(<Layout />);

    const registerButton = screen.getByRole("button", { name: /register/i });
    userEvent.click(registerButton);

    // register fields
    const registerNameField = screen.getByRole("textbox", { name: /name/i });
    const registerEmailField = screen.getByRole("textbox", { name: /email/i });
    const registerPasswordField = screen.getAllByLabelText(/password/i)[0];
    const registerConfirmPasswordField = screen.getByLabelText(
      /confirm password/i
    );

    userEvent.clear(registerNameField);
    userEvent.clear(registerEmailField);
    userEvent.clear(registerPasswordField);
    userEvent.clear(registerConfirmPasswordField);

    userEvent.type(registerNameField, userName);
    userEvent.type(registerEmailField, userEmail);
    userEvent.type(registerPasswordField, shortPassword);
    userEvent.type(registerConfirmPasswordField, shortPassword);

    const registerSubmitButton = screen.getByRole("button", {
      name: "REGISTER",
    });
    userEvent.click(registerSubmitButton);

    const errorMessage = await screen.findByText(
      /the password must be at least 8 characters/i
    );
    expect(errorMessage).toBeInTheDocument();

    const loginBottomButton = screen.getByRole("button", { name: /sign in/i });
    userEvent.click(loginBottomButton);

    const loginSubmitButton = screen.getByRole("button", { name: "LOGIN" });
    expect(loginSubmitButton).toBeInTheDocument();

    const registerBottomButton = screen.getByRole("button", {
      name: /sign up/i,
    });
    userEvent.click(registerBottomButton);

    const nullErrorMessage = screen.queryByText(
      /the password must be at least 8 characters/i
    );
    expect(nullErrorMessage).not.toBeInTheDocument();
  });

  test("if user have error on registeration and he moved to login by close button and then returned by register button to register, he must not see errors anymore", async () => {
    render(<Layout />);

    const registerButton = screen.getByRole("button", { name: /register/i });
    userEvent.click(registerButton);

    // register fields
    const registerNameField = screen.getByRole("textbox", { name: /name/i });
    const registerEmailField = screen.getByRole("textbox", { name: /email/i });
    const registerPasswordField = screen.getAllByLabelText(/password/i)[0];
    const registerConfirmPasswordField = screen.getByLabelText(
      /confirm password/i
    );

    userEvent.clear(registerNameField);
    userEvent.clear(registerEmailField);
    userEvent.clear(registerPasswordField);
    userEvent.clear(registerConfirmPasswordField);

    userEvent.type(registerNameField, userName);
    userEvent.type(registerEmailField, userEmail);
    userEvent.type(registerPasswordField, shortPassword);
    userEvent.type(registerConfirmPasswordField, shortPassword);

    const registerSubmitButton = screen.getByRole("button", {
      name: "REGISTER",
    });
    userEvent.click(registerSubmitButton);

    const errorMessage = await screen.findByText(
      /the password must be at least 8 characters/i
    );
    expect(errorMessage).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    userEvent.click(closeButton);

    userEvent.click(registerButton);

    const nullErrorMessage = screen.queryByText(
      /the password must be at least 8 characters/i
    );
    expect(nullErrorMessage).not.toBeInTheDocument();
  });
});
