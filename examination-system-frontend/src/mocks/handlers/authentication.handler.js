import { rest } from "msw";
import apiRoutes from "../../constants/api-routes.constant";
import {
  userMock,
  userEmail,
  repeatedEmail,
  correctPassword,
  shortPassword,
} from "../mocks/authentication.mock";
import { invalidCriteriaError } from "../errors/failed-login.error";
import {
  shortPasswordError,
  shortPasswordAndRepeatedEmailError,
  repeatedEmailError,
  passwordMatchError,
} from "../errors/failed-register.error";
import {
  wrongCurrentPassword,
  passwordConfirmationDoesNotMatch,
} from "../errors/failed-change-password.error";

const authenticationHandler = [
  rest.post(apiRoutes.authentication.login(), (req, res, ctx) => {
    const { email, password } = req.body;
    if (email === userEmail && password === correctPassword) {
      return res(ctx.json(userMock));
    } else {
      return res(ctx.status(401), ctx.json(invalidCriteriaError));
    }
  }),
  rest.post(apiRoutes.authentication.register(), (req, res, ctx) => {
    const { email, password, password_confirmation } = req.body;
    if (
      email === userEmail &&
      password === password_confirmation &&
      password === correctPassword
    ) {
      return res(ctx.status(201), ctx.json(userMock));
    } else if (
      email === repeatedEmail &&
      password === password_confirmation &&
      password === correctPassword
    ) {
      return res(ctx.status(422), ctx.json(repeatedEmailError));
    } else if (email === userEmail && password !== password_confirmation) {
      return res(ctx.status(422), ctx.json(passwordMatchError));
    } else if (
      email === repeatedEmail &&
      password === password_confirmation &&
      password === shortPassword
    ) {
      return res(ctx.status(422), ctx.json(shortPasswordAndRepeatedEmailError));
    } else if (
      email === userEmail &&
      password === password_confirmation &&
      password === shortPassword
    ) {
      return res(ctx.status(422), ctx.json(shortPasswordError));
    } else {
      console.error(
        `request is not expected(email: '${email}', password: '${password}')`
      );
      return res(ctx.status(404));
    }
  }),
  rest.post(apiRoutes.authentication.logout(), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    return res(ctx.status(202));
  }),
  rest.put(apiRoutes.authentication.changePassword(), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    const { current_password, password, password_confirmation } = req.body;

    if (current_password !== correctPassword) {
      return res(ctx.status(422), ctx.json(wrongCurrentPassword));
    } else if (password !== password_confirmation) {
      return res(ctx.status(422), ctx.json(passwordConfirmationDoesNotMatch));
    }
    return res(ctx.status(200));
  }),
];

export default authenticationHandler;
