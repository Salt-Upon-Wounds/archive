export const stateConstructor = (
  id,
  integer_part,
  questionId,
  text_part = ""
) => {
  return {
    state_id: id,
    text_part: text_part
      ? text_part
      : "Ut minima aspernatur suscipit officiis ea laboriosam.",
    integer_part: integer_part,
    question_id: questionId,
    quesiton_link: `http://localhost:8000/api/exams/1/questions/${questionId}`,
  };
};
export const statesIndexEmpty = {
  data: {
    states: [],
  },
};
export const statesIndexFillTheBlank = {
  data: {
    states: [
      stateConstructor(1, 0, 2),
      stateConstructor(2, 0, 2),
      stateConstructor(3, 0, 2),
    ],
  },
};

export const statesIndexMultipleAnswer = {
  data: {
    states: [
      stateConstructor(1, 0, 3),
      stateConstructor(2, 1, 3),
      stateConstructor(3, 0, 3),
      stateConstructor(4, 1, 3),
    ],
  },
};

export const statesIndexSelectTheAnswer = {
  data: {
    states: [
      stateConstructor(1, 0, 4),
      stateConstructor(2, 0, 4),
      stateConstructor(3, 0, 4),
      stateConstructor(4, 1, 4),
    ],
  },
};

export const statesIndexTrueOrFalse = {
  data: {
    states: [stateConstructor(1, 0, 5)],
  },
};

export const statesIndexOrdering = {
  data: {
    states: [
      stateConstructor(1, 2, 6),
      stateConstructor(2, 3, 6),
      stateConstructor(3, 4, 6),
      stateConstructor(4, 1, 6),
    ],
  },
};

export const statesShowFillTheBlank = {
  data: {
    state: stateConstructor(1, 0),
  },
};

export const statesShowMultipleAnswer = {
  data: {
    state: stateConstructor(1, 1),
  },
};

export const statesShowSelectTheAnswer = {
  data: {
    state: stateConstructor(1, 0),
  },
};

export const statesShowTrueOrFalse = {
  data: {
    state: stateConstructor(1, 0),
  },
};

export const statesShowOrdering = {
  data: {
    state: stateConstructor(1, 2),
  },
};
