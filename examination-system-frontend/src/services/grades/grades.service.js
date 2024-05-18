import apiRoutes from "../../constants/api-routes.constant";
import axios from "axios";

export const getGradeRequest = async (participantId, questionId, token) => {
  return axios.get(
    apiRoutes.participants.getGradeOfQuestion(participantId, questionId),
    {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );
};

export const storeGradeRequest = async (
  participantId,
  questionId,
  token,
  body
) => {
  return axios.post(
    apiRoutes.participants.saveScoreOfQuestion(questionId, participantId),
    body,
    {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );
};
