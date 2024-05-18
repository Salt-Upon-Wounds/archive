const programRoutes = {
  // Profile
  profile: () => `/profile`,
  settings: () => `/profile/settings`,

  // Pages
  aboutUs: () => `/about-us`,
  contactUs: () => `/contact-us`,

  // Exams
  examsRoot: () => `/exams`,
  indexAllExams: () => `/exams`,
  indexParticipatedExams: () => `/exams/participated-exams`,
  indexCreatedExams: () => `/exams/created-exams`,
  createExam: () => `/exams/create-new-exam`,
  updateExam: (examId) => `/exams/${examId}/edit`,
  examining: (examId) => `/exams/${examId}`,
  examiningOverview: (examId) => `/exams/${examId}/overview`,
  examiningQuestion: (examId, questionId) =>
    `/exams/${examId}/question/${questionId}`,
  randomExam: () => `/rexam`,
  randomExamThemed: (examId) => `/rexam/${examId}`,

  // Participants
  participantsRoot: (examId) => `/exams/${examId}/participants`,
  indexParticipants: (examId) => `/exams/${examId}/participants`,
  showParticipant: (examId, participantId) =>
    `/exams/${examId}/participants/${participantId}`,

  // Authentication
  login: () => `/login`,
  register: () => `/register`,
  redirectUnAuthenticated: () => `/login`,
};

export default programRoutes;
