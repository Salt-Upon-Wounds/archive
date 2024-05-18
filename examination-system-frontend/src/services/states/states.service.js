import apiRoutes from "../../constants/api-routes.constant";
import axios from "axios";

export const statesIndexRequest = (examId, questionId, token) => {
  return axios.get(apiRoutes.states.indexStates(examId, questionId), {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const statesShowRequest = (examId, questionId, stateId, token) => {
  return axios.get(apiRoutes.states.showState(examId, questionId, stateId), {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const statesStoreRequest = (examId, questionId, body, token) => {
  return axios.post(apiRoutes.states.createState(examId, questionId), body, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const statesUpdateRequest = (
  examId,
  questionId,
  stateId,
  body,
  token
) => {
  return axios.put(
    apiRoutes.states.updateState(examId, questionId, stateId),
    body,
    {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );
};

export const statesDeleteRequest = (examId, questionId, stateId, token) => {
  return axios.delete(
    apiRoutes.states.deleteState(examId, questionId, stateId),
    {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );
};
