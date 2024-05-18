import apiRoutes from "../../constants/api-routes.constant";
import axios from "axios";

export const registerToExamRequest = (examId, token, password = "") => {
  const bodyObject = {};
  if (password) {
    bodyObject.password = password;
  }
  return axios.post(apiRoutes.exams.registerInExam(examId), bodyObject, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const finishExamRequest = (examId, token) => {
  return axios.put(
    apiRoutes.participants.finishExam(examId),
    {},
    {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getCurrentParticipantRequest = (examId, token) => {
  return axios.get(apiRoutes.participants.currentParticipant(examId), {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const indexParticipantsRequest = (examId, token, page) => {
  return axios.get(apiRoutes.participants.indexParticipants(examId), {
    params: {
      page: page,
    },
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const showParticipantRequest = (examId, participantId, token) => {
  return axios.get(
    apiRoutes.participants.showParticipant(examId, participantId),
    {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );
};

export const confirmParticipantRequest = (examId, body, token) => {
  return axios.put(apiRoutes.exams.confirmParticipant(examId), body, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};
