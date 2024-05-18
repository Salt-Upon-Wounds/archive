import { rest } from "msw";
import { examsPassword } from "../mocks/participants.mock";
import apiRoutes from "../../constants/api-routes.constant";
import {
  indexParticipantsPage1,
  indexParticipantsPage2,
  indexParticipantsPage3,
  indexParticipantsInvalidPage,
  showParticipantId1,
  showParticipantId2,
  showParticipantId3,
  showParticipantId4,
} from "../mocks/participants.mock";
import {
  wrongPassword,
  withoutPassword,
} from "../errors/failed-exam-registration.error";

const participantsHandler = [
  rest.post(apiRoutes.exams.registerInExam(":examId"), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    const { password } = req.body;
    let { examId } = req.params;
    examId = Number(examId);
    switch (examId) {
      case 1: // for without password exams that are not started
        return res(ctx.status(201));
      case 2: // for without password exams that user already registered
        return res(ctx.status(201));
      case 3: // for without password exams that are finished
        return res(ctx.status(403));
      case 4: // for have password exams that are not started
        if (password === examsPassword) {
          return res(ctx.status(201));
        } else if (password === "") {
          return res(ctx.status(422), ctx.json(withoutPassword));
        } else {
          return res(ctx.status(422), ctx.json(wrongPassword));
        }
      case 5: // for have password exams that are started
        if (password === examsPassword) {
          return res(ctx.status(201));
        } else {
          return res(ctx.status(403));
        }
      case 6: // for have password exams that are finished
        return res(ctx.status(403));
      default:
        return res(ctx.status(404));
    }
  }),
  rest.put(apiRoutes.participants.finishExam(":examId"), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    const { examId } = req.params;
    switch (Number(examId)) {
      case 1:
        return res(ctx.status(202));
      case 2:
        return res(ctx.status(403));
      default:
        return res(ctx.status(401));
    }
  }),
  rest.put(apiRoutes.exams.confirmParticipant(":examId"), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    return res(ctx.status(202));
  }),
  rest.get(
    apiRoutes.participants.currentParticipant(":examId"),
    (req, res, ctx) => {
      if (!req.headers.get("authorization")) {
        return res(ctx.status(401));
      }

      return res(ctx.json(showParticipantId1));
    }
  ),
  rest.get(
    apiRoutes.participants.indexParticipants(":examId"),
    (req, res, ctx) => {
      if (!req.headers.get("authorization")) {
        return res(ctx.status(401));
      }

      const page = req.url.searchParams.get("page");
      switch (Number(page)) {
        case 1:
          return res(ctx.json(indexParticipantsPage1));
        case 2:
          return res(ctx.json(indexParticipantsPage2));
        case 3:
          return res(ctx.json(indexParticipantsPage3));
        default:
          return res(ctx.json(indexParticipantsInvalidPage(Number(page))));
      }
    }
  ),
  rest.get(
    apiRoutes.participants.showParticipant(":examId", ":participantId"),
    (req, res, ctx) => {
      if (!req.headers.get("authorization")) {
        return res(ctx.status(401));
      }

      const { participantId } = req.params;

      switch (Number(participantId)) {
        case 1:
          return res(ctx.json(showParticipantId1));
        case 2:
          return res(ctx.json(showParticipantId2));
        case 3:
          return res(ctx.json(showParticipantId3));
        case 4:
          return res(ctx.json(showParticipantId4));
        default:
          throw new Error(
            "not expected participant id in participants handler"
          );
      }
    }
  ),
];

export default participantsHandler;
