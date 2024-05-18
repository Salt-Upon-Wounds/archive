import { rest } from "msw";
import apiRoutes from "../../constants/api-routes.constant";
import { showGrade } from "../mocks/grades.mock";
import {
  questionsShowId_1,
  questionsShowId_2,
  questionsShowId_3,
  questionsShowId_4,
  questionsShowId_5,
  questionsShowId_6,
} from "../mocks/questions.mock";
import {
  biggerThanScore,
  smallerThanZero,
} from "../errors/failed-grade-submission.error";

const gradesHandler = [
  rest.get(
    apiRoutes.participants.getGradeOfQuestion(":participantId", ":questionId"),
    (req, res, ctx) => {
      if (!req.headers.get("authorization")) {
        return res(ctx.status(401));
      }

      const { participantId, questionId } = req.params;
      return res(ctx.json(showGrade(participantId, questionId)));
    }
  ),
  rest.post(
    apiRoutes.participants.saveScoreOfQuestion(":questionId", ":participantId"),
    (req, res, ctx) => {
      if (!req.headers.get("authorization")) {
        return res(ctx.status(401));
      }

      const { questionId } = req.params;
      const { grade } = req.body;
      switch (Number(questionId)) {
        case 1:
          if (
            Number(grade) >
            Number(questionsShowId_1.data.question.question_score)
          ) {
            return res(
              ctx.status(422),
              ctx.json(
                biggerThanScore(questionsShowId_1.data.question.question_score)
              )
            );
          }
          if (Number(grade) < 0) {
            return res(ctx.status(422), ctx.json(smallerThanZero));
          }
          return res(ctx.status(202));
        case 2:
          if (
            Number(grade) >
            Number(questionsShowId_2.data.question.question_score)
          ) {
            return res(
              ctx.status(422),
              ctx.json(
                biggerThanScore(questionsShowId_2.data.question.question_score)
              )
            );
          }
          if (Number(grade) < 0) {
            return res(ctx.status(422), ctx.json(smallerThanZero));
          }
          return res(ctx.status(202));
        case 3:
          if (
            Number(grade) >
            Number(questionsShowId_3.data.question.question_score)
          ) {
            return res(
              ctx.status(422),
              ctx.json(
                biggerThanScore(questionsShowId_3.data.question.question_score)
              )
            );
          }
          if (Number(grade) < 0) {
            return res(ctx.status(422), ctx.json(smallerThanZero));
          }
          return res(ctx.status(202));
        case 4:
          if (
            Number(grade) >
            Number(questionsShowId_4.data.question.question_score)
          ) {
            return res(
              ctx.status(422),
              ctx.json(
                biggerThanScore(questionsShowId_4.data.question.question_score)
              )
            );
          }
          if (Number(grade) < 0) {
            return res(ctx.status(422), ctx.json(smallerThanZero));
          }
          return res(ctx.status(202));
        case 5:
          if (
            Number(grade) >
            Number(questionsShowId_5.data.question.question_score)
          ) {
            return res(
              ctx.status(422),
              ctx.json(
                biggerThanScore(questionsShowId_5.data.question.question_score)
              )
            );
          }
          if (Number(grade) < 0) {
            return res(ctx.status(422), ctx.json(smallerThanZero));
          }
          return res(ctx.status(202));
        case 6:
          if (
            Number(grade) >
            Number(questionsShowId_6.data.question.question_score)
          ) {
            return res(
              ctx.status(422),
              ctx.json(
                biggerThanScore(questionsShowId_6.data.question.question_score)
              )
            );
          }
          if (Number(grade) < 0) {
            return res(ctx.status(422), ctx.json(smallerThanZero));
          }
          return res(ctx.status(202));
        default:
          throw new Error("invalid question id in grades handler");
      }
    }
  ),
];

export default gradesHandler;
