import apiRoutes from "../../constants/api-routes.constant";
import axios from "axios";

export const indexAnswersRequest = (questionId, participantId, token) => {
  return axios.get(apiRoutes.answers.indexAnswers(questionId, participantId), {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const storeAnswerRequest = (questionId, bodyOfRequest, token) => {
  return axios.post(apiRoutes.answers.createAnswer(questionId), bodyOfRequest, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const deleteAnswersRequest = (questionId, token) => {
  return axios.delete(apiRoutes.answers.deleteAnswers(questionId), {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};
