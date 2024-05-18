// src/mocks/server.js

import { setupServer } from "msw/node";

import examsHandler from "./handlers/exams.handler";
import authenticationHandler from "./handlers/authentication.handler";
import participantsHandler from "./handlers/participants.handler";
import questionTypesHandler from "./handlers/question-types.handler";
import questionsHandler from "./handlers/questions.handler";
import statesHandler from "./handlers/states.handler";
import usersHandler from "./handlers/users.handler";
import answersHandler from "./handlers/answers.handler";
import gradesHandler from "./handlers/grades.handler";

// This configures a request mocking server with the given request handlers.

export const handlers = [
  ...examsHandler,
  ...authenticationHandler,
  ...participantsHandler,
  ...questionTypesHandler,
  ...questionsHandler,
  ...statesHandler,
  ...usersHandler,
  ...answersHandler,
  ...gradesHandler,
];

export const server = setupServer(...handlers);
