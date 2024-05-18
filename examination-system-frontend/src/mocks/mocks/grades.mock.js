import apiRoutes from "../../constants/api-routes.constant";
export const showGrade = (participantId, questionId) => ({
  data: {
    grade: {
      participant_id: participantId,
      participant_link: apiRoutes.participants.showParticipant(
        1,
        participantId
      ),
      question_id: questionId,
      question_link: apiRoutes.questions.showQuestion(1, questionId),
      grade: 1,
    },
  },
});
