import { rest } from "msw";
import apiRoutes from "../../constants/api-routes.constant";
import {
  questionTypesIndex,
  descriptive,
  fillTheBlank,
  multipleAnswer,
  selectTheAnswer,
  trueOrFalse,
  ordering,
} from "../mocks/question-types.mock";

const questionTypesHandler = [
  rest.get(apiRoutes.questionTypes.indexQuestionTypes(), (req, res, ctx) => {
    return res(ctx.json(questionTypesIndex));
  }),

  rest.get(
    apiRoutes.questionTypes.showQuestionType(":questionType"),
    (req, res, ctx) => {
      const { questionType } = req.params;

      switch (questionType) {
        case "descriptive":
          return res(ctx.json(descriptive));
        case "fill-the-blank":
          return res(ctx.json(fillTheBlank));
        case "multiple-answer":
          return res(ctx.json(multipleAnswer));
        case "select-the-answer":
          return res(ctx.json(selectTheAnswer));
        case "true-or-false":
          return res(ctx.json(trueOrFalse));
        case "ordering":
          return res(ctx.json(ordering));
        default:
          throw Error("invalid question type");
      }
    }
  ),
];

export default questionTypesHandler;
