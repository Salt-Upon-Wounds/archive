import {
  screen,
  waitFor,
  render,
} from "../test-utils/testing-library-utils.jsx";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import App from "../App";
import {
  userEmail,
  userName,
  correctPassword,
} from "../mocks/mocks/authentication.mock";

test("authenticated user can click logout and logout from his account", async () => {
  render(<App />);
  // login
  const loginLink = screen.getByRole("link", { name: /login/i });
  userEvent.click(loginLink);

  const emailField = screen.getByRole("textbox", { name: /email/i });
  userEvent.clear(emailField);
  userEvent.type(emailField, userEmail);

  const passwordField = screen.getByLabelText(/password/i);
  userEvent.clear(passwordField);
  userEvent.type(passwordField, correctPassword);

  const loginButton2 = screen.getByRole("button", { name: "LOGIN" });
  userEvent.click(loginButton2);

  const axiosPost = jest.spyOn(axios, "post");
  // click button
  const validator = new RegExp(userName, "i");
  userEvent.click(await screen.findByRole("button", { name: validator }));
  const logoutButton = await screen.findByRole("button", { name: /logout/i });
  userEvent.click(logoutButton);

  // check logout request sent
  await waitFor(() => expect(axiosPost).toHaveBeenCalledTimes(1));

  // check token removed
  await waitFor(() => expect(localStorage.getItem("token")).toBe(null));

  // check login and register appeared
  await waitFor(() =>
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument()
  );
  expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
});

test("after logout, redirect must not exist in the url", async () => {
  render(<App />);
  // login
  const loginLink = screen.getByRole("link", { name: /login/i });
  userEvent.click(loginLink);

  const emailField = screen.getByRole("textbox", { name: /email/i });
  userEvent.clear(emailField);
  userEvent.type(emailField, userEmail);

  const passwordField = screen.getByLabelText(/password/i);
  userEvent.clear(passwordField);
  userEvent.type(passwordField, correctPassword);

  const loginButton2 = screen.getByRole("button", { name: "LOGIN" });
  userEvent.click(loginButton2);

  const axiosPost = jest.spyOn(axios, "post");
  // click button
  const validator = new RegExp(userName, "i");
  userEvent.click(await screen.findByRole("button", { name: validator }));
  const logoutButton = await screen.findByRole("button", { name: /logout/i });
  userEvent.click(logoutButton);

  // check logout request sent
  await waitFor(() => expect(axiosPost).toHaveBeenCalledTimes(1));

  // check token removed
  await waitFor(() => expect(localStorage.getItem("token")).toBe(null));

  // check login and register appeared
  await waitFor(() =>
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument()
  );
  expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();

  // check url
  expect(window.location.href.includes("redirect")).toBe(false);
});
