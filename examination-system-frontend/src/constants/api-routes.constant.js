const prefix = "https://api.fizmat.online/api";
//const prefix = "http://127.0.0.1:8000/api";
const apiRoutes = {
  exams: {
    confirmParticipant: (examId) => `${prefix}/accept_participant/${examId}`,
    indexAllExams: () => `${prefix}/exams`,
    indexCreatedExams: () => `${prefix}/own_exams`,
    createExam: () => `${prefix}/exams`,
    showExam: (examId) => `${prefix}/exams/${examId}`,
    updateExam: (examId) => `${prefix}/exams/${examId}`,
    deleteExam: (examId) => `${prefix}/exams/${examId}`,
    registerInExam: (examId) => `${prefix}/exams/${examId}/register`,
    publishExam: (examId) => `${prefix}/publish_exams/${examId}`,
    unpublishExam: (examId) => `${prefix}/unpublish_exams/${examId}`,
    randomExam: () => `${prefix}/rexam`,
    randomExamThemed: (examId) => `${prefix}/rexam/${examId}`,
  },
  authentication: {
    changePassword: () => `${prefix}/authentication/change_password`,
    login: () => `${prefix}/authentication/login`,
    logout: () => `${prefix}/authentication/logout`,
    passwordReset: () => `${prefix}/authentication/password_reset`,
    passwordResetLink: () => `${prefix}/authentication/password_reset_link`,
    register: () => `${prefix}/authentication/register`,
  },
  participants: {
    finishExam: (examId) => `${prefix}/exams/${examId}/finish_exam`,
    indexParticipants: (examId) => `${prefix}/exams/${examId}/participants`,
    showParticipant: (examId, participantId) =>
      `${prefix}/exams/${examId}/participants/${participantId}`,
    getGradeOfQuestion: (participantId, questionId) =>
      `${prefix}/participants/${participantId}/questions/${questionId}/get_question_grade`,
    saveScoreOfQuestion: (questionId, participantId) =>
      `${prefix}/questions/${questionId}/participants/${participantId}/save_score`,
    participatedExams: () => `${prefix}/participated_exams`,
    currentParticipant: (examId) =>
      `${prefix}/exams/${examId}/current_participant`,
  },
  questions: {
    indexQuestions: (examId) => `${prefix}/exams/${examId}/questions`,
    createQuestion: (examId) => `${prefix}/exams/${examId}/questions`,
    showQuestion: (examId, questionId) =>
      `${prefix}/exams/${examId}/questions/${questionId}`,
    updateQuestion: (examId, questionId) =>
      `${prefix}/exams/${examId}/questions/${questionId}`,
    deleteQuestion: (examId, questionId) =>
      `${prefix}/exams/${examId}/questions/${questionId}`,
  },
  questionTypes: {
    indexQuestionTypes: () => `${prefix}/question_types`,
    showQuestionType: (questionTypeId) =>
      `${prefix}/question_types/${questionTypeId}`,
  },
  states: {
    indexStates: (examId, questionId) =>
      `${prefix}/exams/${examId}/questions/${questionId}/states`,
    createState: (examId, questionId) =>
      `${prefix}/exams/${examId}/questions/${questionId}/states`,
    showState: (examId, questionId, stateId) =>
      `${prefix}/exams/${examId}/questions/${questionId}/states/${stateId}`,
    updateState: (examId, questionId, stateId) =>
      `${prefix}/exams/${examId}/questions/${questionId}/states/${stateId}`,
    deleteState: (examId, questionId, stateId) =>
      `${prefix}/exams/${examId}/questions/${questionId}/states/${stateId}`,
  },
  answers: {
    createAnswer: (questionId) => `${prefix}/questions/${questionId}/answers`,
    deleteAnswers: (questionId) => `${prefix}/questions/${questionId}/answers`,
    indexAnswers: (questionId, participantId) =>
      `${prefix}/questions/${questionId}/participants/${participantId}/answers`,
  },
  users: {
    showUser: (userId) => `${prefix}/users/${userId}`,
    getCurrentUser: () => `${prefix}/current_user`,
  },
};

export default apiRoutes;
