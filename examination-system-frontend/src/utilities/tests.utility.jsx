import { act } from "@testing-library/react";
import { rest } from "msw";

import { server, handlers } from "../mocks/server";
import apiRoutes from "../constants/api-routes.constant";
import "../mocks/server";
import { error_401, error_422 } from "../mocks/errors/pure-error-bodies.error";
import {
  examShowId_1,
  examShowId_2,
  examShowId_3,
  examShowId_4,
  examShowId_5_withPassword,
  examConstructor,
} from "../mocks/mocks/exams.mock";
import {
  showParticipantId1,
  showParticipantId2,
  showParticipantId3,
  showParticipantId4,
  indexParticipantsPage1,
  participantConstructor,
} from "../mocks/mocks/participants.mock";

export const wait = (time) =>
  act(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  });

/*
  input:
  examId: id of exam
  start: start time for exam - Date obj
  end: end time for exam - Date obj

  operation: reset the handler with these times for this exam
   */
export const asignExamShowStartAndEnd = (
  examId,
  start,
  end,
  hasPassword = false
) => {
  const createLeadingZero = (input) => ("0" + input).slice(-2);
  const formatted_start_date =
    start.getFullYear() +
    "-" +
    createLeadingZero(start.getMonth() + 1) +
    "-" +
    createLeadingZero(start.getDate()) +
    " " +
    createLeadingZero(start.getHours()) +
    ":" +
    createLeadingZero(start.getMinutes()) +
    ":" +
    createLeadingZero(start.getSeconds());

  let formatted_end_date =
    end.getFullYear() +
    "-" +
    createLeadingZero(end.getMonth() + 1) +
    "-" +
    createLeadingZero(end.getDate()) +
    " " +
    createLeadingZero(end.getHours()) +
    ":" +
    createLeadingZero(end.getMinutes()) +
    ":" +
    createLeadingZero(end.getSeconds());

  const handler = rest.get(
    apiRoutes.exams.showExam(examId),
    (req, res, ctx) => {
      let exam;
      switch (Number(examId)) {
        case 1:
          exam = examShowId_1.data.exam;
          break;
        case 2:
          exam = examShowId_2.data.exam;
          break;
        case 3:
          exam = examShowId_3.data.exam;
          break;
        case 4:
          exam = examShowId_4.data.exam;
          break;
        case 5:
          exam = examShowId_5_withPassword.data.exam;
          break;
        default:
          throw new Error("Unexpected examId in asignExamShowStartAndEnd");
      }
      const add = {};
      if (hasPassword === true) add.has_password = hasPassword;
      return res(
        ctx.json({
          data: {
            exam: {
              ...exam,
              start_of_exam: formatted_start_date,
              end_of_exam: formatted_end_date,
              ...add,
            },
          },
        })
      );
    }
  );
  server.resetHandlers(handler, ...handlers);

  return handler;
};

export const changeShowExam = ({ exam = {}, otherHandlers = [] }) => {
  const handler = rest.get(
    apiRoutes.exams.showExam(":examId"),
    (req, res, ctx) => {
      return res(ctx.json(examConstructor({ ...exam })));
    }
  );
  server.resetHandlers(handler, ...otherHandlers, ...handlers);

  return handler;
};

const emptyPaginatedObject = ({ route, objectName }) => {
  const data = {};
  data[objectName] = [];

  return {
    data,
    links: {
      first: `${route}?page=1`,
      last: `${route}?page=1`,
      prev: null,
      next: null,
    },
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      links: [
        {
          url: `${route}?page=1`,
          label: "&laquo; Previous",
          active: false,
        },
        {
          url: `${route}?page=1`,
          label: "1",
          active: false,
        },
        {
          url: null,
          label: "Next &raquo;",
          active: false,
        },
      ],
      path: route,
      per_page: 18,
      to: null,
      total: 0,
    },
  };
};

export const emptyRequest = ({ route, method, objectName }) => {
  server.resetHandlers(
    rest[method](route, (req, res, ctx) => {
      return res(ctx.json(emptyPaginatedObject({ route, objectName })));
    }),
    ...handlers
  );
};

export const randomString = (length = 8) => {
  // Declare all characters
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Pick characers randomly
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};

export const changeRequestResponseTo401 = ({
  route,
  method,
  otherHandlers = [],
}) => {
  const { errorBody } = error_401();
  server.resetHandlers(
    rest[method](route, (req, res, ctx) => {
      return res(ctx.json(errorBody), ctx.status(401));
    }),
    ...otherHandlers,
    ...handlers
  );
};

export const changeRequestResponseTo422 = ({
  route,
  method,
  fields,
  otherHandlers = [],
}) => {
  const message = randomString(30);
  const { errorBody, errors } = error_422({ message, fields });
  server.resetHandlers(
    rest[method](route, (req, res, ctx) => {
      return res(ctx.json(errorBody), ctx.status(422));
    }),
    ...otherHandlers,
    ...handlers
  );
  return { message, errors };
};

export const changeRequestResponseToSpecificStatus = ({
  route,
  method,
  otherHandlers = [],
  status,
}) => {
  server.resetHandlers(
    rest[method](route, (req, res, ctx) => {
      return res(ctx.status(status));
    }),
    ...otherHandlers,
    ...handlers
  );
};

const getParticipant = (participantId) => {
  switch (Number(participantId)) {
    case 1:
      return showParticipantId1;
    case 2:
      return showParticipantId2;
    case 3:
      return showParticipantId3;
    case 4:
      return showParticipantId4;
    default:
      throw new Error(
        "invalid participant id in test utility - getParticipant"
      );
  }
};

export const changeCurrentParticipant = ({
  participantId,
  otherHandlers = [],
  useObject = false,
  participant = {},
}) => {
  const output = useObject
    ? { data: { participant: participantConstructor({ ...participant }) } }
    : participantId === -1
    ? -1
    : getParticipant(participantId);
  const currentHandler = rest.get(
    apiRoutes.participants.currentParticipant(":examId"),
    (req, res, ctx) => {
      if (participantId === -1) {
        return res(ctx.status(404));
      }
      return res(ctx.json(output));
    }
  );

  server.resetHandlers(currentHandler, ...otherHandlers, ...handlers);
  return currentHandler;
};

export const changeParticipantsWithOneParticipant = ({
  participant = {},
  otherHandlers = [],
}) => {
  const defaultParticipant = showParticipantId1.data.participant;
  const participantId =
    participant.participant_id || defaultParticipant.participant_id;
  const userId = participant.user_id || defaultParticipant.user_id;
  const examId = participant.exam_id || defaultParticipant.exam_id;
  const confirmed = participant.confirmed || defaultParticipant.confirmed;
  const status = participant.status || defaultParticipant.status;
  const grade = participant.grade || defaultParticipant.grade;

  const currentHandler = rest.get(
    apiRoutes.participants.indexParticipants(":examId"),
    (req, res, ctx) => {
      return res(
        ctx.json({
          ...indexParticipantsPage1,
          data: {
            participants: [
              {
                participant_id: participantId,
                user_id: userId,
                user_link: apiRoutes.users.showUser(userId),
                exam_id: examId,
                exam_link: apiRoutes.exams.showExam(examId),
                confirmed,
                status,
                grade,
              },
            ],
          },
        })
      );
    }
  );

  server.resetHandlers(currentHandler, ...otherHandlers, ...handlers);
  return currentHandler;
};
