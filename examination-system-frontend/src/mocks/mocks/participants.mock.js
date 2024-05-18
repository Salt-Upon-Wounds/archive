export const examsPassword = "examPassword";

export const participantConstructor = ({
  id = 1,
  user_id = 1,
  exam_id = 1,
  status = "WAIT_FOR_MANUAL_CORRECTING",
  grade = null,
  confirmed = false,
}) => ({
  participant_id: id,
  user_id: user_id,
  user_link: `http://localhost:8000/api/users/${user_id}`,
  exam_link: `http://localhost:8000/api/exams/${exam_id}`,
  exam_id: exam_id,
  confirmed: confirmed,
  status: status,
  grade: grade,
});

const metaConstructor = ({ exam_id, currentPage, numberOfPages }) => ({
  links: {
    first: `http://localhost:8000/api/exams/${exam_id}/participants?page=${currentPage}`,
    last: `http://localhost:8000/api/exams/${exam_id}/participants?page=${currentPage}`,
    prev: null,
    next: null,
  },
  meta: {
    current_page: currentPage,
    from: 1,
    last_page: numberOfPages,
    links: [
      {
        url: null,
        label: "&laquo; Previous",
        active: false,
      },
      {
        url: `http://localhost:8000/api/exams/${exam_id}/participants?page=${currentPage}`,
        label: "1",
        active: true,
      },
      {
        url: null,
        label: "Next &raquo;",
        active: false,
      },
    ],
    path: `http://localhost:8000/api/exams/${exam_id}/participants`,
    per_page: 15,
    to: 2,
    total: 2,
  },
});

export const indexParticipantsPage1 = (() => {
  const participants = [];
  for (let i = 1; i <= 15; i++) {
    participants.push(participantConstructor({ id: i }));
  }
  return {
    data: {
      participants,
    },
    ...metaConstructor({ examId: 1, currentPage: 1, numberOfPages: 3 }),
  };
})();

export const indexParticipantsPage2 = (() => {
  const participants = [];
  for (let i = 16; i <= 30; i++) {
    participants.push(participantConstructor({ id: i }));
  }
  return {
    data: {
      participants,
    },
    ...metaConstructor({ examId: 1, currentPage: 2, numberOfPages: 3 }),
  };
})();

export const indexParticipantsPage3 = (() => {
  const participants = [];
  for (let i = 31; i <= 45; i++) {
    participants.push(participantConstructor({ id: i }));
  }
  return {
    data: {
      participants,
    },
    ...metaConstructor({ examId: 1, currentPage: 3, numberOfPages: 3 }),
  };
})();

export const indexParticipantsInvalidPage = ({ page = 10 }) => {
  const participants = [];
  return {
    data: {
      participants,
    },
    ...metaConstructor({ examId: 1, currentPage: page, numberOfPages: 3 }),
  };
};

export const showParticipantId1 = {
  data: {
    participant: {
      participant_id: 1,
      user_id: 1,
      user_link: "http://localhost:8000/api/users/1",
      exam_link: "http://localhost:8000/api/exams/1",
      exam_id: 1,
      confirmed: false,
      status: "FINISHED",
      grade: 20,
    },
  },
};

export const showParticipantId2 = {
  data: {
    participant: {
      participant_id: 2,
      user_id: 1,
      user_link: "http://localhost:8000/api/users/1",
      exam_link: "http://localhost:8000/api/exams/1",
      exam_id: 1,
      confirmed: false,
      status: "WAIT_FOR_MANUAL_CORRECTING",
      grade: null,
    },
  },
};

export const showParticipantId3 = {
  data: {
    participant: {
      participant_id: 3,
      user_id: 2,
      user_link: "http://localhost:8000/api/users/2",
      exam_link: "http://localhost:8000/api/exams/1",
      exam_id: 1,
      confirmed: false,
      status: "IS_PROCESSING",
      grade: null,
    },
  },
};

export const showParticipantId4 = {
  data: {
    participant: {
      participant_id: 4,
      user_id: 3,
      user_link: "http://localhost:8000/api/users/3",
      exam_link: "http://localhost:8000/api/exams/1",
      exam_id: 1,
      confirmed: false,
      status: "NOT_FINISHED",
      grade: null,
    },
  },
};
