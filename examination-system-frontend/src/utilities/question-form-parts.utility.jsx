export const questionParts = (questionTypeName) => {
  return {
    questionTypeName: questionTypeName,
    questionType: true,
    questionText: true,
    questionScore: true,
    questionOptions:
      questionTypeName === "multiple answer" ||
      questionTypeName === "select the answer"
        ? {
            booleanIntegerPart:
              questionTypeName === "multiple answer" ||
              questionTypeName === "select the answer",
            justOneTrueAnswer: questionTypeName === "select the answer",
          }
        : false,
    questionAnswers: questionTypeName === "fill the blank",
    questionAnswer: questionTypeName === "true or false",
    defaultStates: questionTypeName === "true or false" ? 1 : 0,
  };
};

export const isStatesValid = (states, questionTypeId) => {
  switch (Number(questionTypeId)) {
    case 1:
      return states === null || states.length === 0;
    case 2:
      const invalidFillTheBlankElement = states.find(
        (state) => state.text_part === "" || state.integer_part
      );
      return invalidFillTheBlankElement === undefined ? true : false;
    case 3:
    case 4:
      const invalidMultipleAnswerElement = states.find(
        (state) => state.text_part === ""
      );
      return invalidMultipleAnswerElement === undefined ? true : false;
    case 5:
      return states.length === 1;
    case 6:
      const invalidOrderingElement = states.find(
        (state) => state.text_part === "" || !state.integer_part
      );
      return invalidOrderingElement === undefined ? true : false;
    default:
      return false;
  }
};

export const questionNeedsState = (question) => {
  const withoutStateTypes = ["descriptive", "fill the blank", "true or false"];
  return !withoutStateTypes.includes(question.question_type.question_type_name);
};
