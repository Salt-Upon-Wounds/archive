import apiRoutes from "../../constants/api-routes.constant";
import axios from "axios";

export const questionsIndexRequest = (examId, token) => {
  return axios.get(apiRoutes.questions.indexQuestions(examId), {
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });
};

export const questionsShowRequest = (examId, questionId, token) => {
  return axios.get(apiRoutes.questions.showQuestion(examId, questionId), {
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });
};

export const questionsStoreRequest = (examId, body, token) => {
  return axios.post(apiRoutes.questions.createQuestion(examId), body, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });
};

export const questionsUpdateRequest = (examId, questionId, body, token) => {
  return axios.put(
    apiRoutes.questions.updateQuestion(examId, questionId),
    body,
    {
      headers: {
        authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    }
  );
};

export const questionsDeleteRequest = (examId, questionId, token) => {
  return axios.delete(apiRoutes.questions.deleteQuestion(examId, questionId), {
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });
};
