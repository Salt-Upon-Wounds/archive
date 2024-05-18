import apiRoutes from "../../constants/api-routes.constant";
import axios from "axios";

export const questionTypesIndexRequest = () =>
  axios.get(apiRoutes.questionTypes.indexQuestionTypes(), {
    headers: {
      accept: "application/json",
    },
  });

export const questionTypesShowRequest = (questionType) =>
  axios.get(apiRoutes.questionTypes.showQuestionType(questionType), {
    headers: {
      accept: "application/json",
    },
  });
