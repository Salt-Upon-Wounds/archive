import { rest } from "msw";
import apiRoutes from "../../constants/api-routes.constant";
import programRoutes from "../../constants/program-routes.constant";
import {
  questionsIndex,
  questionsIndexAll,
  questionsShowId_1,
  questionsShowId_2,
  questionsShowId_3,
  questionsShowId_4,
  questionsShowId_5,
  questionsShowId_6,
  questionsStoreTemp,
  questionsUpdateTemp,
} from "../mocks/questions.mock";
import {
  questionTextIsRequired,
  questionScoreIsRequired,
} from "../errors/failed-question-creation.error";
import { questionScoreMustBeANumber } from "../errors/failed-question-update.error";

const questionsHandler = [
  rest.get(apiRoutes.questions.indexQuestions(":examId"), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    if (
      window.location.href.endsWith(programRoutes.examiningOverview(1)) ||
      window.location.href.includes(programRoutes.participantsRoot(1))
    ) {
      return res(ctx.json(questionsIndexAll));
    }
    return res(ctx.json(questionsIndex));
  }),

  rest.get(
    apiRoutes.questions.showQuestion(":examId", ":questionId"),
    (req, res, ctx) => {
      if (!req.headers.get("authorization")) {
        return res(ctx.status(401));
      }

      const { questionId } = req.params;
      switch (Number(questionId)) {
        case 1:
          return res(ctx.json(questionsShowId_1));
        case 2:
          return res(ctx.json(questionsShowId_2));
        case 3:
          return res(ctx.json(questionsShowId_3));
        case 4:
          return res(ctx.json(questionsShowId_4));
        case 5:
          return res(ctx.json(questionsShowId_5));
        case 6:
          return res(ctx.json(questionsShowId_6));
        default:
          return res(ctx.status(404));
      }
    }
  ),

  rest.post(apiRoutes.questions.createQuestion(":examId"), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    const {
      question_text,
      question_score,
      can_be_shuffled,
      question_type_id,
    } = req.body;
    if (!question_text) {
      return res(ctx.status(422), ctx.json(questionTextIsRequired));
    }
    if (!question_score) {
      return res(ctx.status(422), ctx.json(questionScoreIsRequired));
    }
    if (question_type_id === undefined) {
      throw Error("not handled request");
    }

    return res(
      ctx.status(201),
      ctx.json(
        questionsStoreTemp({
          question_text,
          question_score,
          can_be_shuffled,
          question_id: question_type_id,
          question_type_id,
        })
      )
    );
  }),

  rest.put(
    apiRoutes.questions.updateQuestion(":examId", ":questionId"),
    (req, res, ctx) => {
      if (!req.headers.get("authorization")) {
        return res(ctx.status(401));
      }

      const { question_text, question_score, can_be_shuffled } = req.body;
      const { questionId } = req.params;

      const changed_question_score = Number(question_score);
      if (question_score !== undefined && question_score <= 0) {
        return res(ctx.status(422), ctx.json(questionScoreMustBeANumber));
      }

      let question_type_name;
      switch (Number(questionId)) {
        case 1:
          question_type_name = "descriptive";
          break;
        case 2:
          question_type_name = "fill the blank";
          break;
        case 3:
          question_type_name = "multiple answer";
          break;
        case 4:
          question_type_name = "select the answer";
          break;
        case 5:
          question_type_name = "true or false";
          break;
        case 6:
          question_type_name = "ordering";
          break;
        default:
      }

      return res(
        ctx.json(
          questionsUpdateTemp({
            question_text,
            question_score: changed_question_score,
            can_be_shuffled,
            question_id: questionId,
            question_type_name,
          })
        )
      );
    }
  ),

  rest.delete(
    apiRoutes.questions.deleteQuestion(":examId", ":questionId"),
    (req, res, ctx) => {
      if (!req.headers.get("authorization")) {
        return res(ctx.status(401));
      }

      return res(ctx.status(202));
    }
  ),
];

export default questionsHandler;
